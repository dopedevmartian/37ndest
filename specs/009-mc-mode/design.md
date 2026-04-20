# 009 Multiple Choice Mode — Design

## Purpose

This design defines the implementation approach for MC mode. It translates the
requirements into concrete component structure, distractor generation logic,
interaction state, and integration boundaries.

---

## Design Goals

1. Add MC interaction without touching the review engine, reinforcement system,
   session logic, or pacing
2. Reuse the existing ReviewCard zone structure as much as possible
3. Keep distractor generation pure and deterministic
4. Map MC outcomes to existing outcome types — no new types
5. Keep the implementation narrow and auditable

---

## Component Strategy

Two options were considered:

**Option A:** Extend `ReviewCard` with an `mcChoices` prop and conditional rendering.
**Option B:** Create a parallel `MCCard` component that shares Zone 1 markup.

**Decision: Option B — parallel `MCCard` component.**

Rationale: `ReviewCard` is already complex. MC interaction state (selected choice,
feedback phase) is meaningfully different from reveal state. A parallel component
keeps both clean and independently testable. Zone 1 markup (category chip + Japanese
hero) is small enough to duplicate without abstraction overhead.

`MCCard` lives at `src/components/MCCard.tsx`.

---

## MCCard Component

### Props

```ts
type MCCardProps = {
  item: SessionItem;
  choices: MCChoice[];          // 4 choices, pre-shuffled
  onOutcome: (outcome: "correct" | "incorrect") => void;
};

type MCChoice = {
  text: string;                 // English meaning
  isCorrect: boolean;
};
```

`MCCard` manages its own interaction state internally:
- `selectedIndex: number | null` — null until a choice is tapped
- `phase: "choosing" | "feedback"` — transitions on tap

`onOutcome` is called once, immediately when a choice is tapped. The card then
enters feedback phase. The caller (ReviewView) advances the session after the user
taps "Continue".

### Zone structure

```
Zone 1 (unchanged from ReviewCard):
  - Category chip
  - Japanese hero text (Noto Serif JP, 3.75rem)

Zone 2 (MC-specific, replaces reveal content):
  - 4 stacked choice buttons (choosing phase)
  - Same buttons with feedback state applied (feedback phase)
  - "Continue" button appears below choices in feedback phase

Zone 3:
  - Not shown during MC interaction (deferred to future spec)
```

### Choice button states

| State | Background | Border | Text color |
|---|---|---|---|
| Default (unchosen) | `--paper-deep` | `--rule` | `--ink` |
| Selected correct | `--matcha-soft` | `--matcha` (2px) | `--ink` |
| Selected incorrect | `--coral-soft` | `--coral` (2px) | `--ink` |
| Correct revealed (not selected) | `--matcha-soft` | `--matcha` (1px dashed) | `--ink-muted` |
| Disabled unchosen | `--paper-deep` | `--rule` | `--ink-faint` |

All choices are disabled (`pointer-events: none`) after any tap.

### "Continue" affordance

After feedback, a "Continue" button appears below the choices:

```
Continue →
```

Style: outlined, `--rule` border, `--ink-muted` text, full width, same border-radius
as other buttons. Tapping it calls a `onContinue` callback on `MCCard`, which
ReviewView uses to advance the session (equivalent to the post-reveal action in
reveal mode).

Revised props to include `onContinue`:

```ts
type MCCardProps = {
  item: SessionItem;
  choices: MCChoice[];
  onOutcome: (outcome: "correct" | "incorrect") => void;
  onContinue: () => void;
};
```

---

## Distractor Generation

### Location

`src/features/review/mcChoices.ts` — pure functions, no db, no async.

### Function signature

```ts
function buildMCChoices(
  item: SessionItem,
  allNotes: readonly CanonicalNote[],
  sessionIndex: number   // used as seed offset for deterministic shuffle
): MCChoice[]
```

Returns exactly 4 `MCChoice` objects in randomized order, or `null` if fewer than
4 distinct English strings are available (fallback to reveal mode).

### Algorithm

```
1. Collect the correct answer: item.note.english

2. Build distractor pool:
   a. If item.note.distractors has exactly 2 entries:
      - use both as pre-authored distractors
      - draw 1 more from other deck cards (random, seeded)
   b. Otherwise:
      - draw 3 from other deck cards (random, seeded)

3. Filter pool:
   - exclude cards whose english === correct answer
   - exclude duplicate english strings
   - exclude the current card itself

4. If pool has fewer than 3 distinct candidates after filtering:
   - return null (caller falls back to reveal mode)

5. Shuffle the 4 choices (1 correct + 3 distractors) using a seeded shuffle:
   seed = hash(item.noteId + sessionIndex)
   This ensures the same card always shows the same choice order within a session.

6. Return MCChoice[] with isCorrect flags set.
```

### Seeded shuffle

A simple seeded linear congruential generator (LCG) is sufficient. No external
dependency needed. The seed is derived from a djb2-style hash of the card id
concatenated with the session index as a string.

```ts
function seededShuffle<T>(arr: T[], seed: number): T[]
function hashSeed(cardId: string, sessionIndex: number): number
```

Both are pure functions in `mcChoices.ts`.

---

## ReviewView Integration

### Mode detection

ReviewView reads the active profile's review mode preference. For this spec, a
simple constant or prop is acceptable while the settings UI is not yet wired:

```ts
// Temporary — will be replaced by profile preference lookup
const REVIEW_MODE: "reveal" | "mc" = "reveal";
```

When `REVIEW_MODE === "mc"`:
- Call `buildMCChoices(item, deck.notes, sessionIndex)`
- If result is `null` → fall back to reveal mode for this card
- If result is valid → render `MCCard` instead of `ReviewCard`

### Outcome handling

MC outcomes flow through the same handlers as reveal outcomes:

```
MCCard.onOutcome("correct")  → handleRecognitionOutcome("correct")
MCCard.onOutcome("incorrect") → handleRecognitionOutcome("incorrect")
MCCard.onContinue()          → advance to next card (same as post-reveal action)
```

No new handlers. No new state. The reinforcement system, reinsertion logic, and
session completion logic are completely unaware of which mode produced the outcome.

### Session index tracking

ReviewView needs to pass `sessionIndex` (the current card's position in the
original session) to `buildMCChoices` for deterministic shuffle seeding. This is
`sessionState.currentIndex` at the time the card is presented.

---

## Integration Boundaries

### What this spec adds

| Concern | Location |
|---|---|
| `MCCard` component | `src/components/MCCard.tsx` |
| `MCChoice` type | `src/components/MCCard.tsx` (or `src/types/review.ts`) |
| `buildMCChoices()` function | `src/features/review/mcChoices.ts` |
| `seededShuffle()` helper | `src/features/review/mcChoices.ts` |
| Mode switch in ReviewView | `src/app/ReviewView.tsx` (narrow addition) |

### What this spec must not touch

| File | Reason |
|---|---|
| `src/features/review/sessionProgression.ts` | Pure engine — no change |
| `src/features/review/recognitionFlow.ts` | Pure engine — no change |
| `src/features/review/productionFlow.ts` | Pure engine — no change |
| `src/features/review/progressRecorder.ts` | Persistence — no change |
| `src/features/review/itemSelector.ts` | Selection — no change |
| `src/features/review/confidenceTracker.ts` | Reinforcement — no change |
| `src/features/review/sessionReinsertion.ts` | Reinsertion — no change |
| `src/types/review.ts` | Outcome types unchanged |
| `src/types/content.ts` | Content model unchanged |
| `src/app/HomeView.tsx` | No change |
| `src/app/SettingsView.tsx` | Mode preference UI is a separate task |

---

## Validation Strategy

### Choice generation checks
- Exactly 4 choices returned when deck has sufficient cards
- Correct answer always present in choices
- No duplicate English strings
- Correct answer not duplicated in distractor list
- `null` returned when fewer than 4 distinct English strings available
- Same card + same session index always produces same choice order (determinism)

### Interaction checks
- Tapping correct choice calls `onOutcome("correct")`
- Tapping incorrect choice calls `onOutcome("incorrect")`
- All choices disabled after any tap
- Correct choice revealed when incorrect choice tapped
- "Continue" button appears only after a choice is tapped
- `onContinue` called when "Continue" is tapped

### Reinforcement regression checks
- Confidence score updates correctly after MC outcome
- Reinsertion fires on `"incorrect"` MC outcome
- Session completion logic unchanged
- Daily progress increments correctly after MC session

### Fallback checks
- Card with insufficient distractors renders in reveal mode
- No error or broken state shown to user

---

## What This Design Intentionally Defers

- Settings UI for mode preference (separate task)
- Zone 3 support content during MC feedback (deferred)
- Production direction MC mode (recognition only for now)
- Weighted distractor selection
- Haptic feedback on MC selection (can be added later)
- Animation on choice reveal
