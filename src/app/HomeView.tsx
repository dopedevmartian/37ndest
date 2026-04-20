// HomeView — home/start surface with minimal profile-aware entry behavior.
// Shows existing profiles (up to 2), allows selecting one, allows creating one.
//
// Spec 008: V1-era glassmorphism replaced with V2 design system tokens.
// Profile selector, create form, and navigation buttons are functionally unchanged.

import { useState } from "react";
import type { ProfilesState } from "../features/profiles/useProfiles";
import type { Profile } from "../types/db";

type HomeViewProps = {
  profilesState: ProfilesState;
  onSelectProfile: (id: string) => void;
  onAddProfile: (name: string) => Promise<Profile | null>;
  onNavigate: (view: "review" | "profile") => void;
};

export function HomeView({
  profilesState,
  onSelectProfile,
  onAddProfile,
  onNavigate,
}: HomeViewProps) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = profilesState.status === "ready";
  const profiles = isReady ? profilesState.profiles : [];
  const activeId = isReady ? profilesState.activeProfileId : null;
  const canAddProfile = isReady && profiles.length < 2;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (!isReady) {
      setError("Still loading. Please wait.");
      return;
    }
    if (profiles.length >= 2) {
      setError("Two profiles already exist.");
      return;
    }

    setCreating(true);
    setError(null);
    const result = await onAddProfile(trimmed);
    setCreating(false);
    if (result) {
      setNewName("");
    } else {
      setError("Could not create profile. Please try again.");
    }
  }

  return (
    <section
      className="flex flex-1 flex-col items-center justify-center px-6 py-16 pb-24"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="w-full max-w-sm">

        {/* Callsign */}
        <p
          className="mb-2 font-inter text-xs uppercase tracking-widest"
          style={{ color: "var(--bengara)" }}
        >
          37NDEST
        </p>

        {/* Heading */}
        <h1
          className="font-inter text-2xl font-semibold tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Japanese conversation trainer
        </h1>

        {/* Subheading */}
        <p
          className="mt-3 font-source-serif italic text-sm leading-6"
          style={{ color: "var(--ink-muted)" }}
        >
          Select a profile to continue, or create one below.
        </p>

        {/* Profile selector */}
        <div className="mt-6 space-y-2">
          {profilesState.status === "loading" && (
            <p className="font-inter text-sm" style={{ color: "var(--ink-faint)" }}>
              Loading profiles…
            </p>
          )}

          {profilesState.status === "error" && (
            <p className="font-inter text-sm" style={{ color: "var(--coral)" }}>
              Could not load profiles: {profilesState.message}
            </p>
          )}

          {isReady && profiles.length === 0 && (
            <p className="font-inter text-sm" style={{ color: "var(--ink-faint)" }}>
              No profiles yet. Create one below.
            </p>
          )}

          {profiles.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className="w-full rounded-2xl border px-4 py-3 text-left font-inter text-sm font-medium transition"
                style={{
                  borderColor: isActive ? "var(--bengara)" : "var(--rule)",
                  backgroundColor: isActive ? "var(--paper-deep)" : "var(--paper)",
                  color: isActive ? "var(--ink)" : "var(--ink-soft)",
                }}
              >
                {p.name}
                {isActive && (
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "var(--bengara)" }}
                  >
                    (active)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Create profile form */}
        {canAddProfile && (
          <form onSubmit={handleCreate} className="mt-4 flex gap-2">
            <input
              type="text"
              name="profile-name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New profile name"
              maxLength={40}
              className="min-w-0 flex-1 rounded-xl px-3 py-2 font-inter text-base focus:outline-none"
              style={{
                border: "1px solid var(--rule)",
                backgroundColor: "var(--paper-deep)",
                color: "var(--ink)",
              }}
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="rounded-xl px-4 py-2 font-inter text-sm font-medium transition disabled:opacity-40"
              style={{
                backgroundColor: "var(--ink)",
                color: "var(--paper)",
              }}
            >
              Add
            </button>
          </form>
        )}

        {error && (
          <p className="mt-2 font-inter text-xs" style={{ color: "var(--coral)" }}>
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => onNavigate("review")}
            disabled={!activeId}
            className="w-full rounded-2xl py-3 font-inter text-sm font-medium transition disabled:opacity-40"
            style={{
              backgroundColor: "var(--ink)",
              color: "var(--paper)",
            }}
          >
            Start review
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="w-full rounded-2xl border py-3 font-inter text-sm font-medium transition"
            style={{
              borderColor: "var(--rule)",
              backgroundColor: "var(--paper)",
              color: "var(--ink-muted)",
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </section>
  );
}
