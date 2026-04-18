// src/features/deck-import/validateCanonicalDeck.ts
//
// Deterministic app-side validation for canonical deck content.
// Pure function — no side effects, no imports from db or app state.
// Canonical content must pass this validation before being treated as trusted.

import type { CanonicalDeck } from "../../types/content";

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export function validateCanonicalDeck(value: unknown): ValidationResult {
  if (typeof value !== "object" || value === null) {
    return { valid: false, reason: "Canonical deck must be a non-null object." };
  }
  const deck = value as Record<string, unknown>;

  if (typeof deck["deck_name"] !== "string" || deck["deck_name"].trim().length === 0) {
    return { valid: false, reason: "Missing or empty required field: deck_name." };
  }
  if (typeof deck["canonical_format_version"] !== "string" || deck["canonical_format_version"].trim().length === 0) {
    return { valid: false, reason: "Missing or empty required field: canonical_format_version." };
  }
  if (!Array.isArray(deck["notes"])) {
    return { valid: false, reason: "Required field notes must be an array." };
  }
  if ((deck["notes"] as unknown[]).length === 0) {
    return { valid: false, reason: "Required field notes must not be empty." };
  }

  const notes = deck["notes"] as unknown[];
  for (let i = 0; i < notes.length; i++) {
    const r = validateNote(notes[i], i);
    if (!r.valid) return r;
  }
  return { valid: true };
}

function validateNote(value: unknown, index: number): ValidationResult {
  if (typeof value !== "object" || value === null) {
    return { valid: false, reason: `Note at index ${index} must be a non-null object.` };
  }
  const note = value as Record<string, unknown>;

  if (typeof note["id"] !== "string" || note["id"].trim().length === 0) {
    return { valid: false, reason: `Note at index ${index} is missing required field: id.` };
  }
  if (typeof note["japanese"] !== "string" || note["japanese"].trim().length === 0) {
    return { valid: false, reason: `Note at index ${index} (id: ${note["id"]}) is missing required field: japanese.` };
  }
  if (typeof note["english"] !== "string" || note["english"].trim().length === 0) {
    return { valid: false, reason: `Note at index ${index} (id: ${note["id"]}) is missing required field: english.` };
  }
  if (typeof note["romaji"] !== "string" || note["romaji"].trim().length === 0) {
    return { valid: false, reason: `Note at index ${index} (id: ${note["id"]}) is missing required field: romaji.` };
  }
  return { valid: true };
}

export function assertValidCanonicalDeck(value: unknown): asserts value is CanonicalDeck {
  const result = validateCanonicalDeck(value);
  if (!result.valid) {
    throw new Error(`Canonical deck validation failed: ${result.reason}`);
  }
}
