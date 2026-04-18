# 37NDEST Change Policy

## Purpose

This file defines how change is allowed to happen in 37NDEST. Its job is to prevent silent scope expansion, uncontrolled refactors, and accidental product drift while still allowing deliberate progress.

---

## Default Change Rule

The default rule is:
- make the smallest correct change
- preserve unchanged behavior
- avoid adjacent refactors
- avoid broad reinterpretation of the task
- promote durable decisions before broad implementation

If a change needs more than the active task appears to allow, do not smuggle it through. Update the spec, task, steering, or decision record first.

---

## Allowed by Default

These changes are generally allowed when they are directly required by the active task and stay within approved scope:

### Implementation Changes
- code changes required to satisfy the active task
- narrow bug fixes inside the targeted feature or file area
- small supporting refactors that are necessary for correctness
- test updates required to reflect the intended scoped change
- validation script updates required by the active task

### Documentation Updates
- updating the active tasks.md
- updating the active spec when implementation clarified reality
- updating inline code comments when they materially improve clarity
- updating relevant runbook or prompt references when the task explicitly affects them

### Data and Content Handling
- deterministic import or validation updates tied to the active task
- derived content regeneration when required by approved work
- schema-aligned content adjustments when explicitly in scope

Allowed by default does not mean unreviewed. It means the change is within expected scope if it directly supports the active task.

---

## Not Allowed by Default

These changes require explicit approval through a spec update, steering update, ADR, or decision-log entry before proceeding:

### Product Scope Expansion
- adding new learning modes not required by the active task
- expanding into broader JLPT or kanji product scope
- adding analytics, social, gamification, or public-user features
- adding cloud-first or sync-dependent behavior

### Architecture Expansion
- introducing a backend
- introducing authentication
- introducing sync infrastructure
- introducing major new framework dependencies
- changing the approved stack
- adding runtime complexity that is not clearly required

### Unrelated Improvement Work
- refactoring nearby code "while we are here"
- renaming broad surfaces for style preference
- changing UX patterns outside the intended scope
- moving files or restructuring folders without approved reason
- mixing opportunistic cleanup into unrelated implementation

### Silent Policy Changes
- treating chat decisions as approved implementation truth
- changing the meaning of steering files without updating them
- changing repository structure without documenting it
- changing canonical content handling rules without promotion into repository truth

---

## Change Classes

### Class 1: Narrow Scoped Change

Examples:
- implementing one task from the active spec
- fixing a localized bug
- updating a deterministic validation rule
- adjusting one focused UI behavior

Handling:
- proceed within task scope
- validate proportionally
- record completion

### Class 2: Broader But Related Change

Examples:
- touching several related files to complete one task safely
- adjusting a spec because implementation revealed a real gap
- updating validation and persistence together for one feature

Handling:
- make scope expansion explicit
- update the active spec or task if needed
- document what remains unchanged
- validate more carefully

### Class 3: Boundary-Changing Change

Examples:
- changing architecture
- changing data model shape in durable ways
- changing product boundaries
- changing repository structure rules
- changing workflow policy

Handling:
- do not proceed silently
- create or update an ADR, spec, steering file, or decision-log entry first
- get explicit approval
- then implement

---

## File-Scope Policy

Before implementation, be able to answer:
- which files are expected to change
- which files should not change
- which behaviors must remain unchanged
- whether structure, data model, or UX boundaries are affected

If you cannot answer those questions, the task is not ready for clean execution.

---

## Refactor Policy

### Allowed Refactors

Refactors are allowed when they are:
- necessary for correctness
- necessary to complete the active task safely
- narrow enough to review clearly
- documented when they change implementation reality meaningfully

### Not Allowed Refactors

Refactors are not allowed when they are:
- opportunistic
- aesthetic-only
- broad cleanup unrelated to the task
- architecture reshaping disguised as implementation detail
- done without protecting unchanged behavior

---

## Spec and Decision Policy

### Spec Updates

Update the active spec when:
- implementation reveals a real requirement gap
- design assumptions changed in a material way
- task boundaries changed in a real way
- durable execution truth would otherwise become misleading

### Decision Records

Create or update ADRs or the decision log when:
- architecture changes
- workflow policy changes
- repository structure changes
- durable technical direction changes
- product boundary changes

Do not leave durable decisions trapped in chat.

---

## Content Change Policy

### Canonical Content

Canonical content should not be edited casually during unrelated implementation work.

Canonical content changes require:
- clear intent
- reviewable reasoning
- alignment with schema and validation rules
- separation from unrelated code changes when possible

### Derived Content

Derived content can be regenerated as needed, but regeneration should not silently redefine canonical truth.

### Imports

Raw imports are staging artifacts. They are not trusted runtime truth until transformed and validated.

---

## Validation Policy

Any meaningful change should answer:
- what changed
- what was intended to stay unchanged
- what was validated
- what remains uncertain

Validation must be proportional, but it must not be vague.

---

## Escalation Rule

Escalate before proceeding when:
- the requested change crosses scope boundaries
- the file scope becomes materially larger than expected
- unchanged behavior becomes hard to protect
- repository policy appears to conflict with the request
- the spec no longer matches implementation reality

When escalation is needed:
- stop pretending the task is still narrow
- update or request the right repository artifact
- get the needed decision recorded
- continue from approved truth

---

## Final Bias

When there is doubt:
- choose the narrower change
- choose the more reviewable path
- choose the simpler implementation
- choose explicit documentation over silent drift

37NDEST should evolve through deliberate recorded decisions, not through accidental accumulation.
