# 010 Progress Dashboard — Design

## Purpose

This design defines the implementation approach for the Progress surface. It
translates the requirements into a concrete component structure, data loading
strategy, and rendering layout.

---

## Design Goals

1. Replace the placeholder Progress surface with real content
2. Read from existing `cardConfidence` table — no new data systems
3. Keep the component simple, async-safe, and profile-isolated
4. Match the V2 design system exactly — no new tokens or visual patterns
5. Render correctly in all states: loaded, loading, empty, no-profile

---

## Component

`src/app/ProgressView.tsx` — replaces the current placeholder section.

### Props

```ts
type ProgressViewProps = {
  activeProfileId: string | null;
};
```

`ProgressView` is a self-contained async data loader. It fetches its own data on
mount and when `activeProfileId` changes. No data is passed in from `AppShell`
beyond the active profile id.

---

## Data Loading

### What is loaded

On mount (and on `activeProfileId` change):

1. **Canonical deck** — via `tryGetCanonicalDeck()`. Provides total card count,
   per-card category, and the full note list for category grouping.

2. **Confidence records** — via `db.cardConfidence.where("profileId").equals(profileId).toArray()`.
   Returns all `ConfidenceRecord` entries for the active profile.

### Derived values (computed from loaded data)

All derivations are pure functions of the loaded data. No additional db queries.

```
totalCards       = deck.notes.length
reviewedCardIds  = Set of cardIds where ConfidenceRecord exists (lastReviewedAt > 0)
reviewedCount    = reviewedCardIds.size

// Confidence buckets (only cards with a ConfidenceRecord)
strongCount      = records where confidenceScore >= 8
learningCount    = records where confidenceScore >= 4 && < 8
needsReviewCount = records where confidenceScore < 4

// Category glimpse
For each category in [relationship, foundation, navigation_survival, ministry]:
  totalInCategory    = deck.notes.filter(n => n.category === cat).length
  reviewedInCategory = deck.notes.filter(n => n.category === cat && reviewedCardIds.has(n.id)).length
Sort by reviewedInCategory descending, take top 5, omit if reviewedInCategory === 0.
```

### Loading state

A simple `status: "loading" | "ready" | "error" | "no-profile"` field drives
conditional rendering. No skeleton loaders — a brief blank state is acceptable
given the small data volume.

---

## Layout

```
ProgressView
├── Top bar: "37NDEST · 進捗" callsign (left), no days pill yet
├── Section: Overall progress
│   ├── Label: "X of Y cards reviewed"
│   └── Horizontal bar (--bengara fill, --paper-deep track)
├── Section: Confidence
│   ├── Row: Strong     [count]
│   ├── Row: Learning   [count]
│   └── Row: Needs review [count]
└── Section: By category
    └── For each top category:
        ├── Label: V2 display name
        └── Horizontal bar (--ink fill, --paper-deep track)
```

Bottom nav is rendered by `AppShell` — not by `ProgressView`.

---

## Section Component Pattern

Each section uses a consistent visual pattern:

```
Section header:
  Inter, 0.65rem, uppercase, letter-spacing 0.08em, --ink-faint

Section content:
  Source Serif 4 for values and labels
  --ink for primary values
  --ink-muted for secondary labels
```

No card wrappers. No borders around sections. Sections are separated by vertical
spacing only (`mt-6` or equivalent).

---

## Bar Component

A simple inline bar — no separate component needed:

```tsx
// Track
<div style={{ height: "6px", backgroundColor: "var(--paper-deep)", borderRadius: "3px" }}>
  // Fill
  <div style={{
    height: "100%",
    width: `${pct}%`,
    backgroundColor: fillColor,  // --bengara for overall, --ink for category
    borderRadius: "3px",
    transition: "width 300ms ease-in-out",
  }} />
</div>
```

Bar height: 6px. Rounded ends. Smooth transition on load.

---

## Category Display Label Mapping

Mirrors the mapping already used in `ReviewCard` and `MCCard`:

```ts
const CATEGORY_DISPLAY: Record<string, string> = {
  relationship:        "greetings",
  foundation:          "foundation",
  navigation_survival: "travel",
  ministry:            "church",
};
```

This mapping is duplicated in `ProgressView` — no shared utility needed at this
scale. If it becomes a third duplication, extract to `src/lib/categoryDisplay.ts`.

---

## Empty / First-Use State

When `reviewedCount === 0`:

```
Overall bar: 0% fill, label "0 of N cards reviewed"
Confidence rows: all show 0
Category bars: all 0% fill
Prompt (below sections):
  Source Serif 4, italic, --ink-faint, centered:
  "Start a session to begin tracking your progress."
```

The prompt only appears when `reviewedCount === 0`. It does not appear once any
cards have been reviewed.

---

## No-Profile State

When `activeProfileId` is null:

```
Centered message:
  Source Serif 4, --ink-muted:
  "Select a profile on the home screen to see your progress."
```

---

## Integration Boundaries

### What this spec adds

| Concern | Location |
|---|---|
| `ProgressView` component | `src/app/ProgressView.tsx` |
| Confidence data query | inside `ProgressView` (inline, no new service) |
| Derived progress calculations | inside `ProgressView` (pure, inline) |

### What this spec must not touch

| File | Reason |
|---|---|
| `src/app/AppShell.tsx` | Only change: swap placeholder for `<ProgressView>` |
| `src/db/db.ts` | No schema changes |
| `src/types/db.ts` | No type changes |
| `src/features/review/*` | No review logic changes |
| `src/features/schedule/*` | No pacing changes |
| `src/components/ReviewCard.tsx` | No change |
| `src/components/MCCard.tsx` | No change |

`AppShell.tsx` requires one change: replace the placeholder `<section>` for the
progress surface with `<ProgressView activeProfileId={activeProfileId} />`. This is
the only file outside `ProgressView.tsx` that changes.

---

## Validation Strategy

### Data correctness
- `reviewedCount` matches distinct cards with a ConfidenceRecord for the profile
- Bucket counts sum to `reviewedCount` (every reviewed card falls in exactly one bucket)
- Category bars reflect correct reviewed/total fractions
- No cross-profile data leakage (query is scoped by profileId)

### Rendering
- Empty state renders without errors when no ConfidenceRecords exist
- No-profile state renders without errors when activeProfileId is null
- Bar widths are clamped to 0–100% (no overflow)
- All colors use existing CSS custom property tokens

### Regression
- Review logic unchanged
- Session logic unchanged
- Reinforcement logic unchanged
- Navigation unchanged

---

## What This Design Intentionally Defers

- Days-to-Sapporo pill in the top bar (requires mission date integration)
- "Needs attention" card shelf (requires additional query and card rendering)
- Trip readiness ring (SVG, deferred to a later phase)
- Weekly session dots (requires session history query)
- Per-card drill-down from the progress screen
