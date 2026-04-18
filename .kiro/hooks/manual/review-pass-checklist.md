# Review Pass Checklist

## Purpose

Use this manual checklist when reviewing a completed implementation, bugfix, or validation pass in 37NDEST.

This checklist exists to make reviews concrete, scoped, and grounded in repository truth rather than vague impressions.

---

## Before Review

Confirm all of these before reviewing:

### Repository Truth
- [ ] I checked `AGENTS.md`
- [ ] I checked the relevant steering files
- [ ] I checked the active spec and active task, if applicable
- [ ] I checked any relevant ADRs or decision-log entries
- [ ] I checked any relevant canonical content or schema artifacts when content or data is involved

### Review Target
- [ ] I know what change is being reviewed
- [ ] I know which files changed
- [ ] I know what behavior was intended to change
- [ ] I know what behavior was supposed to remain unchanged
- [ ] I know the highest-risk surfaces to inspect

---

## During Review

Confirm all of these while reviewing:

### Scope Review
- [ ] The change appears to match the intended task
- [ ] File scope appears controlled
- [ ] Unrelated files were not changed without clear reason
- [ ] No adjacent refactors were quietly mixed in
- [ ] No product or architecture scope drift was introduced silently

### Behavior Review
- [ ] The intended behavior change appears to be implemented
- [ ] Unchanged behavior appears preserved
- [ ] Profile isolation risk was considered where relevant
- [ ] Content integrity risk was considered where relevant
- [ ] Import, persistence, review, pacing, or offline behavior was considered where relevant

### Validation Review
- [ ] Validation actually happened
- [ ] Validation was proportional to the change risk
- [ ] Any remaining uncertainty is stated honestly
- [ ] The review is not relying on “looks fine” alone

---

## After Review

Confirm all of these before closing the review:

### Review Result
- [ ] I can state what appears correct
- [ ] I can state what appears risky
- [ ] I can state what appears insufficiently validated
- [ ] I can make a clear verdict
- [ ] I can explain what needs correction or follow-up, if anything

### Acceptable Verdict Types
- [ ] approve
- [ ] approve with minor follow-up
- [ ] needs correction
- [ ] stop and rescope

---

## Escalation Reminder

Stop and escalate if:
- repository truth and the implementation conflict
- the changed files suggest broader hidden scope
- unchanged behavior cannot be evaluated clearly
- validation is too weak to support acceptance
- the change quietly alters product, architecture, or workflow boundaries

---

## Completion Standard

This checklist is complete when:
- the review target is clear
- repository truth was consulted
- scope and unchanged behavior were reviewed
- validation quality was judged
- a clear verdict was reached