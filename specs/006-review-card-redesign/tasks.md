# 006 Review Card Redesign — Tasks

## Purpose

These tasks implement the V2 review card and full-screen review surface for 37NDEST.

This task list is scoped to:
- replace the V1/V1.5 card shell with the V2 full-screen surface
- implement the three-zone card hierarchy
- apply V2 design system tokens and typography
- implement the V2 action pattern (Got it / Again)
- remove the direction-selection screen
- handle enriched and unenriched cards gracefully

This task list does not authorize changes to review engine logic, session progression, result recording, or any behavior outside the rendering boundary.

---

## Task List

- [x] **T1. Establish the full-screen review surface structure**
  - Remove the constrained `max-w-sm` card container and glassmorphism styling from `ReviewView.tsx`
  - Replace with a full-screen layout (full viewport, no bottom nav during active review)
  - Apply `--paper` background and V2 design system tokens to the surface
  - Remove the direction-selection phase from `ViewPhase`; add `complete` as a separate phase
  - Default study direction unconditionally to `recognition` — no settings dependency introduced
  - Add a comment at the direction assignment: `// Phase 5: recognition unconditionally. Profile-based preference deferred to a later spec.`
  - Do not add a `loading` phase or other speculative state phases unless implementation reveals a concrete need
  - Unchanged behavior: session logic, result recording, `onBack` prop, error state

- [x] **T2. Implement top chrome (progress bar + pause affordance)**
  - Add a 3px progress bar at the top of the viewport
    - `--ink` fill on `--paper-deep` track
    - Width = `(currentIndex / items.length) * 100%`
  - Add a pause affordance (enso circle SVG icon) top-left
    - Taps `onBack`
  - Add an item counter top-right (`--ink-muted`, Inter, small)
  - No other persistent chrome during active review
  - Unchanged behavior: `onBack` wiring, session state reads

- [x] **T3. Create the ReviewCard component with Zone 1**
  - Create `src/components/ReviewCard.tsx` — this is the one approved new component file for this phase
  - Do not create additional new component files unless implementation proves one is concretely required
  - Implement Zone 1 — primary prompt area (always visible)
  - Recognition direction: Japanese text (Noto Serif JP, minimum 48pt, `--ink`) + category chip above when present
  - Production direction (scaffolded): English meaning (Source Serif 4, `--ink`) + romaji below (italic Source Serif 4, `--ink-muted`) — romaji shown pre-reveal intentionally as approved beginner scaffolding
  - Category chip: Inter, small, `--ink-muted`, maps internal category to V2 display label
  - Props: `item: SessionItem`, `revealed: boolean`, `onReveal: () => void`, `onGotIt: () => void`, `onAgain: () => void`
  - Unchanged behavior: no engine calls, pure rendering

- [x] **T4. Implement Zone 2 — reveal content with animation**
  - Add Zone 2 to `ReviewCard.tsx`
  - Hidden before reveal (`opacity: 0`, `max-height: 0`, `overflow: hidden`)
  - On reveal: animate in with opacity + max-height transition (under 300ms)
  - Bengara divider line appears above Zone 2 on reveal (`--bengara`, 2px height)
  - Recognition direction content: English meaning (Source Serif 4, `--ink`), romaji (italic Source Serif 4, `--ink-muted`), `simple_explanation` when present (`--ink-muted`)
  - Production direction content: Japanese text (Noto Serif JP, minimum 48pt, `--ink`), romaji (italic Source Serif 4, `--ink-muted`)
  - Unchanged behavior: reveal state driven by `revealed` prop, no engine coupling

- [x] **T5. Implement Zone 3 — inline support content**
  - Add Zone 3 to `ReviewCard.tsx`
  - Hidden before reveal; shown inline after reveal only when enriched support fields are present
  - No chip-based progressive disclosure — all present support fields are shown directly after reveal
  - Fields: example triple (`example_japanese` / `example_romaji` / `example_english` — all three or none), `usage_note`, `literal_breakdown`
  - Typography per design: Noto Sans JP for example Japanese, italic Source Serif 4 for example romaji/english, italic Source Serif 4 for `usage_note`, Inter small `--ink-faint` for `literal_breakdown`
  - Zone 3 is visually subordinate to Zone 2 (smaller type, `--ink-muted` / `--ink-faint` colors)
  - When no support fields are present: Zone 3 is absent — no container, no empty space
  - `distractors` field is ignored entirely — do not render or reference it
  - Unchanged behavior: no engine calls, pure rendering

- [x] **T6. Implement pre-reveal tap affordance**
  - Add "Tap anywhere to reveal" hint below Zone 1 (Inter, small, `--ink-faint`)
  - Pulse animation: opacity oscillates 0.4 → 1.0 over 2.4s, `ease-in-out`, infinite
  - The entire lower half of the card area is a tappable target (not just the hint text)
  - Hint and tappable area are hidden after reveal
  - Unchanged behavior: `onReveal` prop call, no engine coupling

- [x] **T7. Implement V2 post-reveal action pattern**
  - Replace the three-button (Correct / Incorrect / Skip) pattern with two buttons
  - "Got it": `--ink` background, `--paper` text, Inter, `--radius` border-radius
  - "Again": `--coral` text, `--coral-soft` border, `--paper` background, Inter, `--radius` border-radius
  - "Got it" calls `onGotIt` → maps to `correct` outcome in `ReviewView`
  - "Again" calls `onAgain` → maps to `incorrect` outcome in `ReviewView`
  - Both buttons disabled after tap (prevent double-submit)
  - No "Skip" button visible
  - Action buttons hidden before reveal
  - Unchanged behavior: `correct` and `incorrect` outcomes still flow to engine unchanged; `skipped` outcome retained in engine types but not exposed in UI

- [x] **T8. Wire ReviewCard into ReviewView and validate integration**
  - Replace inline card rendering in `ReviewView.tsx` with `<ReviewCard />` component
  - Confirm `onGotIt` and `onAgain` correctly call `handleRecognitionOutcome` / `handleProductionOutcome` with the right outcomes
  - Confirm `onReveal` correctly updates `recognitionInteraction` / `productionInteraction` revealed/recalled state
  - Confirm session completion state renders honestly (separate `complete` phase)
  - Confirm error state renders honestly
  - Confirm `onBack` (pause) fires correctly
  - Unchanged behavior: all session logic, result recording, profile isolation

- [x] **T9. Add validation coverage for Phase 5 behavior**
  - Add proportionate checks for:
    - Zone 1 renders correctly for recognition and production directions
    - Production Zone 1 shows romaji pre-reveal (approved scaffolding)
    - Zone 2 is hidden before reveal, visible after
    - Zone 3 is absent on unenriched cards, present inline on enriched cards after reveal
    - "Got it" records `correct` outcome; "Again" records `incorrect` outcome
    - Unenriched card renders without empty containers or broken layout
    - Session progression behavior unchanged (advance, complete)
  - Keep validation narrow and relevant to this spec
  - Do not duplicate existing engine tests

- [x] **T10. Confirm scope preservation**
  - Review the implementation against this spec
  - Confirm no feedback overlay, encouragement text, or haptic behavior was introduced
  - Confirm no multiple choice mode was introduced
  - Confirm `distractors` field was not rendered or referenced
  - Confirm no settings dependency was introduced for review-mode preference
  - Confirm no engine files were modified
  - Confirm no hardcoded hex values remain in the review surface
  - Confirm Japanese hero text is minimum 48pt
  - Confirm Zone 3 is inline (no chip-based disclosure)
  - Record any clarified reality back into the spec if needed

---

## Task Execution Notes

### Default Order
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10

T3–T7 may be executed together as they all build `ReviewCard.tsx`. T8 integrates the component. T9 validates. T10 confirms scope.

### File Scope

**Allowed to change:**
- `src/app/ReviewView.tsx`
- `src/components/ReviewCard.tsx` (new file — the one approved new component for this phase)

**Conditionally allowed:**
- `src/styles/globals.css` — only if implementation reveals a concrete missing token required by the already-approved design system; minimal addition only; do not touch otherwise

**Must not change:**
- `src/features/review/` — all files
- `src/types/review.ts`
- `src/types/content.ts`
- `src/db/`
- `src/app/HomeView.tsx`
- `src/app/SettingsView.tsx`
- `src/features/profiles/`
- `src/features/settings/`
- `data/decks/`
- Any prior spec files

### Unchanged Behavior Reminder

For each task, confirm:
- session item selection is unchanged
- session progression (advance, complete) is unchanged
- recognition and production result capture is unchanged
- `recordItemResult` is still called on each outcome
- profile isolation is preserved
- error and empty-session states remain honest

### Phase Boundary Reminders

- Do not implement feedback overlay (color wash, encouragement text, auto-advance) — out of scope for this spec
- Do not implement haptic feedback — out of scope for this spec
- Do not implement session milestone messages — out of scope for this spec
- Do not implement multiple choice mode — out of scope for this spec
- Do not render, wire, or reference the `distractors` field — ignored entirely in this phase
- Do not introduce a settings dependency for review-mode preference — deferred to a later spec

---

## Completion Standard

This spec is complete when:
- the review surface is full-screen with V2 top chrome
- the three-zone card hierarchy is implemented for both directions
- production direction shows English + romaji pre-reveal as approved scaffolding
- enriched and unenriched cards render cleanly
- Zone 3 is inline (no chip-based disclosure)
- the V2 action pattern (Got it / Again) is in place
- the direction-selection screen is removed; sessions default to `recognition` unconditionally
- V2 design system tokens and typography are applied throughout
- all existing session logic and result recording behavior is preserved
- validation is present and proportionate
- no feedback overlay, multiple choice, haptics, or settings dependency was introduced
