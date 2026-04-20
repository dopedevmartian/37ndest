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

  const category = typeof note.category === "string" ? note.category : undefined;
  const categoryLabel = getCategoryLabel(category);

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
    <div className="flex flex-col flex-1 px-6 pt-6 pb-8">

      {/* ── Zone 1: Japanese prompt ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center">
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
        </div>
      </div>

      {/* ── Zone 2: Choice buttons ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mt-4">
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
