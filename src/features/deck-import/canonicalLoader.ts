// src/features/deck-import/canonicalLoader.ts
//
// Trusted canonical content entry point for 37NDEST.
// Canonical deck JSON is imported at build time via Vite static import.
// Content is validated before being returned as trusted app content.
// No runtime fetch. No public/ hosting assumption. No IndexedDB writes.

import type { CanonicalDeck } from "../../types/content";
import { assertValidCanonicalDeck } from "./validateCanonicalDeck";

// Build-time static import — Vite bundles this JSON directly from the repo.
import rawDeck from "../../../data/decks/canonical/japanese_mission_deck_canonical_v1_fresh.json";

/**
 * Load and return the canonical deck as trusted read-only content.
 * Throws a descriptive error if the content fails structural validation.
 * Canonical content returned here must not be mutated by callers.
 */
export function loadCanonicalDeck(): Readonly<CanonicalDeck> {
  assertValidCanonicalDeck(rawDeck);
  return rawDeck as Readonly<CanonicalDeck>;
}
