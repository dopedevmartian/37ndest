# Git and GitHub Power

## Purpose

This power groups the repository guidance, files, and tool focus most relevant to source control hygiene, change reviewability, and repository-state awareness in 37NDEST.

Use it to keep repository operations narrow and disciplined when working with:
- change sets
- diffs
- task completion state
- branch-safe review habits
- reviewable repository history
- acceptance readiness for scoped changes

This power exists to prevent silent drift between implementation, specs, and recorded repository truth.

---

## When to Use

Use this power when:
- reviewing what changed in a task
- preparing work for acceptance or merge
- checking whether diffs match the active task
- checking whether repository history and file changes remain reviewable
- verifying that task completion was recorded correctly
- inspecting whether structural or policy changes were introduced

Do not use this power when:
- the task is mainly frontend implementation
- the task is mainly content transformation
- the task is mainly UX exploration
- the task is mainly schema or import work without repository-state review

---

## Relevant Repository Truth

Prioritize these files when this power is active:

- `AGENTS.md`
- `.kiro/steering/workflow.md`
- `.kiro/steering/change-policy.md`
- `.kiro/steering/structure.md`
- active spec files
- relevant ADRs or decision-log entries

Also inspect as relevant:
- changed files
- task tracking in `tasks.md`
- repository diff summaries
- files touched outside expected scope

---

## Primary Concerns

When this power is active, pay extra attention to:

- whether the change set matches the active task
- whether file scope remained controlled
- whether unrelated files were touched
- whether repository structure changed intentionally
- whether decisions that should be recorded actually were recorded
- whether specs, steering, or decision records drifted out of sync with implementation
- whether acceptance state is reviewable from repository artifacts

---

## File Scope Expectations

Typical files in scope may include:
- changed source files
- active spec files
- relevant steering files
- `docs/adr/**`
- `tasks.md`
- repository metadata directly related to the active work

Typical files out of scope unless explicitly justified:
- unrelated feature folders
- unrelated content files
- broad policy files not implicated by the change
- structural files with no connection to the active task

Do not let repository review turn into broad content or implementation redesign.

---

## Review Focus

When this power is active, review as relevant:

- whether the diff is narrow enough
- whether the intended files changed
- whether important unchanged files stayed untouched
- whether the active task was recorded accurately
- whether structural or policy changes were documented
- whether the repository tells the truth about the work that happened

A clean repository state is part of implementation quality.

---

## Anti-Patterns

Do not:
- treat any diff as acceptable just because tests passed
- ignore file-scope drift because the change seems useful
- leave durable decisions only in chat
- forget to update `tasks.md` when task state changes
- mix unrelated cleanup into a reviewable task without recording that change in repository truth

---

## Completion Standard

This power is being used correctly when:
- the change set is understandable from repository artifacts
- file scope is reviewable
- task tracking is current
- durable decisions are recorded where needed
- the repository state matches what the team would claim happened