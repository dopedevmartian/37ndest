// useProfiles.ts — minimal React hook for profile-aware app state
// Loads profiles and active profile id from IndexedDB on mount.
// Exposes just enough surface for the app shell to operate in profile context.

import { useCallback, useEffect, useRef, useState } from "react";
import type { Profile } from "../../types/db";
import {
  createProfile,
  getActiveProfileId,
  getProfiles,
  setActiveProfileId,
} from "./profileService";

export type ProfilesState =
  | { status: "loading" }
  | { status: "ready"; profiles: Profile[]; activeProfileId: string | null }
  | { status: "error"; message: string };

export function useProfiles() {
  const [state, setState] = useState<ProfilesState>({ status: "loading" });
  // Ref always holds the latest state so callbacks never close over stale values.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load profiles and active profile id from IndexedDB on mount.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profiles, activeProfileId] = await Promise.all([
          getProfiles(),
          getActiveProfileId(),
        ]);
        if (!cancelled) {
          setState({ status: "ready", profiles, activeProfileId });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load profiles.";
          setState({ status: "error", message });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Select a profile as active and persist the choice. */
  const selectProfile = useCallback(async (profileId: string) => {
    await setActiveProfileId(profileId);
    setState((prev) => {
      if (prev.status !== "ready") return prev;
      return { ...prev, activeProfileId: profileId };
    });
  }, []);

  /**
   * Create a new profile with the given name and make it active.
   * Enforces the two-profile limit — returns null if already at limit.
   * Returns null and logs on any storage error (e.g. IndexedDB unavailable).
   */
  const addProfile = useCallback(
    async (name: string): Promise<Profile | null> => {
      const current = stateRef.current;
      if (current.status !== "ready") return null;
      if (current.profiles.length >= 2) return null;
      try {
        const profile = await createProfile(name);
        await setActiveProfileId(profile.id);
        setState((prev) => {
          if (prev.status !== "ready") return prev;
          return {
            ...prev,
            profiles: [...prev.profiles, profile],
            activeProfileId: profile.id,
          };
        });
        return profile;
      } catch (err) {
        console.error("[useProfiles] addProfile failed:", err);
        return null;
      }
    },
    [] // stateRef is stable — no dependency on state needed
  );

  return { state, selectProfile, addProfile };
}
