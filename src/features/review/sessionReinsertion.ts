// src/features/review/sessionReinsertion.ts
//
// Within-session reinsertion logic for spec 007-reinforcement-system.
//
// All functions are pure — no db access, no UI coupling, no side effects.
// The engine's core files (sessionProgression, recognitionFlow, productionFlow,
// progressRecorder, itemSelector) are not modified.
//
// Reinsertion rules (from spec 007 design):
//   - minimum distance: currentIndex + 3 (at least 2 cards ahead)
//   - maximum one reinsertion per card per session
//   - maximum 5 total reinsertions per session (REINSERTION_CAP)
//   - tail-end rule: if fewer than 2 cards remain after current, do not reinsert
//
// The caller (ReviewView) owns the session-local tracking sets and count.

import type { SessionItem, SessionState } from "../../types/review";

export const REINSERTION_CAP = 5;

/**
 * Session-local reinsertion tracking state.
 * Owned and reset by ReviewView on each new session.
 * Not persisted to IndexedDB.
 */
export type ReinsertionState = {
  /** Card ids that produced at least one "incorrect" outcome this session. */
  missedCardIds: Set<string>;
  /** Card ids that have already been reinserted once this session. */
  reinsertedCardIds: Set<string>;
  /** Total reinsertions performed this session. Capped at REINSERTION_CAP. */
  reinsertionCount: number;
};

/** Returns a fresh ReinsertionState for a new session. */
export function createReinsertionState(): ReinsertionState {
  return {
    missedCardIds: new Set(),
    reinsertedCardIds: new Set(),
    reinsertionCount: 0,
  };
}

/**
 * Attempt to reinsert a card into the session after an "incorrect" outcome.
 *
 * Returns:
 *   - updatedSessionState: a new SessionState with the card spliced in (or the
 *     original state if reinsertion did not occur)
 *   - updatedReinsertionState: updated tracking (missedCardIds always updated;
 *     reinsertedCardIds and count updated only when reinsertion occurred)
 *   - reinserted: true if the card was actually reinserted
 *
 * Pure function — does not mutate inputs.
 */
export function attemptReinsertion(
  sessionState: SessionState,
  reinsertionState: ReinsertionState,
  cardId: string
): {
  updatedSessionState: SessionState;
  updatedReinsertionState: ReinsertionState;
  reinserted: boolean;
} {
  // Always mark as missed regardless of whether reinsertion occurs.
  const updatedMissed = new Set(reinsertionState.missedCardIds);
  updatedMissed.add(cardId);

  const baseReinsertionState: ReinsertionState = {
    ...reinsertionState,
    missedCardIds: updatedMissed,
  };

  const currentIndex = sessionState.currentIndex;
  const items = sessionState.items;
  const remainingAfterCurrent = items.length - currentIndex - 1;

  // Tail-end rule: fewer than 2 cards remain after current — do not reinsert.
  if (remainingAfterCurrent < 2) {
    return {
      updatedSessionState: sessionState,
      updatedReinsertionState: baseReinsertionState,
      reinserted: false,
    };
  }

  // Already reinserted once this session — do not reinsert again.
  if (reinsertionState.reinsertedCardIds.has(cardId)) {
    return {
      updatedSessionState: sessionState,
      updatedReinsertionState: baseReinsertionState,
      reinserted: false,
    };
  }

  // Cap reached — do not reinsert.
  if (reinsertionState.reinsertionCount >= REINSERTION_CAP) {
    return {
      updatedSessionState: sessionState,
      updatedReinsertionState: baseReinsertionState,
      reinserted: false,
    };
  }

  // Find the card being reinserted (current item).
  const cardToReinsert = items[currentIndex];

  // Insert at currentIndex + 3 (at least 2 cards ahead), clamped to end of list.
  const insertAt = Math.min(currentIndex + 3, items.length);
  const newItems = [
    ...items.slice(0, insertAt),
    cardToReinsert,
    ...items.slice(insertAt),
  ];

  const updatedSessionState: SessionState = {
    ...sessionState,
    items: newItems,
  };

  const updatedReinserted = new Set(reinsertionState.reinsertedCardIds);
  updatedReinserted.add(cardId);

  const updatedReinsertionState: ReinsertionState = {
    missedCardIds: updatedMissed,
    reinsertedCardIds: updatedReinserted,
    reinsertionCount: reinsertionState.reinsertionCount + 1,
  };

  return {
    updatedSessionState,
    updatedReinsertionState,
    reinserted: true,
  };
}
