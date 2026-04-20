# 006 Review Card Redesign — Design

## Purpose

This design defines the implementation approach for the V2 review card and full-screen review surface. It translates the Phase 5 requirements into a concrete component structure, layout model, field placement rules, and integration boundary.

Phase 5 is a rendering and layout change. The engine layer is untouched.

---

## Design Goals

1. Replace the V1/V1.5 card shell with the V2 full-screen surface
2. Implement the three-zone card hierarchy cleanly
3. Apply V2 design system tokens and typography throughout
4. Handle enriched and unenriched cards without layout breakage
5. Preserve all existing session logic without modification
6. Keep the integration boundary between UI and engine narrow and explicit

---

## Surface Structure

### Full-Screen Layout

The review surface is full-screen during active review. No bottom nav. No constrained container.

```
┌─────────────────────────────────────┐
│  [enso pause]   ████░░░░░░░░  3/10  │  ← top chrome (3px bar + pause)
├─────────────────────────────────────┤
│                                     │
│         ZONE 1 — Primary Prompt     │  ← always visible
│                                     │
│  ─────────────────── (bengara rule) │  ← appears on reveal
│                                     │
│         ZONE 2 — Reveal Content     │  ← hidden → animates in on reveal
│                                     │
│         ZONE 3 — Support Content    │  ← hidden → shown after reveal
│                  (when present)     │     when enriched fields exist
│                                     │
│    [Tap anywhere to reveal]  pulse  │  ← pre-reveal affordance
│                                     │
│  [    Got it    ]  [    Again    ]  │  ← post-reveal actions
└─────────────────────────────────────┘
```

### Top Chrome

- Height: slim bar only — 3px progress bar at very top of viewport
- Below the bar: pause affordance (enso icon, top-left) + item counter (top-right, `--ink-muted`, Inter)
- Progress bar: `--ink` fill on `--paper-deep` track, width = `(currentIndex / items.length) * 100%`
- Pause affordance: enso circle SVG icon, taps `onBack`
- No other persistent chrome

### Card Area

The card area fills the remaining viewport below top chrome. It is a single scrollable column on small screens if Zone 3 content is long.

---

## Three-Zone Hierarchy

### Zone 1 — Primary Prompt

Always visible. Never hidden. Occupies the upper portion of the card area.

**Recognition direction:**
```
[category chip]          ← Inter, small, --ink-muted, shown when category present
                         ← category mapped to V2 display label at render time

大丈夫ですか？           ← Noto Serif JP, minimum 48pt, --ink
```

**Production direction (scaffolded):**
```
Are you okay?            ← Source Serif 4, large, --ink

daijoubu desu ka?        ← italic Source Serif 4, --ink-muted
                         ← romaji shown pre-reveal intentionally as beginner scaffolding
```

Zone 1 does not change after reveal. It remains visible throughout.

The production direction pre-reveal cue is English + romaji. This is an approved Phase 5 choice: showing romaji pre-reveal helps beginners connect sound to meaning before attempting recall. It is not an accidental implementation detail.

### Zone 2 — Reveal Content

Hidden before reveal. Animates in on reveal.

Animation: `opacity: 0 → 1` + `max-height: 0 → auto` transition, under 300ms.

A short bengara divider line (`--bengara`, 2px height, ~40px wide, centered or left-aligned per mockup) appears above Zone 2 as part of the reveal animation.

**Recognition direction (after reveal):**
```
────────────  (bengara divider)

It's okay. / Are you alright?    ← Source Serif 4, --ink

daijoubu desu ka?                ← italic Source Serif 4, --ink-muted (romaji, secondary)

It's a gentle way to check in.   ← Source Serif 4, --ink-muted (simple_explanation, when present)
```

**Production direction (after reveal):**
```
────────────  (bengara divider)

大丈夫ですか？           ← Noto Serif JP, minimum 48pt, --ink

daijoubu desu ka?        ← italic Source Serif 4, --ink-muted
```

### Zone 3 — Support Content

Hidden before reveal. Shown inline after reveal only when at least one support field is present.

Zone 3 content is displayed inline — no chip-based progressive disclosure in this phase. All present support fields are shown directly after reveal.

Zone 3 is visually subordinate — smaller type, `--ink-muted` color, separated from Zone 2 by spacing or a faint rule.

**Fields and placement:**

| Field | Placement | Typography |
|---|---|---|
| `example_japanese` | First in Zone 3 | Noto Sans JP, body size, --ink-soft |
| `example_romaji` | Below example_japanese | italic Source Serif 4, --ink-muted |
| `example_english` | Below example_romaji | Source Serif 4, --ink-muted |
| `usage_note` | After example triple (or first if no example) | italic Source Serif 4, --ink-muted |
| `literal_breakdown` | Last in Zone 3 | Inter, small, --ink-faint |

Example triple rule: all three fields (`example_japanese`, `example_romaji`, `example_english`) must be present to render any of them. If only one or two are present, the triple is treated as absent.

**When Zone 3 is absent:**
No container, no empty space, no placeholder. The card ends at Zone 2 (or the action area).

---

## Pre-Reveal State

Before reveal, the card shows:
- Zone 1 (always)
- A "Tap anywhere to reveal" hint below Zone 1
  - Font: Inter, small, `--ink-faint`
  - Animation: opacity oscillates between 0.4 and 1.0 over 2.4s (CSS animation, `ease-in-out`, infinite)
- The entire lower half of the card area is a tappable target — not just the hint text
- Zone 2 and Zone 3 are hidden (not rendered or `visibility: hidden` with `max-height: 0`)
- Action buttons are hidden

---

## Post-Reveal State

After reveal, the card shows:
- Zone 1 (unchanged)
- Zone 2 (animated in)
- Zone 3 (shown if enriched fields present)
- Action buttons:
  - "Got it" — full-width or dominant, `--ink` background, `--paper` text, Inter, `--radius` border-radius
  - "Again" — secondary, `--coral` text, `--coral-soft` border, `--paper` background, Inter, `--radius` border-radius
- The tap-to-reveal hint is hidden

Action button behavior:
- "Got it" → calls `handleRecognitionOutcome("correct")` or `handleProductionOutcome("correct")`
- "Again" → calls `handleRecognitionOutcome("incorrect")` or `handleProductionOutcome("incorrect")`
- Both buttons are disabled after tap (prevent double-submit)
- No "Skip" button

---

## Direction Handling

### Removing the Direction-Selection Screen

The `select-direction` phase is removed from `ViewPhase`. All sessions in this phase start unconditionally in `recognition` direction. No settings dependency is introduced. Profile-based review-mode preference integration is deferred to a later dedicated task or spec.

```ts
// Phase 5: recognition direction unconditionally.
// Profile-based review-mode preference is deferred to a later spec.
const direction: StudyDirection = "recognition";
```

### ViewPhase — Minimal State Change

Remove only the `select-direction` phase. Retain `active` and `error`. Add `complete` as a separate phase to make session completion explicit and distinct from the active state. Do not redesign the view-state model beyond what is required to eliminate the direction-selection screen.

```ts
type ViewPhase =
  | { phase: "active"; sessionState: SessionState }
  | { phase: "complete"; sessionState: SessionState }
  | { phase: "error"; message: string };
```

A `loading` phase is not required unless implementation reveals a concrete need for it. Do not add state phases speculatively.

---

## Component Structure

Phase 5 introduces one new component: `src/components/ReviewCard.tsx`. This is the approved new file for this phase.

```
ReviewView.tsx          — session orchestration, state management, onBack wiring
  └── ReviewCard.tsx    — card rendering only (zones, reveal state, actions)
```

No additional new component files should be created unless implementation proves one is concretely required. If a sub-component becomes necessary, it must be justified and noted before creation.

`ReviewCard` props (minimum):
```ts
type ReviewCardProps = {
  item: SessionItem;
  revealed: boolean;
  onReveal: () => void;
  onGotIt: () => void;
  onAgain: () => void;
};
```

`ReviewCard` is a pure rendering component. It does not own session state. It does not call engine functions directly.

---

## Integration Boundaries

### What Phase 5 changes

| File | Change |
|---|---|
| `src/app/ReviewView.tsx` | Remove direction-selection phase; update surface to full-screen; wire top chrome; delegate card rendering to ReviewCard |
| `src/components/ReviewCard.tsx` | New file — three-zone card rendering, reveal animation, action buttons |

`src/styles/globals.css` is not in scope by default. It may be touched only if implementation reveals a concrete missing token or utility required by the already-approved design system, and only for the minimal addition required.

### What Phase 5 must not touch

| File | Reason |
|---|---|
| `src/features/review/sessionEntry.ts` | Pure engine function — no change |
| `src/features/review/sessionProgression.ts` | Pure engine function — no change |
| `src/features/review/recognitionFlow.ts` | Pure engine function — no change |
| `src/features/review/productionFlow.ts` | Pure engine function — no change |
| `src/features/review/progressRecorder.ts` | Persistence function — no change |
| `src/features/review/itemSelector.ts` | Selection logic — no change |
| `src/types/review.ts` | Type definitions — no change |
| `src/types/content.ts` | Type definitions — no change |
| `src/db/` | Database layer — no change |
| `src/app/HomeView.tsx` | Out of scope |
| `src/app/SettingsView.tsx` | Out of scope — no settings dependency introduced in this phase |
| `src/features/profiles/` | Out of scope |
| `src/features/settings/` | Out of scope — no settings dependency introduced in this phase |
| `data/decks/` | Canonical content — no change |
| `specs/001–005` | Prior specs — no change |

### Minimal integration changes allowed

1. `ReviewView.tsx` — remove `select-direction` phase, add `complete` phase, update surface layout, wire `ReviewCard`, default direction to `recognition` unconditionally
2. `ReviewCard.tsx` — new component (new file in `src/components/`)
3. `src/styles/globals.css` — only if a concrete missing token is discovered during implementation; minimal addition only

---

## Enriched vs. Unenriched Card Handling

### Enriched card (40 cards)
All zones render. Zone 3 shows example triple and/or `usage_note` / `literal_breakdown` as available.

### Unenriched card (majority)
Zone 1 and Zone 2 render normally. Zone 3 is absent — no container, no empty space. The card ends cleanly at Zone 2 content and action buttons.

### Partial enrichment
Some cards may have `usage_note` but no example triple, or `simple_explanation` but no `usage_note`. Each field is rendered independently when present. The example triple is all-or-nothing (all three fields required).

---

## Design System Application

### Color tokens (required)

All colors must use CSS custom properties. No Tailwind color utilities that conflict with the token set.

Key tokens for the review surface:
- `--paper` — card background
- `--paper-deep` — progress bar track
- `--ink` — primary text, "Got it" button background
- `--ink-muted` — secondary text, romaji, labels
- `--ink-faint` — "Tap to reveal" hint, `literal_breakdown`
- `--bengara` — divider line, category chip accent
- `--matcha` — (reserved for feedback overlay — do not use in Phase 5)
- `--coral` — "Again" button text and border
- `--coral-soft` — "Again" button background

### Typography

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Japanese hero (Zone 1 recognition, Zone 2 production) | Noto Serif JP | min 48pt | normal | `--ink` |
| English meaning (Zone 1 production, Zone 2 recognition) | Source Serif 4 | large | normal | `--ink` |
| Romaji (all zones) | Source Serif 4 italic | body | normal | `--ink-muted` |
| `simple_explanation` | Source Serif 4 | body | normal | `--ink-muted` |
| Category chip | Inter | small | medium | `--ink-muted` |
| "Tap to reveal" hint | Inter | small | normal | `--ink-faint` |
| Action buttons | Inter | body | medium | per token |
| `literal_breakdown` | Inter | small | normal | `--ink-faint` |
| Example Japanese | Noto Sans JP | body | normal | `--ink-soft` |
| Example romaji / english | Source Serif 4 italic | small | normal | `--ink-muted` |
| Item counter | Inter | small | normal | `--ink-muted` |

---

## Validation Strategy

### Flow checks
- Recognition flow: Zone 1 shows Japanese → tap reveals Zone 2 → "Got it" / "Again" advance session
- Production flow: Zone 1 shows English + romaji (pre-reveal scaffolding) → tap reveals Zone 2 with Japanese → "Got it" / "Again" advance session
- Session completes after all items are advanced

### Zone checks
- Zone 1 is visible before and after reveal
- Zone 2 is hidden before reveal, visible after
- Zone 3 is absent on unenriched cards, present on enriched cards after reveal
- Reveal animation fires (opacity + max-height transition)

### Token checks
- No hardcoded hex values in ReviewView or ReviewCard
- Japanese hero text renders at minimum 48pt

### Regression checks
- Session progression behavior unchanged (same outcomes recorded, same advance logic)
- `recordItemResult` is still called on each outcome
- Error state still renders honestly
- `onBack` still fires on pause tap

### Unenriched card checks
- Card with only `japanese`, `romaji`, `english` renders without empty containers
- Zone 3 is absent
- No layout gaps or broken spacing

---

## What This Design Intentionally Defers

- Feedback overlay (color wash, encouragement text, haptics, auto-advance) — out of scope for this spec
- Multiple choice mode — out of scope for this spec
- Profile-based review-mode preference integration — out of scope for this spec
- Session summary redesign — out of scope for this spec
- Session milestone messages — out of scope for this spec
- Bucket-writing logic — out of scope for this spec
- Trip-phase weighting — out of scope for this spec
