# JSON Data Pipeline Power

## Purpose

This power groups the repository guidance, files, and tool focus most relevant to canonical content, schema validation, import transformation, and trusted data flow in 37NDEST.

Use it to keep data-related work narrow and disciplined when working with:
- canonical deck JSON
- derived deck outputs
- raw imports
- schema artifacts
- validation scripts
- deterministic transformation logic

This power exists to prevent content drift, schema drift, and accidental confusion between raw imports, derived outputs, canonical truth, and user state.

---

## When to Use

Use this power when:
- working on canonical deck JSON
- reviewing or updating schema artifacts
- building or validating import/transformation scripts
- checking whether derived outputs are correct
- reviewing whether content structure is app-friendly and trusted
- validating that raw imports are transformed safely into canonical form

Do not use this power when:
- the task is mainly frontend implementation
- the task is mainly visual UX work
- the task is mainly repository policy writing
- the task is mainly git/review workflow without data-model implications

---

## Relevant Repository Truth

Prioritize these files when this power is active:

- `AGENTS.md`
- `.kiro/steering/content-model.md`
- `.kiro/steering/tech.md`
- `.kiro/steering/constraints.md`
- `.kiro/steering/testing.md`
- active spec files related to content or import work
- relevant decision-log entries
- relevant ADRs if any exist

Also inspect as relevant:
- `data/decks/canonical/**`
- `data/decks/derived/**`
- `data/decks/imports/**`
- `data/schema/**`
- `data/schedule/**`
- `scripts/import/**`
- `scripts/validation/**`

---

## Primary Concerns

When this power is active, pay extra attention to:

- whether canonical content remains the trusted source of truth
- whether raw imports are being treated only as staging artifacts
- whether derived outputs are clearly separated from canonical truth
- whether schema expectations remain aligned with real content
- whether transformation logic is deterministic and reviewable
- whether content structure remains app-friendly
- whether profile/user state remains separate from canonical content
- whether relationship-building content stays ahead of lower-priority content in practical emphasis

---

## File Scope Expectations

Typical files in scope may include:
- `data/decks/canonical/**`
- `data/decks/derived/**`
- `data/decks/imports/**`
- `data/schema/**`
- `data/schedule/**`
- `scripts/import/**`
- `scripts/validation/**`
- relevant spec files
- relevant steering files

Typical files out of scope unless explicitly justified:
- unrelated frontend components
- broad app-shell or routing changes
- unrelated steering or workflow files
- profile UI surfaces with no connection to data handling

Do not let a data-pipeline pass quietly become a frontend redesign or policy rewrite.

---

## Validation Focus

When this power is active, validate as relevant:

- schema conformance
- required and optional field handling
- deterministic transformation behavior
- canonical versus derived separation
- canonical content integrity
- source traceability when relevant
- no silent mutation of trusted content
- no accidental dependence on raw imports at runtime

Use Codex for bounded validation or transformation review when useful.

Use Claude only if the question is really about content clarity or presentation implications, not raw data truth.

---

## Anti-Patterns

Do not:
- treat APKG or TSV as internal truth
- silently promote derived content into canonical truth
- hardcode lesson content into application source files
- overbuild metadata that does not help study flow, validation, or pacing
- mix unrelated implementation work into content-pipeline changes
- accept malformed content because it “mostly works”

---

## Completion Standard

This power is being used correctly when:
- trusted versus untrusted content surfaces are clear
- file scope remains narrow
- schema and transformation behavior are reviewable
- canonical content integrity is preserved
- the resulting data flow remains structured, deterministic, and app-friendly