# 008 UX Polish — Requirements

## Purpose

This spec defines a targeted polish pass that sits between Phase 5 (review card
redesign) and the feedback-layer work. It resolves the highest-signal UX issues
discovered in live mobile testing without adding feedback overlays, encouragement
text, haptics, auto-advance, or multiple choice behavior.

This is a specification-only document. No implementation is authorized until this
spec is approved and a task list is created.

---

## Current State Analysis

### Review surface (ReviewView + ReviewCard)

The Phase 5 implementation is structurally correct but has several issues visible
in live mobile use:

**Japanese hero text prominence**
The Japanese text renders at `3rem` (~48px). On a real iPhone screen this reads
smaller than expected — the text is technically at the minimum spec size but does
not feel dominant. The card does not immediately communicate "this is the thing you
are learning." The Japanese needs to be larger and more visually weighted.

**Progress indicator**
The counter reads `1 / 148` in `--ink-muted` Inter at `text-xs`. On a 148-card
deck this is immediately discouraging — the user sees they are at card 1 of 148
before they have even started. The raw fraction communicates scale, not progress.
The format and framing need to change.

**Exit affordance**
The top-left enso icon is visually quiet and has no label. On first use, it is not
obvious that tapping it exits the review session. The `aria-label` reads "Pause and
return to home" but this is not visible. Users may not know how to leave a session.

**Action button clarity**
"Got it" and "Again" are functional but ambiguous on first encounter. "Got it"
could mean "I understand the instructions" rather than "I knew this card." "Again"
is clearer but still requires a moment of interpretation. The intent — self-assessing
whether you knew the card — should be immediately obvious.

**Support content structure (Zone 3)**
The current Zone 3 renders the example triple as three separate lines with no
structural framing. For a card like 私はアメリカ人です, the literal breakdown
"I [topic] → American → am" appears as a plain text string with no visual
connection to the Japanese or the natural English meaning. Users are confused about
what the breakdown is explaining and how it relates to the card.

The current rendering:
```
私はアメリカ人です
watashi wa amerikajin desu
I am American.
────────────────
私はアメリカ人です。  ← example_japanese
watashi wa amerikajin desu.  ← example_romaji
I am American.  ← example_english
I [topic] → American → am  ← literal_breakdown
```

There is no visual structure that helps the user understand:
- which line is the Japanese script
- which line is the pronunciation guide
- which line is the natural meaning
- which line is the structural/grammatical explanation

**literal_breakdown specifically** is the most confusing field. It currently renders
as a plain `--ink-faint` Inter string with no label or framing. A user seeing
"I [topic] → American → am" has no context for what this means or why it is there.

### Home surface (HomeView)

The home surface still uses V1-era glassmorphism styling (`bg-white/5`,
`backdrop-blur`, `border-white/10`, `text-white`, `text-slate-400`). It is visually
disconnected from the V2 review surface which uses the approved design system tokens
(`--paper`, `--ink`, `--bengara`, etc.). The two surfaces feel like different apps.

The "Start review" button uses `bg-blue-600` — a hardcoded Tailwind color that
conflicts with the design system. The profile selector uses `border-blue-500` and
`bg-blue-600/20` for the active state.

The page heading "Japanese conversation trainer" and the supporting copy are
functional but do not reflect the V2 product voice or visual identity.

### Settings surface (SettingsView)

The settings surface uses V1-era dark styling throughout (`text-white`,
`text-slate-300`, `text-slate-400`, `text-slate-500`, `border-white/10`,
`bg-black/20`, `bg-blue-600`). It is visually disconnected from the V2 review
surface.

The About section contains three lines of text and nothing else. It reads as
unfinished rather than intentionally minimal.

The section headers use `text-slate-500` uppercase tracking — functional but not
aligned with the V2 design system.

---

## Scope

### Included

- Japanese hero text size increase on the review card
- Progress indicator format and framing revision
- Exit affordance clarity improvement
- Action button label revision for immediate clarity
- Zone 3 support content structure: labeled comparison layout for the example triple
  and literal_breakdown
- Home surface token alignment (replace V1 glassmorphism with V2 design system)
- Settings surface token alignment (replace V1 dark utilities with V2 design system)
- About section minimum intentional content

### Not included

- Feedback overlay system (color wash, encouragement text, haptics, auto-advance)
- Multiple choice mode
- Session summary redesign
- Progress surface implementation
- Bucket-writing logic
- Trip-phase weighting
- Engine or session logic changes
- Deck schema changes
- New surfaces or navigation changes
- Profile management implementation

---

## Requirements

### R1. Japanese hero text must be visually dominant on the review card

The Japanese text in Zone 1 (recognition) and Zone 2 (production reveal) must be
large enough to feel like the primary object of study — not just a large label.

The current `3rem` is the minimum. This spec requires increasing it to at least
`3.5rem` (56px) and applying a font-weight that gives the text visual mass without
distorting the Noto Serif JP letterforms.

The text must remain legible on small screens (iPhone SE viewport width ~375px).
Line wrapping is acceptable for longer phrases; the text must not overflow or clip.

### R2. The progress indicator must be de-emphasized, not removed

The current `1 / 148` format in `--ink-muted` Inter `text-xs` is too prominent
and immediately communicates the total deck size, which is discouraging at the
start of a session. The indicator must be retained but visually de-emphasized so
it is secondary to the progress bar.

Required changes:
- Reduce typography to a size smaller than `text-xs` (e.g. `0.65rem` or `10px`)
- Change color from `--ink-muted` to `--ink-faint`
- The counter remains in the top-right position
- The progress bar remains the primary progress signal

The format `{position} / {total}` may be retained as-is. The goal is to make it
feel like a quiet reference rather than a prominent metric. A user who wants to
know where they are can glance at it; a user who finds it discouraging will not
have it competing for attention.

### R3. The exit affordance must be explicitly understandable

The enso icon alone is not sufficient for first-time users to understand that
tapping it exits the review session. The affordance must be revised to make the
exit action clear without adding heavy chrome.

Acceptable approaches:
- Add a small text label below or beside the icon (e.g. "Exit" or "Leave")
- Replace the enso with a more universally understood exit icon (e.g. ✕ or ←)
  while retaining the enso as a decorative element elsewhere
- Add a visible tooltip or label that appears on first use

The chosen approach must not add visual weight that competes with the card content.

### R4. Action button labels must communicate self-assessment intent immediately

"Got it" and "Again" must be revised so that a first-time user immediately
understands they are self-assessing whether they knew the card — not confirming
an instruction or requesting a repeat.

The revised labels must:
- communicate the self-assessment nature of the action
- remain short (1–3 words)
- remain consistent with the warm, non-punishing product voice
- map to the same `correct` / `incorrect` outcome signals as before

Candidate label pairs (for approval, not mandated here):
- "I knew it" / "Still learning"
- "Knew it" / "Not yet"
- "Got it" / "Not yet" (minimal change)

The final label pair must be decided before implementation.

### R5. Zone 3 support content must use a labeled comparison structure

When enriched support fields are present, Zone 3 must render them in a structure
that makes the relationship between fields immediately clear.

**Example triple (example_japanese / example_romaji / example_english)**

The three lines must be visually grouped as a unit. Each line must have a clear
typographic role:
- `example_japanese`: primary, Noto Serif JP, `--ink-soft`
- `example_romaji`: secondary pronunciation guide, italic Source Serif 4, `--ink-muted`
- `example_english`: natural meaning, Source Serif 4, `--ink-muted`

The grouping must make it clear these three lines are one example, not three
separate pieces of information.

**literal_breakdown**

The `literal_breakdown` field must not render as a bare string. It must be
preceded by a small label that frames what it is. Arrow formatting using `→` is
the approved format for showing word-order relationships:

```
Word order:  I [topic] → American → am
```

The `→` characters in the breakdown content are rendered as-is from the stored
field value — they are not added by the rendering layer. The rendering layer adds
only the "Word order:" label prefix.

The label must be visually distinct from the breakdown content (Inter small caps
or `--ink-faint` label preceding the breakdown text).

**When fields are absent**

- If the example triple is absent: no example section renders. No empty container.
- If `literal_breakdown` is absent: no breakdown section renders. No empty container.
- If `usage_note` is absent: no usage section renders. No empty container.
- Unenriched cards must render cleanly with no visible gaps.

### R6. The home surface must use V2 design system tokens

The home surface must replace all V1-era glassmorphism styling with V2 design
system tokens. Specifically:

- Background: `--paper` (not `bg-white/5 backdrop-blur`)
- Primary text: `--ink` (not `text-white`)
- Secondary text: `--ink-muted` (not `text-slate-400`)
- Borders: `--rule` (not `border-white/10`)
- Primary action button: `--ink` background, `--paper` text (not `bg-blue-600`)
- Active profile indicator: `--bengara` accent (not `border-blue-500`)
- Card/container: no glassmorphism; use `--paper-deep` surface or flat layout

The home surface copy and structure may be lightly revised to align with V2 product
voice, but this is not a full home screen redesign. The profile selector, create
form, and navigation buttons must remain functionally identical.

### R7. The settings surface must use V2 design system tokens

The settings surface must replace all V1-era dark styling with V2 design system
tokens, following the same token substitution pattern as R6.

Section headers must use `--ink-muted` Inter small caps or equivalent — not
`text-slate-500`.

The list-row pattern already in place must be preserved. No structural changes to
the settings layout are required beyond token alignment.

### R8. The About section must feel intentional

The About section must contain enough content to feel considered rather than
placeholder-like. Minimum content:

- App name: 37NDEST
- One-line description of purpose
- Version or build reference (even if static for now)
- A brief note about the mission context (one sentence)

The About section must not become a marketing surface. It should feel like a
quiet, honest statement of what the app is and who it is for.

---

## Acceptance Criteria

### AC1. Japanese hero text
- Japanese text in Zone 1 (recognition) renders at minimum `3.5rem`
- Japanese text in Zone 2 (production reveal) renders at minimum `3.5rem`
- Text does not overflow or clip on iPhone SE viewport (375px width)
- Long phrases wrap cleanly

### AC2. Progress indicator
- The counter is retained but visually de-emphasized
- Counter typography is smaller than `text-xs` and uses `--ink-faint`
- The progress bar remains the primary progress signal
- The counter is visually secondary to the bar

### AC3. Exit affordance
- A first-time user can identify the exit action without prior instruction
- The affordance does not add visual weight that competes with card content
- Tapping the affordance still calls `onBack` (behavior unchanged)

### AC4. Action button labels
- A first-time user immediately understands the buttons are for self-assessment
- Labels are 1–3 words
- Labels map to the same `correct` / `incorrect` outcome signals
- Labels are consistent with the warm, non-punishing product voice

### AC5. Zone 3 structure
- Example triple renders as a visually grouped unit
- `literal_breakdown` renders with a framing label
- Absent fields produce no empty containers or visual gaps
- Unenriched cards render cleanly

### AC6. Home surface tokens
- No `bg-white/5`, `backdrop-blur`, `border-white/10`, `text-white`,
  `text-slate-*`, or `bg-blue-*` utilities remain in HomeView
- All colors use V2 design system tokens
- Profile selector and navigation buttons remain functionally identical

### AC7. Settings surface tokens
- No V1-era dark utilities remain in SettingsView
- All colors use V2 design system tokens
- Settings structure and behavior are unchanged

### AC8. About section
- About section contains app name, purpose, version reference, and mission context
- Content feels considered, not placeholder-like
- Section does not exceed 4–5 lines of content

---

## Risks

1. **Japanese text wrapping on long phrases** — increasing to `3.5rem` or larger
   may cause long phrases (e.g. 4–5 kanji compounds) to wrap awkwardly. Line-height
   and container padding must be tested on actual device widths.

2. **Progress indicator format requires session size confirmation** — the preferred
   format (session-relative counter) requires confirming what `selectSessionItems`
   returns for a typical session. If the session size is always the full deck, the
   counter approach does not help and the bar-only approach is preferred.

3. **Action label change affects user muscle memory** — if users have already formed
   habits around "Got it" / "Again", changing the labels mid-use may cause brief
   confusion. The change should be clean and the new labels should be unambiguous
   enough to self-explain.

4. **Home surface redesign scope creep** — R6 is a token alignment pass, not a
   redesign. The risk is that touching HomeView invites broader layout changes.
   The spec explicitly limits this to token substitution and light copy revision.

5. **literal_breakdown label wording** — "Word order" and "Structure" are both
   reasonable labels but neither is perfect for all card types. The label must be
   chosen before implementation and applied consistently.
