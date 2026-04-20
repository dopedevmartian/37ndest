# 37NDEST Decision Log

## Purpose

This file records approved decisions that govern V2 implementation.
All agents must treat these decisions as settled. Do not re-litigate
them. If a decision needs to change, create a new entry — do not edit
existing ones.

---

## DEC-0013 — V2 is an evolution of V1, not a rebuild

- V1 behavior and constraints are preserved
- Structural refactoring is allowed only when required
- Working systems are not replaced without explicit requirement

---

## DEC-0014 — V2 spec and mockup are the source of truth

- 37ndest-v2-mockup.html is the visual authority
- Steering files interpret, not redefine

---

## DEC-0015 — Content model upgrade is mandatory

- V1 schema is insufficient for V2
- Migration + validation is required before UI redesign

---

## DEC-0016 — Build order is fixed

- Must follow Phase 1 → Phase 9 sequence
- No skipping ahead without explicit approval

---

## DEC-0017 — Bucket model is the progress system

- bucket: 0/1/2 replaces complex SRS
- No spaced repetition system allowed without approval

---

## DEC-0018 — ID strategy is locked

- Existing MJD-NNN IDs remain unchanged
- New cards use human-readable slugs
- No migration of existing IDs

---

## DEC-0019 — Category system is dual-layer

- Canonical JSON uses V1 taxonomy
- UI uses V2 display labels via mapping layer
- No schema migration of categories

---

## DEC-0020 — No backend, ever (for V2)

- Local-first IndexedDB only
- No auth, no sync, no API layer

---

## DEC-0021 — No in-app card editing

- All cards authored externally
- Git is the only pipeline

---

## DEC-0022 — Romaji is presentation logic

- Not globally visible
- Behavior depends on review mode

---

## DEC-0023 — No SRS / gamification layer

- No intervals, ease factors, XP, streak pressure, or leaderboards
