# 002 Deck Import Requirements

## Purpose

This spec defines how 37NDEST should ingest trusted canonical deck content into the application in a way that is structured, reviewable, and separate from profile-specific progress.

This spec is about application-side content ingestion and validation boundaries. It is not about broad raw-format conversion pipelines.

---

## Product Context

37NDEST uses canonical deck JSON as the trusted source of application content.

The product is:
- mission-focused
- two-user only
- local-first
- offline-capable
- centered on practical conversational usefulness

Primary learning priority:
1. everyday relationship building
2. navigation and survival
3. ministry

Deck import behavior must preserve that model and must not quietly reintroduce APKG or TSV as internal truth.

---

## Scope of This Spec

Included:
- loading trusted canonical deck JSON into the app
- validating content against the expected structure
- defining app-side content ingestion behavior
- making imported trusted content available to future study flows
- preserving clean separation between canonical content and mutable profile state
- handling invalid or malformed canonical content safely

Not included:
- full APKG parsing
- TSV conversion workflows
- broad external import UI
- canonical content authoring tools
- full review engine behavior
- final pacing logic
- raw import transformation pipelines in scripts

---

## Requirements

### R1. The app must be able to load canonical deck content
The app must be able to read trusted canonical deck JSON from the repository-owned content location or equivalent approved content boundary.

The load path must:
- respect canonical content as trusted source content
- avoid treating raw imports as runtime truth
- support future study features without redesign

### R2. The app must validate canonical content before trusting it
The app must validate loaded canonical content against the expected structure before treating it as usable study content.

Validation must:
- be deterministic
- reject malformed or structurally invalid content clearly
- avoid silent fallback to ambiguous behavior
- make failures reviewable

### R3. The app must preserve separation between canonical content and profile state
Canonical content must remain distinct from:
- selected profile state
- progress history
- review state
- schedule/pacing state
- settings state

The app must not store canonical content as if it were mutable user progress.

### R4. The app must support content availability for future study flows
Imported canonical content must be made available in a way that future review/session flows can use without re-architecting content access.

This means the app must establish a clean app-side content access pattern.

### R5. The app must handle invalid canonical content safely
If canonical content fails validation or cannot be loaded correctly:
- the failure must be explicit
- the app must not behave as if content is valid when it is not
- the failure state must be understandable enough for debugging or correction
- user progress state must not be corrupted by content failure

### R6. The app must preserve product-aligned content assumptions
The import layer must not flatten away or ignore content structure that supports:
- content prioritization
- recognition-oriented study
- production-oriented study
- future pacing-aware behavior

This does not mean the spec must implement all study behavior now, but the ingestion boundary must not discard needed structure casually.

### R7. The app must avoid overbuilding import scope
This spec must not introduce:
- full raw-format conversion support
- user-facing multi-format import flows
- content editing systems
- broad deck management tooling
- architecture that treats external packaging formats as internal truth

### R8. The app must remain local-first and offline-capable
Canonical content loading must remain compatible with:
- local-first execution
- static deployment
- offline-capable application behavior
- no backend dependency

### R9. The import layer must be reviewable and testable
The implementation must support:
- schema/structure validation checks
- success and failure path validation
- canonical-versus-profile separation checks
- future regression checks when content structure changes

### R10. The spec must preserve narrow responsibility boundaries
This spec must not silently implement:
- the full review engine
- pacing/schedule logic
- profile UX beyond what deck access requires
- advanced settings or dashboards
- external content pipeline tooling beyond what the app directly needs

---

## Acceptance Criteria

### AC1. Trusted canonical content can be loaded
- The app can read approved canonical deck content
- The content becomes available to the app through a stable access boundary

### AC2. Validation exists and is deterministic
- Canonical content is checked before use
- Invalid structure is rejected clearly
- Failure does not degrade into silent undefined behavior

### AC3. Canonical content remains separate from user state
- Canonical content is not treated as mutable progress state
- Profile data remains distinct from trusted content

### AC4. Failure handling is explicit
- Content-load or validation failure is visible and reviewable
- The app does not pretend invalid content is safe

### AC5. Future study flow support is preserved
- The resulting content-access pattern is usable by later review/session work
- No redesign is required just to consume trusted content cleanly

### AC6. Scope is preserved
- No broad raw-format import system was silently introduced
- No review-engine logic was silently introduced
- No backend assumptions were introduced

---

## Explicit Non-Requirements

This spec does not require:
- APKG parsing
- TSV conversion
- user-facing deck upload flows
- content authoring interfaces
- final queue logic
- final schedule logic
- final review rendering
- multi-deck management UX
- cloud content storage

---

## Risks to Watch

- accidentally treating raw formats as trusted runtime truth
- blending canonical content with mutable progress data
- accepting malformed content through weak validation
- overbuilding import architecture before real need exists
- creating content-access patterns that later specs must undo

---

## Requirement Summary

This spec succeeds if 37NDEST can load, validate, and expose trusted canonical deck content through a clean local-first boundary while preserving separation from profile-specific user state and avoiding broad import-system overreach.