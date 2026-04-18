// src/features/deck-import/deckContent.ts
//
// Stable trusted-content access boundary for 37NDEST.
// Future features should consume canonical deck content through getCanonicalDeck()
// or tryGetCanonicalDeck() rather than calling loadCanonicalDeck() directly.
//
// The deck is loaded and validated once on first access, then cached in module
// scope for the lifetime of the app session. Canonical content is read-only
// and is never stored in IndexedDB or mixed with mutable profile state.

import type { CanonicalDeck } from "../../types/content";
import { loadCanonicalDeck } from "./canonicalLoader";

let _deck: Readonly<CanonicalDeck> | null = null;

/**
 * Return the validated canonical deck as trusted read-only content.
 * Loads and validates on first call; returns the cached result on subsequent calls.
 * Throws if the canonical content fails validation.
 * Use tryGetCanonicalDeck() when a non-throwing failure path is needed.
 */
export function getCanonicalDeck(): Readonly<CanonicalDeck> {
  if (_deck === null) {
    _deck = loadCanonicalDeck();
  }
  return _deck;
}

/** Discriminated union result for safe canonical content access. */
export type ContentResult =
  | { ok: true; deck: Readonly<CanonicalDeck> }
  | { ok: false; error: string };

/**
 * Return the validated canonical deck without throwing.
 * Returns { ok: true, deck } on success or { ok: false, error } on failure.
 * Profile state is never touched by this function regardless of outcome.
 * Use this when callers need to handle content failure explicitly.
 */
export function tryGetCanonicalDeck(): ContentResult {
  try {
    return { ok: true, deck: getCanonicalDeck() };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown canonical content error.";
    return { ok: false, error };
  }
}
