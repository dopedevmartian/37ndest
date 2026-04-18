---
name: deck-content-review
description: Review canonical deck content, derived outputs, or import transformations for structure, usefulness, prioritization, and correctness. Use when evaluating 37NDEST content quality and content-model alignment.
---

# Deck Content Review Skill

## Purpose

Use this skill when reviewing canonical deck content, derived deck outputs, or import transformations for 37NDEST.

This skill exists to keep content practical, structured, reviewable, and aligned with the real conversational goal instead of letting deck content drift into clutter, weak prioritization, or presentation-heavy noise.

---

## When to Use

Use this skill when:
- reviewing canonical deck JSON
- reviewing transformed or imported deck content
- checking whether content matches the product priority order
- checking whether content quality supports actual conversational usefulness
- checking whether metadata and structure remain app-friendly

Do not use this skill for:
- app implementation tasks
- broad UX redesign
- speculative curriculum expansion
- random content brainstorming without a review target
- replacing schema validation with opinion

---

## Required Inputs

Before using this skill, identify:

- the content set being reviewed
- whether it is canonical, derived, or raw import content
- the review goal
- the relevant schema or structural expectations
- the learning priority implications
- whether the review is about structure, usefulness, correctness, prioritization, or all of those

If those are unclear, narrow the review before proceeding.

---

## Repository Truth Order

Use repository truth in this order:

1. `AGENTS.md`
2. steering files
3. active specs, if relevant
4. ADRs and decision log
5. canonical content and schema artifacts
6. chat context

Do not let chat preference override approved content priorities and structure rules.

---

## Review Priorities

Always review content with these priorities in mind:

1. everyday relationship building
2. navigation and survival
3. ministry

That means:
- relationship-building value should be protected
- survival usefulness should remain strong
- ministry content should remain present but not crowd out daily usefulness

Do not let lower-priority specialty content dominate the core deck.

---

## Review Categories

### Practical Usefulness
Check:
- whether the content supports real conversation
- whether high-value phrases are prioritized
- whether niche or specialty phrases are crowding out everyday usefulness
- whether the content supports the actual mission timeline goal

### Structural Quality
Check:
- whether entries are structured consistently
- whether fields appear reviewable and app-friendly
- whether content depends on presentation formatting for meaning
- whether metadata serves study flow rather than cluttering it

### Priority Alignment
Check:
- whether relationship-building content is emphasized first
- whether navigation/survival content is adequately represented
- whether ministry content is kept in its proper priority place
- whether pacing and core-usefulness assumptions still make sense

### Content Cleanliness
Check:
- whether duplicates or near-duplicates exist without reason
- whether bundled cards should be split for cleaner study use
- whether overly dense cards damage recall
- whether derived artifacts are being mistaken for canonical truth

### Correctness and Consistency
Check:
- whether obvious wording, romaji, or structure issues exist
- whether terminology is used consistently enough for learning
- whether field usage is consistent across similar entries
- whether transformation output preserved intended meaning

---

## Review Rules

- Keep canonical content reviewable by humans
- Prefer structured content over formatting-heavy content
- Do not silently promote derived output into canonical truth
- Do not expand content scope casually
- Do not overbuild metadata unless it serves study flow, validation, or pacing
- Prefer practical conversational usefulness over curriculum vanity
- Do not confuse quantity with usefulness

---

## Output Expectations

A useful content review should state:

- what content set was reviewed
- whether it is canonical, derived, or raw import material
- what is strong
- what is weak
- what is structurally problematic
- what is mis-prioritized, if anything
- what should be corrected
- what should remain unchanged

Preferred verdict styles:
- good as-is
- good with focused cleanup
- needs structural correction
- stop and rescope content direction

Avoid vague “looks good” content reviews.

---

## Anti-Patterns

Do not:
- review content only for quantity
- praise coverage while ignoring usefulness
- prioritize ministry content over daily relational usefulness
- treat formatting tricks as strong structure
- silently rewrite canonical content direction during review
- overcomplicate the deck with speculative metadata

---

## Completion Standard

A deck content review is complete when:
- the content set is clearly identified
- the review considers usefulness, structure, and priority
- canonical versus derived status is explicit
- concrete corrections or approvals are stated clearly