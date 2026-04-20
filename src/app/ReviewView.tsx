// ReviewView — V2 full-screen review surface for 37NDEST.
//
// Phase 5: presentation and layout change only.
// Engine logic (sessionEntry, sessionProgression, recognitionFlow,
// productionFlow, progressRecorder) is unchanged.
//
// Direction: recognition unconditionally in this phase.
// Profile-based review-mode preference is deferred to a later spec.

import { useState } from "react";
import { tryGetCanonicalDeck } from "../features/deck-import/deckContent";
import { createSessionEntry } from "../features/review/sessionEntry";
import { selectSessionItems } from "../features/review/itemSelector";
import {
  createSessionState,
  getCurrentItem,
  advanceSession,
} from "../features/review/sessionProgression";
import {
  createRecognitionPrompt,
  captureRecognitionResult,
} from "../features/review/recognitionFlow";
import {
  createProductionPrompt,
  captureProductionResult,
} from "../features/review/productionFlow";
import { ReviewCard } from "../components/ReviewCard";
import type {
  ProductionOutcome,
  RecognitionOutcome,
  SessionItem,
  SessionState,
} from "../types/review";

type ReviewViewProps = {
  activeProfileId: string | null;
  onBack: () => void;
};

// Minimal ViewPhase — select-direction removed.
// complete is a separate phase for clarity.
// Do not add phases speculatively.
type ViewPhase =
  | { phase: "active"; sessionState: SessionState }
  | { phase: "complete"; sessionState: SessionState }
  | { phase: "error"; message: string };

type RecognitionInteraction =
  | { item: SessionItem; revealed: false }
  | { item: SessionItem; revealed: true };

type ProductionInteraction =
  | { item: SessionItem; recalled: false }
  | { item: SessionItem; recalled: true };

// Enso circle SVG — pause affordance per V2 spec.
function EnsoIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      style={{ color: "var(--ink-muted)" }}
    >
      <path
        d="M14 4C8.477 4 4 8.477 4 14c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-2.21-.72-4.254-1.93-5.91"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ReviewView({ activeProfileId, onBack }: ReviewViewProps) {
  // Phase 5: recognition direction unconditionally.
  // Profile-based review-mode preference is deferred to a later spec.
  const DIRECTION = "recognition" as const;

  // Initialize session immediately on mount if profile is available.
  function buildInitialPhase(): ViewPhase {
    if (!activeProfileId) {
      return { phase: "error", message: "Select a profile on the home screen before starting a session." };
    }
    const contentResult = tryGetCanonicalDeck();
    if (!contentResult.ok) {
      return { phase: "error", message: `Could not load study content: ${contentResult.error}` };
    }
    try {
      const entry = createSessionEntry(activeProfileId, contentResult.deck, DIRECTION);
      const items = selectSessionItems(entry, new Set());
      const sessionState = createSessionState(items);
      return { phase: "active", sessionState };
    } catch (err) {
      return { phase: "error", message: err instanceof Error ? err.message : "Could not start session." };
    }
  }

  const [viewPhase, setViewPhase] = useState<ViewPhase>(() => buildInitialPhase());
  const [recognitionInteraction, setRecognitionInteraction] =
    useState<RecognitionInteraction | null>(() => {
      const initial = buildInitialPhase();
      if (initial.phase !== "active") return null;
      const item = getCurrentItem(initial.sessionState);
      if (!item || item.direction !== "recognition") return null;
      return { item, revealed: false };
    });
  const [productionInteraction, setProductionInteraction] =
    useState<ProductionInteraction | null>(null);

  // Initialize interaction state for the given item.
  function initInteractionForItem(item: SessionItem | null) {
    if (item && item.direction === "recognition") {
      setRecognitionInteraction({ item, revealed: false });
      setProductionInteraction(null);
    } else if (item && item.direction === "production") {
      setProductionInteraction({ item, recalled: false });
      setRecognitionInteraction(null);
    } else {
      setRecognitionInteraction(null);
      setProductionInteraction(null);
    }
  }

  // Recognition handlers
  function handleRecognitionReveal() {
    if (!recognitionInteraction || recognitionInteraction.revealed) return;
    setRecognitionInteraction({ item: recognitionInteraction.item, revealed: true });
  }

  function handleRecognitionOutcome(outcome: RecognitionOutcome) {
    if (!recognitionInteraction || !recognitionInteraction.revealed) return;
    if (viewPhase.phase !== "active") return;
    const enginePrompt = createRecognitionPrompt(recognitionInteraction.item);
    const result = captureRecognitionResult(enginePrompt, outcome);
    const nextState = advanceSession(viewPhase.sessionState, result);
    if (nextState.completed) {
      setViewPhase({ phase: "complete", sessionState: nextState });
      setRecognitionInteraction(null);
      setProductionInteraction(null);
    } else {
      setViewPhase({ phase: "active", sessionState: nextState });
      initInteractionForItem(getCurrentItem(nextState));
    }
  }

  // Production handlers
  function handleProductionReveal() {
    if (!productionInteraction || productionInteraction.recalled) return;
    setProductionInteraction({ item: productionInteraction.item, recalled: true });
  }

  function handleProductionOutcome(outcome: ProductionOutcome) {
    if (!productionInteraction || !productionInteraction.recalled) return;
    if (viewPhase.phase !== "active") return;
    const enginePrompt = createProductionPrompt(productionInteraction.item);
    const result = captureProductionResult(enginePrompt, outcome);
    const nextState = advanceSession(viewPhase.sessionState, result);
    if (nextState.completed) {
      setViewPhase({ phase: "complete", sessionState: nextState });
      setRecognitionInteraction(null);
      setProductionInteraction(null);
    } else {
      setViewPhase({ phase: "active", sessionState: nextState });
      initInteractionForItem(getCurrentItem(nextState));
    }
  }

  function handleStartAnother() {
    const next = buildInitialPhase();
    setViewPhase(next);
    if (next.phase === "active") {
      initInteractionForItem(getCurrentItem(next.sessionState));
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* ── Top chrome ──────────────────────────────────────────────────── */}
      {viewPhase.phase === "active" && (() => {
        const state = viewPhase.sessionState;
        const total = state.items.length;
        const position = Math.min(state.currentIndex + 1, total);
        const progressPct = total > 0 ? (state.currentIndex / total) * 100 : 0;

        return (
          <>
            {/* 3px progress bar */}
            <div
              className="w-full"
              style={{ height: "3px", backgroundColor: "var(--paper-deep)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  backgroundColor: "var(--ink)",
                  transition: "width 200ms ease-in-out",
                }}
              />
            </div>

            {/* Pause affordance + item counter */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <button
                onClick={onBack}
                aria-label="Pause and return to home"
                className="p-1 -ml-1 focus:outline-none"
              >
                <EnsoIcon />
              </button>
              <span
                className="font-inter text-xs"
                style={{ color: "var(--ink-muted)" }}
              >
                {position} / {total}
              </span>
            </div>
          </>
        );
      })()}

      {/* ── Active session ──────────────────────────────────────────────── */}
      {viewPhase.phase === "active" && (() => {
        const state = viewPhase.sessionState;
        const currentItem = getCurrentItem(state);

        if (!currentItem) {
          return (
            <div className="flex-1 flex items-center justify-center px-6">
              <p className="font-source-serif text-base" style={{ color: "var(--ink-muted)" }}>
                No current item available.
              </p>
            </div>
          );
        }

        const isRecognition = currentItem.direction === "recognition" && recognitionInteraction !== null;
        const isProduction  = currentItem.direction === "production"  && productionInteraction  !== null;

        const revealed =
          (isRecognition && recognitionInteraction!.revealed) ||
          (isProduction  && productionInteraction!.recalled);

        function handleReveal() {
          if (isRecognition) handleRecognitionReveal();
          else if (isProduction) handleProductionReveal();
        }

        function handleGotIt() {
          if (isRecognition) handleRecognitionOutcome("correct");
          else if (isProduction) handleProductionOutcome("correct");
        }

        function handleAgain() {
          if (isRecognition) handleRecognitionOutcome("incorrect");
          else if (isProduction) handleProductionOutcome("incorrect");
        }

        return (
          <div
            className="flex-1 flex flex-col overflow-y-auto"
            onClick={!revealed ? handleReveal : undefined}
            style={{ cursor: !revealed ? "pointer" : "default" }}
          >
            <ReviewCard
              item={currentItem}
              revealed={revealed}
              onReveal={handleReveal}
              onGotIt={handleGotIt}
              onAgain={handleAgain}
            />
          </div>
        );
      })()}

      {/* ── Complete state ──────────────────────────────────────────────── */}
      {viewPhase.phase === "complete" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <p
            className="font-source-serif text-xl text-center"
            style={{ color: "var(--ink)" }}
          >
            Session complete.
          </p>
          <p
            className="font-source-serif text-base text-center"
            style={{ color: "var(--ink-muted)" }}
          >
            {viewPhase.sessionState.results.length} item
            {viewPhase.sessionState.results.length !== 1 ? "s" : ""} reviewed
          </p>
          <button
            onClick={handleStartAnother}
            className="w-full max-w-xs py-4 font-inter font-medium text-base"
            style={{
              backgroundColor: "var(--ink)",
              color: "var(--paper)",
              borderRadius: "var(--radius)",
            }}
          >
            Start another session
          </button>
          <button
            onClick={onBack}
            className="font-inter text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            Return home
          </button>
        </div>
      )}

      {/* ── Error state ─────────────────────────────────────────────────── */}
      {viewPhase.phase === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
          <p
            className="font-source-serif text-base text-center"
            style={{ color: "var(--ink-muted)" }}
          >
            {viewPhase.message}
          </p>
          <button
            onClick={onBack}
            className="font-inter text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            Return home
          </button>
        </div>
      )}
    </div>
  );
}
