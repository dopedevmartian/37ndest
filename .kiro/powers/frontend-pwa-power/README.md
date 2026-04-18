# Frontend PWA Power

## Purpose

This power groups the repository guidance, files, and tool focus most relevant to frontend and PWA work in 37NDEST.

Use it to keep implementation context narrow when working on:
- app shell
- UI flow
- review session interactions
- PWA installability
- offline-capable behavior
- static asset handling
- manifest and service worker related work

This power exists to reduce context bloat and avoid loading unrelated project surfaces when the task is primarily frontend and client-runtime focused.

---

## When to Use

Use this power when:
- working in `src/app/`
- working in `src/components/`
- working in frontend-oriented parts of `src/features/`
- working on session flow, profile selection, or settings UI
- working on installability or offline-capable frontend behavior
- checking whether the app remains simple, fast, and practical in the browser

Do not use this power when:
- the task is mainly about content transformation
- the task is mainly about schema/import validation
- the task is mainly about repository policy or workflow
- the task is mainly about regression review with little frontend scope

---

## Relevant Repository Truth

Prioritize these files when this power is active:

- `AGENTS.md`
- `.kiro/steering/product.md`
- `.kiro/steering/tech.md`
- `.kiro/steering/constraints.md`
- `.kiro/steering/workflow.md`
- `.kiro/steering/testing.md`
- `.kiro/steering/deployment.md`
- active spec files related to frontend or PWA work

Also inspect:
- `src/app/`
- `src/components/`
- `src/features/`
- `public/`

---

## Primary Concerns

When this power is active, pay extra attention to:

- keeping the UI aligned with the mission-focused conversational goal
- preserving low-friction study flow
- preserving offline-capable behavior
- avoiding feature-heavy dashboard drift
- keeping the app installable and usable as a focused static PWA
- preserving unchanged interaction behavior outside the active task
- keeping the implementation simple and reviewable

---

## File Scope Expectations

Typical files in scope may include:
- `src/app/**`
- `src/components/**`
- `src/features/**`
- `src/hooks/**`
- `src/styles/**`
- `public/**`

Typical files out of scope unless explicitly justified:
- canonical content in `data/decks/canonical/`
- schema artifacts in `data/schema/`
- unrelated scripts in `scripts/`
- unrelated specs or steering files

Do not silently widen scope from frontend work into content model or repository policy work.

---

## Validation Focus

When this power is active, validate as relevant:

- core interaction clarity
- intended review/session flow behavior
- unchanged UI behavior outside the change boundary
- installability or manifest behavior when affected
- offline-capable browser behavior when affected
- responsiveness during core study interactions

Use Codex for bounded regression or validation support when useful.

Use Claude for bounded UX or clarity review when useful.

---

## Anti-Patterns

Do not:
- turn frontend work into product redesign
- add decorative complexity that slows core study flow
- change UX patterns outside the active task
- mix unrelated cleanup into a frontend pass
- silently broaden the app into a generic language-learning platform

---

## Completion Standard

This power is being used correctly when:
- frontend scope is clear
- relevant repository truth is in view
- unrelated project surfaces stay unloaded or untouched
- the resulting change remains narrow, reviewable, and aligned with the actual product