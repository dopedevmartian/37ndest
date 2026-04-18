# 001 Foundation Tasks

## Purpose

These tasks implement the narrow foundation layer for 37NDEST.

This task list is intentionally scoped to:
- establish the app shell
- establish local-first persistence foundations
- establish profile-aware state direction
- establish canonical-content loading boundaries
- establish PWA/static groundwork

This task list does not authorize broad implementation of later specs.

---

## Task List

- [x] **T1. Create the base application shell**
  - Set up the core app entry and stable shell structure
  - Ensure the project runs locally in development
  - Keep the initial shell minimal and honest
  - Do not build a fake-complete product surface

- [x] **T2. Establish minimal navigable app structure**
  - Create minimal stable surfaces for:
    - home/start
    - profile-aware entry behavior
    - review placeholder
    - settings placeholder
  - Keep routing or surface structure simple
  - Avoid premature navigation complexity

- [x] **T3. Establish the local persistence foundation**
  - Set up the baseline IndexedDB/Dexie layer
  - Create minimal data structures for:
    - profiles
    - future settings state
    - future progress/review scaffolding
  - Keep canonical content separate from mutable user state

- [x] **T4. Establish the profile model and active-profile handling**
  - Create the minimal profile model
  - Support profile-aware app context or equivalent local state
  - Make room for selecting or loading an active profile
  - Preserve separation between profiles by design

- [x] **T5. Establish canonical content loading boundaries**
  - Create the minimal structure needed to read canonical deck content
  - Keep canonical content treated as read-only trusted content
  - Do not implement the full import/transformation workflow yet
  - Do not blur canonical content with user progress state

- [x] **T6. Establish PWA/installable groundwork**
  - Add manifest/service-worker-compatible setup
  - Preserve static deployment compatibility
  - Keep the setup minimal and reviewable
  - Avoid overbuilding offline complexity before later specs

- [x] **T7. Add minimal validation coverage for the foundation**
  - Add proportionate checks for:
    - app shell startup
    - profile-aware persistence groundwork
    - canonical content separation
    - static build success
  - Keep validation bounded to the foundation scope

- [x] **T8. Confirm scope preservation**
  - Review the implementation against the spec
  - Confirm that major later-spec behaviors were not silently implemented
  - Confirm that no backend/sync assumptions were introduced
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

### Scope Protection
While executing these tasks:
- do not implement the full review engine
- do not implement the full deck import pipeline
- do not implement advanced pacing logic
- do not build analytics or dashboard-heavy UI
- do not add backend, sync, or auth assumptions
- do not hardcode lesson content into source files

### Unchanged Behavior Reminder
For each task:
- state what must remain unchanged
- keep file scope narrow
- validate proportionally
- update this file as tasks are completed or clarified

---

## Completion Standard

This spec is complete when:
- the app has a real foundation shell
- the app has minimal navigable structure
- the local persistence layer is established
- the profile-aware state direction exists
- canonical-content loading boundaries exist
- PWA/static groundwork exists
- validation is present and proportionate
- the scope remained foundation-only