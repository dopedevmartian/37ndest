# 010 Progress Dashboard — Polish

## Purpose

Small copy and tone improvements to the existing Progress screen.
No layout changes. No data model changes. No new logic.

---

## Problems with the Current Screen

1. **Section labels are generic.** "Overall", "Confidence", "By category" are
   functional but cold. They read like a spreadsheet header, not a companion
   check-in.

2. **No encouraging tone.** The screen shows numbers but says nothing warm about
   what they mean. A learner who has reviewed 30 cards has no sense of whether
   that is good progress.

3. **No "currently working on" signal.** The category bars are sorted by reviewed
   count, but there is no visual or textual indicator of which category the learner
   is most actively working through right now. The top category is implicitly the
   most active, but nothing makes that explicit.

---

## Requirements

### R1. Replace generic section labels with warmer, mission-framed language

Current → Replacement:

| Current | Replacement |
|---|---|
| Overall | Your journey |
| Confidence | How it's going |
| By category | Where you're working |

Labels remain small, uppercase, Inter — only the text changes.

### R2. Add a one-line encouraging sentence below the overall bar

When `reviewedCount > 0`, show a single warm sentence below the "X of Y cards
reviewed" label. The sentence is chosen based on progress fraction:

| Condition | Sentence |
|---|---|
| `reviewedCount / totalCards < 0.25` | "You're getting started. Every card counts." |
| `reviewedCount / totalCards < 0.5` | "Good momentum. Keep going." |
| `reviewedCount / totalCards < 0.75` | "More than halfway. Sapporo is getting closer." |
| `reviewedCount / totalCards >= 0.75` | "Almost there. You've put in real work." |

When `reviewedCount === 0`, no sentence is shown (the existing empty-state prompt
handles that case).

The sentence uses Source Serif 4, italic, `--ink-faint`, same size as the count
label. It sits directly below the count label with a small top margin (`mt-1`).

### R3. Mark the top category as "currently working on"

The category list is already sorted by reviewed count descending. The first category
in the list (highest reviewed count) is the one the learner has worked on most.

Add a small inline label — "active" — next to the top category's name when
`reviewedCount > 0` and there is at least one category with reviewed cards.

The label style:
- Inter, 0.6rem, uppercase, letter-spacing 0.08em
- `--bengara` color
- Displayed inline after the category name with a small left margin

No other categories receive this label. If all categories have zero reviewed cards,
no label is shown.

---

## Copy Guidance

### Tone

- Warm but not effusive. "Good momentum." not "Amazing work!!!"
- Mission-aware. Reference Sapporo when it fits naturally — not on every line.
- Brief. One sentence maximum per encouragement. No paragraphs.
- Honest. Do not overclaim. "Getting started" is not a failure — it is a beginning.

### What to avoid

- Percentages in the encouragement sentence (the bar already shows proportion)
- Exclamation points
- Generic productivity language ("You're crushing it", "Keep up the streak")
- Anything that implies punishment for not studying

---

## Acceptance Criteria

### AC1. Section labels
- "Overall" → "Your journey"
- "Confidence" → "How it's going"
- "By category" → "Where you're working"
- Label style (Inter, uppercase, `--ink-faint`) unchanged

### AC2. Encouraging sentence
- Correct sentence shown for each of the four progress bands
- Sentence uses Source Serif 4, italic, `--ink-faint`
- No sentence shown when `reviewedCount === 0`
- No sentence shown when `totalCards === 0`

### AC3. Active category label
- "active" label appears next to the top category when `reviewedCount > 0`
- Label uses `--bengara` color, Inter, small uppercase
- No other categories receive the label
- Label absent when all categories have zero reviewed cards

### AC4. No structural changes
- Layout structure unchanged
- Data model unchanged
- Confidence logic unchanged
- Category calculation unchanged
- No new sections added
- No charts or graphs introduced
