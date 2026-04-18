// src/features/review/sessionEntry.ts
//
// Review-session entry boundary for 37NDEST.
// This is the narrow point where profile context and trusted canonical content
// meet to form a study session.
//
// createSessionEntry() is a pure function — it accepts inputs and returns a
// validated SessionEntry. It does not call getCanonicalDeck() or
// getActiveProfileId() internally. Callers are responsible for providing
// those values through the established boundaries.
//
// No queue logic, no session progression, no result recording here.
// Those concerns belong to later tasks (T2–T6).

import type { CanonicalDeck } from "../../types/content";
import type { SessionEntry, StudyDirection } from "../../types/review";

/**
 * Create a validated review-session entry from the given inputs.
 * Throws a descriptive error if any input is invalid.
 *
 * @param profileId - The active profile id. Must be a non-empty string.
 * @param deck - Trusted canonical deck content. Must have at least one note.
 * @param direction - The study direction for this session.
 * @returns A validated SessionEntry ready for session use.
 */
export function createSessionEntry(
  profileId: string,
  deck: Readonly<CanonicalDeck>,
  direction: StudyDirection
): SessionEntry {
  if (typeof profileId !== "string" || profileId.trim().length === 0) {
    throw new Error("Session entry requires a non-empty profileId.");
  }
  if (!deck || !Array.isArray(deck.notes) || deck.notes.length === 0) {
    throw new Error("Session entry requires a trusted deck with at least one note.");
  }
  if (direction !== "recognition" && direction !== "production") {
    throw new Error(
      `Session entry requires a valid study direction. Got: "${String(direction)}".`
    );
  }

  return {
    profileId: profileId.trim(),
    deck,
    direction,
  };
}
