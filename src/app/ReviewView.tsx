// ReviewView — V2 full-screen review surface for 37NDEST.
//
// Phase 5: presentation and layout change only.
// Engine logic (sessionEntry, sessionProgression, recognitionFlow,
// productionFlow, progressRecorder) is unchanged.
//
// Direction: recognition unconditionally in this phase.
// Profile-based review-mode preference is deferred to a later spec.

import { useState, useRef } from "react";
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
import { updateConfidence } from "../features/review/confidenceTracker";
import {
  attemptReinsertion,
  createReinsertionState,
  type ReinsertionState,
} from "../features/review/sessionReinsertion";
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

  // Maximum cards per normal session. Focused drills are not capped — they
  // contain only the missed cards from the preceding session.
  // Pacing/schedule integration is deferred to a later spec.
  const SESSION_SIZE_DEFAULT = 10;

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
      const items = selectSessionItems(entry, new Set()).slice(0, SESSION_SIZE_DEFAULT);
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

  // Session-local reinsertion tracking. Reset on each new session.
  // Stored in a ref — changes do not need to trigger re-renders.
  const reinsertionStateRef = useRef<ReinsertionState>(createReinsertionState());

  // True when the active session is a focused drill (practice-again).
  // Prevents recursive practice-again offers after a focused drill completes.
  const isFocusedDrillRef = useRef<boolean>(false);

  // The set of card ids that must be seen for the session to complete.
  // Fixed at session start from the initial items list.
  // Reinsertion adds duplicates to items but does not add to this set.
  const originalCardIdsRef = useRef<Set<string>>(
    (() => {
      const initial = buildInitialPhase();
      if (initial.phase !== "active") return new Set<string>();
      return new Set(initial.sessionState.items.map((i) => i.noteId));
    })()
  );

  // Tracks which original card ids have been seen at least once this session.
  // Session completes when this equals originalCardIdsRef in size.
  const seenOriginalCardIdsRef = useRef<Set<string>>(new Set());

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
    // Persist confidence update for correct/incorrect outcomes (skipped is neutral).
    if (outcome !== "skipped" && activeProfileId) {
      updateConfidence(
        recognitionInteraction.item.noteId,
        activeProfileId,
        outcome
      ).catch(() => {
        // Confidence update failure must not crash the session.
      });
    }
    // Attempt reinsertion on incorrect outcome before advancing the engine.
    let currentSessionState = viewPhase.sessionState;
    if (outcome === "incorrect") {
      const { updatedSessionState, updatedReinsertionState } = attemptReinsertion(
        currentSessionState,
        reinsertionStateRef.current,
        recognitionInteraction.item.noteId
      );
      currentSessionState = updatedSessionState;
      reinsertionStateRef.current = updatedReinsertionState;
    }
    const nextState = advanceSession(currentSessionState, result);
    // Mark this card as seen if it belongs to the original session set.
    const cardId = recognitionInteraction.item.noteId;
    if (originalCardIdsRef.current.has(cardId)) {
      seenOriginalCardIdsRef.current.add(cardId);
    }
    // Session completes when every original card has been seen at least once.
    // This is correct under reinsertion: reinserted cards are duplicates of
    // originals and do not add new required cards to the completion set.
    const isComplete =
      seenOriginalCardIdsRef.current.size >= originalCardIdsRef.current.size;
    if (isComplete) {
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
    // Persist confidence update for correct/incorrect outcomes (skipped is neutral).
    if (outcome !== "skipped" && activeProfileId) {
      updateConfidence(
        productionInteraction.item.noteId,
        activeProfileId,
        outcome
      ).catch(() => {
        // Confidence update failure must not crash the session.
      });
    }
    // Attempt reinsertion on incorrect outcome before advancing the engine.
    let currentSessionState = viewPhase.sessionState;
    if (outcome === "incorrect") {
      const { updatedSessionState, updatedReinsertionState } = attemptReinsertion(
        currentSessionState,
        reinsertionStateRef.current,
        productionInteraction.item.noteId
      );
      currentSessionState = updatedSessionState;
      reinsertionStateRef.current = updatedReinsertionState;
    }
    const nextState = advanceSession(currentSessionState, result);
    // Mark this card as seen if it belongs to the original session set.
    const cardId = productionInteraction.item.noteId;
    if (originalCardIdsRef.current.has(cardId)) {
      seenOriginalCardIdsRef.current.add(cardId);
    }
    // Session completes when every original card has been seen at least once.
    const isComplete =
      seenOriginalCardIdsRef.current.size >= originalCardIdsRef.current.size;
    if (isComplete) {
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
    reinsertionStateRef.current = createReinsertionState();
    isFocusedDrillRef.current = false;
    originalCardIdsRef.current =
      next.phase === "active"
        ? new Set(next.sessionState.items.map((i) => i.noteId))
        : new Set();
    seenOriginalCardIdsRef.current = new Set();
    setViewPhase(next);
    if (next.phase === "active") {
      initInteractionForItem(getCurrentItem(next.sessionState));
    }
  }

  // Launch a focused drill containing only the cards missed in the just-finished session.
  // isFocusedDrillRef is set to true so the complete state after this drill
  // does not offer practice-again again (no recursive offers).
  function handlePracticeAgain(missedItems: SessionItem[]) {
    if (missedItems.length === 0) return;
    try {
      const sessionState = createSessionState(missedItems);
      reinsertionStateRef.current = createReinsertionState();
      isFocusedDrillRef.current = true;
      originalCardIdsRef.current = new Set(missedItems.map((i) => i.noteId));
      seenOriginalCardIdsRef.current = new Set();
      setViewPhase({ phase: "active", sessionState });
      initInteractionForItem(getCurrentItem(sessionState));
    } catch {
      // If session creation fails for any reason, fall back to home.
      onBack();
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
                aria-label="Exit review and return to home"
                className="p-2 -ml-2 flex flex-col items-center focus:outline-none"
              >
                <EnsoIcon />
                <span
                  className="font-inter uppercase mt-0.5"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--ink-faint)" }}
                >
                  exit
                </span>
              </button>
              {/* Counter de-emphasized: --ink-faint at 0.625rem, secondary to the bar */}
              <span
                className="font-inter"
                style={{ fontSize: "0.625rem", color: "var(--ink-faint)" }}
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
      {viewPhase.phase === "complete" && (() => {
        const completedState = viewPhase.sessionState;
        const reviewedCount = completedState.results.length;

        // Collect missed items for practice-again offer.
        // Only offered when: not already a focused drill, and ≥ 2 distinct cards missed.
        const missedIds = reinsertionStateRef.current.missedCardIds;
        const showPracticeAgain =
          !isFocusedDrillRef.current && missedIds.size >= 2;

        // Deduplicate: one SessionItem per missed card id (first occurrence in items).
        const seenIds = new Set<string>();
        const missedItems: SessionItem[] = [];
        for (const item of completedState.items) {
          if (missedIds.has(item.noteId) && !seenIds.has(item.noteId)) {
            seenIds.add(item.noteId);
            missedItems.push(item);
          }
        }

        return (
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
              {reviewedCount} item{reviewedCount !== 1 ? "s" : ""} reviewed
            </p>

            {/* Practice-again offer — only when ≥ 2 cards missed and not a focused drill */}
            {showPracticeAgain && (
              <button
                onClick={() => handlePracticeAgain(missedItems)}
                className="w-full max-w-xs py-4 font-inter font-medium text-base"
                style={{
                  backgroundColor: "var(--ink)",
                  color: "var(--paper)",
                  borderRadius: "var(--radius)",
                }}
              >
                Practice again — {missedItems.length} to revisit
              </button>
            )}

            <button
              onClick={handleStartAnother}
              className="w-full max-w-xs py-4 font-inter font-medium text-base"
              style={{
                backgroundColor: showPracticeAgain ? "var(--paper-deep)" : "var(--ink)",
                color: showPracticeAgain ? "var(--ink-muted)" : "var(--paper)",
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
        );
      })()}

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
