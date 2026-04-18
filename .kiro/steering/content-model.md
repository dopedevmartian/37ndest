# 37NDEST Content Model Steering

## Purpose

This file defines the content model posture for 37NDEST. Its goal is to keep content structured, reviewable, app-friendly, and aligned with the actual learning objective rather than allowing deck content to drift into an ungoverned pile of phrases.

---

## Core Content Principle

Canonical deck JSON is the trusted source of application content.

This means:
- content should be stored in structured canonical JSON
- canonical content should be version-controlled
- canonical content should be separate from user progress
- canonical content should be easier to validate and reason about than presentation-heavy source formats

APKG, TSV, or other inputs may exist, but they are not canonical truth.

---

## Product-Aligned Content Priorities

Content should reflect the real learning priority order:

1. everyday relationship building
2. navigation and survival
3. ministry

This priority order should influence:
- what content is included first
- what content is emphasized in study flow
- what content is considered core versus secondary
- what content is unlocked or recommended earlier when pacing logic is introduced

Do not let lower-priority specialty content crowd out higher-priority everyday usefulness.

---

## Canonical Content Rules

### Canonical Format
- Canonical content lives in `data/decks/canonical/`
- Canonical content should use structured JSON
- Canonical content should be stable enough to validate and version
- Canonical content should not depend on UI formatting for meaning

### Canonical Truth
- Canonical content is trusted content
- Derived content is not canonical by default
- Raw imported content is not canonical by default
- Runtime state is not canonical content

### Canonical Discipline
- Do not silently mutate canonical content at runtime
- Do not mix canonical content edits into unrelated implementation work
- Do not promote generated outputs into canonical truth without explicit review
- Keep canonical content reviewable by humans

---

## Separation of Concerns

### Canonical Content vs User State

Keep these concerns separate:
- canonical content = what the app teaches
- user progress = what each profile has done
- derived content = generated subsets or transformed artifacts
- raw imports = staging materials awaiting transformation and validation

Do not blur these boundaries.

### Content vs Presentation

Content structure should remain separate from presentation details.

Do not treat:
- HTML-heavy note bodies
- app-specific styling wrappers
- display-only formatting tricks

as the real internal content model.

The app should be able to render content cleanly from structured data.

---

## Content Design Expectations

### Content Should Be Structured

Canonical entries should be structured enough to support:
- validation
- review flows
- recognition-oriented study
- production-oriented study
- pacing and prioritization
- future app rendering without content redesign

### Content Should Be Practical

Content should favor:
- useful phrases
- practical conversational patterns
- reviewable metadata that serves study flow
- clear scope alignment with the mission-focused use case

Do not overbuild metadata that does not help the product do its actual job.

### Content Should Be Reviewable

Human review should remain possible.

Future agents should be able to inspect the content model without reverse-engineering formatting hacks or hidden assumptions.

---

## Import and Transformation Rules

### Raw Imports

Raw imports belong in `data/decks/imports/`.

They are:
- staging artifacts
- not trusted runtime truth
- not canonical by default
- inputs to deterministic transformation and validation

### Derived Outputs

Derived outputs belong in `data/decks/derived/`.

They may include:
- subsets
- transformed exports
- utility views
- generated study slices

Derived outputs should not silently replace canonical truth.

### Transformation Discipline
- use deterministic scripts for transformation
- preserve reviewability
- preserve source traceability when relevant
- validate before trusting transformed output
- avoid manual one-off transformations that cannot be repeated cleanly

---

## Scope Discipline for Content

### What Content Should Not Become

Content should not drift into:
- broad JLPT curriculum accumulation
- kanji-completeness projects
- exhaustive grammar encyclopedias
- inspirational phrase dumping without conversational utility
- metadata-heavy systems with weak practical value

### Practical Bias

Choose content that improves real conversational usefulness first.

That means:
- everyday relational language beats niche vocabulary
- survival usefulness beats specialty depth
- ministry content matters, but not ahead of daily human interaction
- quantity should not outrun reviewability and usefulness

---

## Schema and Validation Expectations

### Schema Relationship

Canonical content should align with schema and validation artifacts.

The schema should help protect:
- required structure
- valid field shapes
- reviewable assumptions
- predictable import behavior

### Validation Bias

Validate canonical content through deterministic routines.

Prefer clear failure over silent acceptance of malformed or ambiguous content.

---

## Future-Proofing Without Overbuilding

The content model should be strong enough to support:
- profile-specific progress
- pacing-aware study
- recognition and production-oriented review
- future derived exports
- future import adapters

Do not over-engineer the content model for speculative product directions that are out of scope.

---

## Final Bias

When content decisions are unclear:
- choose the more structured form
- choose the more reviewable form
- choose the more practical conversational content
- choose the option that preserves canonical clarity
- choose the option that does not force future app redesign

The content model should help the app stay focused, not make it harder to trust.
