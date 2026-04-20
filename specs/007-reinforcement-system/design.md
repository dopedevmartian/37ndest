# 007 Reinforcement System — Design

## Purpose

This design defines the implementation approach for the reinforcement system.
It translates the requirements into concrete data shapes, scoring logic, session
flow behavior, and integration boundaries.

The reinforcement logic is defined in terms of stored outcome signals (`correct` /
`incorrect`), not the current visible button labels. If the labels change in a future
phase, the reinforcement logic does not change.

This is a specification-only document. No implementation is authorized until approved.

---

## Design Goals

1. consume existing stored outcome signals (`correct` / `incorrect`) without changing
   the interaction model or coupling to visible button labels
2. reinsert missed cards within the session simply and correctly
3. maintain a lightweight per-card confidence score in IndexedDB
4. offer a focused "practice again" drill after sessions with misses
5. keep all logic local-first and profile-isolated
6. avoid touching the review engine's core pure functions

---

## Confidence Score Model

### Score shape

```
ConfidenceRecord {
  cardId:          string        // stable card ID from canonical deck
  profileId:       string        // active profile ID
  confidenceScore: number        // integer 0–10
  recentOutcomes:  Outcome[]     // last 10 outcomes, newest first
  lastReviewedAt:  number        // Unix timestamp ms
}

type Outcome = "correct" | "incorrect"
// "skipped" outcomes are not stored in recentOutcomes — they are neutral
```

### Score calculation

The score is not derived from `recentOutcomes` on read — it is maintained
incrementally on write. After each outcome:

```
correct   → newScore = min(currentScore + 1, 10)
incorrect → newScore = max(currentScore - 2, 0)
skipped   → score unchanged
```

`recentOutcomes` stores `"correct"` or `"incorrect"` values — the stored outcome
signals, not the visible button labels. It is updated by prepending the new outcome
and trimming to 10 entries:

```
recentOutcomes = [newOutcome, ...recentOutcomes].slice(0, 10)
```

**Why this model is intentionally simple:** 37NDEST has a small, bounded deck used
by two people over a ~3.5 month period. The goal is practical conversational
readiness, not long-term academic retention. A rolling-window score is sufficient and
appropriate. This is not trying to be a full SRS system. Full spaced repetition —
with intervals, ease factors, and scheduling algorithms — is explicitly out of scope.

### Initial state

A card with no `ConfidenceRecord` is treated as having:
- `confidenceScore: 5`
- `recentOutcomes: []`
- `lastReviewedAt: 0`

No record is written until the first review outcome is recorded.

---

## Within-Session Reinsertion Logic

### Reinsertion rule

When an `incorrect` outcome is recorded for a card:

1. Check whether the card has already been reinserted in this session.
   If yes: record the outcome (confidence score may decrease again), do not reinsert.
   The card remains eligible for the end-of-session practice-again set.
2. **Tail-end rule:** if fewer than 2 cards remain in the session queue, do not
   reinsert. Add the card to the missed set for the end-of-session offer only.
3. Otherwise: insert the card back into the session queue at position
   `currentIndex + 3` (i.e. at least 2 cards ahead of the current position).
4. Mark the card as reinserted for this session (session-local flag, not persisted).

### Reinsertion cap

Maximum 5 reinsertions per session total, regardless of how many cards are missed.
If the cap is reached, additional "Again" outcomes are recorded but no further
reinsertion occurs.

### Progress bar behavior

When a card is reinserted, the session total increases by 1. The progress bar
denominator updates to reflect the new total. This keeps the bar honest.

### Session flow with reinsertion

```
Session queue (initial): [A, B, C, D, E]

User produces incorrect outcome on A:
  → 2+ cards remain — A is reinserted at currentIndex + 3
  → Queue becomes: [B, C, D, A*, E]   (* = reinserted)
  → Session total: 6 (was 5)

User taps "Got it" on B, C, D:
  → Queue: [A*, E]

User reaches A* again:
  → User produces incorrect outcome on A*
  → A* already reinserted — confidence decreases again, no second reinsertion
  → A* added to missed set for end-of-session offer
  → Queue: [E]

Session completes after E.

---

Tail-end example:
Session queue: [A, B, C]

User produces incorrect outcome on B (1 card remains after B):
  → Fewer than 2 cards remain — tail-end rule applies
  → B is NOT reinserted
  → B is added to missed set for end-of-session offer
  → Queue: [C]

Session completes after C.
```

---

## End-of-Session "Practice Again" Flow

### Trigger condition

After a session completes, collect all cards that produced at least one `incorrect`
outcome during the session. If the count is ≥ 2, offer "practice again."

If the count is 0 or 1, do not offer. (A single miss is not worth a dedicated drill.)

### Offer presentation

The offer appears on the session completion screen (or inline in the completion state
of `ReviewView`). It is a single clear action:

```
"Practice again" — [N] cards to revisit
```

Below it: a secondary dismiss action ("Return home" or equivalent).

The offer is not a modal. It is part of the completion state rendering.

### Focused drill session

When the user accepts:
- A new session is initialized containing only the missed cards
- Direction: same as the preceding session (recognition unconditionally in Phase 5)
- The session follows the normal card interaction model
- No reinsertion occurs within a focused drill session (keep it simple)
- After the focused drill completes, return to the normal completion state
  (no recursive "practice again" offers)

### Session flow diagram

```
Normal session completes
        │
        ▼
  missed cards ≥ 2?
        │
   YES  │  NO
        │   └──→ Show completion state → Return home
        ▼
  Show "Practice again" offer
        │
  Accept │  Dismiss
        │   └──→ Return home
        ▼
  Focused drill session (missed cards only)
        │
        ▼
  Focused drill completes
        │
        ▼
  Show completion state → Return home
```

---

## Long-Term Confidence Tracking

### Storage

`ConfidenceRecord` is stored in a new IndexedDB table: `cardConfidence`.

Index: `[profileId, cardId]` — unique per profile per card.

### Query patterns this shape supports

- "which cards have low confidence for this profile?" →
  query by `profileId`, filter `confidenceScore < 4`
- "what did this card look like recently?" →
  read `recentOutcomes`
- "when was this card last reviewed?" →
  read `lastReviewedAt`
- "session selection weighting" →
  read `confidenceScore`, apply multiplier in item selector

### What this shape does NOT do

- It does not replace the `ReviewProgress` table (which records every outcome for
  audit/history purposes). `ConfidenceRecord` is a derived summary, not a log.
- It does not implement bucket transitions (bucket 0/1/2 logic is a separate spec).
- It does not implement trip-phase weighting.

**Relationship to the CardBucket model:**

`ConfidenceRecord` and the `CardBucket` (0/1/2) model are related but distinct and
must not be merged in this phase.

- `ConfidenceRecord` is **immediate reinforcement memory** — it tracks recent outcome
  signals and drives within-session reinsertion and short-term "practice again"
  behavior. It is responsive and volatile by design.
- `CardBucket` is the **broader mastery classification layer** — it reflects a card's
  overall learning stage (Learning / Familiar / Strong) and drives session selection
  weighting and progress display. It changes more slowly and deliberately.

A future spec may use `confidenceScore` as one input to bucket transition logic, but
that connection is not implemented here. The two systems remain independent in this
phase.

---

## Integration Boundaries

### What this spec adds

| Concern | Location |
|---|---|
| `ConfidenceRecord` type | `src/types/db.ts` |
| `cardConfidence` IndexedDB table | `src/db/db.ts` |
| `updateConfidence()` function | `src/features/review/confidenceTracker.ts` (new) |
| Reinsertion logic | `src/features/review/sessionReinsertion.ts` (new) |
| Session-local reinsertion tracking, mutable queue, missed-set tracking | `src/app/ReviewView.tsx` (runtime session state) |
| "Practice again" offer rendering | `src/app/ReviewView.tsx` (completion state) |

### What this spec must not touch

| File | Reason |
|---|---|
| `src/features/review/sessionProgression.ts` | Pure engine function — no change |
| `src/features/review/recognitionFlow.ts` | Pure engine function — no change |
| `src/features/review/productionFlow.ts` | Pure engine function — no change |
| `src/features/review/progressRecorder.ts` | Existing persistence — no change |
| `src/features/review/itemSelector.ts` | No change in this spec |
| `src/components/ReviewCard.tsx` | Card shell unchanged |
| `src/types/review.ts` | Review types unchanged |
| `src/types/content.ts` | Canonical content types unchanged |

### Integration point in ReviewView

`ReviewView.tsx` requires more than a single-line change to the `complete` phase
render block. The runtime view layer must also:

- track which cards produced `incorrect` outcomes during the active session
  (session-local state, not persisted until the session ends)
- track which cards have been reinserted in the current session (session-local flag)
- maintain an updated session queue that supports reinsertion (mutable during the
  session, distinct from the immutable `SessionState.items` in the engine)
- update the progress bar denominator when a card is reinserted
- on session completion, evaluate the missed set and conditionally render the
  "practice again" offer

The core engine pure functions (`sessionProgression.ts`, `recognitionFlow.ts`,
`productionFlow.ts`) remain untouched. The reinsertion and tracking logic lives in
the view layer and in new feature-level helpers, not in the engine.

This is a meaningful change to `ReviewView.tsx` — not just a completion-state
addition. The session runtime state managed by `ReviewView` will need to be extended
to support the mutable queue and session-local tracking described above.

---

## Scoring Logic Summary

```
Initial score (no history): 5

On correct outcome:
  score = min(score + 1, 10)
  recentOutcomes = ["correct", ...recentOutcomes].slice(0, 10)
  lastReviewedAt = Date.now()

On incorrect outcome:
  score = max(score - 2, 0)
  recentOutcomes = ["incorrect", ...recentOutcomes].slice(0, 10)
  lastReviewedAt = Date.now()

On skipped:
  (no change to score or recentOutcomes)
  lastReviewedAt = Date.now()
```

### Score interpretation (internal use only, not shown to user)

| Score | Meaning |
|---|---|
| 8–10 | Strong — card is well-known |
| 5–7 | Familiar — card is being learned |
| 0–4 | Learning — card needs more attention |

These thresholds align with the bucket 0/1/2 model and can be used to inform
bucket transitions in a future spec without requiring a data model change.

---

## Validation Strategy

### Reinsertion checks
- A card with an `incorrect` outcome reappears in the same session when ≥ 2 cards
  remain in the queue
- Tail-end rule: card is not reinserted when fewer than 2 cards remain; it is added
  to the missed set instead
- Reinserted card is not the immediately next card
- Card is not reinserted more than once per session
- A second `incorrect` outcome on a reinserted card decreases confidence but does not
  trigger a second reinsertion
- Reinsertion cap of 5 is respected
- Progress bar denominator updates when a card is reinserted
- Session completes cleanly after reinsertion

### Confidence score checks
- Score increments correctly on `correct` outcome
- Score decrements correctly on `incorrect` outcome
- Score is capped at 10 and floored at 0
- `recentOutcomes` contains at most 10 entries
- Score is persisted to IndexedDB after each outcome
- No cross-profile leakage

### "Practice again" offer checks
- Offer appears when ≥ 2 cards produced `incorrect` outcomes
- Offer does not appear when 0 or 1 cards were missed
- Focused drill contains only the missed cards
- No recursive "practice again" offer after a focused drill

### Regression checks
- Phase 5 card interaction model unchanged (labels, visual treatment, outcome mapping)
- Reinforcement logic is coupled to stored outcome values, not button labels
- Session progression behavior unchanged
- `ReviewProgress` table unaffected
- Canonical content unaffected

---

## What This Design Intentionally Defers

- bucket transition logic (0/1/2) — separate spec
- trip-phase weighting — separate spec
- session selection weighting by confidence — separate spec
- visible confidence display to the user — separate spec
- spaced repetition intervals — not approved for this product
- feedback overlay and encouragement text — separate spec
