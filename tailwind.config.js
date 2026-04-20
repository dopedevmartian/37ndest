/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // ── V2 Design Token Colors ──────────────────────────────────────────
      // CSS custom properties are the authority. These Tailwind extensions
      // expose ergonomic token-backed utilities (e.g. bg-paper, text-ink).
      // Arbitrary-value classes (bg-[var(--paper)]) are a fallback, not
      // the preferred path.
      //
      // Note: Tailwind opacity modifiers (e.g. bg-paper/50) do not work
      // with CSS custom property references at build time. Use explicit
      // rgba values or inline styles for opacity variants.
      colors: {
        paper:        "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        "paper-shadow": "var(--paper-shadow)",

        ink:          "var(--ink)",
        "ink-soft":   "var(--ink-soft)",
        "ink-muted":  "var(--ink-muted)",
        "ink-faint":  "var(--ink-faint)",

        bengara:      "var(--bengara)",
        "bengara-soft": "var(--bengara-soft)",

        matcha:       "var(--matcha)",
        "matcha-soft": "var(--matcha-soft)",

        coral:        "var(--coral)",
        "coral-soft": "var(--coral-soft)",

        rule:         "var(--rule)",
      },
      // ── V2 Font Families ────────────────────────────────────────────────
      fontFamily: {
        // Japanese display — review card hero, minimum 48pt
        "noto-serif-jp": ["'Noto Serif JP'", "serif"],
        // Japanese body — Japanese text outside the review card hero
        "noto-sans-jp":  ["'Noto Sans JP'", "sans-serif"],
        // Latin body copy — greetings, meanings, summaries, italic prose
        "source-serif":  ["'Source Serif 4'", "Georgia", "serif"],
        // UI chrome only — labels, buttons, nav, chips
        "inter":         ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
