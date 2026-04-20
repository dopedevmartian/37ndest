# 006 Review Card Redesign — Requirements

## Purpose

This spec defines the V2 review card and full-screen review surface for 37NDEST.

Phase 5 is a presentation and layout change. It replaces the V1/V1.5 card shell with the approved V2 three-zone card hierarchy, full-screen surface structure, and V2 action pattern. It does not change review logic, session progression, result recording, or any engine behavior.

---

## Product Context

37NDEST is a tightly scoped Japanese conversation trainer for two users.

The review surface is where ~80% of time in the app is spent. The V1/V1.5 implementation is functional but visually and structurally incompatible with the approved V2 design system and interaction model. Phase 5 corrects that without touching the engine.

---

## Current State (V1/V1.5)

### What exists

`ReviewView.tsx` is the current review surface. It implements:

- a direction-selection screen (recognition vs. production) shown before each session
- a card rendered inside a constrained `max-w-sm` container with `backdrop-blur` glass styling
- a "Back" button at the top of the card
- a session context line showing direction label and item count (e.g. "recognize · 3 / 10")
- a card body with the primary prompt (Japanese for recognition, English for production)
- a reveal section that appears after tap, showing romaji, english, and optional enriched fields
- three post-reveal action buttons: Correct / Incorrect / Skip
- a pre-reveal single button: Reveal
- a completed-session state with item count and "Start another session" button
- an error state with a text message

### What is structurally incompatible with V2

1. **Surface shape** — The card is rendered inside a centered `max-w-sm` box with glassmorphism styling (`bg-white/5`, `backdrop-blur`, `border-white/10`). V2 requires a full-screen surface with no bottom nav during active review. The current container is not full-screen.

2. **Top chrome** — V2 specifies a slim 3px progress bar and a pause affordance (enso icon, top-left). The current implementation has a "← Back" text button and a plain text counter. Neither matches V2 spec.

3. **Color and typography** — The current surface uses dark-mode Tailwind utilities (`text-white`, `text-slate-400`, `bg-blue-600`, `bg-emerald-600`, `bg-red-700`). V2 requires the design system token set (CSS custom properties: `--ink`, `--paper`, `--bengara`, `--matcha`, `--coral`, etc.) and V2 typography (Noto Serif JP at minimum 48pt for Japanese hero text, Source Serif 4 for meanings, Inter for UI chrome).

4. **Japanese text scale** — The current card renders Japanese at `text-3xl` (~30px). V2 requires minimum 48pt for the review card hero. This is a hard rule in the design system.

5. **Action pattern** — The current post-reveal controls are three equal-weight buttons: Correct / Incorrect / Skip. V2 specifies a two-action pattern: "Got it" (filled, `--ink` background) and "Again" (`--coral` text, `--coral-soft` border, `--paper` background). Skip is not part of the V2 action pattern.

6. **Reveal behavior** — The current reveal is a static border-top divider with content below. V2 specifies an opacity + max-height transition animating the meaning zone into view, with a bengara divider line above the meaning.

7. **Enriched field placement** — The current implementation renders enriched fields (`simple_explanation`, `example_japanese`, `example_english`, `usage_note`, `literal_breakdown`) in a flat list after reveal with no hierarchy. V2 defines a three-zone hierarchy with progressive disclosure for support content.

8. **Direction selection screen** — V2 specifies that review mode is a profile preference set in Settings, not a per-session decision point. The current direction-selection screen is incompatible with V2 navigation.

9. **Romaji placement** — The current implementation shows romaji as the first item after reveal in both directions. V2 specifies romaji as a secondary muted line in reveal mode (after reveal, not before), and as part of option text in MC modes. Phase 5 covers reveal mode only.

### What is currently working and must be preserved

- `createSessionEntry()` — pure function, no change
- `selectSessionItems()` — pure function, no change
- `createSessionState()` / `getCurrentItem()` / `advanceSession()` — pure functions, no change
- `createRecognitionPrompt()` / `captureRecognitionResult()` — pure functions, no change
- `createProductionPrompt()` / `captureProductionResult()` — pure functions, no change
- `recordItemResult()` / `recordSessionResults()` — persistence functions, no change
- All types in `src/types/review.ts` and `src/types/content.ts` — no change
- Session state model (`ViewPhase`, `RecognitionInteraction`, `ProductionInteraction`) — logic preserved, only rendering changes
- The `onBack` prop interface — preserved (wired to pause behavior)

### Enriched card reality

As of Phase 5, approximately 40 cards have V2 enriched fields populated (`simple_explanation`, `example_japanese`, `example_romaji`, `example_english`, `usage_note`, `literal_breakdown`). The remaining cards have only the V1 core fields (`japanese`, `romaji`, `english`, and optionally `usage_note`). The card shell must handle both gracefully.

---

## Scope of This Spec

### Included

- full-screen review surface structure
- top chrome: slim progress bar + pause affordance
- three-zone card hierarchy (Zone 1, Zone 2, Zone 3)
- reveal behavior (animation, bengara divider)
- enriched field placement per zone
- romaji placement in reveal mode
- V2 action pattern (Got it / Again)
- V2 design system tokens and typography applied to the review surface
- direction-selection screen removal (mode comes from profile settings)
- graceful handling of unenriched cards
- file-level impact definition

### Not included

- feedback overlay system (timing, color wash animation, encouragement text, haptics, auto-advance) — out of scope for this spec
- multiple choice mode implementation — out of scope for this spec
- profile-based review-mode preference integration — out of scope for this spec
- session summary redesign — out of scope for this spec
- home screen redesign — out of scope for this spec
- progress screen redesign — out of scope for this spec
- bucket-writing logic — out of scope for this spec
- trip-phase weighting — out of scope for this spec
- card population / authoring work
- session milestone micro-moments

---

## Requirements

### R1. The review surface must be full-screen during active review

The review surface must occupy the full viewport during an active session. No bottom navigation bar is shown during active review. No centered card container with constrained max-width.

### R2. The top chrome must match V2 specification

Top chrome must include:
- a slim progress bar (3px height, `--ink` fill on `--paper-deep` track) showing item progress
- a pause affordance in the top-left position using the enso circle icon
- no other persistent chrome during active review

The pause affordance must return the user to the Today/Home screen (via the existing `onBack` prop).

### R3. The card must implement the three-zone hierarchy

**Zone 1 — Primary prompt area**
Always visible. Contains the primary study cue. Never hidden before or after reveal.

**Zone 2 — Reveal content**
Hidden before reveal. Animates into view on reveal. Contains the core answer content.

**Zone 3 — Progressive disclosure / support content**
Hidden before reveal. Shown after reveal when enriched fields are present. Contains secondary support content. Must not compete visually with Zone 2.

### R4. Zone 1 content must follow direction rules

Recognition direction:
- Zone 1 displays the Japanese text at minimum 48pt (Noto Serif JP)
- category chip displayed above the Japanese text when `category` is present

Production direction (scaffolded):
- Zone 1 displays the English meaning (Source Serif 4)
- romaji is displayed below the English as a secondary muted line (italic Source Serif 4, `--ink-muted`) — shown pre-reveal intentionally as beginner scaffolding
- This is an approved Phase 5 choice: production direction uses English + romaji as the pre-reveal cue, supporting beginners in connecting sound to meaning before attempting recall

### R5. Zone 2 content must follow direction rules

Recognition direction (after reveal):
- a short bengara divider line appears above the meaning zone
- English meaning (Source Serif 4)
- romaji as a secondary muted line (italic Source Serif 4, `--ink-muted`) — appears after reveal, not before
- `simple_explanation` when present (Source Serif 4, `--ink-muted`)

Production direction (after reveal):
- a short bengara divider line appears above the answer zone
- Japanese text at minimum 48pt (Noto Serif JP)
- romaji as a secondary muted line (italic Source Serif 4, `--ink-muted`)

### R6. Zone 3 content must follow placement rules

Zone 3 is shown inline after reveal when any of the following fields are present:
- `example_japanese` / `example_romaji` / `example_english` (example triple — all three or none)
- `usage_note`
- `literal_breakdown`

Zone 3 must not appear when none of these fields are present on the current card.

Zone 3 must be visually subordinate to Zone 2. It must not compete with the primary answer content.

Zone 3 content is displayed inline — no chip-based progressive disclosure in this phase. All present support fields are shown directly after reveal.

### R7. The pre-reveal state must include a tap-to-reveal affordance

Before reveal, the lower half of the card area must be tappable to trigger reveal. A "Tap to reveal" hint must be present, pulsing gently (opacity oscillation, 2.4s cycle). The entire lower half of the card area is tappable — not just the hint text.

### R8. The reveal animation must match V2 specification

On reveal:
- the meaning zone (Zone 2) animates into view using opacity + max-height transition
- a short bengara divider line appears above the meaning
- transition duration must be under 300ms

### R9. The post-reveal action pattern must match V2 specification

After reveal, two actions are shown:
- "Got it" — filled button, `--ink` background, `--paper` text
- "Again" — `--coral` text, `--coral-soft` border, `--paper` background

"Got it" maps to the `correct` outcome in the existing engine.
"Again" maps to the `incorrect` outcome in the existing engine.

The `skipped` outcome is removed from the V2 action pattern. It may be retained internally in the engine but must not appear as a visible UI action in Phase 5.

### R10. The direction-selection screen must be removed

The per-session direction-selection screen must be removed. In this phase, all review sessions default unconditionally to `recognition` direction. No new settings dependency is introduced. Profile-based review-mode preference integration is deferred to a later dedicated task or spec.

### R11. The design system tokens and typography must be applied

All colors must use CSS custom property tokens (`--paper`, `--ink`, `--bengara`, `--matcha`, `--coral`, etc.). No hardcoded hex values. No Tailwind color utilities that conflict with the design system.

Typography must use the four approved fonts in their correct roles:
- Noto Serif JP — Japanese display (minimum 48pt on review card hero)
- Source Serif 4 — meanings, explanations, italic prose
- Inter — UI chrome (labels, buttons, chips)

### R12. Unenriched cards must not feel broken

Cards without enriched fields must render cleanly. Zone 3 must not appear. The absence of `simple_explanation`, example triple, `usage_note`, or `literal_breakdown` must not produce empty containers, broken layout, or visual gaps.

### R13. The review surface must preserve all existing session logic

The following behaviors must remain unchanged:
- session item selection
- session progression (advance, complete)
- recognition and production result capture
- result persistence via `recordItemResult`
- profile isolation
- error and empty-session state handling

---

## Acceptance Criteria

### AC1. Full-screen surface
- The review surface occupies the full viewport during active review
- No bottom nav is visible during active review
- No constrained card container is used

### AC2. Top chrome
- A 3px progress bar is visible at the top, showing item progress with `--ink` fill
- A pause affordance (enso icon) is visible top-left
- Tapping the pause affordance returns to the home screen via `onBack`

### AC3. Zone 1 — recognition
- Japanese text is displayed at minimum 48pt using Noto Serif JP
- Category chip is shown above when `category` is present
- Zone 1 is visible before and after reveal

### AC4. Zone 1 — production
- English meaning is displayed using Source Serif 4
- Romaji is shown below as a secondary muted line (italic, `--ink-muted`) — shown pre-reveal as approved beginner scaffolding
- Zone 1 is visible before and after reveal

### AC5. Zone 2 — recognition reveal
- Zone 2 is hidden before reveal
- On reveal, Zone 2 animates in (opacity + max-height, under 300ms)
- A bengara divider line appears above Zone 2
- English meaning is shown in Source Serif 4
- Romaji is shown as a secondary muted line (italic Source Serif 4, `--ink-muted`)
- `simple_explanation` is shown when present

### AC6. Zone 2 — production reveal
- Zone 2 is hidden before reveal
- On reveal, Zone 2 animates in (opacity + max-height, under 300ms)
- A bengara divider line appears above Zone 2
- Japanese text is shown at minimum 48pt using Noto Serif JP
- Romaji is shown as a secondary muted line

### AC7. Zone 3
- Zone 3 is hidden before reveal
- Zone 3 appears inline after reveal only when enriched support fields are present
- Example triple (all three fields) is shown when present
- `usage_note` is shown when present
- `literal_breakdown` is shown when present
- Zone 3 does not appear when none of these fields are present
- Zone 3 is visually subordinate to Zone 2
- No chip-based progressive disclosure is used in this phase

### AC8. Pre-reveal tap affordance
- "Tap to reveal" hint is visible before reveal
- The hint pulses gently (opacity oscillation)
- The lower half of the card area is tappable to trigger reveal

### AC9. Post-reveal actions
- "Got it" and "Again" buttons are shown after reveal
- "Got it" uses `--ink` background, `--paper` text
- "Again" uses `--coral` text, `--coral-soft` border, `--paper` background
- No "Skip" button is visible
- "Got it" records `correct` outcome; "Again" records `incorrect` outcome

### AC10. Direction selection removed
- No per-session direction-selection screen is shown
- All sessions start unconditionally in `recognition` direction
- No settings dependency is introduced in this phase

### AC11. Design system tokens
- All colors use CSS custom property tokens
- No hardcoded hex values in the review surface
- Japanese hero text is minimum 48pt

### AC12. Unenriched cards
- Cards without enriched fields render cleanly
- No empty containers or broken layout
- Zone 3 is absent when no support fields are present

### AC13. Session logic preserved
- Session progression, result capture, and persistence behavior are unchanged
- Profile isolation is preserved
- Error and empty-session states remain honest and understandable

---

## Risks

1. **Layout drift from mockup** — The three-zone hierarchy must match the approved V2 mockup. Implementing from spec alone without referencing `37ndest-v2-mockup.html` risks visual drift.

2. **Breaking existing review logic** — The session state model and engine functions must not be touched. Any refactor that bleeds into `sessionProgression.ts`, `recognitionFlow.ts`, `productionFlow.ts`, or `progressRecorder.ts` is out of scope.

3. **Sparse cards feeling broken** — Unenriched cards (the majority) must render cleanly. Zone 3 absence must be invisible, not a visible gap.

4. **Feedback overlay and encouragement out of scope** — The feedback overlay system (color wash, encouragement text, haptics, auto-advance timing) is out of scope for this spec. Phase 5 action buttons record outcomes and advance the session directly without overlay animation. Do not implement any part of this system here.

5. **Overreaching into multiple choice mode** — Multiple choice mode is out of scope for this spec. Phase 5 covers reveal mode only. The `distractors` field exists on some content records but must be entirely ignored by the Phase 5 UI — not rendered, not wired, not referenced.

6. **Direction preference deferred** — Profile-based review-mode preference is not integrated in this phase. Sessions default unconditionally to `recognition`. Do not introduce a settings dependency here.

---

## Explicit Non-Requirements

- feedback overlay animation, encouragement text, haptics, and auto-advance — out of scope for this spec
- multiple choice mode — out of scope for this spec
- profile-based review-mode preference integration — out of scope for this spec
- session milestone messages — out of scope for this spec
- session summary redesign
- home screen redesign
- progress screen redesign
- bucket-writing logic
- trip-phase weighting
- card authoring or population
