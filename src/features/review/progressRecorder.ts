// src/features/review/progressRecorder.ts
//
// Profile-specific progress recording for 37NDEST.
// Converts an ItemResult into a ReviewProgress record and persists it.
//
// buildReviewProgressRecord() is a pure function — no db, no side effects.
// recordItemResult() is the thin async persistence wrapper.
//
// Canonical content is not stored — only the note id (cardId) is referenced.
// No pacing, scoring, aggregation, or history logic here.

import { db } from "../../db";
import type { ReviewProgress } from "../../types/db";
import type { ItemResult, SessionState } from "../../types/review";

/**
 * Build a ReviewProgress record from a profile id and an item result.
 * Pure function — does not write to db.
 *
 * @param profileId - The active profile id. Must be non-empty.
 * @param result - The ItemResult from recognition or production flow.
 * @param reviewedAt - Optional timestamp (ms). Defaults to Date.now().
 * @returns A ReviewProgress record ready to persist.
 */
export function buildReviewProgressRecord(
  profileId: string,
  result: ItemResult,
  reviewedAt: number = Date.now()
): ReviewProgress {
  if (typeof profileId !== "string" || profileId.trim().length === 0) {
    throw new Error("buildReviewProgressRecord requires a non-empty profileId.");
  }
  return {
    id: crypto.randomUUID(),
    profileId: profileId.trim(),
    cardId: result.item.noteId,
    direction: result.item.direction,
    outcome: result.outcome,
    reviewedAt,
  };
}

/**
 * Record an item result as profile-specific progress in IndexedDB.
 * Thin async wrapper around buildReviewProgressRecord + db write.
 *
 * @param profileId - The active profile id.
 * @param result - The ItemResult to record.
 * @returns The persisted ReviewProgress record.
 */
export async function recordItemResult(
  profileId: string,
  result: ItemResult
): Promise<ReviewProgress> {
  const record = buildReviewProgressRecord(profileId, result);
  await db.reviewProgress.add(record);
  return record;
}

/**
 * Record all results from a completed session as profile-specific progress.
 * Validates that the session is completed and profileId is non-empty before writing.
 * Calls recordItemResult for each result — profile binding is enforced per record.
 *
 * @param profileId - The active profile id. Must be non-empty.
 * @param sessionState - The completed SessionState. Must have completed: true.
 * @returns Array of persisted ReviewProgress records, one per result.
 */
export async function recordSessionResults(
  profileId: string,
  sessionState: SessionState
): Promise<ReviewProgress[]> {
  if (typeof profileId !== "string" || profileId.trim().length === 0) {
    throw new Error("recordSessionResults requires a non-empty profileId.");
  }
  if (!sessionState.completed) {
    throw new Error(
      "recordSessionResults requires a completed session. Session is not yet complete."
    );
  }
  const records: ReviewProgress[] = [];
  for (const result of sessionState.results) {
    const record = await recordItemResult(profileId.trim(), result);
    records.push(record);
  }
  return records;
}
