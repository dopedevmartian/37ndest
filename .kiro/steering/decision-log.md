# 37NDEST Decision Log

## Purpose

This file records durable decisions that affect implementation, structure, and workflow for 37NDEST. It is not a brainstorming document. It exists so future work does not depend on memory, inference, or old chat context.

Use this file for approved decisions that should remain easy to discover.

---

## How to Use This File

Add entries when:
- a technical direction is approved
- a workflow rule becomes durable
- a structural choice should be preserved
- a product boundary needs to be made explicit
- a prior ambiguity has been resolved and future work should follow that resolution

Do not use this file for:
- raw ideas
- open questions
- speculative alternatives
- implementation notes that belong in a spec
- architecture changes that deserve a full ADR instead

If a change materially alters architecture, create an ADR and reference it here if helpful.

---

## Entry Format

Use this format for new entries:

### DEC-XXXX: Short Title
- **Date:** YYYY-MM-DD
- **Status:** accepted
- **Decision:** short statement of what was decided
- **Reason:** why this decision was made
- **Implications:** what future work should assume because of this

Keep entries concise and durable.

---

## Active Decisions

### DEC-0001: Product Scope Is Mission-Focused and Two-User Only
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** 37NDEST is a tightly scoped Japanese conversation trainer for me and my wife only.
- **Reason:** The real goal is useful conversational preparation for an upcoming mission timeline, not a broad public learning platform.
- **Implications:** Do not design for public onboarding, generic user growth, or social features by default.

### DEC-0002: Learning Priority Order Is Relationship, Survival, Then Ministry
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Learning content priority is everyday relationship building first, navigation and survival second, and ministry third.
- **Reason:** Daily relational usefulness has the highest practical value for the target outcome and timeline.
- **Implications:** Content, pacing, study flows, and UX emphasis should reflect this priority order.

### DEC-0003: Canonical Deck JSON Is the Content Source of Truth
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Canonical deck JSON stored in the repository is the authoritative format for trusted app content.
- **Reason:** Structured JSON is auditable, versionable, app-friendly, and cleaner than using presentation-heavy Anki artifacts as the internal truth model.
- **Implications:** App import and validation logic should center on canonical JSON. Other formats remain secondary and must convert into canonical form.

### DEC-0004: APKG and TSV Are Secondary Formats, Not Internal Truth
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** APKG and TSV may be supported as import or interoperability formats later, but they are not the internal source-of-truth format.
- **Reason:** The project needs a clean, structured, repository-owned content model rather than a runtime dependency on external learning-app packaging.
- **Implications:** Do not design the core data model around APKG internals.

### DEC-0005: Architecture Is Local-First with No Backend by Default
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Core v1 architecture is local-first and should not depend on backend services, sync, or authentication.
- **Reason:** The project is intentionally small, personal, and offline-capable. Adding backend infrastructure would increase complexity before it is justified.
- **Implications:** Core flows must work locally. Backend, sync, or auth require explicit future approval.

### DEC-0006: Kiro Is the Primary Repository Memory and Implementation Environment
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Kiro is the primary project memory and execution environment for this repository.
- **Reason:** The project needs durable file-based continuity instead of dependence on chat-session memory.
- **Implications:** Steering, specs, ADRs, decision logs, and repository artifacts should carry durable project truth.

### DEC-0007: Non-Trivial Work Must Be Spec-Driven
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Non-trivial features, bug fixes, data model changes, workflow changes, and meaningful UX changes require specs.
- **Reason:** Spec-driven work reduces drift, keeps tasks reviewable, and improves agent coordination.
- **Implications:** Broad implementation should not begin without a relevant spec.

### DEC-0008: Codex Is a Validation Agent, Not a Product-Direction Agent
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Codex is used for bounded validation, testing, and regression review, not for deciding product direction.
- **Reason:** The project needs clear separation between execution, validation, and durable decision-making.
- **Implications:** Codex prompts should be narrow and verification-oriented.

### DEC-0009: Claude Is Used for Bounded UX and Design Review
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Claude is used for UX, clarity, and design review within scope, not as the primary implementation authority.
- **Reason:** UX review is valuable, but durable project truth must remain in repository artifacts.
- **Implications:** Claude should review bounded questions rather than redefine the product or architecture silently.

### DEC-0010: GPT Is Used for Framing and Prompt Construction, Not Repository Truth
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** GPT is used for planning, framing, and constructing scoped prompt packets, but repository truth lives in files.
- **Reason:** Chat planning is useful, but durable truth must survive session boundaries.
- **Implications:** Promote important decisions into repository artifacts before implementation.

### DEC-0011: Narrow Scoped Change Is the Default Change Style
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** The default implementation style is the smallest correct change with explicit protection of unchanged behavior.
- **Reason:** This reduces accidental drift, uncontrolled refactors, and avoidable regressions.
- **Implications:** Adjacent refactors and opportunistic cleanup are not allowed by default.

### DEC-0012: Repository Structure Is a Governed Asset
- **Date:** 2026-04-17
- **Status:** accepted
- **Decision:** Repository layout, file placement, and durable guidance locations are intentional and should not change casually.
- **Reason:** Stable structure makes project memory easier for both humans and agents to find and trust.
- **Implications:** Structural changes should be documented and reviewed rather than introduced casually.

---

## Decision Maintenance Rules

- Keep this file concise
- Prefer short durable statements over long narratives
- Update only when a real decision has been made
- Do not turn this file into a roadmap or idea backlog
- Use ADRs when the decision is architectural enough to deserve fuller reasoning

---

## Relationship to Other Files

- Use `AGENTS.md` for repository-wide operating rules
- Use steering files for durable policy by topic
- Use specs for scoped implementation truth
- Use ADRs for larger architecture decisions
- Use this file for short durable decisions that future work should not have to rediscover
