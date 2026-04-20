# 37NDEST V2 Navigation

## Purpose

This file is the authoritative source for V2 surface structure,
navigation behavior, and information hierarchy. Any agent implementing
screens, routing, or navigation must reference this file.

---

## Four Surfaces. No More.

V2 ships with exactly four surfaces:

1. Today (Home)
2. Review
3. Progress
4. Profile / Settings

Any additional surface is debt and requires explicit approval before
implementation begins. Do not add surfaces speculatively.

---

## Surface Descriptions

### Surface 1: Today (Home)

The heart of the app. The screen opened most often.
This is the mission companion check-in — not a dashboard.

Information hierarchy (top to bottom):
1. Top bar: "37NDEST · 今日" callsign (left), days-to-Sapporo pill (right)
2. Warm greeting: italic Source Serif 4, user's name from active profile
3. Subtitle: Noto Serif JP, --ink-muted
4. Primary session card: eyebrow, card count + time estimate, weighting
   note, "Begin" button (full-width, --ink background)
5. Two mini-cards: Streak (paper-lantern icon + day count in bengara)
   and Known (count / total)
6. Phrase of the day: bengara left border, Japanese, romaji, English,
   category tag
7. "Recently missed" section header with rule line
8. Horizontally scrollable shelf of missed cards
9. Persistent bottom nav

Days-to-Sapporo counter:
- Derives from the stored mission date in profile settings
- Number displayed in --bengara
- If mission date is not set, show a prompt to set it in Profile
- If mission date has passed, display gracefully (do not break)

The Today screen does not contain a mode picker.
Mode is a setting, not a decision point on Home.

### Surface 2: Review

Where 80% of time in the app is spent.
Full-screen. No bottom nav during active review.

Top chrome only:
- Slim progress bar (3px, --ink fill on --paper-deep track) with item count
- Pause affordance (top left) — returns to Today

The pause affordance is not an X. It is framed as "take a breath."
The enso circle icon is preferred for the pause affordance.

Review surface entry:
- From the Today screen "Begin" button (standard session)
- From a recently-missed shelf card tap on Today or Progress
  (focused drill session for that card)
- No other entry points. Review is not entered from arbitrary locations.

Review surface exit:
- Pause button returns to Today
- Session completion leads to Session Summary, which returns to Today

### Surface 3: Progress

Not "stats." Progress — framed around the trip.

Information hierarchy (top to bottom):
1. Top bar: "37NDEST · 進捗" callsign (left), days pill (right)
2. Trip-prep ring: SVG circle, bengara stroke showing percentage,
   center shows percentage and "Trip prep" label
3. Trip readiness sentence: italic Source Serif 4, references 札幌
4. "Mastery" section header with rule line
5. Three mastery cells: Learning (bengara count), Familiar (ink count),
   Strong (matcha count)
6. "This week" section header with rule line
7. Seven weekly session dots (M T W T F S S):
   - Studied: --ink dot
   - Today: --bengara dot with glow ring
   - Unstudied: --paper-deep dot
8. "Needs attention" section header with rule line
9. Horizontally scrollable shelf of weak cards
10. Persistent bottom nav

The Progress screen is framed around trip readiness, not raw metrics.
"You can now recognize 47 of ~200 phrases you'll need in Sapporo"
is more motivating than "47 cards mastered."

Do not add charts, graphs, or analytics-style displays.
Do not add study-history reporting.
Do not add social comparison.

### Surface 4: Profile / Settings

This is where V1's overflow issues live. Collapse ruthlessly.

Four sections maximum:
1. Profile
2. Study preferences (includes review mode preference)
3. Trip pacing (mission date, study intensity)
4. About

Use native-feeling iOS list rows for all sections.
Do not use card pattern in settings — cards waste horizontal space
on mobile and cause the overflow issues already present in V1.

Settings is where review mode preference lives.
Settings is where mission date and study intensity live.
Settings is not a dashboard or reporting surface.

---

## Bottom Navigation

The bottom nav is persistent on Today and Progress surfaces.
It is absent on the Review surface during active review.
It is absent on the Session Summary surface.

Three tabs:
1. Today (house icon)
2. Progress (chart icon)
3. Profile (person icon)

Active tab: --ink color
Inactive tab: --ink-muted color

Font: Inter, 10px, uppercase, letter-spacing 0.08em

---

## Session Summary

The session summary is a transitional surface, not a persistent tab.
It appears after a review session completes and returns to Today.

It is not accessible from the bottom nav.
It is not a persistent destination.

Content:
- Enso circle animation (draws on entry)
- "おつかれさま." heading
- "Thank you for your work." subtitle
- Three stats: Correct / To revisit / New today
- Warm closing sentence referencing Sapporo vocabulary
- "Close" button returns to Today

---

## Navigation Rules

- Review is entered from Today or Progress through explicit
  session or drill actions only
- Review is not entered from arbitrary app locations
- The pause button in Review returns to Today
- Session completion leads to Session Summary, which returns to Today only
- Session Summary is not accessible from the bottom nav
- No browser back-button dependency — the app manages its own state

---

## Routing Implementation Note

V1 uses simple React state switching (no router library). V2 may
retain this approach or introduce a lightweight router if the four-
surface structure requires it. This is an implementation decision to
be made during Phase 1 (layout containment), not a steering decision.
The navigation behavior described above must be preserved regardless
of the routing mechanism chosen.

---

## What This Structure Must Not Become

- No fifth surface without explicit approval
- No modal-heavy navigation patterns that obscure the four-surface model
- No dashboard surfaces
- No analytics or reporting surfaces
- No social or multiplayer surfaces
- No deep settings hierarchies beyond the four sections defined above
