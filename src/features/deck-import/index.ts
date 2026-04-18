// src/features/deck-import/index.ts
//
// Stable re-export surface for the trusted canonical content entry point.
// Consumers should import from this path rather than reaching into
// individual loader or validator files directly.

export { loadCanonicalDeck } from "./canonicalLoader";
export { getCanonicalDeck, tryGetCanonicalDeck } from "./deckContent";
export type { ContentResult } from "./deckContent";
export type { ValidationResult } from "./validateCanonicalDeck";
export { validateCanonicalDeck } from "./validateCanonicalDeck";
