export type CanonicalNote = {
  id: string;
  japanese: string;
  english: string;
  romaji: string;
  front?: string;
  back?: string;
  prompt?: string;
  answer?: string;
  tags?: string[];
  usage_note?: string;
  example_japanese?: string;
  example_english?: string;
  literal_breakdown?: string;
  [key: string]: unknown;
};

export type CanonicalDeck = {
  deck_name: string;
  canonical_format_version: string;
  notes: CanonicalNote[];
  [key: string]: unknown;
};