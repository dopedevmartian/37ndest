# 003 Review Engine Requirements

## Purpose

This spec defines the core review-engine behavior for 37NDEST. It establishes how trusted canonical content and profile-specific progress come together to produce practical study sessions for the two intended users.

This spec is about core study behavior. It is not about broad dashboard features, advanced gamification, or speculative learning modes.

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
- focused on practical conversational usefulness

The review engine must reinforce that shape.

---

## Scope of This Spec

Included:
- core review/session logic
- recognition-oriented study flow support
- production-oriented study flow support
- profile-specific progress updates
- session progression behavior
- integration with trusted canonical content
- integration with future pacing-aware work without overbuilding it

Not included:
- advanced schedule tuning
- final pacing recommendation system
- dashboards
- analytics-heavy reporting
- cloud sync
- broad learning-mode expansion
- gamification systems
- pronunciation evaluation

---

## Requirements

### R1. The app must be able to generate a practical study session from trusted content
The review engine must be able to use trusted canonical deck content together with profile-specific progress state to produce a usable study session.

A study session must be shaped for practical study use, not just content display.

### R2. The review engine must support recognition-oriented study flow
The app must support a recognition-oriented study path where the user can review content by recognizing the intended answer or meaning from trusted prompts.

This requirement does not prescribe the exact UI, but the engine must support this study direction clearly.

### R3. The review engine must support production-oriented study flow
The app must support a production-oriented study path where the user is expected to recall or produce the target content rather than simply recognize it.

This requirement is important because the product is focused on conversational usefulness, not recognition alone.

### R4. The review engine must update profile-specific progress
The engine must write progress updates into profile-specific mutable state without mutating canonical content.

Progress updates must remain:
- profile-specific
- local-first
- separated from trusted content
- suitable for later pacing and schedule work

### R5. The review engine must preserve canonical-versus-progress boundaries
The review engine must treat canonical content as trusted read-only content and profile progress as mutable local state.

It must not:
- write trusted content as if it were user progress
- blur canonical deck structure with review history
- introduce cross-profile progress leakage

### R6. The review engine must support session progression
Within a session, the app must support meaningful progression such as:
- presenting the next appropriate study item
- recording the user’s interaction outcome
- advancing through the session without losing state coherence

This spec does not require final queue sophistication, but it does require real review progression behavior.

### R7. The review engine must remain compatible with pacing and scheduling work
The engine must update progress in a way that later specs can use for pacing and scheduling without requiring review-engine redesign.

This spec does not require final pacing logic, but it must avoid blocking it.

### R8. The review engine must stay aligned with the product’s practical focus
The review engine must reinforce:
- relationship-building usefulness first
- practical survival usefulness second
- ministry usefulness third

It must not drift toward a generic or vanity-focused study experience.

### R9. The review engine must remain local-first and offline-capable
Core review/session behavior must not depend on:
- backend calls
- cloud sync
- online services
- external runtime dependencies for core use

### R10. The review engine must be reviewable and testable
The implementation must support:
- session behavior validation
- profile-isolation validation
- progress-update validation
- recognition/production flow validation
- regression review for adjacent study behavior

### R11. The review engine must preserve narrow scope
This spec must not silently implement:
- advanced dashboarding
- full analytics/reporting
- advanced schedule recommendation UX
- unrelated import tooling
- cloud or backend behavior
- speculative extra study modes

---

## Acceptance Criteria

### AC1. Trusted content can drive a session
- The app can use trusted deck content to produce a study session
- The session uses profile-specific state appropriately

### AC2. Recognition-oriented flow works
- The engine supports recognition-oriented review behavior
- The session can progress through that mode coherently

### AC3. Production-oriented flow works
- The engine supports production-oriented recall behavior
- The session can progress through that mode coherently

### AC4. Progress updates are profile-specific
- Progress updates are written to the active profile only
- Canonical content remains unchanged
- No cross-profile leakage occurs

### AC5. Session progression is coherent
- The user can move through study items without state confusion
- Interaction outcomes update session state appropriately

### AC6. Local-first boundaries are preserved
- Core review behavior works without backend dependency
- The review engine remains compatible with offline-capable use

### AC7. Scope is preserved
- The implementation does not silently include advanced analytics, dashboard systems, or speculative learning-mode expansion

---

## Explicit Non-Requirements

This spec does not require:
- advanced spacing/pacing recommendation logic
- final queue sophistication
- detailed analytics dashboards
- social comparison features
- cloud sync
- pronunciation scoring
- gamification layers
- broad curriculum expansion

---

## Risks to Watch

- overbuilding the review engine before pacing logic is defined
- blending canonical content with mutable progress state
- creating a session model too generic for the actual product
- biasing too heavily toward recognition and neglecting production
- introducing profile leakage
- introducing backend assumptions into core study behavior

---

## Requirement Summary

This spec succeeds if 37NDEST gains a real, profile-aware, local-first review engine that can run recognition and production-oriented study sessions from trusted canonical content while preserving canonical/progress separation and staying within the product’s narrow practical scope.