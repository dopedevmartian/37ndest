# 003 Review Engine Design

## Purpose

This design defines the core review-engine architecture for 37NDEST. It turns trusted canonical content plus profile-specific mutable progress into coherent study sessions without overbuilding analytics, dashboards, or speculative learning modes.

The design must support:
- local-first study behavior
- offline-capable operation
- profile-specific progress
- recognition-oriented review
- production-oriented recall
- later pacing/scheduling integration without forcing redesign

The design must not silently become the whole product.

---

## Design Goals

1. generate coherent study sessions from trusted content
2. preserve separation between canonical content and mutable progress
3. support both recognition and production-oriented study directions
4. keep profile-specific progress isolated
5. support later pacing work without premature overdesign
6. keep the runtime simple, reviewable, and local-first

---

## High-Level Design

The review engine should sit between:
- the trusted-content access boundary
- the active profile’s mutable review/progress state
- the session UI layer

The design should include:

- a **session-input layer** that reads trusted content and active profile state
- a **session selection layer** that determines what study items are presented
- a **session progression layer** that advances through items coherently
- a **result-recording layer** that updates mutable profile-specific progress
- a strict **boundary** between canonical content and profile progress/state

No part of this design should require:
- backend calls
- sync
- cloud services
- analytics pipelines
- speculative multi-user logic

---

## Core Design Decisions

### D1. Canonical content stays read-only during review
The review engine should read trusted canonical content but should never treat it as mutable review progress state.

Implications:
- canonical entries remain stable
- profile-specific review outcomes are stored separately
- session results update progress state, not trusted source content

### D2. Sessions are profile-aware from the start
Every review session is tied to the active profile.

Implications:
- session state must not float free of profile identity
- review outcomes must be recorded only against the active profile
- profile leakage must be treated as a design failure

### D3. Recognition and production are study directions, not separate products
The review engine should support both recognition-oriented and production-oriented study behavior as first-class session directions.

Implications:
- the engine should be able to select and present items in either direction
- later UI work can render those directions differently without re-architecting engine behavior
- practical conversational usefulness remains the guiding priority

### D4. Session progression should be real but not overcomplicated
The review engine must support a coherent next-item flow and result recording, but should avoid premature queue sophistication.

Implications:
- there should be a clear session state model
- there should be a clear “next item” progression path
- later specs can refine queue sophistication without replacing the engine structure

### D5. Progress writes must prepare for later pacing work
The review engine should record enough structured profile-specific progress for later pacing/scheduling work, but should not fully implement that logic here.

Implications:
- progress updates should be structured and durable
- review outcomes should not be thrown away as transient UI events
- later pacing work should be able to build on these results rather than replace them

---

## Proposed Review Flow

The app-side review flow should look like this:

1. identify the active profile
2. read trusted canonical content through the content boundary
3. read relevant mutable profile progress
4. derive a study-session item set
5. present one item at a time in the chosen study direction
6. record the user’s outcome for that item
7. update session state and profile progress
8. continue until the current session is complete or exited

This flow should remain local-first and simple.

---

## Session Model Direction

The session model only needs enough structure to support:
- active profile context
- current study direction
- current item
- remaining or next items
- recorded outcomes within the session
- clean advancement through the session

It should not become a giant generalized engine prematurely.

### Suggested session concerns
The design should allow for concepts like:
- active profile ID
- active study direction
- current trusted item ID
- session item order
- per-item result capture
- session completion or interruption state

Do not overdesign beyond what current requirements justify.

---

## Study Direction Design

### Recognition-Oriented Direction
Recognition-oriented review should support:
- seeing a prompt
- attempting recognition
- revealing or confirming the intended answer
- recording an outcome that can affect profile progress

### Production-Oriented Direction
Production-oriented review should support:
- seeing a prompt intended to trigger recall/production
- attempting recall before confirmation
- recording an outcome that can affect profile progress

### Shared Engine Principle
Recognition and production should share the same core engine boundary where practical:
- trusted content selection
- session progression
- profile-specific result recording
- later pacing integration

Do not duplicate the whole engine just to support both study directions.

---

## Progress State Design

Progress state belongs to the active profile and should remain mutable local state.

It should be able to support:
- per-item progress status
- review outcomes
- later schedule/pacing interpretation
- future session eligibility logic

### Separation rule
Keep these concerns separate:
- canonical content
- session runtime state
- durable profile progress
- future pacing/schedule logic

Do not collapse them into one catch-all blob.

---

## Item Selection Design

This spec requires real selection behavior, but not final queue sophistication.

The selection layer should:
- choose items from trusted content
- consider profile-specific progress state
- support recognition and production-oriented study paths
- remain simple enough to understand and validate

This design intentionally avoids defining advanced scheduling or recommendation behavior here.

---

## Result Recording Design

User outcomes during a review session should be recorded into profile-specific mutable state.

Recording should:
- stay tied to the active profile
- stay tied to trusted item identity
- preserve future ability to interpret progress for pacing/scheduling
- avoid mutating trusted content

Do not treat session outcomes as disposable UI state.

---

## Failure and Integrity Rules

If review-related state is missing, inconsistent, or invalid:
- fail in a way that is reviewable
- avoid corrupting canonical content
- avoid cross-profile leakage
- avoid pretending the session state is valid if it is not

Do not invent broad recovery systems prematurely, but do keep failure behavior honest.

---

## Local-First and Offline-Capable Compatibility

The review engine must remain compatible with:
- local-only execution
- static deployment
- offline-capable use
- no backend dependency

This means:
- core session behavior should not depend on online services
- trusted content and profile progress should be usable locally
- session progression should remain available without cloud rescue

---

## Validation Strategy for This Spec

The review engine should be validated with checks such as:

### Session behavior checks
- trusted content can produce a session
- session progression is coherent
- next-item behavior works for the intended scope
- session results are recorded appropriately

### Study-direction checks
- recognition-oriented flow works
- production-oriented flow works
- both directions remain compatible with the same core engine boundaries

### Boundary checks
- canonical content remains read-only
- profile progress remains mutable and separate
- no cross-profile leakage occurs
- no backend assumptions were introduced

### Risk checks
- result recording does not damage content integrity
- the engine did not silently grow into dashboards, analytics, or advanced pacing systems

---

## What This Design Intentionally Defers

This design intentionally defers:
- advanced queue sophistication
- final pacing logic
- recommendation tuning
- dashboard/reporting systems
- gamification
- social comparison
- cloud or sync architecture
- speculative extra learning modes beyond the required directions

If implementation starts solving those broadly, it is exceeding this spec.

---

## File Scope Expectations

Likely file areas in scope for this spec include:
- `src/features/review/`
- `src/features/profiles/` only where profile-context integration is needed
- `src/db/`
- `src/lib/` in narrow support roles
- `src/types/`
- relevant test files

Likely out of scope unless explicitly justified:
- broad import tooling
- advanced settings surfaces
- dashboards or analytics areas
- broad routing redesign
- canonical-content authoring/transformation work
- backend or sync surfaces

---

## Design Summary

This design succeeds if 37NDEST gains a small, real, profile-aware, local-first review engine that:
- consumes trusted canonical content
- supports recognition and production-oriented study
- records profile-specific progress coherently
- preserves canonical/progress separation
- supports future pacing work without needing architectural rescue