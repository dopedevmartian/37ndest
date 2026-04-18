// src/test/foundation.test.ts
//
// Minimal foundation validation for 37NDEST.
// Covers the canonical content loading boundary established in T5.
// No Dexie/IndexedDB-dependent tests. No frozen-object assertions.
// No tests for unimplemented future behavior.

import { describe, expect, it } from "vitest";
import { loadCanonicalDeck } from "../features/deck-import/canonicalLoader";

describe("canonical content loader — success path", () => {
  it("returns a non-empty deck_name", async () => {
    const deck = await loadCanonicalDeck();
    expect(typeof deck.deck_name).toBe("string");
    expect(deck.deck_name.trim().length).toBeGreaterThan(0);
  });

  it("returns a present canonical_format_version", async () => {
    const deck = await loadCanonicalDeck();
    expect(typeof deck.canonical_format_version).toBe("string");
    expect(deck.canonical_format_version.trim().length).toBeGreaterThan(0);
  });

  it("returns notes as an array", async () => {
    const deck = await loadCanonicalDeck();
    expect(Array.isArray(deck.notes)).toBe(true);
  });

  it("returns a non-empty notes array", async () => {
    const deck = await loadCanonicalDeck();
    expect(deck.notes.length).toBeGreaterThan(0);
  });
});

describe("canonical content loader — structural trust boundary", () => {
  it("each note has a non-empty id", async () => {
    const deck = await loadCanonicalDeck();
    for (const note of deck.notes) {
      expect(typeof note.id).toBe("string");
      expect(note.id.trim().length).toBeGreaterThan(0);
    }
  });

  it("each note has a non-empty japanese field", async () => {
    const deck = await loadCanonicalDeck();
    for (const note of deck.notes) {
      expect(typeof note.japanese).toBe("string");
      expect(note.japanese.trim().length).toBeGreaterThan(0);
    }
  });

  it("each note has a non-empty english field", async () => {
    const deck = await loadCanonicalDeck();
    for (const note of deck.notes) {
      expect(typeof note.english).toBe("string");
      expect(note.english.trim().length).toBeGreaterThan(0);
    }
  });
});
