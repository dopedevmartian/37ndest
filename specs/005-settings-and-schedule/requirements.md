# 005 Settings and Schedule Requirements

## Purpose

This spec defines the settings and schedule behavior for 37NDEST. It establishes the minimum product-facing controls and pacing support needed to keep two users on track toward the mission timeline without turning the app into a dashboard-heavy system.

This spec is about practical controls and pacing guidance. It is not about advanced analytics, broad productivity systems, or speculative recommendation engines.

---

## Product Context

37NDEST is a tightly scoped Japanese conversation trainer for me and my wife only.

Primary learning priority:
1. everyday relationship building
2. navigation and survival
3. ministry

The app is:
- local-first
- offline-capable
- profile-aware
- driven by canonical deck JSON
- focused on practical conversational usefulness within a real timeline

Settings and schedule behavior must reinforce that shape.

---

## Scope of This Spec

Included:
- a minimal settings surface
- profile-aware settings behavior where relevant
- schedule-aware pacing support
- user-visible study pacing guidance
- settings/state behavior that supports practical repeated use
- schedule behavior compatible with trusted canonical content and profile-specific progress

Not included:
- advanced analytics dashboards
- broad reporting systems
- cloud sync
- social coordination features
- speculative AI tutoring
- broad notification systems
- generic productivity tooling
- gamification systems

---

## Requirements

### R1. The app must provide a minimal usable settings surface
The app must provide a simple settings surface that supports the product’s practical study purpose.

The settings surface should remain:
- narrow
- understandable
- low-friction
- aligned with the real product scope

### R2. The app must support profile-aware settings where relevant
Where a setting is user-specific, it must remain tied to the active profile rather than being silently treated as a global product state.

This spec does not require many settings, but it does require correct boundary behavior.

### R3. The app must support schedule-aware pacing guidance
The app must be able to reflect the reality that the users are studying toward a mission timeline.

At minimum, the product must support pacing guidance that can help answer questions like:
- how far along is this profile relative to the timeline?
- how much study load is appropriate now?
- whether the user is roughly on track, behind, or ahead in practical terms

This does not require an overbuilt analytics system.

### R4. The app must present pacing guidance in a practical way
Pacing guidance must be understandable and useful, not overly abstract or analytics-heavy.

The app should support practical user-facing guidance that helps the user know how to continue studying without requiring them to interpret dense metrics.

### R5. The app must preserve the product’s learning priorities in schedule behavior
Schedule/pacing behavior must respect the product priority order:

1. everyday relationship building
2. navigation and survival
3. ministry

The schedule layer must not accidentally flatten those priorities into a generic or purely quantity-driven progression model.

### R6. The app must preserve separation between trusted content and mutable profile schedule/progress state
Schedule and settings behavior must not blur:
- canonical content
- mutable profile progress
- mutable pacing/schedule state
- user preferences

These concerns must remain distinct enough for review and future iteration.

### R7. The app must remain local-first and offline-capable
Settings and schedule behavior must work without requiring:
- backend calls
- cloud sync
- external online services

Core usefulness must remain compatible with local-only/offline-capable use.

### R8. The app must handle missing or incomplete schedule state honestly
If schedule or settings information is incomplete, unavailable, or not yet sufficient:
- the app must remain honest
- the user must not be shown fake precision
- the UI should remain understandable enough for practical use and debugging

### R9. The settings and schedule layer must be reviewable and testable
The implementation must support:
- settings-behavior validation
- profile-aware settings checks
- pacing-behavior checks
- on-track/behind/ahead logic checks if used
- regression checks for nearby review/profile behavior

### R10. The spec must preserve narrow scope
This spec must not silently implement:
- analytics dashboards
- generic productivity systems
- social accountability systems
- cloud notifications
- broad reporting systems
- speculative recommendation engines far beyond the practical product need

---

## Acceptance Criteria

### AC1. A minimal settings surface exists
- The app provides a real settings surface
- The surface remains narrow and product-aligned

### AC2. Relevant settings are profile-aware
- User-specific settings do not leak across profiles
- The boundary between profile settings and broader app state remains clear

### AC3. Practical pacing guidance exists
- The app provides a usable study-pacing signal tied to the mission timeline
- The signal is understandable without requiring an analytics mindset

### AC4. Schedule behavior respects product priorities
- Pacing behavior remains compatible with the intended relationship/survival/ministry priority order

### AC5. Settings and schedule state remain separated from canonical content
- Canonical content is not treated as mutable settings or schedule data
- Mutable pacing/settings data remains local and profile-aware

### AC6. Local-first boundaries are preserved
- Settings and pacing behavior do not require backend services
- Core settings/schedule usefulness works locally

### AC7. Scope is preserved
- The implementation does not silently become a reporting dashboard or generic productivity layer

---

## Explicit Non-Requirements

This spec does not require:
- advanced analytics dashboards
- broad study-history reporting
- cloud notifications
- social accountability features
- generic to-do or habit systems
- full recommendation engines
- AI tutor-style schedule coaching
- backend or sync systems

---

## Risks to Watch

- turning schedule guidance into a fake-precision analytics system
- flattening content priorities into generic counts
- blending profile settings with global app state carelessly
- overbuilding settings before real need exists
- introducing dashboard complexity that weakens the product’s practical focus

---

## Requirement Summary

This spec succeeds if 37NDEST gains a simple, profile-aware settings and schedule layer that provides practical pacing guidance toward the mission timeline, preserves the product’s priority order, and stays narrow, local-first, and free of dashboard-heavy drift.