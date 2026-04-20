// profileService.ts — minimal profile persistence helpers
// All reads and writes go through the Dexie db established in T3.
// Canonical content is not touched here.

import { db } from "../../db";
import type { Profile } from "../../types/db";

/** Return all profiles ordered by creation time. */
export async function getProfiles(): Promise<Profile[]> {
  return db.profiles.orderBy("createdAt").toArray();
}

/**
 * Generate a UUID. Uses crypto.randomUUID() when available (requires secure
 * context and iOS 15.4+). Falls back to a Math.random-based v4 UUID for
 * older iOS Safari versions where crypto.randomUUID is not available.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: RFC 4122 v4 UUID using Math.random
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a new profile with the given display name.
 * Caller is responsible for enforcing the two-profile limit before calling.
 */
export async function createProfile(name: string): Promise<Profile> {
  const now = Date.now();
  const profile: Profile = {
    id: generateId(),
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
  };
  await db.profiles.add(profile);
  return profile;
}

/** Return the currently active profile id, or null if none is set. */
export async function getActiveProfileId(): Promise<string | null> {
  const row = await db.settings.get("global");
  return row?.activeProfileId ?? null;
}

/** Persist the active profile id. Pass null to clear the selection. */
export async function setActiveProfileId(
  profileId: string | null
): Promise<void> {
  const existing = await db.settings.get("global");
  if (existing) {
    await db.settings.update("global", { activeProfileId: profileId });
  } else {
    await db.settings.put({ id: "global", activeProfileId: profileId });
  }
}
