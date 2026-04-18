// src/test/deck-import.test.ts
//
// Validation coverage for the canonical deck ingestion boundary (spec 002 T2–T5).
// Tests the deterministic validator, trusted-content access boundary, and failure handling.
// No Dexie/IndexedDB dependency. No tests for unimplemented future behavior.

import { describe, expect, it } from "vitest";
import { validateCanonicalDeck, assertValidCanonicalDeck } from "../features/deck-import/validateCanonicalDeck";
import { loadCanonicalDeck } from "../features/deck-import/canonicalLoader";
import { getCanonicalDeck, tryGetCanonicalDeck } from "../features/deck-import/deckContent";

// ---------------------------------------------------------------------------
// validateCanonicalDeck — invalid input cases
// ---------------------------------------------------------------------------

describe("validateCanonicalDeck — rejects invalid input", () => {
  it("rejects null", () => {
    const result = validateCanonicalDeck(null);
    expect(result.valid).toBe(false);
  });

  it("rejects a non-object primitive", () => {
    const result = validateCanonicalDeck("not a deck");
    expect(result.valid).toBe(false);
  });

  it("rejects missing deck_name", () => {
    const result = validateCanonicalDeck({
      canonical_format_version: "1.0",
      notes: [{ id: "X", japanese: "X", english: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/deck_name/);
  });

  it("rejects empty deck_name", () => {
    const result = validateCanonicalDeck({
      deck_name: "   ",
      canonical_format_version: "1.0",
      notes: [{ id: "X", japanese: "X", english: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/deck_name/);
  });

  it("rejects missing canonical_format_version", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      notes: [{ id: "X", japanese: "X", english: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/canonical_format_version/);
  });

  it("rejects notes that is not an array", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: "not an array",
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/notes/);
  });

  it("rejects empty notes array", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/notes/);
  });

  it("rejects a note missing id", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ japanese: "X", english: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/id/);
  });

  it("rejects a note missing japanese", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ id: "X", english: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/japanese/);
  });

  it("rejects a note missing english", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ id: "X", japanese: "X", romaji: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/english/);
  });

  it("rejects a note missing romaji", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ id: "X", japanese: "X", english: "X" }],
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/romaji/);
  });
});

// ---------------------------------------------------------------------------
// validateCanonicalDeck — valid input
// ---------------------------------------------------------------------------

describe("validateCanonicalDeck — accepts valid input", () => {
  it("accepts a minimal valid deck", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ id: "MJD-001", japanese: "は", english: "Topic marker", romaji: "wa" }],
    });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// loadCanonicalDeck — real canonical content passes validation
// ---------------------------------------------------------------------------

describe("loadCanonicalDeck — real canonical content", () => {
  it("loads without throwing", () => {
    expect(() => loadCanonicalDeck()).not.toThrow();
  });

  it("returns a deck with a non-empty deck_name", () => {
    const deck = loadCanonicalDeck();
    expect(deck.deck_name.trim().length).toBeGreaterThan(0);
  });

  it("returns a deck with notes", () => {
    const deck = loadCanonicalDeck();
    expect(deck.notes.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getCanonicalDeck — stable trusted-content access boundary (T3)
// ---------------------------------------------------------------------------

describe("getCanonicalDeck — stable access boundary", () => {
  it("returns a valid deck without throwing", () => {
    expect(() => getCanonicalDeck()).not.toThrow();
  });

  it("returns a deck with a non-empty deck_name", () => {
    const deck = getCanonicalDeck();
    expect(deck.deck_name.trim().length).toBeGreaterThan(0);
  });

  it("returns a deck with notes", () => {
    const deck = getCanonicalDeck();
    expect(deck.notes.length).toBeGreaterThan(0);
  });

  it("returns the same reference on repeated calls (cached)", () => {
    const first = getCanonicalDeck();
    const second = getCanonicalDeck();
    expect(first).toBe(second);
  });

  it("returns content consistent with loadCanonicalDeck", () => {
    const fromAccessor = getCanonicalDeck();
    const fromLoader = loadCanonicalDeck();
    expect(fromAccessor.deck_name).toBe(fromLoader.deck_name);
    expect(fromAccessor.notes.length).toBe(fromLoader.notes.length);
  });
});

// ---------------------------------------------------------------------------
// Separation boundary — canonical content vs profile state (T4)
// ---------------------------------------------------------------------------

describe("separation boundary — canonical content is not profile state", () => {
  it("canonical deck has no activeProfileId field", () => {
    const deck = getCanonicalDeck();
    // activeProfileId belongs to AppSettings (profile state), not canonical content
    expect((deck as Record<string, unknown>)["activeProfileId"]).toBeUndefined();
  });

  it("canonical notes have no profileId field", () => {
    const deck = getCanonicalDeck();
    for (const note of deck.notes) {
      // profileId belongs to ReviewProgress (user state), not canonical notes
      expect((note as Record<string, unknown>)["profileId"]).toBeUndefined();
    }
  });

  it("canonical notes have stable ids that are not UUIDs (they are MJD-prefixed)", () => {
    const deck = getCanonicalDeck();
    for (const note of deck.notes) {
      // Canonical ids follow the MJD-NNN pattern, not crypto.randomUUID() format
      expect(note.id).toMatch(/^MJD-/);
    }
  });

  it("getCanonicalDeck does not return a Profile shape", () => {
    const deck = getCanonicalDeck();
    // A Profile has createdAt and updatedAt — canonical deck does not
    expect((deck as Record<string, unknown>)["createdAt"]).toBeUndefined();
    expect((deck as Record<string, unknown>)["updatedAt"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Failure handling — invalid trusted content (T5)
// ---------------------------------------------------------------------------

describe("failure handling — invalid canonical content", () => {
  it("assertValidCanonicalDeck throws on null input", () => {
    expect(() => assertValidCanonicalDeck(null)).toThrow(/validation failed/i);
  });

  it("assertValidCanonicalDeck throws with a specific reason on missing deck_name", () => {
    expect(() =>
      assertValidCanonicalDeck({
        canonical_format_version: "1.0",
        notes: [{ id: "X", japanese: "X", english: "X", romaji: "X" }],
      })
    ).toThrow(/deck_name/);
  });

  it("assertValidCanonicalDeck throws with a specific reason on empty notes", () => {
    expect(() =>
      assertValidCanonicalDeck({
        deck_name: "Test",
        canonical_format_version: "1.0",
        notes: [],
      })
    ).toThrow(/notes/);
  });

  it("tryGetCanonicalDeck returns ok: true for real canonical content", () => {
    const result = tryGetCanonicalDeck();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.deck.notes.length).toBeGreaterThan(0);
    }
  });

  it("tryGetCanonicalDeck result has no error field on success", () => {
    const result = tryGetCanonicalDeck();
    expect(result.ok).toBe(true);
    expect((result as Record<string, unknown>)["error"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Deck-ingestion coverage completeness (T6)
// ---------------------------------------------------------------------------

describe("deck-ingestion coverage — validation result shape", () => {
  it("validateCanonicalDeck returns { valid: true } for a valid deck", () => {
    const result = validateCanonicalDeck({
      deck_name: "Test Deck",
      canonical_format_version: "1.0",
      notes: [{ id: "MJD-001", japanese: "は", english: "Topic marker", romaji: "wa" }],
    });
    expect(result).toEqual({ valid: true });
  });

  it("validateCanonicalDeck returns { valid: false, reason } for invalid input", () => {
    const result = validateCanonicalDeck({ deck_name: "X", canonical_format_version: "1.0", notes: [] });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(typeof result.reason).toBe("string");
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});

describe("deck-ingestion coverage — real canonical deck structure", () => {
  it("real canonical deck has a notes_total field", () => {
    const deck = getCanonicalDeck();
    expect(typeof (deck as Record<string, unknown>)["notes_total"]).toBe("number");
  });

  it("real canonical deck notes_total matches actual notes array length", () => {
    const deck = getCanonicalDeck();
    const notesTotal = (deck as Record<string, unknown>)["notes_total"] as number;
    expect(deck.notes.length).toBe(notesTotal);
  });

  it("real canonical deck canonical_format_version is present", () => {
    const deck = getCanonicalDeck();
    expect(deck.canonical_format_version.trim().length).toBeGreaterThan(0);
  });
});
