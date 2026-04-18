# Project Memory Checklist

## Purpose

Use this manual checklist when starting, resuming, or handing off meaningful work in 37NDEST.

This checklist exists to make sure work is grounded in repository truth rather than drifting chat memory.

---

## Checklist

Before implementation or review, confirm:

### Repository Truth
- [ ] I checked `AGENTS.md`
- [ ] I checked the relevant steering files
- [ ] I checked the active spec, if one exists
- [ ] I checked relevant ADRs or the decision log
- [ ] I checked relevant canonical content or schema artifacts when content or data is involved

### Task Clarity
- [ ] I can state the active task clearly
- [ ] I know what is in scope
- [ ] I know what is out of scope
- [ ] I know which files are expected to change
- [ ] I know what behavior must remain unchanged

### Change Safety
- [ ] I am making the smallest correct change
- [ ] I am not introducing adjacent refactors without approval
- [ ] I am not silently changing architecture, product scope, or UX meaning
- [ ] I am not treating chat ideas as approved truth

### Validation Readiness
- [ ] I know what needs to be validated
- [ ] I know whether Codex would help with bounded validation or regression review
- [ ] I know whether Claude would help with bounded UX or clarity review
- [ ] I can explain what will remain uncertain, if anything

### Recording Discipline
- [ ] I will update `tasks.md` if task status changes
- [ ] I will update specs if implementation changes durable execution truth
- [ ] I will record durable decisions in steering, ADRs, or the decision log when needed

---

## Escalation Reminder

Stop and escalate before proceeding if:
- the task scope is no longer narrow
- file scope is expanding materially
- unchanged behavior is unclear
- the spec no longer matches reality
- the requested change conflicts with steering or constraints

---

## Completion Standard

This checklist is complete when:
- repository truth has been consulted
- task boundaries are explicit
- unchanged behavior is explicit
- validation expectations are explicit
- recording expectations are explicit