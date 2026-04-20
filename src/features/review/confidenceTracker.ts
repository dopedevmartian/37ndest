// src/features/review/confidenceTracker.ts
//
// Minimal service for reading and updating per-card-per-profile confidence records.
// Implements the scoring rules defined in spec 007-reinforcement-system.
//
// Score rules:
//   correct   → min(score + 1, 10)
//   incorrect → max(score - 2, 0)
//   initial   → 5 (neutral; no record is written until the first outcome)
//
// recentOutcomes stores the last 10 outcomes, newest first.
// Outcomes older than the window are discarded.

import { db } from "../../db/db";
import type { ConfidenceRecord } from "../../types/db";

const INITIAL_SCORE = 5;
const MAX_SCORE = 10;
const MIN_SCORE = 0;
const CORRECT_DELTA = 1;
const INCORRECT_DELTA = -2;
const OUTCOME_WINDOW = 10;

function makeId(profileId: string, cardId: string): string {
  return `${profileId}:${cardId}`;
}

/**
 * Returns the ConfidenceRecord for a card/profile pair.
 * If no record exists, returns a synthetic default (score 5, no history).
 * The default is NOT written to the database — records are only created on
 * the first actual review outcome.
 */
export async function getConfidence(
  cardId: string,
  profileId: string
): Promise<ConfidenceRecord> {
  const id = makeId(profileId, cardId);
  const existing = await db.cardConfidence.get(id);
  if (existing) return existing;

  return {
    id,
    cardId,
    profileId,
    confidenceScore: INITIAL_SCORE,
    recentOutcomes: [],
    lastReviewedAt: 0,
  };
}

/**
 * Records a review outcome for a card/profile pair and persists the updated
 * ConfidenceRecord to IndexedDB.
 *
 * Score update:
 *   "correct"   → min(score + 1, 10)
 *   "incorrect" → max(score - 2, 0)
 *
 * recentOutcomes is updated by prepending the new outcome and trimming to 10.
 */
export async function updateConfidence(
  cardId: string,
  profileId: string,
  outcome: "correct" | "incorrect"
): Promise<ConfidenceRecord> {
  const current = await getConfidence(cardId, profileId);

  const delta = outcome === "correct" ? CORRECT_DELTA : INCORRECT_DELTA;
  const newScore = Math.min(
    MAX_SCORE,
    Math.max(MIN_SCORE, current.confidenceScore + delta)
  );

  const newOutcomes = [outcome, ...current.recentOutcomes].slice(
    0,
    OUTCOME_WINDOW
  );

  const updated: ConfidenceRecord = {
    id: current.id,
    cardId,
    profileId,
    confidenceScore: newScore,
    recentOutcomes: newOutcomes,
    lastReviewedAt: Date.now(),
  };

  await db.cardConfidence.put(updated);
  return updated;
}
