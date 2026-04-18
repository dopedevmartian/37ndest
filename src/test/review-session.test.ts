// src/test/review-session.test.ts
//
// Validation coverage for the review-session entry boundary (spec 003 T1).
// Tests createSessionEntry() directly — pure function, no Dexie/IndexedDB dependency.
// No tests for unimplemented session progression, queue, or result-recording behavior.

import { describe, expect, it } from "vitest";
import { createSessionEntry } from "../features/review/sessionEntry";
import { getCanonicalDeck } from "../features/deck-import/deckContent";

const PROFILE_ID = "test-profile-id";

describe("createSessionEntry — valid inputs", () => {
  it("returns a SessionEntry with the given profileId", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect(entry.profileId).toBe(PROFILE_ID);
  });

  it("returns a SessionEntry with the trusted deck", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect(entry.deck).toBe(deck);
  });

  it("returns a SessionEntry with direction recognition", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect(entry.direction).toBe("recognition");
  });

  it("returns a SessionEntry with direction production", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    expect(entry.direction).toBe("production");
  });

  it("trims whitespace from profileId", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry("  profile-abc  ", deck, "recognition");
    expect(entry.profileId).toBe("profile-abc");
  });
});

describe("createSessionEntry — invalid inputs", () => {
  it("throws on empty profileId", () => {
    const deck = getCanonicalDeck();
    expect(() => createSessionEntry("", deck, "recognition")).toThrow(/profileId/);
  });

  it("throws on whitespace-only profileId", () => {
    const deck = getCanonicalDeck();
    expect(() => createSessionEntry("   ", deck, "recognition")).toThrow(/profileId/);
  });

  it("throws on deck with no notes", () => {
    expect(() =>
      createSessionEntry(PROFILE_ID, { deck_name: "X", canonical_format_version: "1.0", notes: [] }, "recognition")
    ).toThrow(/deck/);
  });

  it("throws on invalid direction", () => {
    const deck = getCanonicalDeck();
    expect(() =>
      // @ts-expect-error intentionally passing invalid direction
      createSessionEntry(PROFILE_ID, deck, "invalid-direction")
    ).toThrow(/direction/);
  });
});

describe("createSessionEntry — separation boundary", () => {
  it("session entry deck is the same trusted reference as getCanonicalDeck", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect(entry.deck).toBe(deck);
  });

  it("session entry does not have a createdAt field (not a Profile shape)", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect((entry as Record<string, unknown>)["createdAt"]).toBeUndefined();
  });

  it("session entry does not have a cardId field (not a ReviewProgress shape)", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    expect((entry as Record<string, unknown>)["cardId"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// selectSessionItems — session item selection (T2)
// ---------------------------------------------------------------------------

import { selectSessionItems } from "../features/review/itemSelector";

describe("selectSessionItems — basic selection", () => {
  it("returns items from the trusted deck", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    expect(items.length).toBeGreaterThan(0);
  });

  it("each item has a noteId matching a canonical note id", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const noteIds = new Set(deck.notes.map((n) => n.id));
    for (const item of items) {
      expect(noteIds.has(item.noteId)).toBe(true);
    }
  });

  it("each item note reference is the trusted canonical note", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    for (const item of items) {
      expect(item.note.id).toBe(item.noteId);
    }
  });

  it("each item direction matches the session entry direction", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    for (const item of items) {
      expect(item.direction).toBe("production");
    }
  });
});

describe("selectSessionItems — seen-card filtering", () => {
  it("excludes seen card ids from the selection", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const firstNote = deck.notes[0];
    const items = selectSessionItems(entry, new Set([firstNote.id]));
    const returnedIds = items.map((i) => i.noteId);
    expect(returnedIds).not.toContain(firstNote.id);
  });

  it("returns all items when seenCardIds is empty", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    expect(items.length).toBe(deck.notes.length);
  });

  it("returns all items when all cards have been seen (full cycle)", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const allIds = new Set(deck.notes.map((n) => n.id));
    const items = selectSessionItems(entry, allIds);
    expect(items.length).toBe(deck.notes.length);
  });

  it("accepts an array of seen ids as well as a Set", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const seenArray = [deck.notes[0].id];
    const items = selectSessionItems(entry, seenArray);
    expect(items.length).toBe(deck.notes.length - 1);
  });
});

describe("selectSessionItems — separation boundary", () => {
  it("items do not have a profileId field (not profile state)", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    for (const item of items) {
      expect((item as Record<string, unknown>)["profileId"]).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Recognition-oriented study flow (T3)
// ---------------------------------------------------------------------------

import { createRecognitionPrompt, captureRecognitionResult } from "../features/review/recognitionFlow";

describe("createRecognitionPrompt — valid input", () => {
  it("returns a prompt with revealed: false", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    expect(prompt.revealed).toBe(false);
  });

  it("returns a prompt with the same item reference", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    expect(prompt.item).toBe(items[0]);
  });
});

describe("createRecognitionPrompt — invalid input", () => {
  it("throws if item direction is production", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    expect(() => createRecognitionPrompt(items[0])).toThrow(/recognition/);
  });
});

describe("captureRecognitionResult — valid outcomes", () => {
  it("returns a result with revealed: true for outcome correct", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    expect(result.revealed).toBe(true);
    expect(result.outcome).toBe("correct");
  });

  it("returns a result with outcome incorrect", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "incorrect");
    expect(result.outcome).toBe("incorrect");
  });

  it("returns a result with outcome skipped", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "skipped");
    expect(result.outcome).toBe("skipped");
  });

  it("result item is the same reference as the prompt item", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    expect(result.item).toBe(prompt.item);
  });
});

describe("captureRecognitionResult — invalid outcome", () => {
  it("throws on an invalid outcome string", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    expect(() =>
      // @ts-expect-error intentionally passing invalid outcome
      captureRecognitionResult(prompt, "maybe")
    ).toThrow(/outcome/);
  });
});

// ---------------------------------------------------------------------------
// Production-oriented study flow (T4)
// ---------------------------------------------------------------------------

import { createProductionPrompt, captureProductionResult } from "../features/review/productionFlow";

describe("createProductionPrompt — valid input", () => {
  it("returns a prompt with recalled: false", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    expect(prompt.recalled).toBe(false);
  });

  it("returns a prompt with the same item reference", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    expect(prompt.item).toBe(items[0]);
  });
});

describe("createProductionPrompt — invalid input", () => {
  it("throws if item direction is recognition", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    expect(() => createProductionPrompt(items[0])).toThrow(/production/);
  });
});

describe("captureProductionResult — valid outcomes", () => {
  it("returns a result with recalled: true for outcome correct", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    const result = captureProductionResult(prompt, "correct");
    expect(result.recalled).toBe(true);
    expect(result.outcome).toBe("correct");
  });

  it("returns a result with outcome incorrect", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    const result = captureProductionResult(prompt, "incorrect");
    expect(result.outcome).toBe("incorrect");
  });

  it("returns a result with outcome skipped", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    const result = captureProductionResult(prompt, "skipped");
    expect(result.outcome).toBe("skipped");
  });

  it("result item is the same reference as the prompt item", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    const result = captureProductionResult(prompt, "correct");
    expect(result.item).toBe(prompt.item);
  });
});

describe("captureProductionResult — invalid outcome", () => {
  it("throws on an invalid outcome string", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    expect(() =>
      // @ts-expect-error intentionally passing invalid outcome
      captureProductionResult(prompt, "maybe")
    ).toThrow(/outcome/);
  });
});

// ---------------------------------------------------------------------------
// Session progression (T5)
// ---------------------------------------------------------------------------

import {
  createSessionState,
  getCurrentItem,
  advanceSession,
} from "../features/review/sessionProgression";

describe("createSessionState — valid input", () => {
  it("creates state with currentIndex 0", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    expect(state.currentIndex).toBe(0);
  });

  it("creates state with empty results", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    expect(state.results.length).toBe(0);
  });

  it("creates state with completed: false", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    expect(state.completed).toBe(false);
  });

  it("throws on empty items array", () => {
    expect(() => createSessionState([])).toThrow();
  });
});

describe("getCurrentItem", () => {
  it("returns the first item initially", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    expect(getCurrentItem(state)).toBe(items[0]);
  });

  it("returns null when session is completed", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    // Use a single-item session to reach completion in one advance
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const advanced = advanceSession(state, result);
    expect(getCurrentItem(advanced)).toBeNull();
  });
});

describe("advanceSession", () => {
  it("appends the result to results", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const next = advanceSession(state, result);
    expect(next.results.length).toBe(1);
    expect(next.results[0]).toBe(result);
  });

  it("increments currentIndex", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const next = advanceSession(state, result);
    expect(next.currentIndex).toBe(1);
  });

  it("does not mutate the original state", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    advanceSession(state, result);
    expect(state.currentIndex).toBe(0);
    expect(state.results.length).toBe(0);
  });

  it("sets completed: true when last item is advanced", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const next = advanceSession(state, result);
    expect(next.completed).toBe(true);
  });

  it("throws when called on a completed session", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const completed = advanceSession(state, result);
    expect(() => advanceSession(completed, result)).toThrow(/completed/);
  });
});

// ---------------------------------------------------------------------------
// Profile-specific progress recording — pure helper (T6)
// ---------------------------------------------------------------------------

import { buildReviewProgressRecord } from "../features/review/progressRecorder";

describe("buildReviewProgressRecord — valid input", () => {
  it("sets profileId from the given profile id", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(record.profileId).toBe(PROFILE_ID);
  });

  it("sets cardId from the item noteId", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(record.cardId).toBe(items[0].noteId);
  });

  it("sets direction from the item direction", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(record.direction).toBe("recognition");
  });

  it("sets outcome from the result outcome", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "incorrect");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(record.outcome).toBe("incorrect");
  });

  it("uses the provided reviewedAt timestamp", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const ts = 1700000000000;
    const record = buildReviewProgressRecord(PROFILE_ID, result, ts);
    expect(record.reviewedAt).toBe(ts);
  });

  it("generates a non-empty id", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(typeof record.id).toBe("string");
    expect(record.id.length).toBeGreaterThan(0);
  });

  it("works with a production result", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "production");
    const items = selectSessionItems(entry, new Set());
    const prompt = createProductionPrompt(items[0]);
    const result = captureProductionResult(prompt, "skipped");
    const record = buildReviewProgressRecord(PROFILE_ID, result);
    expect(record.direction).toBe("production");
    expect(record.outcome).toBe("skipped");
  });
});

describe("buildReviewProgressRecord — invalid input", () => {
  it("throws on empty profileId", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const prompt = createRecognitionPrompt(items[0]);
    const result = captureRecognitionResult(prompt, "correct");
    expect(() => buildReviewProgressRecord("", result)).toThrow(/profileId/);
  });
});

// ---------------------------------------------------------------------------
// Failure/integrity protections — recordSessionResults (T7)
// ---------------------------------------------------------------------------

import { recordSessionResults } from "../features/review/progressRecorder";

describe("recordSessionResults — rejection cases", () => {
  it("throws on empty profileId", async () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const completed = advanceSession(state, result);
    await expect(recordSessionResults("", completed)).rejects.toThrow(/profileId/);
  });

  it("throws on whitespace-only profileId", async () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const completed = advanceSession(state, result);
    await expect(recordSessionResults("   ", completed)).rejects.toThrow(/profileId/);
  });

  it("throws when session is not yet completed", async () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const state = createSessionState(items);
    // state.completed is false — session has not been advanced to completion
    await expect(recordSessionResults(PROFILE_ID, state)).rejects.toThrow(/completed/);
  });
});

describe("recordSessionResults — structural integrity", () => {
  it("a completed session has results matching the items advanced through", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const completed = advanceSession(state, result);
    // Verify the completed session has the expected shape for batch recording
    expect(completed.completed).toBe(true);
    expect(completed.results.length).toBe(1);
    expect(completed.results[0]).toBe(result);
  });

  it("each result in a completed session can produce a valid progress record", () => {
    const deck = getCanonicalDeck();
    const entry = createSessionEntry(PROFILE_ID, deck, "recognition");
    const items = selectSessionItems(entry, new Set());
    const singleItem = [items[0]];
    const state = createSessionState(singleItem);
    const prompt = createRecognitionPrompt(singleItem[0]);
    const result = captureRecognitionResult(prompt, "correct");
    const completed = advanceSession(state, result);
    // Use buildReviewProgressRecord to verify record shape without db
    const record = buildReviewProgressRecord(PROFILE_ID, completed.results[0]);
    expect(record.profileId).toBe(PROFILE_ID);
    expect(record.cardId).toBe(singleItem[0].noteId);
    expect(record.outcome).toBe("correct");
  });
});
