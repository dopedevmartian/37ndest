// src/types/review.ts
//
// Minimal type definitions for the review-engine session boundary.
// These types represent the entry point where profile context and
// trusted canonical content meet to form a study session.
//
// Canonical content remains read-only. Profile state remains separate.

import type { CanonicalDeck, CanonicalNote } from "./content";

/** The two supported study directions for a review session. */
export type StudyDirection = "recognition" | "production";

/**
 * The minimal input shape for a review session entry.
 * Produced by createSessionEntry() after narrow validation.
 */
export type SessionEntry = {
  readonly profileId: string;
  readonly deck: Readonly<CanonicalDeck>;
  readonly direction: StudyDirection;
};

/**
 * A single item selected for study in a session.
 * Produced by selectSessionItems() from trusted canonical content.
 */
export type SessionItem = {
  readonly noteId: string;
  readonly note: Readonly<CanonicalNote>;
  readonly direction: StudyDirection;
};

// ---------------------------------------------------------------------------
// Recognition flow types (T3)
// ---------------------------------------------------------------------------

/** The three possible outcomes for a recognition review interaction. */
export type RecognitionOutcome = "correct" | "incorrect" | "skipped";

/** Recognition prompt state — item presented, answer not yet revealed. */
export type RecognitionPrompt = {
  readonly item: SessionItem;
  readonly revealed: false;
};

/**
 * Recognition result state — answer revealed, outcome captured.
 * Not yet persisted — persistence belongs to T6.
 */
export type RecognitionResult = {
  readonly item: SessionItem;
  readonly revealed: true;
  readonly outcome: RecognitionOutcome;
};

// ---------------------------------------------------------------------------
// Production flow types (T4)
// ---------------------------------------------------------------------------

/**
 * The three possible outcomes for a production review interaction.
 * Kept as a separate type from RecognitionOutcome to allow future divergence.
 */
export type ProductionOutcome = "correct" | "incorrect" | "skipped";

/**
 * Production prompt state — item presented, user is attempting recall.
 * Uses `recalled: false` to make the recall-before-reveal semantic explicit.
 */
export type ProductionPrompt = {
  readonly item: SessionItem;
  readonly recalled: false;
};

/**
 * Production result state — recall attempted, answer revealed, outcome captured.
 * Not yet persisted — persistence belongs to T6.
 */
export type ProductionResult = {
  readonly item: SessionItem;
  readonly recalled: true;
  readonly outcome: ProductionOutcome;
};

// ---------------------------------------------------------------------------
// Session progression types (T5)
// ---------------------------------------------------------------------------

/**
 * Union of all possible item result shapes.
 * Allows session progression to accept results from either study direction.
 */
export type ItemResult = RecognitionResult | ProductionResult;

/**
 * Minimal session progression state.
 * Pure data — no db, no UI, no timestamps, no scoring metadata.
 * Produced by createSessionState() and advanced by advanceSession().
 */
export type SessionState = {
  /** The ordered items for this session, from selectSessionItems(). */
  readonly items: readonly SessionItem[];
  /** Index of the current item. Equal to items.length when session is complete. */
  readonly currentIndex: number;
  /** Results captured so far, in order. */
  readonly results: readonly ItemResult[];
  /** True when all items have been advanced through. */
  readonly completed: boolean;
};
