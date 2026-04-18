---
name: prompt-packet-builder
description: Build narrow prompt packets for Kiro, Codex, Claude, or GPT using active specs, file scope, unchanged behavior, and expected outputs. Use when preparing a clean execution or review prompt.
---

# Prompt Packet Builder Skill

## Purpose

Use this skill when preparing a clean, scoped prompt packet for Kiro, Codex, Claude, or GPT so implementation and review work stay narrow, consistent, and aligned with repository truth.

This skill exists to prevent giant prompts, blurry task boundaries, and chat-driven drift.

---

## When to Use

Use this skill when:
- preparing an implementation prompt for an active task
- preparing a validation prompt for Codex
- preparing a UX review prompt for Claude
- converting repository truth into a clean execution packet
- reducing a broad request into a reviewable bounded instruction set

Do not use this skill for:
- raw brainstorming
- vague “build this whole thing” prompts
- replacing specs or steering
- open-ended ideation without a defined next action

---

## Required Inputs

Before using this skill, identify:

- the target agent
- the active spec and active task, if applicable
- the goal of the prompt
- the relevant repository truth
- the file scope
- what must remain unchanged
- the expected output format

If those are unclear, stop and clarify them before building the prompt packet.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not build packets that let chat context outrank repository files.

---

## Default Packet Structure

A good prompt packet should normally include:

1. **Agent role**
2. **Goal**
3. **Relevant repository truth**
4. **Active spec and task**
5. **Allowed file scope**
6. **What must remain unchanged**
7. **Validation or review expectations**
8. **Expected output**

Keep the packet as small as possible while still making the task clear.

---

## Kiro Packet Pattern

Use when preparing implementation work.

Include:
- active spec path
- active task
- narrow goal
- allowed files
- unchanged behavior boundaries
- constraints from steering
- expected deliverable

Do not ask Kiro to improvise architecture or product scope inside an implementation packet.

---

## Codex Packet Pattern

Use when preparing validation or regression review.

Include:
- change being reviewed
- relevant spec/task
- files changed
- intended behavior
- unchanged behavior
- risk surfaces to inspect
- expected review format

Keep Codex packets verification-oriented, not exploratory.

---

## Claude Packet Pattern

Use when preparing UX, clarity, or design review.

Include:
- bounded surface under review
- intended user behavior
- product constraints
- what should not change
- desired type of feedback

Do not ask Claude to redefine product direction unless the work is explicitly a design-decision exercise.

---

## GPT Packet Pattern

Use when preparing planning or framing work.

Include:
- bounded problem statement
- current repository constraints
- active priorities
- output needed
- whether the result is exploratory or intended for promotion into repository files

Do not treat GPT output as repository truth until it has been promoted.

---

## Prompting Rules

- prefer narrow packets over broad prompts
- one prompt should usually serve one immediate purpose
- avoid mixing planning, implementation, validation, and redesign into one packet
- make unchanged behavior explicit
- make file scope explicit
- make output expectations explicit

A good prompt packet reduces ambiguity without inflating the task.

---

## Anti-Patterns

Do not build packets that:
- ask for the whole project at once
- blend multiple major tasks carelessly
- hide scope in vague language
- omit what must remain unchanged
- omit repository constraints
- leave output format ambiguous
- silently elevate chat ideas over repository truth

---

## Output Expectations

A useful packet should be:
- short enough to execute cleanly
- specific enough to prevent drift
- grounded enough to survive session reset
- clear about scope and unchanged behavior
- easy to review before use

---

## Completion Standard

A prompt packet is complete when:
- the target agent is clear
- the goal is clear
- repository truth is cited appropriately
- file scope is clear
- unchanged behavior is explicit
- expected output is explicit