# 37NDEST V2 Interaction Model

## Purpose

This file is the authoritative source for V2 review mode behavior,
feedback system, romaji presentation logic, and interaction philosophy.
Any agent implementing review modes, feedback, or card interaction must
reference this file.

---

## Core Philosophy

The app is a patient teacher, not a quiz.

Wrong answers reveal the correct one immediately.
No punishment. No lives. No streaks-broken shame.
No "try again" loops.

This single philosophy is the biggest difference between
"Japanese flashcard app" and "mission companion."

---

## Three Review Modes

### Mode 1: Reveal

The existing V1 mode, refined.

Pre-reveal state:
- Japanese text displayed large (Noto Serif JP, minimum 48pt)
- Category chip above
- "Tap anywhere to reveal" hint pulses gently below
- The entire lower half of the card area is tappable — not just the hint

On reveal:
- Meaning zone animates into view (opacity + max-height transition)
- A short bengara divider line appears above the meaning
- Meaning text appears in Source Serif 4
- Romaji appears as a secondary muted line in italic Source Serif 4
  in --ink-muted color
- "See example" chip appears for progressive disclosure

Romaji in reveal mode:
- Romaji is secondary scaffolding — it appears after reveal, not before
- It is muted (--ink-muted) to signal it is support, not the primary cue
- This is a mode-specific rule, not a global always-on rule

Post-reveal actions:
- "Got it" button: --ink background (filled), --paper text
- "Again" button: --coral text, --coral-soft border, --paper background
- Actions appear only after reveal — hidden before

### Mode 2: Multiple Choice Forward (JP → meaning)

Japanese text displayed large at top (Noto Serif JP, review card scale).
Category chip above.

Three meaning options stacked vertically (not grid — better thumb reach).
Each option shows:
- Romaji in italic Source Serif 4 (romaji is part of the option text
  in this mode — it helps the learner connect sound to meaning)
- English meaning below in smaller --ink-muted text

On tap:
- Correct: option receives --matcha-soft background, --matcha border
- Wrong: option receives --coral-soft background, --coral border;
  correct option is revealed with --matcha border (2px) immediately
- All options are disabled after any tap
- Feedback overlay appears
- Auto-advances after ~1.4 seconds

Romaji in MC forward mode:
- Romaji is part of each option's display text
- It helps beginners connect the Japanese they see to the sound
- This is a mode-specific rule

### Mode 3: Multiple Choice Reverse (romaji → JP)

Romaji displayed as the primary cue at top in italic Source Serif 4.
English meaning displayed below in --ink-muted.

Three Japanese options stacked vertically.
Each option shows Japanese text in Noto Serif JP at minimum 24pt
(32pt preferred for readability on small screens).

Same correct/incorrect feedback pattern as MC forward.
Same auto-advance and disable-after-tap behavior.

Romaji in MC reverse mode:
- Romaji is the primary cue — it is what the user is being tested on
- This is a mode-specific rule

---

## Romaji as Presentation Logic

Romaji visibility and placement are determined by review mode and
context. Romaji is learning scaffolding, not a universal always-on rule.

Summary by mode:
- Reveal mode: secondary muted line, appears after reveal only
- MC forward: part of each option's text (connects sound to meaning)
- MC reverse: primary cue at top (the thing being tested)
- Future modes: romaji behavior must be defined per mode

Do not implement romaji as a global always-visible element.
Do not implement romaji as a global always-hidden element.
Romaji behavior belongs in the mode's rendering logic.

---

## Feedback and Encouragement System

### Timing

- Feedback overlay appears immediately on answer
- Overlay is visible for ~1.2 seconds
- Overlay fades out over ~300ms
- Auto-advance to next card follows fade-out
- Total time from answer to next card: ~1.5 seconds

### Color washes

Correct: linear gradient from transparent to --matcha-soft,
  animating from the bottom of the card.
Incorrect: linear gradient from transparent to --coral-soft,
  animating from the bottom of the card.

Red is never used. --coral is the incorrect color. Always.

### Feedback text

Feedback text appears in a pill:
- Font: Noto Serif JP
- Correct text color: --matcha
- Incorrect text color: --coral
- Background: --paper with warm shadow
- Animates in with a slight scale-up (0.9 → 1.0)

### Encouragement library

The library is data-driven — not hardcoded inline in rendering logic.

Correct responses (warm, varied — rotate randomly):
- "ええ!"
- "Nice."
- "You've got this."
- "Feels familiar now, doesn't it?"
- "いいね."
- "上手!"
- "がんばって" — use only after 3+ consecutive correct answers,
  so it feels earned

Incorrect responses (gentle, never scolding — rotate randomly):
- "Not this time."
- "Close — we'll see it again."
- "It's a tricky one."
- "もう一度."

Session milestone messages:
- "Halfway."
- "Last three."
- "Done. You added N new phrases today."

Japanese encouragement phrases (ええ!, いいね., がんばって, もう一度.)
should be introduced gradually — not on the first session. Once the
user has seen them taught, they can appear in rotation. This creates
a "the app is teaching me in Japanese" feeling.

### Haptic feedback

Correct: navigator.vibrate(10)
Incorrect: navigator.vibrate([10, 40, 10])

Feature-detect at call time. Fall back silently when unavailable.
Do not assume the Vibration API exists.
Test on an actual installed PWA on iPhone before considering complete —
iOS Safari support has historically been inconsistent.

---

## Session Milestone Micro-Moments

These appear at specific points during a session:
- Halfway point: "Halfway."
- Three cards remaining: "Last three."
- Session complete (before summary screen): "Done. You added N new
  phrases today."

Milestone messages use the encouragement library.
They are brief and do not block session flow.

---

## Mode Selection

Review mode is a profile preference, not a per-session decision point.
Mode selection lives in the Profile/Settings surface.
The Today screen does not present a mode picker.
The spec is explicit: "mode is a setting, not a decision point on Home."

Cards without distractors populated are excluded from MC modes
gracefully. The session falls back to reveal mode for those cards.

---

## What This Model Must Not Become

- No SRS (spaced repetition scheduling with intervals and ease factors)
- No punishment mechanics (lives, streaks-broken shame, score penalties)
- No "try again" loops on wrong answers
- No gamification layers (badges, leaderboards, XP)
- No pronunciation scoring
- No social comparison
