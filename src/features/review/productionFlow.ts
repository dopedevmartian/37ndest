// src/features/review/productionFlow.ts
//
// Production-oriented study flow for 37NDEST.
// Models the engine-level state transitions for production recall review:
//   prompt (item shown, user attempting recall) → result (answer revealed, outcome captured)
//
// Both functions are pure — no db access, no UI coupling, no session progression.
// Callers are responsible for wiring these into session state and persistence.
// Persistence of results belongs to T6.

import type {
  ProductionOutcome,
  ProductionPrompt,
  ProductionResult,
  SessionItem,
} from "../../types/review";

const VALID_OUTCOMES: ReadonlySet<ProductionOutcome> = new Set([
  "correct",
  "incorrect",
  "skipped",
]);

/**
 * Create a production prompt for the given session item.
 * Throws if the item's study direction is not "production".
 *
 * @param item - A SessionItem with direction "production".
 * @returns A ProductionPrompt in the pre-recall state.
 */
export function createProductionPrompt(item: SessionItem): ProductionPrompt {
  if (item.direction !== "production") {
    throw new Error(
      `createProductionPrompt requires a production-direction item. Got: "${item.direction}".`
    );
  }
  return { item, recalled: false };
}

/**
 * Capture the outcome of a production prompt interaction.
 * Throws if the outcome is not one of the three valid values.
 *
 * @param prompt - The ProductionPrompt being resolved.
 * @param outcome - The user's interaction outcome after recall attempt.
 * @returns A ProductionResult in the recalled state with the captured outcome.
 */
export function captureProductionResult(
  prompt: ProductionPrompt,
  outcome: ProductionOutcome
): ProductionResult {
  if (!VALID_OUTCOMES.has(outcome)) {
    throw new Error(
      `captureProductionResult requires a valid outcome. Got: "${String(outcome)}".`
    );
  }
  return { item: prompt.item, recalled: true, outcome };
}
