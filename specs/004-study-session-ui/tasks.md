# 004 Study Session UI Tasks

## Purpose

These tasks implement the user-facing study-session interface for 37NDEST.

This task list is intentionally scoped to:
- present a focused study surface
- support recognition-oriented interaction
- support production-oriented interaction
- make reveal/confirmation state clear
- make session progression clear
- keep the session UI low-friction and practical

This task list does not authorize dashboards, analytics-heavy reporting, broad gamification, or speculative extra learning modes.

---

## Task List

- [x] **T1. Establish the session entry surface**
  - Create the narrow UI entry path into a study session
  - Keep entry behavior aligned with the active profile and review-engine boundaries
  - Avoid introducing fake dashboard complexity

- [x] **T2. Establish the current-item session surface**
  - Implement the main UI surface for showing the active study item
  - Keep one current study item visually central
  - Ensure the surface stays focused and readable

- [x] **T3. Establish recognition-oriented interaction UI**
  - Implement the recognition-oriented prompt/reveal/result flow
  - Make the user’s next action clear at each step
  - Keep the interaction low-friction and practical

- [x] **T4. Establish production-oriented interaction UI**
  - Implement the production-oriented prompt/reveal/result flow
  - Make the recall expectation clear before reveal
  - Keep the interaction aligned with practical conversational study

- [x] **T5. Establish explicit reveal/confirmation state behavior**
  - Make unrevealed versus revealed state visually and behaviorally distinct
  - Ensure result actions appear at the correct time
  - Avoid ambiguous half-state interaction

- [x] **T6. Establish session progression UI**
  - Implement clear advancement from one item to the next
  - Ensure progression behavior feels stable and understandable
  - Avoid confusing or brittle transitions

- [ ] **T7. Establish completion, interruption, and empty/error states**
  - Implement honest completion behavior
  - Implement understandable interruption behavior
  - Implement honest empty/error session states
  - Avoid showing broken or misleading study controls

- [ ] **T8. Add validation coverage for study-session UI behavior**
  - Add proportionate checks for:
    - recognition-oriented interaction flow
    - production-oriented interaction flow
    - reveal-state clarity
    - progression behavior
    - completion/interruption/empty-state behavior
  - Keep validation narrow and relevant to this spec

- [x] **T9. Confirm scope preservation**
  - Review the implementation against this spec
  - Confirm that no dashboard, analytics, or gamification behavior was silently introduced
  - Confirm that no speculative extra learning modes were introduced
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
- do not implement dashboard-heavy UI
- do not implement analytics/reporting surfaces
- do not implement social or multiplayer behavior
- do not implement broad gamification layers
- do not redesign the whole app shell unnecessarily
- do not blur UI rendering with review-engine logic

### Unchanged Behavior Reminder
For each task:
- state what must remain unchanged
- keep file scope narrow
- validate proportionally
- update this file as tasks are completed or clarified

---

## Completion Standard

This spec is complete when:
- a focused study-session UI exists
- recognition-oriented interaction works coherently
- production-oriented interaction works coherently
- reveal and progression states are clear
- completion/interruption/empty states are honest and understandable
- validation is present and proportionate
- the implementation remained narrow and aligned with the product’s practical study purpose