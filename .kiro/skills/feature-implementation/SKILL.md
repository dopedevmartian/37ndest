---
name: feature-implementation
description: Implement a narrow spec task for 37NDEST with explicit file scope, unchanged behavior protection, and proportional validation. Use when building an approved feature task from specs.
---

# Feature Implementation Skill

## Purpose

Use this skill when implementing a non-trivial feature or a clearly scoped spec task in 37NDEST.

This skill exists to keep feature work narrow, spec-driven, reviewable, and aligned with repository truth.

---

## When to Use

Use this skill when:
- implementing an active task from a feature spec
- building a new feature within approved product and technical scope
- turning approved requirements and design into code
- making a change that touches multiple related files within a known boundary

Do not use this skill for:
- broad brainstorming
- vague “improve the app” requests
- architectural redefinition
- opportunistic cleanup
- bugfixes that should use the surgical bugfix workflow instead

---

## Required Inputs

Before using this skill, identify:

- the active spec path
- the active task
- the goal of the change
- which files are expected to change
- what behavior must remain unchanged
- whether data model, UX, or structure boundaries are affected

If those are unclear, stop and clarify before implementing.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not let chat override repository files.

---

## Default Working Method

Follow this sequence:

1. restate the active task in narrow terms
2. restate what must remain unchanged
3. identify file scope
4. implement the smallest correct change
5. validate proportionally
6. update `tasks.md` if the task is completed or clarified

---

## Implementation Rules

- Implement only what the active task requires
- Prefer the smallest correct change
- Do not introduce adjacent refactors without approval
- Do not silently expand feature scope
- Do not change product direction during implementation
- Do not redesign architecture unless the active spec explicitly requires it
- Keep canonical content separate from user state
- Preserve profile isolation when relevant
- Preserve offline-capable behavior when relevant

---

## File Scope Rules

Before making changes, explicitly identify:
- files expected to change
- files expected not to change
- behaviors expected to remain unchanged

If implementation reveals broader scope:
- stop
- update the spec or task if needed
- request approval if boundaries changed
- then continue

Do not smuggle broad change through a narrow task.

---

## Validation Rules

After implementation, validate as relevant:

- spec alignment
- unchanged behavior preservation
- profile isolation
- import/content integrity
- review flow correctness
- schedule/pacing behavior
- persistence/reload behavior
- offline-capable behavior

Use Codex when bounded regression or validation support would help.

Use Claude when bounded UX or clarity review would help.

---

## Output Expectations

When finishing a feature pass, provide:
- what changed
- what stayed unchanged
- which files changed
- what was validated
- what remains uncertain, if anything

Avoid vague completion language.

---

## Anti-Patterns

Do not:
- use giant implementation prompts
- implement the whole spec at once
- mix planning and implementation carelessly
- rewrite unrelated files for style
- broaden the product during a feature pass
- treat “while we are here” work as free

---

## Completion Standard

A feature task is complete when:
- the active task is satisfied
- the change stays within approved scope
- unchanged behavior is preserved
- relevant validation has been performed
- `tasks.md` is updated if appropriate