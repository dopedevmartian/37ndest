# 003 Review Engine Tasks

## Purpose

These tasks implement the core review engine for 37NDEST.

This task list is intentionally scoped to:
- turn trusted canonical content into usable study sessions
- support recognition-oriented study
- support production-oriented study
- record profile-specific progress
- preserve canonical-versus-progress boundaries
- remain local-first and compatible with later pacing work

This task list does not authorize dashboards, analytics, broad learning-mode expansion, or speculative queue overengineering.

---

## Task List

- [x] **T1. Establish the review-session entry boundary**
  - Create the narrow application-side path for starting a study session
  - Ensure the session is tied to the active profile
  - Ensure the session consumes trusted canonical content rather than raw imports or mutable content state

- [x] **T2. Establish session item selection behavior**
  - Implement a simple, reviewable selection path for choosing study items from trusted content plus profile-specific progress
  - Keep selection logic narrow and understandable
  - Do not overbuild final queue sophistication yet

- [x] **T3. Establish recognition-oriented study flow**
  - Implement the core engine behavior needed for recognition-oriented review
  - Support coherent prompt presentation, user interaction, and result capture
  - Keep the behavior aligned with future UI rendering without overcoupling engine and presentation

- [x] **T4. Establish production-oriented study flow**
  - Implement the core engine behavior needed for production-oriented recall
  - Support coherent prompt presentation, user interaction, and result capture
  - Preserve alignment with practical conversational usefulness rather than recognition-only study

- [x] **T5. Establish session progression behavior**
  - Implement the core “next item” session flow
  - Ensure results affect session state coherently
  - Ensure session advancement remains understandable and reviewable
  - Avoid building advanced recommendation or pacing systems here

- [x] **T6. Establish profile-specific progress recording**
  - Record review outcomes into mutable profile-specific state
  - Preserve separation from canonical content
  - Preserve separation between profiles
  - Keep the recorded state useful for later pacing and schedule work

- [x] **T7. Add failure/integrity protections**
  - Handle missing or invalid review-related state honestly
  - Avoid cross-profile leakage
  - Avoid corrupting canonical content
  - Keep failure behavior narrow and reviewable

- [ ] **T8. Add validation coverage for review-engine behavior**
  - Add proportionate checks for:
    - session creation
    - study-direction behavior
    - session progression
    - profile-specific progress updates
    - canonical-versus-progress separation
  - Keep validation narrow and relevant to this spec

- [ ] **T9. Confirm scope preservation**
  - Review the implementation against this spec
  - Confirm that no advanced dashboard, analytics, or speculative learning-mode work was silently introduced
  - Confirm that no backend assumptions were introduced
  - Record any clarified reality back into the spec if needed

---

## Task Execution Notes

### Default Order
Preferred implementation order:
1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7
8. T8
9. T9

### Scope Protection
While executing these tasks:
- do not implement advanced pacing logic
- do not implement broad queue optimization systems
- do not implement analytics dashboards
- do not implement social or multiplayer features
- do not implement cloud or backend behavior
- do not blur canonical content with mutable progress state

### Unchanged Behavior Reminder
For each task:
- state what must remain unchanged
- keep file scope narrow
- validate proportionally
- update this file as tasks are completed or clarified

---

## Completion Standard

This spec is complete when:
- trusted canonical content can drive a real study session
- recognition-oriented flow works
- production-oriented flow works
- session progression is coherent
- profile-specific progress is recorded cleanly
- canonical content remains separate from mutable progress
- validation is present and proportionate
- the implementation remained reviewable and within scope