// src/features/review/itemSelector.ts
//
// Session item selection for 37NDEST.
// Selects and prioritizes study items from trusted canonical content.
//
// selectSessionItems() is a pure function — no db access, no async.
// Callers provide confidence data from their own async loading.
//
// Priority scoring (when confidence data is available):
//   confidenceFactor = 10 - confidenceScore  (higher = weaker card)
//   timeFactor       = hours since lastReviewedAt
//                      (never reviewed → TIME_FACTOR_MAX)
//   priority         = (confidenceFactor * 2) + timeFactor
//
// Cards are sorted highest priority first, then by original deck order
// as a stable tie-breaker.

import type { CanonicalNote } from "../../types/content";
import type { ConfidenceRecord } from "../../types/db";
import type { SessionEntry, SessionItem } from "../../types/review";

/** Hours assigned to cards never reviewed — ensures they rank high. */
const TIME_FACTOR_MAX = 9999;

/**
 * Safely read a numeric field from a canonical note's flexible shape.
 * Returns Infinity as a fallback so items with missing fields sort last.
 */
function safeNum(note: CanonicalNote, field: string): number {
  const val = (note as Record<string, unknown>)[field];
  return typeof val === "number" ? val : Infinity;
}

/**
 * Compute a priority score for a card given its confidence record.
 *
 * priority = (confidenceFactor * 2) + timeFactor
 *
 * confidenceFactor = 10 - confidenceScore  (range 0–10; higher = weaker)
 * timeFactor       = hours since lastReviewedAt, or TIME_FACTOR_MAX if never reviewed
 *
 * Confidence is weighted 2× relative to time so weak cards are consistently
 * prioritized over merely stale ones.
 */
function computePriority(record: ConfidenceRecord | undefined, now: number): number {
  if (!record || record.lastReviewedAt === 0) {
    // Never reviewed — maximum priority
    const confidenceFactor = 10 - 5; // initial score is 5
    return (confidenceFactor * 2) + TIME_FACTOR_MAX;
  }
  const confidenceFactor = 10 - record.confidenceScore;
  const hoursElapsed = (now - record.lastReviewedAt) / (1000 * 60 * 60);
  return (confidenceFactor * 2) + hoursElapsed;
}

/**
 * Select an ordered array of study items from the session entry.
 *
 * When confidenceMap is provided, cards are sorted by priority score
 * (highest first) so weak and unseen cards appear first.
 *
 * When confidenceMap is absent, falls back to the original phase_order /
 * domain_priority sort so the function remains backward-compatible.
 *
 * @param entry          - The validated session entry.
 * @param seenCardIds    - Card ids already seen by this profile (unused when
 *                         confidenceMap is provided — priority handles ordering).
 * @param confidenceMap  - Optional map of cardId → ConfidenceRecord for the
 *                         active profile. Pass undefined to use legacy ordering.
 * @param now            - Optional timestamp override for testing (ms). Defaults
 *                         to Date.now().
 */
export function selectSessionItems(
  entry: SessionEntry,
  seenCardIds: ReadonlySet<string> | readonly string[],
  confidenceMap?: ReadonlyMap<string, ConfidenceRecord>,
  now: number = Date.now()
): SessionItem[] {
  const allNotes = entry.deck.notes;

  if (confidenceMap) {
    // Confidence-aware path: sort all cards by priority, highest first.
    // Stable tie-breaker: original deck order (index).
    const scored = allNotes.map((note, index) => ({
      note,
      index,
      priority: computePriority(confidenceMap.get(note.id), now),
    }));

    scored.sort((a, b) => {
      const diff = b.priority - a.priority;
      if (diff !== 0) return diff;
      return a.index - b.index; // stable tie-breaker
    });

    return scored.map(({ note }) => ({
      noteId: note.id,
      note,
      direction: entry.direction,
    }));
  }

  // Legacy path (no confidence data): unseen first, then phase_order / domain_priority.
  const seenSet: ReadonlySet<string> =
    seenCardIds instanceof Set ? seenCardIds : new Set(seenCardIds);

  const candidates = allNotes.filter((n) => !seenSet.has(n.id));
  const pool = candidates.length > 0 ? candidates : [...allNotes];

  const sorted = [...pool].sort((a, b) => {
    const phaseDiff = safeNum(a, "phase_order") - safeNum(b, "phase_order");
    if (phaseDiff !== 0) return phaseDiff;
    return safeNum(a, "domain_priority") - safeNum(b, "domain_priority");
  });

  return sorted.map((note) => ({
    noteId: note.id,
    note,
    direction: entry.direction,
  }));
}
