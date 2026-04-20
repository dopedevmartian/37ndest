# 010 Progress Dashboard — Requirements

## Purpose

This spec defines a minimal, encouraging progress screen for 37NDEST. The screen
replaces the current "Coming in a later phase" placeholder in the Progress surface.
It shows the user how their learning is going without overwhelming them with numbers
or analytics.

The tone is a patient teacher checking in — not a productivity dashboard.

---

## Product Context

The app currently has no progress visibility beyond the session completion screen.
Users have no way to see how many cards they know, which categories they are strong
in, or how their confidence is trending. This screen fills that gap with the minimum
useful information.

The Progress surface is already wired in the bottom nav. This spec implements its
content.

---

## Scope

### Included

- Overall progress bar (cards reviewed vs total deck)
- Confidence bucket counts (Strong / Learning / Needs review)
- Category glimpse (top 3–5 categories with simple visual indicator)
- Profile-aware display (reads from active profile's confidence data)
- Empty/first-use state when no data exists yet

### Not included

- Study history or session log
- Per-card detail view
- Streak tracking
- Charts, graphs, or sparklines
- Social comparison
- Export or sharing
- Changes to navigation structure
- Changes to existing data structures
- New IndexedDB tables or schema changes

---

## Requirements

### R1. Overall progress must show cards reviewed vs total deck

The screen must display how many distinct cards the active profile has reviewed at
least once, compared to the total number of cards in the canonical deck.

Display format: a calm horizontal bar with a label below it.

Example label: "42 of 148 cards reviewed"

The bar fill is proportional to the reviewed fraction. It uses `--bengara` as the
fill color on a `--paper-deep` track.

"Reviewed" means: the card has at least one `ConfidenceRecord` in IndexedDB for the
active profile (i.e. `lastReviewedAt > 0`).

### R2. Confidence buckets must group cards into three tiers

Cards with a `ConfidenceRecord` are grouped by `confidenceScore`:

| Bucket | Score range | Label |
|---|---|---|
| Strong | 8–10 | Strong |
| Learning | 4–7 | Learning |
| Needs review | 0–3 | Needs review |

Cards with no `ConfidenceRecord` (never reviewed) are not counted in any bucket.

Display: three labeled rows, each showing a count. No bar or visual indicator
required for buckets — counts alone are sufficient.

Example:
```
Strong         12
Learning       24
Needs review    6
```

### R3. Category glimpse must show top 3–5 categories by reviewed card count

For each internal category value present in the deck (`relationship`, `foundation`,
`navigation_survival`, `ministry`), count how many cards in that category have been
reviewed by the active profile.

Show the top 3–5 categories ranked by reviewed count. Display the V2 display label
(not the internal taxonomy value) alongside a simple horizontal bar showing the
fraction of that category's cards that have been reviewed.

The bar uses `--ink` fill on `--paper-deep` track. Width is proportional to
`reviewed / total` for that category.

If a category has zero reviewed cards, it may be omitted from the glimpse.

### R4. The screen must handle the first-use / no-data state gracefully

When the active profile has no `ConfidenceRecord` entries yet:
- Overall bar shows 0 of N cards reviewed
- Bucket counts show 0 / 0 / 0
- Category glimpse shows categories with 0 bars
- A calm prompt appears: "Start a session to begin tracking your progress."

No error state. No broken layout. The screen must be usable and encouraging even
before any cards have been reviewed.

### R5. The screen must be profile-aware

All data displayed is scoped to the active profile. If no profile is active, show a
prompt to select a profile on the home screen.

### R6. The screen must use existing design system tokens

All colors, typography, and spacing must use the existing CSS custom property tokens
defined in the V2 design system. No new tokens are introduced.

Typography:
- Section labels: Inter, small, uppercase, `--ink-faint`
- Counts and values: Source Serif 4, `--ink`
- Supporting text: Source Serif 4, `--ink-muted`

No charts. No graphs. No heavy visuals. Bars only.

### R7. The screen must not modify any existing data structures or logic

`ProgressView` reads from `db.cardConfidence` and the canonical deck. It does not
write to any table. It does not modify review logic, session logic, or reinforcement
logic.

---

## Acceptance Criteria

### AC1. Overall progress
- Bar and label display correctly when cards have been reviewed
- Bar and label display correctly when no cards have been reviewed (0 of N)
- "Reviewed" count matches the number of distinct cards with a ConfidenceRecord

### AC2. Confidence buckets
- Cards are correctly grouped by score range
- Counts are accurate for the active profile
- Cards with no ConfidenceRecord are excluded from all buckets

### AC3. Category glimpse
- Top 3–5 categories shown by reviewed count
- V2 display labels used (not internal taxonomy values)
- Bar width proportional to reviewed fraction for each category
- Categories with zero reviewed cards may be omitted

### AC4. Empty state
- Screen renders without errors when no data exists
- Calm prompt shown to encourage starting a session

### AC5. Profile isolation
- All data is scoped to the active profile
- No cross-profile data leakage

### AC6. Design system compliance
- All colors use existing CSS custom property tokens
- No new tokens introduced
- No charts or graphs

---

## Explicit Non-Requirements

- Study history or session log
- Per-card detail or drill-down
- Streak tracking or gamification
- Charts, graphs, sparklines
- Social comparison
- Export or sharing
- New data structures or schema changes
- Changes to navigation
- Changes to review, session, or reinforcement logic
