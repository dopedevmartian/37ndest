# Testing Quality Power

## Purpose

This power groups the repository guidance, files, and tool focus most relevant to validation, regression checking, and implementation quality review in 37NDEST.

Use it to keep validation work narrow and grounded when checking:
- spec alignment
- regression risk
- unchanged behavior preservation
- profile isolation
- import/content integrity
- persistence and reload behavior
- pacing and review logic

This power exists to reduce quality drift and to prevent validation from becoming vague, shallow, or disconnected from repository truth.

---

## When to Use

Use this power when:
- validating completed work
- reviewing a patch or task for correctness
- checking regression risk
- checking whether unchanged behavior survived a change
- testing import, persistence, review, or pacing behavior
- preparing or reviewing Codex validation handoffs

Do not use this power when:
- the task is mainly product ideation
- the task is mainly content authoring without validation scope
- the task is mainly visual design exploration
- the task is mainly repository policy writing

---

## Relevant Repository Truth

Prioritize these files when this power is active:

- `AGENTS.md`
- `.kiro/steering/testing.md`
- `.kiro/steering/workflow.md`
- `.kiro/steering/change-policy.md`
- `.kiro/steering/constraints.md`
- active spec files
- relevant ADRs or decision-log entries
- relevant schema and canonical content artifacts

Also inspect as relevant:
- changed application files
- `src/test/`
- `scripts/validation/`
- `data/schema/`
- `data/decks/canonical/`
- `data/decks/derived/`

---

## Primary Concerns

When this power is active, pay extra attention to:

- whether the implementation matches the active spec and task
- whether unchanged behavior was clearly identified
- whether unchanged behavior was actually preserved
- whether validation is proportional to the risk
- whether the change affected profile isolation
- whether the change affected canonical content integrity
- whether the change affected import behavior
- whether the change affected review or pacing behavior
- whether uncertainty is being reported honestly

---

## File Scope Expectations

Typical files in scope may include:
- changed files under `src/`
- active spec files
- relevant steering files
- `src/test/**`
- `scripts/validation/**`
- relevant schema/content artifacts

Typical files out of scope unless explicitly justified:
- unrelated feature areas
- unrelated steering files
- unrelated content files
- broad structural surfaces not implicated by the change

Do not turn a validation pass into a broad rewrite or architectural redesign.

---

## Validation Focus

When this power is active, validate as relevant:

- spec alignment
- unchanged behavior preservation
- file scope discipline
- profile isolation
- persistence/reload behavior
- import/schema behavior
- review flow correctness
- pacing logic correctness
- offline-capable behavior where affected

Use Codex for bounded validation, regression review, and test-oriented checking when useful.

Use Claude for bounded UX clarity review only when the change materially affects user understanding or interaction quality.

---

## Anti-Patterns

Do not:
- approve based on vibes
- skip unchanged behavior review
- treat small diffs as automatically safe
- confuse “looks right” with validated behavior
- hide uncertainty behind confident language
- broaden a quality pass into unrelated cleanup

---

## Completion Standard

This power is being used correctly when:
- the validation target is clear
- the relevant repository truth is in view
- the risk surfaces are explicit
- the review remains bounded and evidence-based
- the result is clear enough to support approve, revise, or rescope decisions