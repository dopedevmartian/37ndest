// HomeView — home/start surface with minimal profile-aware entry behavior.
// Shows existing profiles (up to 2), allows selecting one, allows creating one.
// Honest and narrow — no profile management polish beyond what T4 requires.

import { useState } from "react";
import type { ProfilesState } from "../features/profiles/useProfiles";
import type { Profile } from "../types/db";

type HomeViewProps = {
  profilesState: ProfilesState;
  onSelectProfile: (id: string) => void;
  onAddProfile: (name: string) => Promise<Profile | null>;
  onNavigate: (view: "review" | "settings") => void;
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
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-blue-300">
          37NDEST
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Japanese conversation trainer
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Select a profile to continue, or create one below.
        </p>

        {/* Profile selector */}
        <div className="mt-6 space-y-2">
          {profilesState.status === "loading" && (
            <p className="text-sm text-slate-500">Loading profiles…</p>
          )}

          {profilesState.status === "error" && (
            <p className="text-sm text-red-400">
              Could not load profiles: {profilesState.message}
            </p>
          )}

          {isReady && profiles.length === 0 && (
            <p className="text-sm text-slate-500">
              No profiles yet. Create one below.
            </p>
          )}

          {profiles.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                  isActive
                    ? "border-blue-500 bg-blue-600/20 text-white"
                    : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10",
                ].join(" ")}
              >
                {p.name}
                {isActive && (
                  <span className="ml-2 text-xs text-blue-300">(active)</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Create profile form — only shown when ready and under the limit */}
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
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-40"
            >
              Add
            </button>
          </form>
        )}

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        {/* Navigation — only enabled when a profile is active */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => onNavigate("review")}
            disabled={!activeId}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40"
          >
            Start review
          </button>
          <button
            onClick={() => onNavigate("settings")}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
          >
            Settings
          </button>
        </div>
      </div>
    </section>
  );
}
