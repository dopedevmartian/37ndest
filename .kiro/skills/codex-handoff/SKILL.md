---
name: codex-handoff
description: Prepare a bounded Codex handoff for validation, regression review, or narrow implementation support. Use when Codex needs a scoped packet grounded in repository truth.
---

# Codex Handoff Skill

## Purpose

Use this skill when handing a bounded implementation, validation, or regression task to Codex.

This skill exists to keep Codex focused on what it does best in 37NDEST: testing, verification, regression review, and tightly scoped implementation support. It also prevents Codex from becoming accidental project memory or accidental product direction.

---

## When to Use

Use this skill when:
- a task implementation needs bounded validation
- a recent change needs regression review
- a spec/task needs an implementation cross-check
- a focused bugfix investigation would benefit from a second execution or review pass
- a narrow implementation task is appropriate for Codex

Do not use this skill for:
- broad product planning
- architecture direction
- repository memory
- open-ended “improve this whole app” prompts
- replacing steering or specs

---

## Required Inputs

Before using this skill, identify:

- the exact goal of the handoff
- the active spec and active task, if applicable
- the files in scope
- what behavior changed
- what behavior must remain unchanged
- the validation or output expected from Codex

If those are not explicit, the handoff is not ready.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not hand Codex a prompt that lets chat memory override repository truth.

---

## Codex Role Boundaries

Codex is for:
- bounded implementation support
- test-oriented reasoning
- regression review
- bug analysis
- validation against an active spec/task

Codex is not for:
- deciding product direction
- redefining architecture casually
- expanding scope
- serving as long-term project memory
- treating vague ideas as approved work

---

## Default Handoff Packet

A good Codex handoff should usually include:

1. **Goal**
2. **Active spec and task**
3. **Repository constraints**
4. **Files in scope**
5. **What changed**
6. **What must remain unchanged**
7. **What to validate or produce**
8. **Expected output format**

Keep the handoff narrow and reviewable.

---

## Validation-Oriented Handoff Pattern

Use this when Codex is reviewing or validating work.

Include:
- what implementation is being reviewed
- which files changed
- intended behavior
- unchanged behavior boundaries
- likely regression surfaces
- what kind of verdict is needed

Example outputs to request:
- pass / fail / uncertain
- regression risks
- mismatches with active spec
- tests or checks still needed

---

## Implementation-Oriented Handoff Pattern

Use this only when the task is truly narrow.

Include:
- one bounded task
- allowed file scope
- relevant spec/task text
- explicit constraints
- what must remain unchanged
- expected patch or result format

Do not ask Codex to implement a whole feature set in one handoff.

---

## Regression Handoff Pattern

Use this when verifying adjacent safety after a change.

Include:
- the change that was made
- affected files
- unchanged behavior boundaries
- high-risk surfaces to inspect
- expected review format

The goal is credible adjacent-risk checking, not generic confidence.

---

## Output Expectations

A useful Codex response should make it easy to answer:

- what was checked
- whether the task/spec was satisfied
- what remains at risk
- what appears unchanged
- what remains uncertain
- whether the result is acceptable as-is

Avoid vague confidence statements.

---

## Anti-Patterns

Do not hand Codex a prompt that:
- asks for product strategy
- asks for architecture drift without approval
- hides file scope
- omits unchanged behavior
- mixes multiple broad goals together
- assumes Codex should remember prior chat context
- treats Codex output as repository truth without review

---

## Completion Standard

A Codex handoff is complete when:
- the task is narrow
- repository truth is cited appropriately
- file scope is explicit
- unchanged behavior is explicit
- expected output is explicit
- the handoff keeps Codex in a bounded role