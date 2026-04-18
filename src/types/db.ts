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
