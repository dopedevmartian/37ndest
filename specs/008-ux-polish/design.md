# 008 UX Polish — Design

## Purpose

This design defines the implementation approach for the UX polish pass.
It translates the requirements into concrete visual decisions, component changes,
and file-level impact.

This is a specification-only document. No implementation is authorized until approved.

---

## Design Goals

1. make the Japanese text feel like the primary object of study
2. make the progress indicator honest without being discouraging
3. make the exit affordance immediately understandable
4. make the action buttons communicate self-assessment intent on first encounter
5. make Zone 3 support content structurally clear, especially for SOV comparisons
6. align home and settings surfaces with the V2 design system
7. make the About section feel considered

---

## 1. Japanese Hero Text

### Current state
`fontSize: "3rem"` in both Zone 1 (recognition) and Zone 2 (production reveal).
No explicit font-weight set — defaults to Noto Serif JP normal weight.

### Proposed change
Increase to `fontSize: "3.75rem"` (60px). This is a meaningful step up from 3rem
and gives the Japanese text clear visual dominance over the reveal content below.

Apply `fontWeight: 500` (medium) to add visual mass without distorting letterforms.
Noto Serif JP supports weight 400 and 700; 500 may fall back to 400 depending on
the loaded subset. If 500 is unavailable, 400 is acceptable — do not use 700 as it
is too heavy for body-scale Japanese text.

Line height: `lineHeight: 1.3` — slightly looser than the current `leading-tight`
to prevent descenders from colliding on multi-line phrases.

### Affected elements
- Zone 1 recognition: `<p className="font-noto-serif-jp ...">` in `ReviewCard.tsx`
- Zone 2 production reveal: same element in the production reveal block

### Wrapping behavior
Long phrases must wrap cleanly. The container is already `text-center` with full
card width. No overflow or clip should occur at 375px viewport width. Test with
the longest card in the deck before considering complete.

---

## 2. Progress Indicator

### Current state
`{position} / {total}` where `total = state.items.length` — the full deck size
(148 cards). Rendered as `font-inter text-xs` in `--ink-muted` at top-right.

### Proposed change

**De-emphasize the counter; retain it.**

The counter is kept but made visually secondary to the progress bar. Changes:
- Reduce font size from `text-xs` (~12px) to approximately `10px` (`0.625rem`)
- Change color from `--ink-muted` to `--ink-faint`
- Position and format (`{position} / {total}`) are unchanged

The progress bar remains the primary progress signal. The counter becomes a quiet
reference a user can glance at if they want it, but it no longer competes for
attention.

### Affected elements
- `ReviewView.tsx`: update the `<span>` rendering `{position} / {total}` —
  change `className="font-inter text-xs"` and `color: var(--ink-muted)` to
  `font-inter` at `0.625rem` with `color: var(--ink-faint)`

---

## 3. Exit Affordance

### Current state
Enso circle SVG icon, top-left, `aria-label="Pause and return to home"`.
No visible label. Icon color `--ink-muted`. Tap target: `p-1 -ml-1`.

### Proposed change

Add a small visible text label directly below the enso icon:

```
◯  ← enso icon (28×28)
exit  ← Inter, 10px, --ink-faint, letter-spacing 0.08em, uppercase
```

The label "exit" is short, universally understood, and does not compete with card
content. It sits below the icon within the same button element.

The tap target must be at least 44×44px to meet mobile touch target guidelines.
The current `p-1 -ml-1` may need to be adjusted to `p-2` to accommodate the label.

The enso icon is retained — it is the approved pause affordance per V2 navigation
spec. The label supplements it rather than replacing it.

### Affected elements
- `ReviewView.tsx`: update the pause affordance button in the top chrome block

---

## 4. Action Button Labels

### Decision

Replace "Got it" / "Again" with **"I knew it"** / **"Not yet"**.

Rationale:
- "I knew it" is unambiguously a self-assessment statement. It cannot be
  misread as confirming an instruction.
- "Not yet" is honest, warm, and non-punishing. It implies forward progress
  ("not yet, but I will") rather than failure.
- Both labels are short enough to fit comfortably in the button at `text-base`.
- The pair is consistent with the product's patient-teacher philosophy.

The underlying outcome mapping is unchanged:
- "I knew it" → `correct` outcome
- "Not yet" → `incorrect` outcome

### Visual treatment
No change to button styling. The `--ink` filled button remains the primary action.
The `--coral` text / `--coral-soft` border button remains the secondary action.

### Affected elements
- `ReviewCard.tsx`: update button text strings only

---

## 5. Zone 3 Support Content Structure

### Current state
Three separate `<p>` elements with no grouping label or structural framing.
`literal_breakdown` renders as a bare `--ink-faint` Inter string.

### Proposed structure

#### Example triple

Wrap the three lines in a labeled group:

```
Example
───────────────────────────────
私はアメリカ人です。          ← Noto Serif JP, text-sm, --ink-soft
watashi wa amerikajin desu.   ← italic Source Serif 4, text-xs, --ink-muted
I am American.                ← Source Serif 4, text-xs, --ink-muted
```

The "Example" label:
- Font: Inter, `text-xs`, `--ink-faint`, uppercase, letter-spacing 0.08em
- Positioned above the three lines
- A faint rule or spacing separates the label from the content

The three lines remain in the same typographic roles as Phase 5. The addition is
the label and the visual grouping.

#### literal_breakdown

Render with a "Word order:" label prefix. The `→` arrow characters in the
breakdown content are stored in the field value and rendered as-is — the rendering
layer does not add or transform them. The label is the only addition:

```
WORD ORDER  I [topic] → American → am
```

Or as two lines if the breakdown is long:
```
WORD ORDER
I [topic] → American → am
```

Implementation — single-line preferred:
```
<p>
  <span style="color: var(--ink-faint); font-family: Inter; font-size: 0.65rem;
               text-transform: uppercase; letter-spacing: 0.08em; margin-right: 0.4em;">
    Word order
  </span>
  <span style="color: var(--ink-faint); font-family: Inter; font-size: 0.75rem;">
    {literalBreakdown}
  </span>
</p>
```

The `→` characters in `literalBreakdown` are part of the stored content and
render naturally in Inter at `--ink-faint`. No special handling is required.

#### usage_note

No label required — `usage_note` is already contextually clear as a note about
usage. Retain italic Source Serif 4, `--ink-muted`, `text-xs`.

#### Absent fields

No change to absence behavior. If a field is absent, its section does not render.
No empty containers, no labels without content.

---

## 6. Home Surface Token Alignment

### Current state
`HomeView.tsx` uses V1-era glassmorphism throughout:
- Container: `rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur`
- Heading: `text-white`
- Body: `text-slate-400`
- Active profile: `border-blue-500 bg-blue-600/20 text-white`
- Inactive profile: `border-white/10 bg-black/20 text-slate-300`
- Primary button: `bg-blue-600 text-white`
- Secondary button: `border-white/10 bg-white/5 text-slate-300`
- Input: `border-white/10 bg-black/20 text-white placeholder-slate-600`

### Token substitution map

| Current | Replacement |
|---|---|
| `bg-white/5 backdrop-blur` | `bg-paper-deep` (flat surface, no blur) |
| `border-white/10` | `border-rule` |
| `text-white` | `text-ink` |
| `text-slate-400` | `text-ink-muted` |
| `text-slate-300` | `text-ink-soft` |
| `text-slate-500` | `text-ink-faint` |
| `bg-black/20` | `bg-paper-deep` |
| `bg-blue-600 text-white` (primary button) | `bg-ink text-paper` |
| `border-blue-500 bg-blue-600/20` (active profile) | `border-bengara bg-paper-deep` |
| `placeholder-slate-600` | `placeholder-ink-faint` |
| `focus:border-blue-500` | `focus:border-bengara` |

The outer container `rounded-2xl ... shadow-2xl backdrop-blur` is removed.
The home surface becomes a flat `--paper` background layout, consistent with the
review surface.

The `max-w-sm` constraint on the container may be retained for readability on
larger screens, but the glassmorphism wrapper is removed.

### Copy revision (light)

The current heading "Japanese conversation trainer" and subheading "Select a profile
to continue, or create one below." are functional. A light revision to align with
V2 product voice:

- Callsign: `37NDEST` (retain, already present)
- Heading: "今日の学習" or simply the profile greeting — defer to a later phase
  if the full home redesign is not in scope here
- For this polish pass: update the subheading to use `--ink-muted` Source Serif 4
  italic rather than Inter, to match the V2 warm-greeting tone

This is a minimal copy touch, not a full home redesign.

---

## 7. Settings Surface Token Alignment

### Current state
`SettingsView.tsx` uses V1-era dark styling throughout. Same pattern as HomeView.

### Token substitution

Apply the same substitution map as section 6. Additionally:

Section headers (`text-xs uppercase tracking-widest text-slate-500`):
→ `font-inter text-xs uppercase tracking-widest` with `color: var(--ink-faint)`

List row borders (`border-white/10`):
→ `border-rule`

Row text (`text-slate-300`):
→ `text-ink-soft`

Row subtext (`text-slate-400`, `text-slate-500`):
→ `text-ink-muted`, `text-ink-faint`

Active state buttons (`bg-blue-600 text-white`):
→ `bg-ink text-paper`

Inactive state buttons (`border-white/10 bg-white/5 text-slate-400`):
→ `border-rule bg-paper-deep text-ink-muted`

Date input (`border-white/10 bg-black/20 text-white`):
→ `border-rule bg-paper-deep text-ink`

The `← Back` button:
→ `text-ink-muted` with `hover:text-ink`

The `text-white` heading:
→ `text-ink`

---

## 8. About Section

### Current state
Three lines: app name, "Japanese conversation trainer", and one sentence about
the app being for two users preparing for a mission trip.

### Proposed content

```
37NDEST

A focused Japanese conversation trainer for two people
preparing for a mission trip to Sapporo, Japan.

Built for practical conversational use — not academic completeness.

Version 0.1
```

The version string can be static for now. It signals that the app is versioned
and intentional, not a prototype.

Typography:
- App name: `font-inter font-medium text-sm` `--ink`
- Description lines: `font-source-serif text-xs` `--ink-muted`
- Version: `font-inter text-xs` `--ink-faint`

---

## File-Level Impact

### Files this spec is allowed to touch

| File | Change |
|---|---|
| `src/components/ReviewCard.tsx` | Japanese text size, action button labels, Zone 3 structure |
| `src/app/ReviewView.tsx` | Progress counter removal, exit affordance label |
| `src/app/HomeView.tsx` | Token alignment, light copy revision |
| `src/app/SettingsView.tsx` | Token alignment |

### Files this spec must not touch

| File | Reason |
|---|---|
| `src/features/review/` — all files | Engine logic — no change |
| `src/types/review.ts` | Review types — no change |
| `src/types/content.ts` | Content types — no change |
| `src/db/` | Database layer — no change |
| `src/app/AppShell.tsx` | Navigation structure — no change |
| `src/features/profiles/` | Profile logic — no change |
| `src/features/settings/` | Settings logic — no change |
| `src/styles/globals.css` | Only if a concrete missing token is discovered |
| `data/decks/` | Canonical content — no change |
| Any spec files 001–007 | Prior specs — no change |

---

## Validation Strategy

### Review surface checks
- Japanese text renders at ≥ 3.5rem on both Zone 1 and Zone 2
- Long phrases wrap cleanly at 375px viewport width
- Progress counter is present but visually de-emphasized (`--ink-faint`, ~10px)
- Progress bar is still present and fills correctly
- Exit affordance has a visible label
- Action buttons read "I knew it" and "Not yet"
- "I knew it" records `correct` outcome; "Not yet" records `incorrect` outcome
- Zone 3 example triple renders with "Example" label
- `literal_breakdown` renders with "Word order" label; `→` characters render as-is
- Absent fields produce no empty containers

### Home surface checks
- No `bg-white/5`, `backdrop-blur`, `border-white/10`, `text-white`,
  `text-slate-*`, or `bg-blue-*` utilities remain
- Profile selector and navigation buttons work identically
- Surface uses `--paper` background

### Settings surface checks
- No V1-era dark utilities remain
- Settings behavior is unchanged
- About section contains all four required content elements

### Regression checks
- Session progression behavior unchanged
- Outcome recording unchanged (`correct` / `incorrect` signals)
- `onBack` fires correctly from exit affordance
- Profile selection and creation work correctly on home surface
- All settings save and load correctly
