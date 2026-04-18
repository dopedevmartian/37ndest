# 002 Deck Import Design

## Purpose

This design defines how 37NDEST should load and validate trusted canonical deck content inside the app without turning raw import formats or mutable user state into internal truth.

This design is intentionally narrow. It establishes the application-side content ingestion boundary and leaves broader external conversion workflows to separate concerns.

---

## Design Goals

1. load trusted canonical deck JSON cleanly
2. validate content deterministically before use
3. preserve separation between canonical content and profile-specific state
4. expose trusted content through a stable app-side access boundary
5. support future review, pacing, and profile-aware study flows without redesign
6. avoid overbuilding raw-format import infrastructure

---

## High-Level Design

The deck-import layer should sit between repository-owned canonical content and the rest of the application.

The design should include:

- a **content source layer** that reads canonical deck JSON
- a **validation layer** that checks trusted content structure before app use
- a **normalization or preparation layer** if needed for app consumption
- a **content access layer** that exposes trusted deck content to later features
- a strict **boundary** between canonical content and mutable profile-specific state

No part of this design should require:
- backend fetches
- cloud content storage
- APKG-native runtime parsing
- TSV-native runtime parsing

---

## Core Design Decisions

### D1. Canonical JSON is loaded as trusted source content
The app should load canonical deck JSON from repository-owned content locations or an equivalent approved local content boundary.

Implications:
- canonical JSON is the trusted app-content input
- raw imports are not runtime truth
- later import adapters must target canonical-compatible structures rather than replacing the core model

### D2. Validation happens before content becomes usable app content
Loaded canonical content must be validated before it is exposed as trusted deck data to the rest of the app.

Implications:
- malformed content should fail explicitly
- app behavior should not quietly continue with invalid structures
- validation should be deterministic and reviewable

### D3. Canonical content remains read-only within app runtime
The app may read and prepare canonical content, but should not treat it as mutable user progress state.

Implications:
- profile review history, pacing state, and settings remain separate
- canonical deck data must not be silently written back as progress
- trusted content and user state must remain different concerns in code and persistence

### D4. The app should expose content through a stable access boundary
Later features should not need to know where or how canonical content was read or validated.

Implications:
- future review logic should consume trusted deck content through a stable access path
- content loading details should remain narrow and reviewable
- later feature work should build on the boundary, not bypass it

### D5. The import boundary should preserve meaningful structure
The deck-import layer should preserve content structure needed by later work, including:
- study direction distinctions
- prioritization metadata
- pacing-relevant fields
- app-friendly rendering fields
- canonical identifiers

Implications:
- do not flatten or discard useful structure casually
- do not force later specs to rebuild content meaning from weak import output

---

## Proposed Application-Side Flow

The app-side deck import flow should look like this:

1. locate approved canonical deck source
2. load raw canonical JSON payload
3. validate payload shape and required fields
4. prepare or normalize into trusted app deck structures if necessary
5. expose trusted deck content through a content-access boundary
6. keep all mutable profile state separate from this trusted content layer

This flow should remain local-first and deterministic.

---

## Canonical Content Boundary

### Trusted Content
Trusted content is:
- repository-owned canonical JSON
- validated structure
- app-readable study content
- read-only at runtime for normal study use

### Untrusted or Non-Canonical Inputs
These are not trusted runtime truth:
- APKG internals
- TSV files
- raw imports
- malformed payloads
- generated or derived outputs not explicitly promoted into canonical truth

### Boundary Rule
Nothing should cross into trusted app content unless it has passed the canonical boundary intentionally and reviewably.

---

## Validation Design

### Validation Responsibilities
Validation should confirm, as relevant:
- required top-level structure exists
- entries are shaped correctly
- required fields are present
- field types are correct
- identifiers are usable
- structurally invalid content is rejected clearly

### Validation Behavior
Validation should:
- fail clearly
- avoid silent fallback
- keep errors reviewable
- avoid pretending malformed content is acceptable

### Validation Scope
This spec only needs app-side validation strong enough to trust canonical content at runtime.
It does not need to solve every external content-pipeline concern.

---

## Content Access Design

The app should provide a stable content-access mechanism for trusted deck content.

This mechanism should support:
- reading available trusted content
- exposing deck entries in app-friendly structures
- enabling later review and pacing features
- preserving a clean boundary from profile-specific mutable state

### Design Direction
This can be implemented with a narrow content module, loader, or provider pattern as long as:
- the boundary stays explicit
- the runtime stays simple
- future features do not need to re-parse repository assets ad hoc

Do not overabstract the content-access layer.

---

## Relationship to Profile State

Canonical content and profile state must remain separate.

### Canonical content includes
- trusted deck entries
- content metadata
- stable deck identifiers
- structural data needed for study behavior

### Profile state includes
- selected profile
- progress history
- review state
- pacing or schedule state
- settings

These concerns should not be collapsed into the same storage model.

---

## Failure Handling Design

If canonical content cannot be trusted:
- the app should surface a clear failure state
- the app should not pretend valid study content exists
- profile data should not be corrupted by content failure
- the failure should be diagnosable enough for correction

This failure handling should remain honest and narrow.
Do not invent broad error-recovery systems prematurely.

---

## Static and Offline-Capable Compatibility

The deck-import design must remain compatible with:
- static deployment
- local-first execution
- offline-capable app behavior
- no backend dependency

This means:
- content loading should not depend on server APIs
- trusted content should remain available to the app in static/offline-capable deployment models
- import architecture should not assume future cloud services

---

## Validation Strategy for This Spec

The deck-import layer should be validated with checks such as:

### Success-path checks
- canonical content loads
- validation passes for valid content
- trusted content becomes available through the intended access boundary

### Failure-path checks
- malformed content fails clearly
- invalid content is not treated as trusted
- failure state remains reviewable
- profile state is not corrupted

### Boundary checks
- canonical content remains separate from mutable user state
- raw imports are not treated as trusted runtime truth
- no backend assumptions were introduced

---

## What This Design Intentionally Defers

This design intentionally defers:
- APKG parsing workflows
- TSV transformation workflows
- user-facing upload/import UI
- canonical content authoring tools
- final review queue logic
- final pacing logic
- advanced deck management UX
- broad content pipeline tooling outside the app boundary

If implementation begins solving those problems broadly, it is exceeding this spec.

---

## File Scope Expectations

Likely file areas in scope for this spec include:
- `src/features/deck-import/`
- `src/lib/` in narrow support roles
- `src/types/`
- `src/db/` only if needed for clear separation boundaries
- `data/decks/canonical/` only if an approved canonical example or integration boundary needs to be referenced
- `data/schema/`
- `scripts/validation/` only if directly needed for the runtime/trusted-content validation contract
- relevant test files

Likely out of scope unless explicitly justified:
- broad review-engine files
- advanced settings surfaces
- broad profile UX work
- APKG/TSV conversion tooling
- large routing changes
- dashboards or analytics surfaces

---

## Design Summary

This design succeeds if 37NDEST gains a clean, deterministic, local-first trusted-content boundary that:
- loads canonical JSON
- validates it before use
- preserves separation from profile state
- exposes app-friendly trusted content for future features
- avoids broad external-import-system overreach