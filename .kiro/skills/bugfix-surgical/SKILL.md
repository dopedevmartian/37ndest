---
name: bugfix-surgical
description: Fix a specific bug in 37NDEST with the smallest correct change, narrow file scope, and explicit regression awareness. Use for bounded bugfix work, not broad cleanup.
---

# Surgical Bugfix Skill

## Purpose

Use this skill when fixing a bug in 37NDEST without allowing the fix to sprawl into unrelated cleanup, refactors, or product drift.

This skill exists to keep bugfixes narrow, evidence-based, and safe.

---

## When to Use

Use this skill when:
- a specific bug has been identified
- behavior is incorrect or broken
- a regression needs to be fixed
- data handling, review flow, import behavior, or UI behavior is failing in a known way

Do not use this skill for:
- feature implementation
- broad cleanup
- speculative hardening without a concrete issue
- architecture redesign disguised as a fix
- “improve this whole area” requests

---

## Required Inputs

Before using this skill, identify:

- the bug being fixed
- the expected correct behavior
- the observed incorrect behavior
- reproduction steps, if known
- likely file scope
- what behavior must remain unchanged

If the bug is not concrete enough to describe, clarify the problem before changing code.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files, if the bug is tied to a spec
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not let chat reinterpret the product while fixing a bug.

---

## Default Working Method

Follow this sequence:

1. restate the bug in specific terms
2. restate expected behavior
3. restate unchanged behavior boundaries
4. identify likely file scope
5. find the narrowest credible fix
6. validate the fix and nearby regression risk
7. record completion or remaining uncertainty

---

## Bugfix Rules

- Fix the bug actually reported
- Do not expand into cleanup unless required for correctness
- Do not refactor adjacent code without approval
- Prefer the smallest correct fix that preserves existing intended behavior
- Do not silently change UX, data model, or product meaning while fixing a bug
- Keep canonical content handling stable unless the bug is directly about content handling
- Preserve profile isolation when relevant
- Preserve offline-capable behavior when relevant

---

## File Scope Rules

Before making changes, identify:
- files likely to change
- files that should stay untouched
- nearby behavior that must not drift

If the bug turns out to require broader changes:
- stop pretending it is still a narrow fix
- update the relevant spec or decision record if needed
- get approval if boundaries changed
- then continue

A surprising fix scope is a signal to slow down, not improvise faster.

---

## Investigation Rules

When investigating:
- prefer concrete reproduction over theory
- inspect the smallest relevant surface first
- identify whether the issue is logic, state, persistence, import, or UI
- avoid rewriting code before you can describe the failure clearly
- distinguish between root cause, symptom, and nearby mess

Do not confuse an ugly area of code with the actual bug.

---

## Validation Rules

After implementing the fix, validate as relevant:

- the reported bug is actually fixed
- unchanged behavior still works
- no obvious regression was introduced nearby
- profile isolation still holds when relevant
- persistence still behaves correctly when relevant
- import/content integrity still holds when relevant
- schedule/review logic still behaves correctly when relevant

Use Codex when bounded regression review or targeted validation would help.

Use Claude only if the bugfix affects user clarity or interaction quality in a meaningful way.

---

## Output Expectations

When finishing a bugfix pass, provide:
- the bug that was fixed
- the root cause, if known
- what changed
- what stayed unchanged
- which files changed
- what was validated
- what remains uncertain, if anything

Avoid claiming certainty you did not earn.

---

## Anti-Patterns

Do not:
- turn the bugfix into a refactor project
- “clean up everything nearby”
- broaden the product while fixing a bug
- silently reinterpret expected behavior
- hide uncertainty behind confident language
- ship a fix without checking likely adjacent regression risk

---

## Completion Standard

A bugfix is complete when:
- the reported behavior is corrected
- the intended behavior is preserved
- the change remains narrow and reviewable
- relevant validation has been performed
- any remaining uncertainty is clearly stated