# 37NDEST Constraints Steering

## Purpose

This file defines hard project constraints for 37NDEST. These are not suggestions. They are default boundaries for implementation, architecture, UX scope, and content handling unless an approved spec, ADR, or steering update explicitly changes them.

---

## Product Constraints

### User Scope
- The product is for me and my wife only
- Do not design for public onboarding
- Do not design for generic multi-user growth
- Do not introduce social, collaborative, or community features

### Learning Scope
- Prioritize everyday relationship building first
- Prioritize navigation and survival second
- Prioritize ministry third
- Do not expand into broad JLPT preparation
- Do not expand into a comprehensive kanji-learning platform
- Do not turn the app into a generic language-learning system

### Outcome Constraints
- Optimize for basic conversational usefulness
- Do not optimize for academic completeness
- Do not optimize for exhaustive grammar coverage
- Do not optimize for "nice to have" learning modes before core conversational value is solid

---

## Architecture Constraints

### Local-First Constraint
- Default to local-first architecture
- User progress must work without a backend
- Core v1 functionality must not depend on cloud services
- Offline-capable behavior is a default requirement, not an enhancement

### Backend Constraint
- No backend by default
- No authentication service by default
- No sync service by default
- No server database by default
- No API dependency for core v1 behavior

### Runtime Simplicity Constraint
- Prefer simple, auditable runtime flows
- Avoid complex orchestration layers
- Avoid unnecessary abstraction
- Avoid premature plugin systems
- Avoid hidden or implicit runtime behavior

---

## Data Constraints

### Canonical Content Constraint
- Canonical deck JSON is the source of truth for content
- Canonical content must remain separate from user progress
- Canonical content must not be silently mutated by runtime code
- Canonical content belongs in `data/decks/canonical/`

### Import Constraint
- Import logic must be deterministic
- Validation must be deterministic
- Raw imports must not become runtime dependencies
- Imported content must be transformed into canonical JSON before becoming trusted application content

### Profile Data Constraint
- Each profile must remain isolated
- No cross-profile leakage is acceptable
- Profile deletion or reset must not damage canonical deck content
- User progress must be recoverable through explicit backup/export paths when implemented

---

## Implementation Constraints

### Scope Control
- Implement only the active task
- Do not introduce adjacent refactors without approval
- Do not quietly improve unrelated areas while touching nearby code
- Do not expand the task to include "while we are here" work
- Prefer the smallest correct change

### File Scope Constraint
- Limit changes to files relevant to the active task
- If additional files are required, the reason must be explicit
- If a task forces broader structural changes, update the spec or request approval before proceeding

### Change Safety
- State what must remain unchanged before making code changes
- Preserve existing behavior outside the intended change boundary
- Validate that unchanged behavior still holds after implementation
- Do not ship speculative cleanup as part of unrelated work

---

## UX Constraints

### Product Shape
- The app should feel focused, fast, and practical
- Do not add feature-heavy dashboards in v1
- Do not add decorative complexity that slows review flow
- Do not optimize for novelty over clarity

### Interaction Constraints
- Review interactions should be quick and low-friction
- Core study flows should remain understandable without training
- Avoid burying important learning actions behind deep navigation
- Do not add modes that dilute the main conversational training goal

---

## Content Constraints

### Content Discipline
- Content changes should be intentional and reviewable
- Do not mix canonical content editing into unrelated implementation work
- Do not hardcode lesson content into source files
- Do not treat generated or derived outputs as canonical without explicit promotion

### Deck Scope Discipline
- Focus deck design on practical mission-relevant conversation
- Keep relationship-building content ahead of ministry content in priority
- Do not let specialty vocabulary crowd out daily conversational usefulness
- Do not overbuild metadata unless it serves study flow, validation, or pacing directly

---

## Tooling Constraints

### Kiro
- Kiro is the primary project memory and implementation environment
- Kiro should execute from specs and steering, not from drifting chat context

### Codex
- Codex is for validation, testing, and regression review
- Codex is not the decision-maker for product direction
- Codex is not long-term project memory

### Claude
- Claude is for UX and design review within scope
- Claude is not the primary implementation authority

### GPT
- GPT is for planning, framing, and scoped prompt construction
- GPT responses do not become repository truth until promoted into files

### MCP
- MCP should be introduced deliberately, not broadly
- Do not make MCP a runtime dependency for the app itself
- Do not load unnecessary MCP surface area into the working context
- Use MCP to reduce friction, not to increase architecture complexity

---

## Spec and Decision Constraints

### Spec Requirement
- Non-trivial work requires a spec
- Specs must exist before broad implementation begins
- Specs must remain aligned with actual implementation
- Tasks must be updated as work is completed

### Decision Promotion
- Chat ideas are not approved decisions
- Architectural or process decisions should be promoted into ADRs or the decision log
- Product or workflow decisions should be promoted into steering or specs
- Do not execute on ideas that have not been promoted

---

## Explicit Anti-Scope Rules

Do not expand 37NDEST into:
- a broad JLPT study platform
- a full kanji mastery system
- a cloud-first sync product
- a social study product
- an analytics-heavy product
- an AI tutor platform
- a generic edtech platform

Do not add by default:
- backend services
- authentication
- sync
- multiplayer
- public onboarding
- broad gamification
- unrelated analytics
- speculative platform infrastructure

---

## Enforcement Posture

When in doubt:
- choose the narrower scope
- choose the simpler architecture
- choose the smaller change
- choose the more reviewable implementation
- choose the option that preserves existing boundaries

If a requested change conflicts with this file, do not proceed silently. Update the spec, steering, or decision record first.
