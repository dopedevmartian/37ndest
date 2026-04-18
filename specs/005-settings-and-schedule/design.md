# 005 Settings and Schedule Design

## Purpose

This design defines the settings and schedule layer for 37NDEST. It turns profile-specific progress and the mission timeline into practical, low-friction user guidance without turning the app into a reporting dashboard.

The design must support:
- a narrow settings surface
- profile-aware settings behavior
- practical pacing guidance
- local-first schedule state
- compatibility with trusted canonical content and profile-specific progress
- future refinement without architectural rescue

The design must not drift into analytics-heavy or generic productivity-tool behavior.

---

## Design Goals

1. keep settings simple and useful
2. provide practical schedule guidance without fake precision
3. preserve profile-specific boundaries
4. preserve separation between canonical content, progress state, settings state, and pacing state
5. respect the product’s learning priority order
6. remain local-first, reviewable, and narrow in scope

---

## High-Level Design

The settings and schedule layer should sit on top of:
- active profile state
- trusted canonical content metadata
- profile-specific progress state
- the existing local persistence layer

The design should include:

- a **settings surface** for minimal user-facing controls
- a **schedule/pacing interpretation layer** that derives practical guidance from progress plus timeline context
- a **profile-aware settings boundary**
- a **clear separation** between trusted content and mutable user-specific schedule/settings state

This design should not require:
- backend services
- cloud sync
- external analytics systems
- broad recommendation engines

---

## Core Design Decisions

### D1. Settings must remain narrow and product-aligned
The settings surface should expose only controls that materially support real study use.

Implications:
- avoid generic app-settings sprawl
- avoid product-management vanity controls
- avoid exposing speculative controls that the app does not yet need

### D2. User-specific settings should remain tied to the active profile
If a setting affects study experience or pacing at the user level, it should belong to the active profile rather than silently becoming global mutable app state.

Implications:
- profile-specific preferences remain separated
- profile switching should not blur personalized settings
- global app state should remain narrow

### D3. Pacing guidance should be practical, not theatrical
The schedule layer should provide user-facing guidance that is understandable without making the user parse dense metrics.

Implications:
- prefer simple interpretations like on-track / behind / ahead or equivalent practical guidance
- avoid fake precision
- avoid chart-heavy or dashboard-heavy behavior

### D4. Schedule logic should respect content priorities
Pacing guidance should remain compatible with the approved priority order:
1. everyday relationship building
2. navigation and survival
3. ministry

Implications:
- progression should not become purely quantity-driven
- practical relational usefulness should still dominate
- later pacing work should build on these priorities rather than flatten them away

### D5. Settings and pacing state must remain separate from trusted content
Canonical content is trusted source material, not mutable schedule or settings state.

Implications:
- settings state remains mutable and profile-aware
- pacing/schedule interpretation remains derived from mutable state plus trusted content metadata
- canonical content must not be rewritten to express user schedule state

---

## Proposed Settings Surface

The settings surface should remain small and practical.

It should generally support:
- profile-aware study settings as needed
- schedule-aware or pacing-related visibility as needed
- low-friction operational controls relevant to real study use

It should not become:
- a dashboard
- a reporting center
- a generic productivity control panel
- a dumping ground for speculative options

### Suggested surface posture
The settings area should feel like:
- a practical control surface
- easy to scan
- honest about what exists
- free of analytics clutter

---

## Schedule Guidance Design

### Inputs to schedule guidance
The pacing layer may interpret:
- mission timeline context
- active profile progress state
- trusted content structure or prioritization metadata
- settings or preferences that affect the study plan, if approved

### Outputs from schedule guidance
The user-facing output should remain practical, such as:
- an understandable status signal
- a sensible study-load recommendation
- a clear directional cue for what the user should do next

It should not require the user to interpret advanced analytics.

### Practical bias
The pacing output should answer practical questions like:
- am I roughly on track?
- should I increase study load?
- should I focus on core content first?
- how aggressively should I continue?

It should not pretend to be mathematically perfect.

---

## State Boundary Design

Keep these concerns separate:

- **canonical content**
  - trusted source material
  - stable IDs and structured deck data
  - priority-related metadata

- **profile progress**
  - mutable review history and progress state
  - tied to one profile only

- **profile settings**
  - mutable user-specific preferences
  - tied to one profile only where relevant

- **schedule or pacing state**
  - mutable or derived profile-aware interpretation layer
  - may use timeline information and progress state
  - must remain distinct from canonical content

Do not collapse these into one generic state blob.

---

## Timeline Design Direction

The schedule layer should support a real mission-driven time horizon.

That means the design should make room for:
- a meaningful target timeline
- progress interpretation relative to that timeline
- practical adjustment guidance

It does not require:
- enterprise scheduling complexity
- calendar integration
- notification infrastructure
- broad habit-tracking systems

Keep timeline handling narrow and product-relevant.

---

## Failure and Honesty Rules

If schedule or settings information is incomplete, invalid, or insufficient:
- do not pretend the guidance is authoritative
- keep the UI honest
- provide practical fallback behavior if possible
- preserve local state integrity
- avoid corrupting profile or trusted-content boundaries

Do not produce fake-precision guidance from weak data.

---

## Local-First and Offline-Capable Compatibility

The settings and schedule design must remain compatible with:
- local-only execution
- static deployment
- offline-capable use
- no backend dependency

This means:
- profile-specific settings should remain locally usable
- pacing guidance should not depend on cloud services
- schedule behavior should remain coherent even without network access

---

## Validation Strategy for This Spec

The settings and schedule layer should be validated with checks such as:

### Settings checks
- settings surface is usable and narrow
- user-specific settings stay tied to the correct profile
- settings state remains separated from canonical content

### Schedule checks
- pacing guidance is understandable
- practical status/recommendation behavior works
- guidance remains compatible with the product’s learning priorities
- incomplete state does not produce misleading certainty

### Boundary checks
- canonical content remains read-only trusted content
- profile-specific mutable state remains isolated
- no backend assumptions were introduced
- no dashboard-heavy drift was introduced

---

## What This Design Intentionally Defers

This design intentionally defers:
- advanced analytics dashboards
- broad study-history reporting
- social accountability features
- cloud notifications
- generic habit/productivity systems
- complex recommendation engines
- AI tutor-style schedule coaching
- backend or sync architecture

If implementation starts solving those broadly, it is exceeding this spec.

---

## File Scope Expectations

Likely file areas in scope for this spec include:
- `src/features/settings/`
- `src/features/schedule/`
- `src/features/profiles/` where profile-aware settings integration is needed
- `src/db/`
- `src/lib/` in narrow support roles
- `src/types/`
- relevant test files

Likely out of scope unless explicitly justified:
- broad review-engine redesign
- canonical content transformation work
- dashboard/reporting systems
- social or multiplayer surfaces
- backend or sync surfaces

---

## Design Summary

This design succeeds if 37NDEST gains a small, profile-aware, local-first settings and schedule layer that:
- exposes only practical controls
- provides understandable pacing guidance
- respects the product’s relationship/survival/ministry priority order
- keeps state boundaries clean
- stays far away from dashboard-heavy or generic productivity-product drift