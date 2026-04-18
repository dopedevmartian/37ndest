# 001 Foundation Design

## Purpose

This design defines the foundation architecture for 37NDEST. It turns the foundation requirements into a narrow implementation shape that supports future work without overbuilding the product.

The design must support:
- local-first execution
- offline-capable app structure
- two-profile local state separation
- canonical content as source-of-truth content
- future review and pacing work
- static deployment compatibility

The design must not silently implement large parts of later specs.

---

## Design Goals

1. establish a stable app shell
2. establish a clean local persistence model
3. establish profile-aware application state
4. establish canonical-content loading boundaries
5. establish a simple navigable structure for future feature work
6. preserve narrow scope and avoid fake completeness

---

## High-Level Architecture

The foundation should use a simple client-only structure:

- **UI layer** for app shell and navigable surfaces
- **application state layer** for selected profile and app-level state
- **local persistence layer** for profile records and future progress/settings state
- **content boundary layer** for reading canonical content without treating it as mutable user data
- **PWA layer** for installability and offline-capable setup

No backend layer is part of this design.

---

## Core Design Decisions

### D1. Client-only runtime
The app runs entirely in the browser for core v1 foundation behavior.

Implications:
- no backend runtime
- no auth dependency
- no sync dependency
- no server database
- local state and canonical content separation must be explicit

### D2. Canonical content is read-only application content
Canonical deck JSON is trusted content loaded into the app as repository-owned data.

Implications:
- canonical content is not user progress
- canonical content must remain separate from IndexedDB profile state
- later deck-import flows must convert external sources into canonical-compatible structures rather than replacing the internal truth model

### D3. Profiles are part of the application model from the start
Even if the first profile UX is minimal, the app should be architected around profile-aware local state now.

Implications:
- selected profile state is foundational
- persistence must be partitionable by profile
- future review/schedule data should hang off profile identity, not global mutable state

### D4. Routing and UI surfaces stay minimal
The app should include only enough navigable structure to support future work clearly.

Implications:
- no fake-complete dashboard
- no inflated navigation tree
- simple route structure is preferred
- placeholder surfaces are acceptable if they are honest and stable

### D5. PWA setup should be real but minimal
The foundation should establish real installable/offline-capable groundwork without overinvesting in polish prematurely.

Implications:
- manifest and service worker compatibility should exist
- static build output should remain straightforward
- offline-capable design should not depend on later rescue work

---

## Proposed Application Structure

### App Shell
The app shell should provide:
- root app entry
- stable layout container
- route or surface selection mechanism
- profile-aware startup behavior
- future-friendly place for review and settings surfaces

### Recommended initial surfaces
Use a small structure such as:
- home / start surface
- profile selection or profile context surface
- review placeholder surface
- settings placeholder surface

These surfaces should exist to anchor the architecture, not to simulate a complete product.

---

## Persistence Design

### Persistence tool
Use IndexedDB through Dexie as the persistence layer.

### Initial persistence responsibilities
The foundation should create baseline stores or their equivalent for:
- profiles
- settings or app preferences
- future progress / review state scaffolding
- future schedule-related state scaffolding

Do not overfill these structures before later specs define them more fully.

### Persistence separation rule
Keep these concerns separate:
- canonical content
- profile identity
- profile-specific progress
- future schedule/review state
- app settings

Do not collapse them into one generic catch-all structure.

---

## Profile Model Direction

At foundation level, the profile model only needs enough structure to support:
- unique profile identity
- displayable name or label
- future profile-scoped progress and settings
- selection of the active profile

Do not overdesign profile attributes yet.

### Suggested minimum profile shape
The foundation may use a minimal model such as:
- `id`
- `name`
- `createdAt`
- `updatedAt`

Additional fields should be deferred unless clearly needed.

---

## Canonical Content Boundary Design

The app should be able to load canonical content from repository-owned data without mixing it into mutable profile data.

### Boundary rules
- canonical content is loaded as trusted app content
- canonical content is not written back as mutable progress
- runtime code should treat canonical content as read-only
- later import workflows should target canonical-compatible structures

### Foundation scope
This spec only needs the loading boundary and structure awareness.
It does not need the full import/transformation workflow yet.

---

## State Management Direction

Use lightweight local-first application state.

The foundation only needs enough app state to support:
- selected profile
- basic startup/app shell behavior
- minimal navigation or surface state
- future hydration from persistence

Avoid introducing heavy global state patterns unless later specs justify them.

---

## PWA and Deployment Design

### PWA baseline
Establish:
- manifest support
- service-worker-compatible setup
- static asset strategy consistent with installable use
- build output suitable for static deployment

### Deployment posture
The foundation must remain deployable as a static application.
Do not introduce assumptions that require:
- backend routing
- API infrastructure
- server sessions
- deployment secrets for core runtime

---

## Validation Strategy for This Spec

The foundation should be validated with proportionate checks:

### Core checks
- app starts locally
- static build succeeds
- app shell renders
- profile-aware groundwork exists
- persistence layer exists
- canonical content boundary exists
- installable/offline-capable groundwork exists

### Risk checks
- canonical content is not treated as user progress
- profile model is not globally conflated
- foundation did not silently implement major future-spec behavior
- no backend assumptions were introduced

---

## What This Design Intentionally Defers

This design intentionally defers:
- full import workflows
- full spaced repetition logic
- full queue building
- final pacing calculations
- final settings surface
- advanced profile UX
- analytics or dashboards
- cloud or sync architecture

If implementation starts filling in those areas broadly, it is exceeding this spec.

---

## File Scope Expectations

Likely file areas in scope for this spec include:
- `src/app/`
- `src/features/profiles/`
- `src/features/settings/` in minimal form
- `src/db/`
- `src/lib/` in narrow support roles
- `src/types/`
- `public/` for manifest/install assets
- minimal build/PWA configuration files
- minimal canonical content loading helpers if needed

Likely out of scope unless explicitly justified:
- broad content transformation scripts
- full review-engine implementation
- major dashboard surfaces
- advanced import tooling
- advanced analytics or gamification surfaces

---

## Design Summary

The foundation design succeeds if it creates a small, honest, local-first app skeleton with:
- real browser-runtime foundations
- profile-aware persistence direction
- canonical-content separation
- static/PWA compatibility
- enough navigable structure to support later specs cleanly

It fails if it tries to become the whole product too early.