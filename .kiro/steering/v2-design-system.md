# 37NDEST V2 Design System

## Purpose

This file is the authoritative source for V2 visual identity decisions.
Any agent making a visual decision must reference this file.

The design system authority flows from the V2 specification and the CSS
token set. Tailwind may consume these tokens, but Tailwind is not the
authority. If a Tailwind utility class conflicts with the design system,
the design system wins.

The visual reference for all UI work is the approved mockup:
37ndest-v2-mockup.html. When in doubt, the mockup is the ground truth.

---

## Visual Direction

Primary: washi paper + sumi ink.
The app should feel like a well-made study journal — quiet confidence,
not productivity software. Warm, personal, mission-focused.

Dark mode: "reading by lamplight."
Deep indigo background, warm cream text. Not pure black. Not blue-gray.

---

## Color Tokens

All colors are defined as CSS custom properties. Use token names in all
code — never hardcode hex values.

### Light mode

| Token           | Value     | Purpose                                      |
|-----------------|-----------|----------------------------------------------|
| --paper         | #F5EFE4   | Primary background                           |
| --paper-deep    | #ECE4D3   | Card surfaces, input backgrounds             |
| --paper-shadow  | #D9CFB8   | Deepest shadow layer                         |
| --ink           | #1F1C18   | Primary text, primary button fill            |
| --ink-soft      | #3A352E   | Secondary headings                           |
| --ink-muted     | #6E655A   | Labels, secondary text                       |
| --ink-faint     | #A39989   | "Tap to reveal" hint, placeholder text       |
| --bengara       | #B84A39   | Accent — days counter, streak, active state  |
| --bengara-soft  | #D98A7B   | Bengara tints                                |
| --matcha        | #6B7A4A   | Correct feedback text and border             |
| --matcha-soft   | #C5CFA9   | Correct feedback wash background             |
| --coral         | #C9715E   | Incorrect feedback text and border           |
| --coral-soft    | #E8C8BF   | Incorrect feedback wash background           |
| --rule          | #CFC3AB   | Borders, dividers                            |

### Dark mode (prefers-color-scheme: dark)

| Token           | Value     |
|-----------------|-----------|
| --paper         | #1A1D2E   |
| --paper-deep    | #14172A   |
| --paper-shadow  | #0F1121   |
| --ink           | #F1E8D6   |
| --ink-soft      | #D8CDB7   |
| --ink-muted     | #928A79   |
| --ink-faint     | #5A5445   |
| --bengara       | #D9735F   |
| --bengara-soft  | #8A3A2D   |
| --matcha        | #A8B37D   |
| --matcha-soft   | #3D4529   |
| --coral         | #D88A77   |
| --coral-soft    | #4A2A22   |
| --rule          | #2D3048   |

---

## Typography

Four fonts. Four roles. Do not mix roles.

| Font             | Role                  | Notes                                          |
|------------------|-----------------------|------------------------------------------------|
| Noto Serif JP    | Japanese display      | Minimum 48pt on review cards. Hard rule.       |
| Noto Sans JP     | Japanese body         | Japanese text outside the review card hero     |
| Source Serif 4   | Latin body copy       | Greetings, meanings, summaries, italic prose   |
| Inter            | UI chrome only        | Labels, buttons, nav, chips — not body copy    |

Inter is never used for body copy.
Source Serif 4 is never used for UI chrome.
Noto Serif JP is never used below 48pt on the review card.

### Font delivery

Noto Serif JP must be subsetted to only the characters present in the
canonical deck. Full font is ~5MB. Subsetting cuts this by ~90%.
Subsetting runs as a build step — not a manual operation.
Use font-display: swap so the app renders immediately offline.

---

## Gradients and Texture

Gradients are used intentionally in V2. The distinction is:

### Approved gradient uses

- Paper texture: layered radial gradients (bengara and matcha tints at
  ~3% opacity) plus a repeating linear gradient for paper grain.
  Applied to the body background. Subtle — not heavy.
- Primary session card: linear gradient from --paper to --paper-deep.
- Phrase of the day: diagonal gradient combining bengara and matcha
  tints at low opacity with a bengara left border.
- Feedback color washes: linear gradient from transparent to
  --matcha-soft (correct) or --coral-soft (incorrect), animating
  from the bottom of the card.

### Prohibited gradient uses

- Neon or glow gradients
- Decorative multi-color gradients
- Any gradient that reads as "modern SaaS UI"

---

## Motion

- All CSS transitions: under 300ms.
- Feedback overlay hold period: ~1.2 seconds (this is intentional, not
  a transition — the transition in and out are each under 300ms).
- Reveal animation: opacity + max-height transition.
- Enso circle on session summary: stroke-dashoffset animation, ~1.8s.
- "Tap to reveal" pulse: opacity oscillates over 2.4s.
- Avoid playful, dramatic, or attention-seeking motion.
- Use restrained easing only. Warmth, not drama.

---

## Visual Treatment

The V2 visual language is ink on paper — not frosted glass.

Avoid glassmorphism-style treatment on any surface.
Avoid frosted-glass card aesthetics.
Avoid blur as a primary visual language.
Subtle blur effects are not categorically banned but require explicit
approval and must not read as glassmorphism.

---

## Iconography

- Paper lantern: streak indicator
- Torii gate: trip milestones
- Enso (zen circle): pause button, session completion
- Hand-drawn feel, not geometric
- Simple line icons with slight imperfection

---

## Radius Tokens

| Token        | Value |
|--------------|-------|
| --radius-sm  | 10px  |
| --radius     | 16px  |
| --radius-lg  | 22px  |

---

## Mobile Constraints

- Primary target: iPhone (iOS Safari, installed PWA)
- All interactive targets must be thumb-reachable
- Review card Japanese text: minimum 48pt, no exceptions
- Settings surface: list-row pattern, not card pattern
- MC options: stacked vertically, not grid

---

## Explicit Prohibitions

- Cherry blossoms. Zero. None.
- Anime styling
- Kanji-as-decoration wallpaper patterns
- Glassmorphism and frosted-glass card aesthetics
- Neon or glow effects
- Red (use coral for errors, matcha for correct)
- Modern decorative gradients
- Rounded-corner card pattern in settings

---

## Romaji as Presentation Logic

Romaji visibility is determined by review mode and context.
It is not a global always-on rule.
See v2-interaction-model.md for mode-specific romaji behavior.
