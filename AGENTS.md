# 37NDEST Operating Contract

## Project Identity

**Name:** 37NDEST
**Type:** Progressive Web App (PWA)
**Users:** Me and my wife only
**Primary Goal:** basic conversational Japanese in ~3.5 months
**Scope:** tightly bounded mission-focused conversational trainer

This is not a generic Japanese mega-platform. This is not a JLPT-first system. This is a relationship-building conversational tool for two specific users.

---

## Product Boundaries

### Content Priority (Strict Order)
1. Everyday relationship building
2. Navigation and survival
3. Ministry

### Out of Scope (Unless Explicitly Approved)
- Broad JLPT preparation
- Full kanji system
- Advanced grammar deep-dives
- Generic language-learning platform expansion
- Backend synchronization systems
- Cloud-first architecture
- Social or multiplayer features
- Analytics-heavy dashboard features
- Multi-user collaboration features

---

## Source of Truth Order

When sources conflict, use this order:

1. **AGENTS.md** — repository-wide operating contract
2. **Active spec files** (requirements.md, design.md, tasks.md) — scoped execution truth for non-trivial work
3. **Steering documents** (.kiro/steering/) — durable product, technical, structural, and workflow rules
4. **ADRs and decision log** — approved architectural and process decisions
5. **Canonical deck JSON and schema artifacts** — source of truth for content and content structure
6. **Chat and exploratory discussion** — temporary reasoning only, never final authority

---

## Operating Rules for All Agents

### File Authority
- Files decide. Chat explores.
- New ideas are not accepted until promoted into steering, specs, ADRs, or the decision log.
- If conflict exists between chat instructions and repository files, prefer repository files according to the source-of-truth order above.
- Architectural or process decisions that affect future work should be promoted into ADRs or the decision log before implementation proceeds.

### Spec and Task Discipline
- Specs are required for all non-trivial work.
- One task at a time.
- Always work from the active spec and active task.
- If no spec exists for non-trivial work, create or request one before implementation.

### Change Control
- Do not introduce adjacent refactors without explicit approval.
- Do not change architecture, data model, or UX behavior unless the active spec or task calls for it.
- Preserve unchanged behavior.
- For any code change, state what must remain unchanged.
- Prefer the smallest correct change.

### Scope Boundaries
- No backend by default.
- No sync system by default.
- No expanding scope into a full kanji or JLPT platform without explicit approval.

### Work Lifecycle
1. **Explore** — Use chat to examine options and frame the problem.
2. **Decide** — Select a direction within project boundaries.
3. **Promote** — Record the decision in steering, specs, ADRs, or the decision log.
4. **Execute** — Implement only from recorded repository truth.

Do not skip promotion. Ideas discussed in chat are not approved work until written into repository files.

---

## Implementation Rules

### Code Changes
- State what must remain unchanged before making changes.
- Implement only what the active task requires.
- Do not refactor adjacent code without approval.
- Do not optimize prematurely.
- Preserve all existing behavior not explicitly targeted for change.

### File Scope Control
- Limit changes to files relevant to the active task.
- Do not modify unrelated files without explicit justification.
- If a task appears to require broader file changes, update the spec or request approval before proceeding.

### Architecture and Data Model
- Do not modify architecture or the data model without an explicit spec or task requirement.
- Changes to the data model require spec documentation.
- Changes to UX behavior require spec documentation.

### No Giant Prompts
- Do not use broad implementation prompts.
- Work from scoped, specific task descriptions.
- Reference the active spec and active task in all implementation work.

---

## Testing and Validation Rules

### General Validation
- Validate implementation against the active spec.
- Confirm unchanged behavior remains intact.
- Prefer focused validation tied to the task.
- Regression checks are required when behavior or data flow changes.

### Codex Role
- Used for validation, testing, and regression checks.
- Not the source of product direction.
- Validates that implementation matches spec requirements.

### Claude Role
- Used for UX, design, and clarity review.
- Not the primary source of implementation truth.
- Provides feedback on user experience and design clarity within scope.

### GPT Role
- Helps frame scoped prompt packets and planning.
- Produces narrow, task-scoped prompt packets rather than broad implementation prompts.
- Repository truth lives in files, not in GPT responses.
- Used for brainstorming within established boundaries.

### Kiro Role
- Primary project memory and implementation environment.
- Executes specs and tasks.
- Maintains file-based truth.
- Enforces operating rules.

---

## Collaboration Model

### Kiro (Primary Implementation Agent)
- Executes active specs and tasks
- Maintains file-based project state
- Enforces operating rules and boundaries
- Hands off bounded validation work to Codex when implementation review or regression checking is needed
- Uses Claude review prompts when UX, clarity, or design review is needed
- References GPT for planning and framing only

### Codex (Validation Agent)
- Runs tests and validation checks
- Confirms implementation matches spec
- Detects regressions
- Does not drive product decisions

### Claude (Design and UX Agent)
- Reviews UX clarity and design
- Provides feedback on user experience
- Suggests improvements within scope
- Does not override the active spec

### GPT (Planning and Framing Agent)
- Helps structure prompt packets
- Assists with planning and scoping
- Frames problems within boundaries
- Does not become the source of truth

---

## Definition of Done for a Task

A task is complete when:

1. **Spec alignment** — Implementation matches active spec requirements exactly
2. **Code quality** — Changes are minimal, focused, and preserve unchanged behavior
3. **Testing** — Required validation passes and no regressions are detected
4. **Documentation** — Task completion is recorded in tasks.md
5. **No scope creep** — No adjacent refactors or out-of-scope changes were introduced
6. **Unchanged behavior preserved** — All behavior not explicitly targeted for change remains intact
7. **Scope integrity** — Only intended files and behaviors were changed

---

## Important Rules (Explicit)

### Files Decide
- Chat explores possibilities.
- Files contain decisions.
- Promote ideas to files before implementation.

### No Broad Implementation Prompts
- Work from specific, scoped task descriptions.
- Reference the active spec and task.
- Do not accept vague or broad implementation requests.

### Active Spec and Task First
- Always work from the active spec.
- Always work from the active task.
- If conflict exists, prefer repository truth over chat.
- If no spec exists for non-trivial work, create one first.

### State What Remains Unchanged
- Before any code change, identify what must not change.
- Preserve all behavior not explicitly targeted.
- Verify no regressions after changes.

### Smallest Correct Change
- Implement only what the task requires.
- Do not optimize or refactor adjacent code without approval.
- Do not introduce new features.
- Do not change architecture without spec approval.

### No Backend by Default
- Frontend-first approach.
- Backend only if a spec explicitly requires it.

### No Sync System by Default
- Local-first approach.
- Sync only if a spec explicitly requires it.

### No JLPT or Kanji Expansion
- Stay mission-focused on conversational training.
- Do not expand into a full kanji system.
- Do not shift to a JLPT-first approach.
- Explicit approval is required for scope expansion.

---

## Tone and Style

- Crisp and operational
- No fluff
- Written for long-term reuse by multiple AI agents
- Clear, unambiguous rules
- Enforceable by automated systems
