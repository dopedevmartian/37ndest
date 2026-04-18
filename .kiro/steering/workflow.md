# 37NDEST Workflow Steering

## Purpose

This file defines the default working method for 37NDEST. It exists to reduce scope creep, preserve implementation quality, and keep project memory in repository artifacts rather than in drifting conversation context.

---

## Default Work Pattern

The default sequence for meaningful work is:

1. Explore
2. Decide
3. Promote
4. Execute
5. Validate
6. Record

Do not skip steps casually. The goal is deliberate, reviewable progress.

---

## Step Definitions

### 1. Explore

Use chat to:
- clarify the problem
- compare options
- identify constraints
- identify what is in scope and out of scope
- frame the next task clearly

Exploration is not authority. Exploration does not change the repository by itself.

### 2. Decide

Choose a direction that fits:
- product boundaries
- technical steering
- current constraints
- active priorities
- deadline reality

Do not carry multiple competing directions into implementation.

### 3. Promote

Before broad implementation, promote decisions into repository truth:
- steering for durable project policy
- specs for scoped feature work
- ADRs or decision log for architectural or process decisions
- canonical content or schema artifacts for approved content structure

Ideas are not approved until they are promoted.

### 4. Execute

Implement only from recorded repository truth:
- active spec
- active task
- steering
- ADRs / decision log
- canonical content artifacts

Prefer the smallest correct change.

### 5. Validate

After implementation:
- verify alignment with the active spec
- verify unchanged behavior
- run focused validation and regression checks
- use Codex when bounded testing or regression review is appropriate
- use Claude when bounded UX or design review is appropriate

### 6. Record

After successful work:
- update tasks.md
- update relevant specs if implementation clarified reality
- record architectural or process decisions when appropriate
- keep repository memory current

---

## Spec-First Discipline

### When Specs Are Required

A spec is required for:
- non-trivial features
- non-trivial bug fixes
- structural refactors
- data model changes
- UX changes with meaningful user impact
- workflow changes that affect future execution

### Spec Shape

Non-trivial work should normally use:
- requirements.md
- design.md
- tasks.md

### Task Execution Rule

- Work one active task at a time
- Do not execute multiple broad tasks in parallel unless a spec explicitly supports that pattern
- Do not treat a full spec as one implementation blob

---

## Prompting Discipline

### Default Prompt Shape

Prompt packets should be:
- narrow
- task-scoped
- grounded in repository files
- explicit about what must remain unchanged
- explicit about which files are in play

### Avoid

- giant implementation prompts
- mixed planning and execution prompts
- open-ended "improve this whole system" prompts
- vague refactor prompts
- speculative roadmap prompts during active implementation

### Preferred Pattern

When prompting implementation agents:
- cite the active spec
- cite the active task
- state the goal
- state the allowed file scope
- state what must remain unchanged
- state the expected output

---

## File Scope and Change Control

### File Scope Rule

Every meaningful implementation pass should have a clear file boundary.

At minimum:
- know which files are expected to change
- know which behaviors must remain unchanged
- know whether the task is allowed to touch structure, data model, or UX

### If Scope Expands

If implementation reveals broader required change:
- stop pretending the task is still narrow
- update the spec, task, or decision record
- request approval when needed
- then continue

Do not smuggle structural change through a small task.

---

## Validation Workflow

### Required Validation Mindset

Validation should be proportional to the change, but always present.

Check:
- spec alignment
- unchanged behavior
- profile isolation when relevant
- content integrity when relevant
- import and persistence behavior when relevant
- pacing and review logic when relevant

### Tool Roles

- Kiro executes and maintains file-based truth
- Codex validates bounded implementation and regression behavior
- Claude reviews bounded UX, clarity, and design questions
- GPT helps frame scoped work, but does not become the source of truth

---

## Repository Memory Discipline

### Durable Memory Lives In Files

Repository memory should live in:
- AGENTS.md
- .kiro/steering/
- specs/
- docs/adr/
- canonical content and schema artifacts

### Chat Memory Is Temporary

Do not rely on chat history as durable project memory. Do not treat prior chat wording as repository truth unless it has been written into files.

### Knowledge and References

Large references, supporting materials, and operational guidance should live in repository docs or knowledge systems rather than bloating active implementation prompts.

---

## One-Way Promotion Rule

Use this rule consistently:
- exploration may generate ideas
- decisions narrow those ideas
- promotion records approved direction
- execution follows promoted direction

Do not reverse the flow by letting raw chat ideas silently drive implementation.

---

## Completion Discipline

A task is not complete just because code exists.

A task is complete when:
- the implementation matches the active spec and task
- required validation has been performed
- unchanged behavior has been preserved
- related task tracking has been updated
- any durable decisions uncovered by the work have been recorded

---

## Default Escalation Rule

If uncertainty appears during implementation:
- check the active spec
- check steering
- check ADRs / decision log
- narrow the task if possible
- request a decision update before proceeding if needed

Do not fill important gaps with improvisation when repository truth should be updated instead.
