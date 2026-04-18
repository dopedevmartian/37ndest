# Codex Handoff Hook Template

## Purpose

Use this manual hook template when preparing a bounded handoff to Codex for validation, regression review, or narrow implementation support.

This is not an automation script. It is the repository-standard handoff structure that should be filled in before sending work to Codex.

---

## Template

### Goal
<State the exact goal of the Codex handoff in one or two sentences.>

### Active Spec
<Path to the active spec folder, if applicable.>

### Active Task
<State the exact task being validated or implemented.>

### Relevant Repository Truth
- `AGENTS.md`
- <relevant steering files>
- <relevant ADRs or decision-log entries>
- <relevant schema/content artifacts>

### Files In Scope
- <file 1>
- <file 2>
- <file 3>

### Files Expected To Remain Unchanged
- <file or surface 1>
- <file or surface 2>

### Intended Change
<Describe what changed or what Codex is expected to change.>

### Unchanged Behavior Requirements
- <behavior 1>
- <behavior 2>
- <behavior 3>

### Risk Surfaces To Inspect
- <risk 1>
- <risk 2>
- <risk 3>

### Expected Output
Choose one or more:
- validation verdict
- regression review
- spec mismatch check
- narrow patch proposal
- test recommendations
- uncertainty report

### Output Format
Request Codex to respond with:
1. what was checked
2. what appears correct
3. what appears risky
4. what remains uncertain
5. final verdict

---

## Use Rules

- Keep the handoff narrow
- Do not ask Codex to redefine product direction
- Do not omit unchanged behavior requirements
- Do not omit file scope
- Do not treat chat memory as repository truth
- Do not ask for a whole-feature rewrite in one packet

---

## Completion Standard

This template is ready to use when:
- the task is narrow
- repository truth is cited
- file scope is explicit
- unchanged behavior is explicit
- expected output is explicit