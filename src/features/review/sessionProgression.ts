// src/features/review/sessionProgression.ts
//
// Session progression for 37NDEST.
// Models the engine-level state transitions for advancing through a session:
//   initial state → advance with result → ... → completed state
//
// All functions are pure — no db access, no UI coupling, no persistence.
// advanceSession() is immutable — it returns a new state, never mutates input.
// Persistence of results belongs to T6.

import type { ItemResult, SessionItem, SessionState } from "../../types/review";

/**
 * Create the initial session state from an ordered item list.
 * Throws if items is empty.
 *
 * @param items - Ordered SessionItem array from selectSessionItems().
 * @returns Initial SessionState with currentIndex 0, no results, not completed.
 */
export function createSessionState(items: readonly SessionItem[]): SessionState {
  if (!items || items.length === 0) {
    throw new Error("createSessionState requires at least one session item.");
  }
  return {
    items,
    currentIndex: 0,
    results: [],
    completed: false,
  };
}

/**
 * Return the current session item, or null if the session is completed.
 *
 * @param state - The current SessionState.
 * @returns The current SessionItem, or null if completed.
 */
export function getCurrentItem(state: SessionState): SessionItem | null {
  if (state.completed || state.currentIndex >= state.items.length) {
    return null;
  }
  return state.items[state.currentIndex];
}

/**
 * Advance the session by recording a result and moving to the next item.
 * Returns a new SessionState — does not mutate the input state.
 * Sets completed: true when all items have been advanced through.
 *
 * @param state - The current SessionState. Must not already be completed.
 * @param result - The ItemResult for the current item.
 * @returns A new SessionState with the result appended and index advanced.
 */
export function advanceSession(
  state: SessionState,
  result: ItemResult
): SessionState {
  if (state.completed) {
    throw new Error("advanceSession called on an already-completed session.");
  }
  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= state.items.length;
  return {
    items: state.items,
    currentIndex: nextIndex,
    results: [...state.results, result],
    completed,
  };
}
