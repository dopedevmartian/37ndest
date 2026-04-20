// src/components/ReviewCard.tsx
//
// V2 review card — three-zone card hierarchy for 37NDEST.
// Zone 1: primary prompt (always visible)
// Zone 2: reveal content (animates in on reveal)
// Zone 3: inline support content (shown after reveal when enriched fields present)
//
// Pure rendering component — no session state, no engine calls.
// Direction defaults to recognition unconditionally in Phase 5.
// distractors field is ignored entirely in this phase.

import type { SessionItem } from "../types/review";

// Category display label mapping — internal taxonomy → V2 display labels.
const CATEGORY_DISPLAY: Record<string, string> = {
  relationship:         "greetings",
  foundation:           "foundation",
  navigation_survival:  "travel",
  ministry:             "church",
};

function getCategoryLabel(category: string | undefined): string | null {
  if (!category) return null;
  return CATEGORY_DISPLAY[category] ?? category;
}


export type ReviewCardProps = {
  item: SessionItem;
  revealed: boolean;
  onReveal: () => void;
  onGotIt: () => void;
  onAgain: () => void;
};

export function ReviewCard({ item, revealed, onReveal, onGotIt, onAgain }: ReviewCardProps) {
  const note = item.note;
  const isRecognition = item.direction === "recognition";
  const categoryLabel = getCategoryLabel(note.category);

  // Zone 3 presence check — example triple requires all three fields.
  const hasExampleTriple =
    Boolean(note.example_japanese) &&
    Boolean(note.example_romaji) &&
    Boolean(note.example_english);
  const hasZone3 = hasExampleTriple || Boolean(note.usage_note) || Boolean(note.literal_breakdown);

  return (
    <div className="flex flex-col flex-1 px-6 pt-6 pb-8">

      {/* ── Zone 1: Primary Prompt ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center">

        {isRecognition ? (
          /* Recognition: category chip + Japanese hero */
          <div className="text-center">
            {categoryLabel && (
              <span
                className="inline-block mb-4 px-3 py-1 rounded-full border text-xs font-medium font-inter tracking-wide uppercase"
                style={{ borderColor: "var(--rule)", color: "var(--ink-muted)" }}
              >
                {categoryLabel}
              </span>
            )}
            <p
              className="font-noto-serif-jp leading-tight"
              style={{ fontSize: "3rem", color: "var(--ink)" }}
            >
              {note.japanese}
            </p>
          </div>
        ) : (
          /* Production (scaffolded): English + romaji pre-reveal.
             Romaji shown pre-reveal intentionally as approved beginner scaffolding. */
          <div className="text-center">
            <p
              className="font-source-serif text-2xl leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {note.english}
            </p>
            <p
              className="mt-2 font-source-serif italic text-base"
              style={{ color: "var(--ink-muted)" }}
            >
              {note.romaji}
            </p>
          </div>
        )}

        {/* ── Pre-reveal tap affordance ─────────────────────────────────── */}
        {!revealed && (
          <button
            onClick={onReveal}
            aria-label="Tap to reveal answer"
            className="mt-10 flex flex-col items-center gap-2 w-full focus:outline-none"
          >
            <span
              className="tap-hint-pulse font-inter text-sm"
              style={{ color: "var(--ink-faint)" }}
            >
              Tap anywhere to reveal
            </span>
          </button>
        )}
      </div>

      {/* ── Zone 2: Reveal Content ─────────────────────────────────────── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: revealed ? "600px" : "0",
          opacity: revealed ? 1 : 0,
          transition: "max-height 250ms ease-in-out, opacity 250ms ease-in-out",
        }}
      >
        {/* Bengara divider */}
        <div
          className="my-5 mx-auto"
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: "var(--bengara)",
            borderRadius: "1px",
          }}
        />

        {isRecognition ? (
          /* Recognition reveal: English meaning + romaji + simple_explanation */
          <div className="text-center space-y-2">
            <p
              className="font-source-serif text-xl leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {note.english}
            </p>
            <p
              className="font-source-serif italic text-base"
              style={{ color: "var(--ink-muted)" }}
            >
              {note.romaji}
            </p>
            {note.simple_explanation && (
              <p
                className="font-source-serif text-base mt-3"
                style={{ color: "var(--ink-muted)" }}
              >
                {note.simple_explanation}
              </p>
            )}
          </div>
        ) : (
          /* Production reveal: Japanese hero + romaji */
          <div className="text-center space-y-2">
            <p
              className="font-noto-serif-jp leading-tight"
              style={{ fontSize: "3rem", color: "var(--ink)" }}
            >
              {note.japanese}
            </p>
            <p
              className="font-source-serif italic text-base"
              style={{ color: "var(--ink-muted)" }}
            >
              {note.romaji}
            </p>
          </div>
        )}

        {/* ── Zone 3: Inline Support Content ───────────────────────────── */}
        {hasZone3 && (
          <div
            className="mt-5 pt-4 space-y-3 text-sm"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            {/* Example triple — all three or none */}
            {hasExampleTriple && (
              <div className="space-y-1">
                <p
                  className="font-noto-sans-jp text-sm"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {note.example_japanese}
                </p>
                <p
                  className="font-source-serif italic text-xs"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {note.example_romaji}
                </p>
                <p
                  className="font-source-serif text-xs"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {note.example_english}
                </p>
              </div>
            )}

            {/* usage_note */}
            {note.usage_note && (
              <p
                className="font-source-serif italic text-xs"
                style={{ color: "var(--ink-muted)" }}
              >
                {note.usage_note}
              </p>
            )}

            {/* literal_breakdown */}
            {note.literal_breakdown && (
              <p
                className="font-inter text-xs"
                style={{ color: "var(--ink-faint)" }}
              >
                {note.literal_breakdown}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Post-reveal actions ────────────────────────────────────────── */}
      {revealed && (
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onGotIt}
            className="w-full py-4 rounded-2xl font-inter font-medium text-base transition-opacity active:opacity-80"
            style={{
              backgroundColor: "var(--ink)",
              color: "var(--paper)",
              borderRadius: "var(--radius)",
            }}
          >
            Got it
          </button>
          <button
            onClick={onAgain}
            className="w-full py-4 font-inter font-medium text-base border transition-opacity active:opacity-80"
            style={{
              color: "var(--coral)",
              borderColor: "var(--coral-soft)",
              backgroundColor: "var(--paper)",
              borderRadius: "var(--radius)",
            }}
          >
            Again
          </button>
        </div>
      )}
    </div>
  );
}
