---
name: regression-check
description: Review recent changes for adjacent regressions, unchanged behavior drift, and spec mismatches. Use when checking whether a change broke nearby behavior or needs bounded regression review.
---

# Regression Check Skill

## Purpose

Use this skill when checking whether a recent change in 37NDEST damaged behavior that was supposed to remain unchanged.

This skill exists to make “unchanged behavior” a real verification step rather than a polite phrase.

---

## When to Use

Use this skill when:
- a task has been implemented and needs regression review
- a bugfix may have affected nearby behavior
- a feature touched persistence, import, review, schedule, or profile logic
- a reviewer wants a bounded check of adjacent risk
- a change looks small but sits in a high-risk area

Do not use this skill for:
- broad feature planning
- product direction decisions
- vague quality audits with no recent change to anchor the check
- open-ended architecture reviews

---

## Required Inputs

Before using this skill, identify:

- what change was made
- which files changed
- what behavior was intended to change
- what behavior was explicitly supposed to remain unchanged
- what risk area is most likely affected

If the unchanged behavior was never stated, reconstruct it from the active spec, steering, and surrounding implementation context before proceeding.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. active spec files
3. steering files
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not let casual chat assumptions define what counts as a regression.

---

## Default Working Method

Follow this sequence:

1. restate the intended change
2. restate the unchanged behavior boundaries
3. identify the highest-likelihood regression surfaces
4. check those surfaces directly
5. record what still works, what drifted, and what remains uncertain

The goal is not maximum testing. The goal is credible adjacent-risk checking.

---

## High-Risk Areas for This Project

Treat these as high-risk by default:

- canonical content import
- schema validation
- profile isolation
- IndexedDB persistence
- review queue behavior
- pacing and schedule logic
- offline-capable behavior
- transformations that affect trusted content
- settings that alter study flow or profile behavior

Even small diffs in these areas deserve stronger regression attention.

---

## Regression Questions

Always ask, when relevant:

- Did the intended change work?
- What behavior was supposed to remain unchanged?
- Did file scope stay controlled?
- Did profile isolation remain intact?
- Did content integrity remain intact?
- Did import behavior remain stable?
- Did review and pacing behavior remain stable?
- Did reload/offline-capable behavior remain stable?
- Is there any new coupling or side effect that was not part of the task?

---

## Validation Posture

### Good Regression Checking
Good regression checking is:
- bounded
- explicit
- tied to actual risk
- honest about uncertainty
- grounded in repository truth

### Bad Regression Checking
Bad regression checking is:
- vague
- purely visual when logic changed
- purely logical when interaction behavior changed
- overconfident without evidence
- silent about what was not checked

---

## Tool Roles

### Kiro
- identifies what changed
- identifies what was supposed to stay unchanged
- records reviewable project truth

### Codex
- useful for bounded regression analysis
- useful for checking affected paths and likely adjacent drift
- useful for comparing implementation to expected behavior

### Claude
- useful when the regression risk is mainly UX clarity or interaction quality
- not a substitute for logic and state validation

### GPT
- useful for framing a regression checklist
- not a substitute for actual verification

---

## Output Expectations

When finishing a regression check, provide:

- the change being checked
- the unchanged behavior being protected
- the surfaces reviewed
- what passed
- what failed
- what remains uncertain
- whether the change is safe to accept as-is

Avoid “looks fine” unless the review is truly narrow and the evidence is clear.

---

## Anti-Patterns

Do not:
- assume unchanged behavior survived
- treat small diffs as automatically low risk
- review only the changed line and ignore the affected flow
- confuse lack of obvious breakage with verified safety
- hide uncertainty behind confidence

---

## Completion Standard

A regression check is complete when:
- the intended change is understood
- unchanged behavior boundaries are explicit
- likely adjacent risks were checked proportionally
- results are stated clearly enough for acceptance or correction