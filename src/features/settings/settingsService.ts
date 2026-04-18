// src/features/settings/settingsService.ts
//
// Settings persistence helpers for 37NDEST.
// Manages global app preferences and profile-specific preferences.
//
// Global preferences (T2, T4): preferredStudyDirection, missionDate, studyIntensity.
// Profile-specific preference (T3): preferredStudyDirection in ProfileSettings.
//
// When a profile is active, profile-specific settings take precedence for
// direction preference. Pacing inputs (missionDate, studyIntensity) are global
// because the mission trip is shared by both users.
//
// Canonical content is not touched here.

import { db } from "../../db";

/** The valid values for a preferred study direction. */
export type PreferredStudyDirection = "recognition" | "production" | null;

/** The valid values for study intensity, matching the schedule config profiles. */
export type StudyIntensity = "standard" | "intensive" | null;

// ---------------------------------------------------------------------------
// Global preference — study direction
// ---------------------------------------------------------------------------

export async function getPreferredStudyDirection(): Promise<PreferredStudyDirection> {
  const row = await db.settings.get("global");
  return row?.preferredStudyDirection ?? null;
}

export async function setPreferredStudyDirection(
  direction: PreferredStudyDirection
): Promise<void> {
  const existing = await db.settings.get("global");
  if (existing) {
    await db.settings.update("global", { preferredStudyDirection: direction });
  } else {
    await db.settings.put({ id: "global", activeProfileId: null, preferredStudyDirection: direction });
  }
}

// ---------------------------------------------------------------------------
// Global pacing inputs — mission date and study intensity
// ---------------------------------------------------------------------------

/**
 * Return the mission trip date as a YYYY-MM-DD string, or null if not set.
 */
export async function getMissionDate(): Promise<string | null> {
  const row = await db.settings.get("global");
  return row?.missionDate ?? null;
}

/**
 * Persist the mission trip date.
 * Must be a YYYY-MM-DD string or null to clear.
 */
export async function setMissionDate(date: string | null): Promise<void> {
  const existing = await db.settings.get("global");
  if (existing) {
    await db.settings.update("global", { missionDate: date });
  } else {
    await db.settings.put({ id: "global", activeProfileId: null, missionDate: date });
  }
}

/**
 * Return the study intensity preference, or null if not set.
 */
export async function getStudyIntensity(): Promise<StudyIntensity> {
  const row = await db.settings.get("global");
  return row?.studyIntensity ?? null;
}

/**
 * Persist the study intensity preference.
 * Values must match the schedule config profiles: "standard" or "intensive".
 */
export async function setStudyIntensity(intensity: StudyIntensity): Promise<void> {
  const existing = await db.settings.get("global");
  if (existing) {
    await db.settings.update("global", { studyIntensity: intensity });
  } else {
    await db.settings.put({ id: "global", activeProfileId: null, studyIntensity: intensity });
  }
}

// ---------------------------------------------------------------------------
// Profile-specific preference — study direction
// ---------------------------------------------------------------------------

export async function getProfilePreferredStudyDirection(
  profileId: string
): Promise<PreferredStudyDirection> {
  const row = await db.profileSettings.get(profileId);
  return row?.preferredStudyDirection ?? null;
}

export async function setProfilePreferredStudyDirection(
  profileId: string,
  direction: PreferredStudyDirection
): Promise<void> {
  const existing = await db.profileSettings.get(profileId);
  if (existing) {
    await db.profileSettings.update(profileId, { preferredStudyDirection: direction });
  } else {
    await db.profileSettings.put({ id: profileId, preferredStudyDirection: direction });
  }
}
