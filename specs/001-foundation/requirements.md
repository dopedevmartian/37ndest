# 001 Foundation Requirements

## Purpose

This spec defines the foundational application layer for 37NDEST. It establishes the minimum structure needed to support future deck import, review flow, pacing, and profile-specific progress without overbuilding beyond the approved project scope.

This spec is not for the full product. It is for the base application skeleton and durable local-first foundations.

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
- two-user only
- driven by canonical deck JSON
- intentionally narrow in product scope

The foundation layer must support that direction without introducing backend, sync, or generic platform expansion.

---

## Scope of This Spec

This spec covers the initial foundation only.

Included:
- app shell
- local project structure integration
- basic routing/application entry
- profile-aware local data foundation
- initial persistence layer setup
- canonical content loading foundation
- baseline installable/offline-capable app setup
- minimal settings and app-state scaffolding needed to support later specs

Not included:
- full deck import workflows
- full review engine behavior
- full pacing behavior
- content transformation pipeline work
- advanced settings
- dashboards
- expanded learning modes
- cloud or backend systems

---

## Requirements

### R1. The app must have a working local-first application shell
The project must provide a working frontend application shell suitable for future feature layering.

The shell must:
- run locally in development
- support static build output
- fit the approved React + Vite + TypeScript direction
- provide a clean root for future features

### R2. The app must support an offline-capable baseline
The foundation must support installable, offline-capable behavior consistent with the approved static PWA direction.

This does not require full final polish, but it must establish:
- manifest support
- service worker compatible architecture
- static build compatibility
- a path toward installed/offline use without redesign

### R3. The app must establish a persistent local data layer
The foundation must establish the baseline persistence model for:
- profile records
- future user progress state
- future settings state
- future review/schedule state

The persistence layer must:
- be local-first
- avoid backend dependency
- be compatible with separate profile state
- keep canonical content separate from user state

### R4. The app must support two local profiles as a first-class concept
The foundation must recognize that the product is for two specific users and must support profile-specific local state.

At minimum, the foundation must make room for:
- creating/selecting a local profile
- separating stored progress by profile
- loading the app within the context of a selected profile
- preventing cross-profile leakage by design

This spec does not require the full polished profile UX yet, but the data and state model must be prepared correctly.

### R5. The app must establish canonical content loading foundations
The foundation must support the approved content direction where canonical deck JSON is the source of truth.

At minimum, the foundation must make room for:
- reading trusted canonical content from repository data locations
- validating or preparing content ingestion boundaries
- keeping canonical content distinct from mutable user progress
- enabling future deck-import logic without architectural redesign

This spec does not require final import transformation workflows yet.

### R6. The app must provide a minimal navigable app structure
The foundation must include minimal navigable application structure so future feature work has a stable home.

At minimum, the app must support a basic structure for:
- app entry
- profile-aware home/start surface
- placeholder review-related surface
- placeholder settings-related surface

This structure should be minimal and should not become a fake-complete product.

### R7. The foundation must preserve narrow product scope
The foundation must not introduce assumptions that push the app toward:
- public onboarding
- multi-user growth
- cloud sync
- backend auth
- analytics-heavy dashboards
- generic language-learning platform behavior

The foundation must remain aligned with the mission-focused two-user product shape.

### R8. The foundation must support future specs without forcing redesign
The foundation must be strong enough to support:
- deck import
- review flow
- pacing and scheduling
- settings
- profile-specific progress

But it must do so without speculative overbuilding.

### R9. The foundation must be reviewable and testable
The work produced under this spec must be structured in a way that supports:
- narrow follow-on implementation
- bounded validation
- profile isolation checks
- persistence checks
- basic offline-capable checks
- future feature growth within the approved architecture

### R10. Unchanged-scope constraints must be preserved
The work under this spec must not:
- implement full review logic
- implement full deck import workflows
- implement advanced pacing logic
- redesign the product around dashboard-heavy interaction
- introduce backend or sync architecture
- hardcode lesson content into application code
- blur canonical content with user progress

---

## Acceptance Criteria

### AC1. Project foundation runs locally
- The app starts successfully in local development
- The base shell renders without depending on unfinished feature work

### AC2. Static build compatibility exists
- The project can build as a static frontend application
- The setup does not assume a backend runtime

### AC3. Offline-capable groundwork exists
- Manifest/service-worker-aligned groundwork is present
- The architecture is compatible with installable/offline-capable use

### AC4. Local persistence groundwork exists
- A local persistence layer is present
- Profile-aware state separation is part of the design
- Canonical content is not stored as mutable progress state

### AC5. Canonical content boundary exists
- The app has a defined way to load or prepare canonical content
- Canonical content remains distinct from user state

### AC6. Minimal navigable app structure exists
- There is a stable app entry point
- There is a profile-aware base flow or placeholder
- There are stable surfaces for future review and settings work

### AC7. Scope is preserved
- The implementation does not silently include major parts of future specs
- The implementation remains narrow and foundation-focused

---

## Explicit Non-Requirements

This spec does not require:
- full review queue logic
- full spaced repetition scheduling
- final content import conversion
- final settings behavior
- final polished profile UX
- analytics
- dashboards
- cloud sync
- auth
- multiplayer
- social features
- generic curriculum expansion

---

## Risks to Watch

- accidentally overbuilding before later specs exist
- blending profile state with canonical content
- building a fake-complete UI instead of a stable foundation
- introducing backend assumptions into the base architecture
- making routing or state structure too abstract too early
- creating installability/offline complexity that exceeds the product’s real needs

---

## Requirement Summary

The foundation spec succeeds if it creates a clean, local-first, profile-aware, canonical-content-aware app skeleton that future specs can build on without needing architectural rescue.