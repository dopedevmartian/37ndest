// ReviewView — session entry, current-item, recognition, and production interaction surface.
// T1: session entry with direction selection.
// T2: current-item display with session state.
// T3: recognition-oriented prompt/reveal/result interaction.
// T4: production-oriented recall-before-reveal interaction.
// Persistence belongs to T6.

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
import type {
  ProductionOutcome,
  RecognitionOutcome,
  SessionItem,
  SessionState,
  StudyDirection,
} from "../types/review";

type ReviewViewProps = {
  activeProfileId: string | null;
  onBack: () => void;
};

type ViewPhase =
  | { phase: "select-direction" }
  | { phase: "active"; sessionState: SessionState }
  | { phase: "error"; message: string };

type RecognitionInteraction =
  | { item: SessionItem; revealed: false }
  | { item: SessionItem; revealed: true };

type ProductionInteraction =
  | { item: SessionItem; recalled: false }
  | { item: SessionItem; recalled: true };

export function ReviewView({ activeProfileId, onBack }: ReviewViewProps) {
  const [viewPhase, setViewPhase] = useState<ViewPhase>({
    phase: "select-direction",
  });
  const [recognitionInteraction, setRecognitionInteraction] =
    useState<RecognitionInteraction | null>(null);
  const [productionInteraction, setProductionInteraction] =
    useState<ProductionInteraction | null>(null);

  // Initialize the correct interaction state for the given item.
  // Clears the other mode's state to prevent stale UI leaking across modes.
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

  function handleSelectDirection(direction: StudyDirection) {
    if (!activeProfileId) {
      setViewPhase({
        phase: "error",
        message: "Select a profile on the home screen before starting a session.",
      });
      return;
    }

    const contentResult = tryGetCanonicalDeck();
    if (!contentResult.ok) {
      setViewPhase({
        phase: "error",
        message: `Could not load study content: ${contentResult.error}`,
      });
      return;
    }

    try {
      const entry = createSessionEntry(activeProfileId, contentResult.deck, direction);
      const items = selectSessionItems(entry, new Set());
      const sessionState = createSessionState(items);
      setViewPhase({ phase: "active", sessionState });
      initInteractionForItem(getCurrentItem(sessionState));
    } catch (err) {
      setViewPhase({
        phase: "error",
        message: err instanceof Error ? err.message : "Could not start session.",
      });
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
    setViewPhase({ phase: "active", sessionState: nextState });
    initInteractionForItem(getCurrentItem(nextState));
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
    setViewPhase({ phase: "active", sessionState: nextState });
    initInteractionForItem(getCurrentItem(nextState));
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <h2 className="text-xl font-semibold tracking-tight text-white">
          Review
        </h2>

        {/* No active profile */}
        {!activeProfileId && (
          <p className="mt-3 text-sm leading-6 text-amber-400">
            Select a profile on the home screen before starting a session.
          </p>
        )}

        {/* Direction selection */}
        {activeProfileId && viewPhase.phase === "select-direction" && (
          <>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Choose a study direction to begin.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => handleSelectDirection("recognition")}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Recognition
              </button>
              <button
                onClick={() => handleSelectDirection("production")}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
              >
                Production
              </button>
            </div>
          </>
        )}

        {/* Active session */}
        {viewPhase.phase === "active" && (() => {
          const state = viewPhase.sessionState;
          const total = state.items.length;
          const position = state.currentIndex + 1;

          // Completed-session state — explicit and distinct from unexpected null
          if (state.completed) {
            return (
              <>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Session complete.
                </p>
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                  <p className="text-sm text-slate-300">
                    {state.results.length} item{state.results.length !== 1 ? "s" : ""} reviewed
                  </p>
                </div>
                <button
                  onClick={() => {
                    setViewPhase({ phase: "select-direction" });
                    setRecognitionInteraction(null);
                    setProductionInteraction(null);
                  }}
                  className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Start another session
                </button>
              </>
            );
          }

          const currentItem = getCurrentItem(state);

          if (!currentItem) {
            return (
              <p className="mt-3 text-sm leading-6 text-slate-400">
                No current item available.
              </p>
            );
          }

          const isRecognition =
            currentItem.direction === "recognition" && recognitionInteraction !== null;
          const isProduction =
            currentItem.direction === "production" && productionInteraction !== null;

          return (
            <>
              {/* Session context */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="uppercase tracking-widest">
                  {currentItem.direction === "recognition" ? "recognize" : "produce"}
                </span>
                <span>{position} / {total}</span>
              </div>

              {/* Current item card */}
              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-8 text-center">

                {/* Recognition: cue = Japanese */}
                {isRecognition && (
                  <>
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      {currentItem.note.japanese}
                    </p>
                    {recognitionInteraction?.revealed && (
                      <div className="mt-4 border-t border-white/10 pt-4 text-left space-y-2">
                        <p className="text-sm text-slate-400">{currentItem.note.romaji}</p>
                        <p className="text-base text-slate-200">{currentItem.note.english}</p>
                        {currentItem.note.usage_note && (
                          <p className="text-xs italic text-slate-400">{currentItem.note.usage_note}</p>
                        )}
                        {currentItem.note.example_japanese && (
                          <p className="text-sm text-slate-300">{currentItem.note.example_japanese}</p>
                        )}
                        {currentItem.note.example_english && (
                          <p className="text-xs text-slate-400">{currentItem.note.example_english}</p>
                        )}
                        {currentItem.note.literal_breakdown && (
                          <p className="text-xs text-slate-500">{currentItem.note.literal_breakdown}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Production: cue = English (user must recall Japanese) */}
                {isProduction && (
                  <>
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      {currentItem.note.english}
                    </p>
                    {productionInteraction?.recalled && (
                      <div className="mt-4 border-t border-white/10 pt-4 text-left space-y-2">
                        <p className="text-2xl font-semibold text-white">{currentItem.note.japanese}</p>
                        <p className="text-sm text-slate-400">{currentItem.note.romaji}</p>
                        {currentItem.note.example_japanese && (
                          <p className="text-sm text-slate-300">{currentItem.note.example_japanese}</p>
                        )}
                        {currentItem.note.example_english && (
                          <p className="text-xs text-slate-400">{currentItem.note.example_english}</p>
                        )}
                        {currentItem.note.literal_breakdown && (
                          <p className="text-xs text-slate-500">{currentItem.note.literal_breakdown}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Interaction controls */}
              {isRecognition && (
                <div className="mt-6 flex flex-col gap-3">
                  {!recognitionInteraction?.revealed ? (
                    <button
                      onClick={handleRecognitionReveal}
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Reveal
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRecognitionOutcome("correct")}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => handleRecognitionOutcome("incorrect")}
                        className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Incorrect
                      </button>
                      <button
                        onClick={() => handleRecognitionOutcome("skipped")}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>
              )}

              {isProduction && (
                <div className="mt-6 flex flex-col gap-3">
                  {!productionInteraction?.recalled ? (
                    <button
                      onClick={handleProductionReveal}
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Reveal
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleProductionOutcome("correct")}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => handleProductionOutcome("incorrect")}
                        className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Incorrect
                      </button>
                      <button
                        onClick={() => handleProductionOutcome("skipped")}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          );
        })()}

        {/* Error state */}
        {viewPhase.phase === "error" && (
          <p className="mt-3 text-sm leading-6 text-red-400">
            {viewPhase.message}
          </p>
        )}
      </div>
    </section>
  );
}
