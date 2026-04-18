# Spec Task Complete Checklist

## Purpose

Use this manual checklist after completing an active task from a spec in 37NDEST.

This checklist exists to make sure task completion is real, reviewable, and aligned with repository truth rather than inferred from effort alone.

---

## Before Marking the Task Complete

Confirm all of these before closing the task:

### Task Outcome
- [ ] I can state what the task was supposed to accomplish
- [ ] I can state what was actually implemented
- [ ] The implementation matches the active task
- [ ] I did not quietly expand the task into broader work
- [ ] I can identify any remaining uncertainty honestly

### File Scope
- [ ] I know which files changed
- [ ] The file scope remained appropriately narrow
- [ ] Any file-scope expansion was made explicit and justified
- [ ] Unrelated files were not changed without reason

### Unchanged Behavior
- [ ] I can state what was supposed to remain unchanged
- [ ] I checked unchanged behavior where relevant
- [ ] Adjacent behavior does not appear to have drifted
- [ ] Profile isolation remains intact where relevant
- [ ] Content integrity remains intact where relevant
- [ ] Review, pacing, persistence, and offline behavior remain intact where relevant

### Validation
- [ ] I validated the intended behavior change
- [ ] Validation was proportional to the risk
- [ ] Regression risk was checked where relevant
- [ ] I know whether Codex should still review the result
- [ ] I know whether Claude should still review the result for UX or clarity

### Repository Recording
- [ ] I updated `tasks.md` if the task is complete or changed state
- [ ] I updated the active spec if implementation clarified durable truth
- [ ] I recorded any durable architectural or process decisions if needed
- [ ] I did not leave important truth trapped only in chat

---

## Escalation Reminder

Do not mark the task complete if:
- the implementation drifted from the task
- file scope grew without being acknowledged
- unchanged behavior is uncertain
- validation is too weak to support acceptance
- the spec no longer matches reality
- a durable decision was made but not recorded

---

## Completion Standard

This checklist is complete when:
- the task result is clear
- file scope is clear
- unchanged behavior has been considered
- validation has been considered
- repository recording has been considered
- task completion can be defended from repository artifacts