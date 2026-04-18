---
name: pr-review
description: Review a change set against the active spec, file scope, unchanged behavior, and validation quality. Use when checking whether a task or patch is acceptable for 37NDEST.
---

# PR Review Skill

## Purpose

Use this skill when reviewing a proposed change set for 37NDEST before accepting it as good work.

This skill exists to catch scope drift, regression risk, weak validation, and violations of repository truth before they harden into the project.

---

## When to Use

Use this skill when:
- reviewing a completed task or patch
- checking whether implementation matches the active spec
- checking whether the file scope stayed controlled
- checking whether unchanged behavior was protected
- preparing a change for merge or acceptance

Do not use this skill for:
- brainstorming
- initial feature planning
- open-ended architecture exploration
- vague “take a look” reviews without a defined change set

---

## Required Inputs

Before using this skill, identify:

- the active spec and active task, if applicable
- the files changed
- the intended change
- what behavior was supposed to remain unchanged
- what validation was already performed

If those are unclear, ask for them or reconstruct them from repository artifacts before reviewing.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not review against chat memory when repository files say otherwise.

---

## Review Questions

Always review for these questions when relevant:

- Does the change match the active spec and task?
- Did the file scope remain appropriately narrow?
- What was supposed to remain unchanged?
- Does the change appear to preserve that unchanged behavior?
- Did the implementation introduce adjacent refactors?
- Did the implementation quietly expand product or architectural scope?
- Was the validation proportional and credible?
- Are there obvious regression risks left unaddressed?

---

## Review Categories

### Scope Review
Check:
- whether the task stayed narrow
- whether unrelated files were touched
- whether adjacent cleanup was mixed in
- whether the product meaning drifted

### Implementation Review
Check:
- whether the code appears to solve the intended problem
- whether the solution is simpler than the problem
- whether the solution introduced avoidable complexity
- whether the data and UX boundaries stayed intact

### Validation Review
Check:
- whether validation actually happened
- whether the validation matched the risk
- whether unchanged behavior was checked
- whether any uncertainty remains

### Project-Specific Risk Review
Check carefully for:
- profile isolation risk
- canonical content handling drift
- import/validation drift
- review queue or schedule drift
- offline-capable behavior drift

---

## Review Output Expectations

A useful review should state:

- what appears correct
- what appears risky
- what appears out of scope
- what appears insufficiently validated
- whether the change is acceptable as-is
- what should be fixed before acceptance, if anything

Preferred final states:
- approve
- approve with minor follow-up
- needs correction
- stop and rescope

Avoid vague review language.

---

## Anti-Patterns

Do not:
- approve based on vibes
- ignore file scope drift because the code “looks better”
- substitute taste for scope discipline
- invent new product goals during review
- ask for broad polish unrelated to the active task
- treat missing validation as harmless

---

## Completion Standard

A review is complete when:
- the change has been checked against repository truth
- file scope and unchanged behavior were considered
- validation quality was judged proportionally
- a clear acceptance judgment was made