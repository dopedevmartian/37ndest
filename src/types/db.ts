// db.ts — minimal type definitions for the local persistence layer
// These types define the shape of IndexedDB stores used by the app.
// Canonical deck content is NOT stored here — it remains read-only app content.

/** A local user profile. The app supports two profiles. */
export interface Profile {
  /** Unique identifier (UUID). */
  id: string;
  /** Display name chosen by the user. */
  name: string;
  /** Unix timestamp (ms) when the profile was created. */
  createdAt: number;
  /** Unix timestamp (ms) when the profile was last updated. */
  updatedAt: number;
}

/**
 * App-level settings record.
 * A single row keyed to "global" tracks which profile is currently active.
 * Per-profile settings will be added in a later spec.
 */
export interface AppSettings {
  /** Always "global" for the single app-settings row. */
  id: "global";
  /** The id of the currently active profile, or null if none selected. */
  activeProfileId: string | null;
  /**
   * The user's preferred default study direction.
   * Stored as a saved preference — not a hard lock on session behavior.
   * null means no preference set (user will be asked each session).
   */
  preferredStudyDirection?: "recognition" | "production" | null;
  /**
   * The target mission trip date in YYYY-MM-DD format.
   * Used as the primary input for schedule/pacing guidance.
   * null means not yet set.
   */
  missionDate?: string | null;
  /**
   * The study intensity preference.
   * Matches the named profiles in the schedule config: "standard" or "intensive".
   * null means not yet set.
   */
  studyIntensity?: "standard" | "intensive" | null;
}

/**
 * Per-profile settings record.
 * One row per profile, keyed by profileId.
 * Holds profile-specific preferences separate from global app settings.
 */
export interface ProfileSettings {
  /** The profile id this settings record belongs to. */
  id: string;
  /**
   * This profile's preferred default study direction.
   * Overrides the global preference when a profile is active.
   * null means no preference set for this profile.
   */
  preferredStudyDirection?: "recognition" | "production" | null;
}

/**
 * Per-card-per-user bucket state record.
 * One record per profile per card — updated on each review interaction.
 * Separate from ReviewProgress (the raw interaction log).
 * Drives mastery display, recently-missed shelf, and trip-phase weighting.
 *
 * id is a composite key: "{profileId}:{cardId}"
 *
 * bucket values:
 *   0 = Learning  (new or frequently missed)
 *   1 = Familiar  (seen and mostly correct)
 *   2 = Strong    (consistently correct)
 *
 * Bucket write logic is implemented in Phase 5.
 * This store is created in Phase 3 so Phase 5 can write to it.
 */
export interface CardBucket {
  /** Composite key: "{profileId}:{cardId}" — one record per profile per card. */
  id: string;
  /** The profile this bucket belongs to. */
  profileId: string;
  /** The canonical note id (MJD-NNN or slug). */
  cardId: string;
  /** Total times this card has been presented to this profile. */
  seen_count: number;
  /** Times the user answered correctly. */
  correct_count: number;
  /** Times the user answered incorrectly. */
  incorrect_count: number;
  /** Unix timestamp (ms) of the last time this card was presented. */
  last_seen: number;
  /** Mastery bucket: 0=Learning, 1=Familiar, 2=Strong. */
  bucket: 0 | 1 | 2;
}

/**
 * Per-card-per-profile confidence record.
 * One record per profile per card — updated after each review outcome.
 * Tracks a rolling confidence score and recent outcome history.
 * Drives within-session reinsertion and end-of-session "practice again" logic.
 *
 * Distinct from CardBucket: ConfidenceRecord is immediate reinforcement memory
 * (volatile, responsive). CardBucket is the broader mastery classification layer.
 * The two systems must not be merged.
 *
 * id is a composite key: "{profileId}:{cardId}"
 *
 * Score rules:
 *   correct   → min(score + 1, 10)
 *   incorrect → max(score - 2, 0)
 *   initial   → 5 (neutral, no record written until first outcome)
 */
export interface ConfidenceRecord {
  /** Composite key: "{profileId}:{cardId}" — one record per profile per card. */
  id: string;
  /** The canonical note id (MJD-NNN or slug). */
  cardId: string;
  /** The profile this record belongs to. */
  profileId: string;
  /** Confidence score: integer 0–10. */
  confidenceScore: number;
  /** Last 10 outcomes, newest first. Only "correct" and "incorrect" are stored. */
  recentOutcomes: ("correct" | "incorrect")[];
  /** Unix timestamp (ms) of the last review outcome recorded. */
  lastReviewedAt: number;
}

/**
 * Per-profile review progress record.
 * One record per item result, tied to a specific profile.
 * Canonical content is not stored here — only the note id (cardId) is referenced.
 * Fields are structured to support later pacing and schedule work.
 */
export interface ReviewProgress {
  /** Unique identifier for this progress record (UUID). */
  id: string;
  /** The profile this progress belongs to. */
  profileId: string;
  /** The canonical note id this progress tracks (maps to CanonicalNote.id). */
  cardId: string;
  /** The study direction used for this review interaction. */
  direction: "recognition" | "production";
  /** The outcome of this review interaction. */
  outcome: "correct" | "incorrect" | "skipped";
  /** Unix timestamp (ms) when this review interaction occurred. */
  reviewedAt: number;
}
