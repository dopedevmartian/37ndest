// db.ts — Dexie database definition for 37NDEST
// Manages local IndexedDB persistence for profiles, app settings, and
// future review progress. Canonical deck content is NOT stored here.

import Dexie, { type Table } from "dexie";
import type { AppSettings, CardBucket, ConfidenceRecord, Profile, ProfileSettings, ReviewProgress } from "../types/db";

class AppDatabase extends Dexie {
  profiles!: Table<Profile, string>;
  settings!: Table<AppSettings, string>;
  reviewProgress!: Table<ReviewProgress, string>;
  profileSettings!: Table<ProfileSettings, string>;
  cardBuckets!: Table<CardBucket, string>;
  cardConfidence!: Table<ConfidenceRecord, string>;

  constructor() {
    super("37ndest");

    this.version(1).stores({
      // v1 — initial schema (createdAt not indexed; superseded by v2)
      profiles: "id, name",
    });

    this.version(2).stores({
      // profiles — createdAt indexed to support orderBy("createdAt")
      profiles: "id, name, createdAt",
      // settings — single "global" row tracking active profile
      settings: "id",
      // reviewProgress — keyed by id; profileId + cardId indexed for queries
      reviewProgress: "id, profileId, cardId",
    });

    this.version(3).stores({
      // profileSettings — one row per profile, keyed by profileId
      profileSettings: "id",
    });

    this.version(4).stores({
      // cardBuckets — per-card-per-user mastery state.
      // id is composite key "{profileId}:{cardId}" — one record per profile per card.
      // Indexed by profileId and cardId for efficient queries.
      // Bucket write logic is implemented in Phase 5.
      cardBuckets: "id, profileId, cardId",
    });

    this.version(5).stores({
      // cardConfidence — per-card-per-profile confidence tracking.
      // id is composite key "{profileId}:{cardId}" — one record per profile per card.
      // Indexed by profileId and cardId for efficient queries.
      // Drives within-session reinsertion and end-of-session "practice again" logic.
      cardConfidence: "id, profileId, cardId",
    });
  }
}

/** Singleton database instance used throughout the app. */
export const db = new AppDatabase();
