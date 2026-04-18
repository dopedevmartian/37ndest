# Spec Task Start Checklist

## Purpose

Use this manual checklist before starting an active task from a spec in 37NDEST.

This checklist exists to make sure implementation begins from repository truth, not from assumption, memory drift, or broad interpretation of the whole spec.

---

## Before Starting the Task

Confirm all of these before implementation begins:

### Repository Truth
- [ ] I checked `AGENTS.md`
- [ ] I checked the relevant steering files
- [ ] I checked the active spec folder
- [ ] I read `requirements.md`
- [ ] I read `design.md`
- [ ] I identified the exact active task in `tasks.md`
- [ ] I checked any relevant ADRs or decision-log entries
- [ ] I checked any relevant canonical content or schema artifacts if content or data is involved

### Task Clarity
- [ ] I can restate the task in one clear sentence
- [ ] I know the intended outcome of this task
- [ ] I know what this task does not include
- [ ] I know whether this task affects code, data, UX, structure, or workflow
- [ ] I know which files are expected to change

### Unchanged Behavior
- [ ] I can state what must remain unchanged
- [ ] I know what adjacent behavior could be accidentally affected
- [ ] I know whether profile isolation is relevant
- [ ] I know whether canonical content integrity is relevant
- [ ] I know whether review, pacing, persistence, or offline behavior is relevant

### Scope Control
- [ ] I am treating this as one task, not the whole spec
- [ ] I am not bundling in “while we are here” work
- [ ] I am not silently changing architecture or product scope
- [ ] I am prepared to stop and escalate if the task turns out broader than expected

---

## Start Prompt Quality Check

Before starting, confirm:
- [ ] the prompt or implementation request is narrow
- [ ] the active task is cited explicitly
- [ ] file scope is explicit
- [ ] unchanged behavior is explicit
- [ ] expected output is explicit

Do not begin from a blurry prompt.

---

## Escalation Reminder

Stop and escalate before starting if:
- the active task is unclear
- the spec is incomplete for the work required
- file scope cannot be described cleanly
- unchanged behavior cannot be described
- the task appears to require structural, architectural, or product-boundary change not recorded in repository truth

---

## Completion Standard

This checklist is complete when:
- the active task is explicit
- repository truth has been consulted
- file scope is explicit
- unchanged behavior is explicit
- the task is ready for a narrow implementation pass