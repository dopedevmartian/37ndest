# 37NDEST Testing Steering

## Purpose

This file defines the default testing and validation posture for 37NDEST. The goal is not maximal ceremony. The goal is proportionate, repeatable confidence that scoped changes behave correctly and do not damage adjacent behavior.

---

## Testing Philosophy

### Proportional Validation

Testing should scale with the risk and surface area of the change.

Small change:
- focused validation
- targeted regression check
- unchanged behavior confirmation

Medium change:
- targeted tests
- path-specific regression checks
- affected state and data validation

Larger or riskier change:
- stronger automated coverage
- broader regression review
- explicit review of unchanged behavior boundaries

### No Fake Confidence

Do not claim confidence without validation. Do not treat "it looks right" as sufficient for non-trivial work. Do not skip validation because the change seems small if the behavior is important.

### Required Validation Mindset

For any meaningful change, validate at least these questions when relevant:
- Does the implementation match the active spec and task?
- What behavior was supposed to stay unchanged?
- Was that unchanged behavior actually preserved?
- Did the change affect profile isolation?
- Did the change affect canonical content integrity?
- Did the change affect import behavior?
- Did the change affect schedule or review logic?
- Did the change affect offline-capable behavior?

Not every question applies every time, but the thought process should always be explicit.

---

## Testing Priorities

### Highest Priority
- Canonical deck import correctness
- Profile isolation
- Review flow correctness
- Schedule and pacing behavior
- Persistence and reload behavior
- Unchanged behavior preservation

### Medium Priority
- UI clarity under normal usage
- Error handling for invalid or incomplete input
- Recovery behavior after bad data or interrupted flows
- Responsiveness during core study interactions

### Lower Priority
- Nice-to-have visual polish checks
- Broad exploratory UI checks outside active scope
- Performance micro-optimizations without evidence of need

---

## Test Categories

### Content and Import Validation

Use when working on:
- deck import
- schema updates
- canonical content handling
- derived content generation
- validation scripts

Check:
- schema conformance
- required field handling
- optional field handling
- invalid input rejection
- deterministic transform behavior
- preservation of canonical content integrity

### Persistence and Profile Validation

Use when working on:
- IndexedDB
- profile creation
- profile switching
- progress storage
- export/import backup behavior

Check:
- profile isolation
- no cross-profile leakage
- correct persistence on reload
- safe reset/delete behavior
- canonical content remains unaffected by profile operations

### Review and Schedule Validation

Use when working on:
- review flow
- queue logic
- pacing logic
- progress transitions
- recall and recognition flow behavior

Check:
- ordering and selection behavior
- state transitions
- progress tracking
- pacing recommendation correctness
- review updates after user actions

### UI and Interaction Validation

Use when working on:
- session flow
- navigation
- settings
- profile selection
- card interactions

Check:
- low-friction core flow
- intended actions remain clear
- important controls are reachable
- no accidental complexity is introduced
- behavior remains aligned with the active scope

---

## Unchanged Behavior Rule

Before implementation:
- state what must remain unchanged

After implementation:
- confirm that unchanged behavior was actually preserved

This rule is required for any non-trivial work. A task is not complete if adjacent behavior drifted.

---

## Automation Expectations

### Preferred Use of Tests

Prefer automated tests when:
- logic is deterministic
- regression risk is meaningful
- behavior is reused
- data validation is critical
- the change affects persistence, import, or scheduling

### Acceptable Non-Test Validation

Manual validation can be acceptable when:
- the change is narrow and low-risk
- the behavior is highly visual
- automated coverage would be disproportionate
- the manual validation steps are explicit and reviewable

### Do Not Hide Behind Either Mode

- Do not avoid tests when tests are appropriate
- Do not overbuild tests for trivial changes just to appear rigorous
- Match the validation method to the actual risk

---

## Tool Roles in Validation

### Kiro
- Executes the scoped change
- Records what changed
- Records what was intended to remain unchanged
- Maintains repository truth

### Codex
- Best used for bounded validation, test support, and regression review
- Useful for checking whether implementation matches the active spec
- Useful for spotting unintended behavior drift
- Not responsible for redefining what the product should do

### Claude
- Useful for bounded UX and clarity review
- Useful when interaction quality or comprehension matters
- Not a substitute for implementation validation

### GPT
- Useful for framing validation prompts and checklists
- Useful for helping define what should remain unchanged
- Not a substitute for actual verification

---

## Validation Output Expectations

When validation is performed, the output should make it easy to answer:
- What changed?
- What was supposed to remain unchanged?
- What was checked?
- What passed?
- What remains uncertain?

Avoid vague validation summaries. Preferred phrasing is concrete and scoped.

---

## High-Risk Areas for This Project

Treat changes in these areas as higher risk by default:
- canonical content import
- schema validation
- IndexedDB persistence
- profile separation
- review queue behavior
- schedule and pacing logic
- offline-capable behavior
- transformation scripts that affect trusted content

These areas deserve stronger validation even when the code diff looks small.

---

## Completion Standard

Validation is sufficient when:
- it is proportional to the change
- it addresses the relevant risk areas
- it verifies unchanged behavior where applicable
- it gives a reviewable reason to trust the result

Validation is not sufficient when:
- it is vague
- it relies on assumption
- it ignores adjacent behavior risk
- it treats repository truth casually
