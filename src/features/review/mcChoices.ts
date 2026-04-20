// src/features/review/mcChoices.ts
//
// Multiple choice distractor generation for 37NDEST spec 009.
// Pure functions — no db, no async, no side effects.
//
// buildMCChoices() returns MCChoice[] | null.
// null means the card has insufficient distractors — caller falls back to reveal mode.
//
// Distractor selection priority (per spec 009 R2):
//   1. Use card's own distractors field if it has exactly 2 entries (pre-authored).
//      Draw 1 more from other deck cards.
//   2. Otherwise draw all 3 from other deck cards.
//
// Choice order is deterministically shuffled using a seeded LCG so the same
// card always produces the same choice order within a session (no re-render flicker).

import type { CanonicalNote } from "../../types/content";
import type { SessionItem } from "../../types/review";

export type MCChoice = {
  /** English meaning displayed to the user. */
  text: string;
  /** True for the one correct answer. */
  isCorrect: boolean;
};

// ---------------------------------------------------------------------------
// Seeded shuffle helpers
// ---------------------------------------------------------------------------

/** djb2-style hash of a string, returns a positive integer. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  return h;
}

/** Derive a numeric seed from a card id and session index. */
function hashSeed(cardId: string, sessionIndex: number): number {
  return hashString(cardId + String(sessionIndex));
}

/**
 * Deterministic Fisher-Yates shuffle using a seeded LCG.
 * Returns a new array — does not mutate input.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    // LCG: next = (a * s + c) % m  (Numerical Recipes constants)
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Build 4 MC choices (1 correct + 3 distractors) for the given session item.
 *
 * Returns MCChoice[] in randomized order, or null if the deck cannot produce
 * 3 distinct distractors (caller should fall back to reveal mode).
 *
 * @param item - The current session item being presented.
 * @param allNotes - All notes in the active deck.
 * @param sessionIndex - Current position in the session (used as shuffle seed offset).
 */
export function buildMCChoices(
  item: SessionItem,
  allNotes: readonly CanonicalNote[],
  sessionIndex: number
): MCChoice[] | null {
  const correctText = item.note.english;
  const seed = hashSeed(item.noteId, sessionIndex);

  // Build a pool of candidate distractor texts from other deck cards.
  // Exclude: the current card, any card whose english matches the correct answer,
  // and any duplicate english strings.
  const seenTexts = new Set<string>([correctText]);
  const candidatePool: string[] = [];
  for (const note of allNotes) {
    if (note.id === item.noteId) continue;
    const text = note.english;
    if (!text || seenTexts.has(text)) continue;
    seenTexts.add(text);
    candidatePool.push(text);
  }

  // Determine distractor texts.
  let distractorTexts: string[];

  const preAuthored = item.note.distractors;
  if (Array.isArray(preAuthored) && preAuthored.length === 2) {
    // Use both pre-authored distractors if they are distinct from the correct answer
    // and from each other. Fall back to random pool entries for any that fail.
    const d0 = typeof preAuthored[0] === "string" ? preAuthored[0] : null;
    const d1 = typeof preAuthored[1] === "string" ? preAuthored[1] : null;
    const validPreAuthored: string[] = [];
    const usedTexts = new Set<string>([correctText]);

    for (const d of [d0, d1]) {
      if (d && !usedTexts.has(d)) {
        validPreAuthored.push(d);
        usedTexts.add(d);
      }
    }

    // Fill remaining slots from the random pool (excluding already-used texts).
    const remainingPool = candidatePool.filter((t) => !usedTexts.has(t));
    const shuffledRemaining = seededShuffle(remainingPool, seed);
    const needed = 3 - validPreAuthored.length;
    const extras = shuffledRemaining.slice(0, needed);

    if (validPreAuthored.length + extras.length < 3) return null;
    distractorTexts = [...validPreAuthored, ...extras];
  } else {
    // No pre-authored distractors — draw all 3 from the random pool.
    const shuffled = seededShuffle(candidatePool, seed);
    if (shuffled.length < 3) return null;
    distractorTexts = shuffled.slice(0, 3);
  }

  // Build the 4-choice array and shuffle it.
  const choices: MCChoice[] = [
    { text: correctText, isCorrect: true },
    ...distractorTexts.map((text) => ({ text, isCorrect: false })),
  ];

  return seededShuffle(choices, seed + 1);
}
