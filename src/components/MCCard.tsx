// src/components/MCCard.tsx
//
// Multiple choice review card for 37NDEST spec 009.
// Parallel component to ReviewCard — does not modify ReviewCard.
//
// Zone 1: Japanese prompt (category chip + hero text) — same as ReviewCard.
// Zone 2: 4 stacked choice buttons replacing the reveal area.
// Zone 3: deferred (not shown during MC interaction).
//
// MCCard manages its own interaction state (selected choice, feedback phase).
// onOutcome is called once immediately when a choice is tapped.
// onContinue is called when the user taps "Continue" after feedback.

import { useState } from "react";
import type { SessionItem } from "../types/review";
import type { MCChoice } from "../features/review/mcChoices";

// Category display label mapping — mirrors ReviewCard.
const CATEGORY_DISPLAY: Record<string, string> = {
  relationship:        "greetings",
  foundation:          "foundation",
  navigation_survival: "travel",
  ministry:            "church",
};

function getCategoryLabel(category: string | undefined): string | null {
  if (!category) return null;
  return CATEGORY_DISPLAY[category] ?? category;
}

export type MCCardProps = {
  item: SessionItem;
  /** 4 pre-shuffled choices from buildMCChoices(). */
  choices: MCChoice[];
  /** Called once immediately when a choice is tapped. */
  onOutcome: (outcome: "correct" | "incorrect") => void;
  /** Called when the user taps "Continue" after feedback. */
  onContinue: () => void;
};

type MCPhase = "choosing" | "feedback";

export function MCCard({ item, choices, onOutcome, onContinue }: MCCardProps) {
  const note = item.note;
  const [phase, setPhase] = useState<MCPhase>("choosing");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const category          = typeof note.category           === "string" ? note.category           : undefined;
  const romaji            = typeof note.romaji             === "string" ? note.romaji             : undefined;
  const simpleExplanation = typeof note.simple_explanation === "string" ? note.simple_explanation : undefined;
  const exampleJapanese   = typeof note.example_japanese   === "string" ? note.example_japanese   : undefined;
  const exampleRomaji     = typeof note.example_romaji     === "string" ? note.example_romaji     : undefined;
  const exampleEnglish    = typeof note.example_english    === "string" ? note.example_english    : undefined;

  const categoryLabel = getCategoryLabel(category);
  const hasExampleTriple = Boolean(exampleJapanese) && Boolean(exampleRomaji) && Boolean(exampleEnglish);

  function handleChoiceTap(index: number) {
    if (phase !== "choosing") return;
    const choice = choices[index];
    setSelectedIndex(index);
    setPhase("feedback");
    onOutcome(choice.isCorrect ? "correct" : "incorrect");
  }

  // Determine visual state for each choice button in feedback phase.
  function choiceStyle(index: number): React.CSSProperties {
    if (phase === "choosing") {
      return {
        backgroundColor: "var(--paper-deep)",
        border: "1.5px solid var(--rule)",
        color: "var(--ink)",
        borderRadius: "var(--radius)",
      };
    }
    const choice = choices[index];
    const isSelected = index === selectedIndex;

    if (isSelected && choice.isCorrect) {
      // Selected correct
      return {
        backgroundColor: "var(--matcha-soft)",
        border: "2px solid var(--matcha)",
        color: "var(--ink)",
        borderRadius: "var(--radius)",
      };
    }
    if (isSelected && !choice.isCorrect) {
      // Selected incorrect
      return {
        backgroundColor: "var(--coral-soft)",
        border: "2px solid var(--coral)",
        color: "var(--ink)",
        borderRadius: "var(--radius)",
      };
    }
    if (!isSelected && choice.isCorrect) {
      // Correct answer revealed (not selected)
      return {
        backgroundColor: "var(--matcha-soft)",
        border: "1px dashed var(--matcha)",
        color: "var(--ink-muted)",
        borderRadius: "var(--radius)",
      };
    }
    // Disabled unchosen
    return {
      backgroundColor: "var(--paper-deep)",
      border: "1.5px solid var(--rule)",
      color: "var(--ink-faint)",
      borderRadius: "var(--radius)",
    };
  }

  return (
    <div className="flex flex-col flex-1 px-6 pt-8 pb-8">

      {/* ── Zone 1: Japanese prompt ────────────────────────────────────── */}
      <div className="flex flex-col items-center pb-4">
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
            className="font-noto-serif-jp"
            style={{ fontSize: "3.75rem", lineHeight: 1.3, color: "var(--ink)" }}
          >
            {note.japanese}
          </p>
          {/* Romaji — shown after selection only */}
          {phase === "feedback" && romaji && (
            <p
              className="mt-2 font-source-serif italic text-base"
              style={{ color: "var(--ink-muted)" }}
            >
              {romaji}
            </p>
          )}
        </div>
      </div>

      {/* ── Post-answer learning reveal ────────────────────────────────── */}
      {phase === "feedback" && (simpleExplanation || hasExampleTriple) && (
        <div
          className="mb-4 space-y-3"
          style={{ borderTop: "1px solid var(--rule)", paddingTop: "0.75rem" }}
        >
          {simpleExplanation && (
            <p
              className="font-source-serif text-sm"
              style={{ color: "var(--ink-muted)" }}
            >
              {simpleExplanation}
            </p>
          )}
          {hasExampleTriple && (
            <div className="space-y-0.5">
              <p
                className="font-noto-sans-jp text-sm"
                style={{ color: "var(--ink-soft)" }}
              >
                {exampleJapanese}
              </p>
              <p
                className="font-source-serif italic text-xs"
                style={{ color: "var(--ink-muted)" }}
              >
                {exampleRomaji}
              </p>
              <p
                className="font-source-serif text-xs"
                style={{ color: "var(--ink-muted)" }}
              >
                {exampleEnglish}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Zone 2: Choice buttons ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceTap(index)}
            disabled={phase === "feedback"}
            className="w-full py-4 px-4 font-source-serif text-base text-left transition-opacity"
            style={{
              ...choiceStyle(index),
              pointerEvents: phase === "feedback" ? "none" : "auto",
            }}
          >
            {choice.text}
          </button>
        ))}

        {/* Continue affordance — appears after feedback */}
        {phase === "feedback" && (
          <button
            onClick={onContinue}
            className="w-full py-3 font-inter text-sm mt-1"
            style={{
              backgroundColor: "transparent",
              color: "var(--ink-muted)",
              border: "1.5px solid var(--rule)",
              borderRadius: "var(--radius)",
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
