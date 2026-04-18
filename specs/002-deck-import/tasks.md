# 002 Deck Import Tasks

## Purpose

These tasks implement the application-side trusted deck ingestion boundary for 37NDEST.

This task list is intentionally scoped to:
- load canonical deck JSON
- validate canonical deck structure before use
- expose trusted content through a stable app-side boundary
- preserve separation between canonical content and mutable profile state
- support future study flows without redesign

This task list does not authorize broad raw-format conversion work or full review-engine implementation.

---

## Task List

- [x] **T1. Establish the trusted canonical content entry point**
  - Create the narrow application-side path for reading canonical deck content
  - Keep the source aligned with repository-owned canonical JSON
  - Do not treat APKG, TSV, or raw imports as runtime truth

- [x] **T2. Establish deterministic canonical content validation**
  - Implement the app-side validation boundary for canonical deck content
  - Ensure malformed or structurally invalid content fails clearly
  - Keep validation deterministic and reviewable
  - Do not rely on vague fallback behavior

- [x] **T3. Establish a stable trusted-content access boundary**
  - Expose validated canonical content through a stable application-side access pattern
  - Make future feature consumption possible without re-parsing content ad hoc
  - Keep the access layer narrow and simple

- [x] **T4. Preserve separation between canonical content and profile state**
  - Confirm canonical content is treated as read-only trusted content
  - Confirm mutable profile progress remains separate
  - Avoid storing canonical content as if it were user progress state

- [x] **T5. Add failure handling for invalid trusted content**
  - Surface invalid or unusable canonical content clearly
  - Prevent the app from pretending invalid content is safe
  - Preserve profile state integrity when content loading fails

- [x] **T6. Add validation coverage for deck-ingestion behavior**
  - Add proportionate checks for:
    - successful canonical content loading
    - deterministic validation behavior
    - invalid-content failure behavior
    - canonical-versus-profile separation
  - Keep validation narrow and relevant to this spec

- [x] **T7. Confirm scope preservation**
  - Review the implementation against this spec
  - Confirm that no broad APKG or TSV import system was silently introduced
  - Confirm that no review-engine logic was silently introduced
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

### Scope Protection
While executing these tasks:
- do not implement APKG parsing
- do not implement TSV conversion flows
- do not build user-facing upload/import UI
- do not implement the full review engine
- do not implement pacing logic
- do not build dashboards or deck-management UX
- do not blend canonical content with mutable user state

### Unchanged Behavior Reminder
For each task:
- state what must remain unchanged
- keep file scope narrow
- validate proportionally
- update this file as tasks are completed or clarified

---

## Completion Standard

This spec is complete when:
- canonical deck JSON can be loaded through a trusted app-side boundary
- validation exists and is deterministic
- invalid content fails clearly
- canonical content remains separate from profile state
- trusted content is exposed in a future-friendly app shape
- the implementation remained narrow and did not drift into broader import-system work