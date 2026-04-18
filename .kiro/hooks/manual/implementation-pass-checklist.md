# Implementation Pass Checklist

## Purpose

Use this manual checklist before and after a meaningful implementation pass in 37NDEST.

This checklist exists to keep implementation narrow, reviewable, and aligned with repository truth rather than drifting through chat context or opportunistic change.

---

## Before Implementation

Confirm all of these before changing code:

### Repository Truth
- [ ] I checked `AGENTS.md`
- [ ] I checked the relevant steering files
- [ ] I checked the active spec
- [ ] I checked the active task
- [ ] I checked any relevant ADRs or decision-log entries
- [ ] I checked any relevant canonical content or schema artifacts

### Task Clarity
- [ ] I can state the task in one clear sentence
- [ ] I know what outcome the task is supposed to produce
- [ ] I know what is in scope
- [ ] I know what is out of scope
- [ ] I know which files are expected to change

### Unchanged Behavior
- [ ] I can state what must remain unchanged
- [ ] I can state what files or surfaces should remain untouched
- [ ] I understand whether profile isolation is at risk
- [ ] I understand whether content integrity is at risk
- [ ] I understand whether review, pacing, persistence, or offline behavior is at risk

### Scope Safety
- [ ] I am making the smallest correct change
- [ ] I am not introducing adjacent refactors without approval
- [ ] I am not silently changing architecture, product scope, or UX meaning
- [ ] I am not treating chat ideas as repository truth

---

## After Implementation

Confirm all of these after changing code:

### Change Review
- [ ] I can state what changed clearly
- [ ] I can state what stayed unchanged clearly
- [ ] The file scope stayed narrow or any expansion was made explicit
- [ ] I did not smuggle unrelated cleanup into the implementation

### Validation
- [ ] I validated the behavior the task was supposed to change
- [ ] I checked unchanged behavior where relevant
- [ ] I checked relevant risk surfaces proportionally
- [ ] I know whether Codex would help with bounded validation or regression review
- [ ] I know whether Claude would help with bounded UX or clarity review

### Repository Recording
- [ ] I updated `tasks.md` if task status changed
- [ ] I updated the active spec if implementation clarified durable truth
- [ ] I recorded any durable architectural or process decision in ADRs or the decision log if needed
- [ ] I did not leave important implementation truth trapped only in chat

---

## Escalation Reminder

Stop and escalate before proceeding or accepting the change if:
- the task is no longer narrow
- file scope expanded materially
- unchanged behavior is unclear
- the spec no longer matches reality
- the request conflicts with steering or constraints
- the implementation seems to require product or architecture reinterpretation

---

## Completion Standard

This checklist is complete when:
- repository truth was consulted
- task boundaries were explicit
- unchanged behavior was explicit
- validation expectations were explicit
- repository recording expectations were explicit