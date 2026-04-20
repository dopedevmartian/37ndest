// V2 Phase 3: Added explicit V2 fields to CanonicalNote.
// All new fields are optional — existing cards won't have them until authored.
// The [key: string]: unknown index signature is retained for forward compatibility.

export type CanonicalNote = {
  id: string;
  japanese: string;
  english: string;
  romaji: string;
  // Internal canonical taxonomy (V1 values). UI maps to V2 display labels at render time.
  category?: string;
  // V2 required field — assigned during migration, refined during authoring.
  trip_phase?: "pre-trip" | "arrival" | "ministry" | "daily-life";
  // V2 strongly recommended — absent until authored via the V2 authoring workflow.
  simple_explanation?: string;
  // Example triple — all three present or none (for newly authored V2 cards).
  example_japanese?: string;
  example_romaji?: string;
  example_english?: string;
  // Exactly 2 distractors for MC modes — absent until authored.
  distractors?: [string, string];
  // Optional fields present in V1
  front?: string;
  back?: string;
  prompt?: string;
  answer?: string;
  tags?: string[];
  usage_note?: string;
  literal_breakdown?: string;
  [key: string]: unknown;
};

export type CanonicalDeck = {
  deck_name: string;
  canonical_format_version: string;
  notes: CanonicalNote[];
  [key: string]: unknown;
};
