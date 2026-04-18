# 004 Study Session UI Design

## Purpose

This design defines the user-facing study-session experience for 37NDEST. It turns review-engine behavior into a focused, practical, repeatable study flow that feels clear and low-friction for the two intended users.

The design must support:
- profile-aware study sessions
- recognition-oriented interaction
- production-oriented interaction
- clear reveal/confirmation flow
- coherent item-to-item progression
- low-friction repeated use

The design must not drift into dashboard-heavy or novelty-first interaction design.

---

## Design Goals

1. make the current study step obvious
2. keep core interactions fast and low-friction
3. make recognition and production feel consistent within one product
4. preserve a clean separation between UI and engine boundaries
5. support practical repeated use under a real mission timeline
6. avoid decorative complexity and fake completeness

---

## High-Level Design

The study-session UI should sit on top of the review engine and present one current study item at a time.

The design should include:

- a **session entry surface** or entry path
- a **current-item surface** that shows the active study prompt
- a **reveal/confirmation state**
- a **result action area**
- a **session progression path** to the next item
- a **completion or interruption state**
- honest **empty/error state handling**

The UI should remain focused on study work, not on broad product chrome.

---

## Core Design Decisions

### D1. The session UI should center one study item at a time
The user should not be asked to parse multiple competing study surfaces at once.

Implications:
- the current item should dominate the interface
- secondary information should not compete with the main study action
- the UI should feel like a session surface, not a dashboard

### D2. Recognition and production should share a common interaction grammar
The session UI should feel like one product even when the study direction changes.

Implications:
- both directions should use a familiar overall structure
- the user should be able to tell what mode they are in without re-learning the whole screen
- reveal, confirm, and next-step actions should feel related across modes

### D3. Reveal state should be explicit
The UI should clearly distinguish between:
- prompt-only state
- revealed/confirmed state
- post-result progression state

Implications:
- the user should not wonder whether the answer is already shown
- actions should change coherently based on current state
- result actions should not appear prematurely in confusing ways

### D4. Session progression should be obvious
The UI should make it clear how the user moves forward.

Implications:
- the “next” path should be easy to find
- the user should not feel trapped in ambiguous state
- transitions between items should feel stable and consistent

### D5. The UI should remain practical, not theatrical
This product is for repeated actual study use.

Implications:
- avoid decorative motion that slows repetition
- avoid burying actions behind cleverness
- prioritize readability, repeatability, and low interaction cost
- keep the UI honest about what it does and does not yet support

---

## Proposed Session Surface Structure

A study session surface should generally include:

1. **session context header**
   - enough context to know a session is active
   - may include lightweight information like active mode or progress context
   - should not become a dense analytics band

2. **current prompt area**
   - the main study prompt for the current item
   - should visually dominate the session

3. **supporting context area**
   - optional supporting information that does not overwhelm the prompt
   - should remain subordinate to the main task

4. **reveal / confirmation area**
   - the place where answer reveal or confirmation is controlled
   - should clearly reflect whether the item is hidden or revealed

5. **result action area**
   - the place where the user records the outcome
   - should appear only when appropriate for the current state

6. **progression area**
   - the place where the user advances to the next item or exits cleanly
   - should remain simple and easy to understand

This structure should remain compact and review-oriented.

---

## Recognition-Oriented UI Design

Recognition-oriented flow should support a sequence like:

1. user sees the prompt
2. user attempts recognition mentally
3. user reveals or confirms the answer
4. user records the result
5. user advances to the next item

### Recognition UI requirements
- the prompt should be clear
- the answer should not be ambiguously half-visible
- reveal state should be obvious
- result actions should be clearly tied to the revealed state
- progression should remain simple

---

## Production-Oriented UI Design

Production-oriented flow should support a sequence like:

1. user sees the prompt intended to trigger recall
2. user attempts recall before confirmation
3. user reveals or confirms the intended answer
4. user records the result
5. user advances to the next item

### Production UI requirements
- the UI should make the recall expectation obvious
- the user should be encouraged to attempt recall before reveal
- reveal state should remain clear
- result actions should remain consistent with the broader session grammar
- the mode should support conversational usefulness rather than passive recognition

---

## State Model at the UI Layer

The session UI should make these states easy to understand:

- no active usable session
- active item, unrevealed
- active item, revealed
- result recorded / ready to advance
- session complete
- interrupted or exited
- invalid or unavailable session state

Do not blur those states together in confusing ways.

---

## Completion and Interruption Design

### Session Completion
When a session finishes, the UI should provide a clear completion state.

This state should:
- feel conclusive
- avoid unnecessary ceremony
- make it clear the current session is done
- allow the user to leave or continue appropriately when future behavior supports that

### Session Interruption
If a session is exited or cannot continue:
- the state should be honest
- the user should not be shown fake progress
- the UI should remain understandable
- interruption behavior should not corrupt the broader session model

---

## Error and Empty-State Design

If no usable session can be shown:
- the UI should say so clearly
- the user should not see broken or misleading study controls
- the state should remain reviewable and diagnosable
- the UI should not pretend a normal session is happening

This is especially important for:
- invalid session state
- missing content
- incompatible profile/session state
- load failures tied to trusted content or local state

---

## Visual and Interaction Posture

The study-session UI should feel:
- focused
- practical
- repeatable
- readable
- light enough for repeated use

Avoid:
- dashboard density
- noisy chrome
- decorative complexity
- feature-heavy side panels
- novelty-first interactions

This is a working study surface, not a product showcase.

---

## Relationship to Engine and Data Boundaries

The UI should consume:
- active session state
- current trusted study item
- profile-aware mutable progress behavior through the engine boundary

The UI should not:
- mutate canonical content directly
- own review-engine logic that belongs below it
- re-derive product truth independently of engine/session state

Keep engine logic and UI rendering separate enough that later changes do not require architectural rescue.

---

## Validation Strategy for This Spec

The session UI should be validated with checks such as:

### Flow checks
- recognition-oriented flow is understandable
- production-oriented flow is understandable
- reveal state is obvious
- result recording is coherent
- next-item progression is clear

### State checks
- unrevealed vs revealed state is clear
- result-ready state is clear
- completion/interruption state is clear
- empty/error state is honest

### Scope checks
- the UI did not drift into dashboard-heavy product behavior
- the UI did not silently add unrelated learning modes
- the UI remained aligned with profile-aware, local-first behavior

---

## What This Design Intentionally Defers

This design intentionally defers:
- advanced dashboard/reporting surfaces
- deep analytics
- streaks and gamification
- pronunciation scoring
- broad study-history UI
- social or multiplayer interaction
- advanced pacing recommendation UX
- broad settings redesign

If implementation starts solving those broadly, it is exceeding this spec.

---

## File Scope Expectations

Likely file areas in scope for this spec include:
- `src/features/review/`
- `src/components/`
- `src/app/` only where routing/surface integration requires it
- `src/styles/`
- relevant test files

Likely out of scope unless explicitly justified:
- broad persistence redesign
- canonical content transformation work
- advanced settings surfaces
- dashboards or analytics areas
- backend or sync surfaces

---

## Design Summary

This design succeeds if 37NDEST gains a clear, low-friction, profile-aware study-session UI that:
- presents one study item at a time clearly
- supports recognition and production-oriented interaction
- makes reveal and progression states obvious
- handles completion and empty/error states honestly
- stays tightly aligned with the product’s practical conversational purpose