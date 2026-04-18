// src/features/review/itemSelector.ts
//
// Session item selection for 37NDEST.
// Selects study items from trusted canonical content using the session entry
// and a set of already-seen card ids from profile progress.
//
// selectSessionItems() is a pure function — it accepts inputs and returns
// a SessionItem array. It does not fetch from db or call any async service.
// Callers are responsible for providing seenCardIds from profile progress.
//
// Selection logic is intentionally simple and honest:
// - unseen items first (not in seenCardIds)
// - ordered by phase_order then domain_priority (defensive — fields may be unknown)
// - if all items have been seen, returns all items (full cycle)
//
// No weighting, no pacing, no recommendation engine. Those belong to later tasks.

import type { CanonicalNote } from "../../types/content";
import type { SessionEntry, SessionItem } from "../../types/review";

/**
 * Safely read a numeric field from a canonical note's flexible shape.
 * Returns Infinity as a fallback so items with missing fields sort last.
 */
function safeNum(note: CanonicalNote, field: string): number {
  const val = (note as Record<string, unknown>)[field];
  return typeof val === "number" ? val : Infinity;
}

/**
 * Select an ordered array of study items from the session entry.
 *
 * @param entry - The validated session entry (profile + trusted deck + direction).
 * @param seenCardIds - Set of canonical note ids already seen by this profile.
 *   Pass an empty Set or empty array if no progress exists yet.
 * @returns Ordered array of SessionItem ready for session use.
 */
export function selectSessionItems(
  entry: SessionEntry,
  seenCardIds: ReadonlySet<string> | readonly string[]
): SessionItem[] {
  const seenSet: ReadonlySet<string> =
    seenCardIds instanceof Set
      ? seenCardIds
      : new Set(seenCardIds);

  const allNotes = entry.deck.notes;

  // Prefer unseen items. Fall back to all items if everything has been seen.
  const candidates = allNotes.filter((n) => !seenSet.has(n.id));
  const pool = candidates.length > 0 ? candidates : [...allNotes];

  // Sort by phase_order ascending, then domain_priority ascending.
  // Both fields come through the flexible index signature — handle defensively.
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
