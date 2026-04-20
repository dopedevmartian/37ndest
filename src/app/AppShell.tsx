// AppShell — V2 Phase 1 (T1.2): four-surface navigation structure.
// Surfaces: today | review | progress | profile
// Bottom nav is rendered here and conditionally shown/hidden per surface.
// Session Summary will be introduced in a later phase.

import { useState } from "react";
import { useProfiles } from "../features/profiles/useProfiles";
import { HomeView, incrementDailyProgress } from "./HomeView";
import { ReviewView } from "./ReviewView";
import { SettingsView } from "./SettingsView";

type Surface = "today" | "review" | "progress" | "profile";

const BOTTOM_NAV_SURFACES: Surface[] = ["today", "progress"];

export function AppShell() {
  const [activeSurface, setActiveSurface] = useState<Surface>("today");
  const { state, selectProfile, addProfile } = useProfiles();

  const activeProfileId =
    state.status === "ready" ? state.activeProfileId : null;

  // Incremented each time a review session completes — triggers HomeView refresh.
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  function handleSessionComplete() {
    if (activeProfileId) {
      incrementDailyProgress(activeProfileId);
    }
    setSessionCompletedCount((n) => n + 1);
  }

  const showBottomNav = BOTTOM_NAV_SURFACES.includes(activeSurface);

  return (
    <main className="flex min-h-screen flex-col">

      {/* Surface rendering */}
      {activeSurface === "today" && (
        <HomeView
          profilesState={state}
          onSelectProfile={selectProfile}
          onAddProfile={addProfile}
          onNavigate={(v: "review" | "profile") => setActiveSurface(v)}
          sessionCompletedCount={sessionCompletedCount}
        />
      )}

      {activeSurface === "review" && (
        <ReviewView
          activeProfileId={activeProfileId}
          onBack={() => setActiveSurface("today")}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {activeSurface === "progress" && (
        // Placeholder — Progress surface will be implemented in Phase 7.
        <section className="flex flex-1 flex-col px-5 py-8 pb-24">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Progress
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Coming in a later phase.
          </p>
        </section>
      )}

      {activeSurface === "profile" && (
        <SettingsView
          activeProfileId={activeProfileId}
          onBack={() => setActiveSurface("today")}
        />
      )}

      {/* Bottom nav — visible on today and progress only */}
      {showBottomNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-white/10 bg-slate-900/95"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <button
            onClick={() => setActiveSurface("today")}
            className={[
              "flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium uppercase tracking-widest transition",
              activeSurface === "today" ? "text-white" : "text-slate-500",
            ].join(" ")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12 12 4l9 8"/>
              <path d="M5 10v10h14V10"/>
            </svg>
            Today
          </button>

          <button
            onClick={() => setActiveSurface("progress")}
            className={[
              "flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium uppercase tracking-widest transition",
              activeSurface === "progress" ? "text-white" : "text-slate-500",
            ].join(" ")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3v18h18"/>
              <path d="M7 15l4-6 4 3 5-8"/>
            </svg>
            Progress
          </button>

          <button
            onClick={() => setActiveSurface("profile")}
            className={[
              "flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium uppercase tracking-widest transition",
              activeSurface === "profile" ? "text-white" : "text-slate-500",
            ].join(" ")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>
            </svg>
            Profile
          </button>
        </nav>
      )}
    </main>
  );
}
