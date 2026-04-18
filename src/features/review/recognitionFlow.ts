// src/features/review/recognitionFlow.ts
//
// Recognition-oriented study flow for 37NDEST.
// Models the engine-level state transitions for recognition review:
//   prompt (item shown, answer hidden) → result (answer revealed, outcome captured)
//
// Both functions are pure — no db access, no UI coupling, no session progression.
// Callers are responsible for wiring these into session state and persistence.
// Persistence of results belongs to T6.

import type {
  RecognitionOutcome,
  RecognitionPrompt,
  RecognitionResult,
  SessionItem,
} from "../../types/review";

const VALID_OUTCOMES: ReadonlySet<RecognitionOutcome> = new Set([
  "correct",
  "incorrect",
  "skipped",
]);

/**
 * Create a recognition prompt for the given session item.
 * Throws if the item's study direction is not "recognition".
 *
 * @param item - A SessionItem with direction "recognition".
 * @returns A RecognitionPrompt in the unrevealed state.
 */
export function createRecognitionPrompt(item: SessionItem): RecognitionPrompt {
  if (item.direction !== "recognition") {
    throw new Error(
      `createRecognitionPrompt requires a recognition-direction item. Got: "${item.direction}".`
    );
  }
  return { item, revealed: false };
}

/**
 * Capture the outcome of a recognition prompt interaction.
 * Throws if the outcome is not one of the three valid values.
 *
 * @param prompt - The RecognitionPrompt being resolved.
 * @param outcome - The user's interaction outcome.
 * @returns A RecognitionResult in the revealed state with the captured outcome.
 */
export function captureRecognitionResult(
  prompt: RecognitionPrompt,
  outcome: RecognitionOutcome
): RecognitionResult {
  if (!VALID_OUTCOMES.has(outcome)) {
    throw new Error(
      `captureRecognitionResult requires a valid outcome. Got: "${String(outcome)}".`
    );
  }
  return { item: prompt.item, revealed: true, outcome };
}
