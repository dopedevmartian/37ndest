// AppShell — root application shell
// Wires profile-aware state from useProfiles and passes it to HomeView.
// Surface switching remains simple React state — no router library needed.

import { useState } from "react";
import { useProfiles } from "../features/profiles/useProfiles";
import { HomeView } from "./HomeView";
import { ReviewView } from "./ReviewView";
import { SettingsView } from "./SettingsView";

type View = "home" | "review" | "settings";

export function AppShell() {
  const [view, setView] = useState<View>("home");
  const { state, selectProfile, addProfile } = useProfiles();

  const activeProfileId =
    state.status === "ready" ? state.activeProfileId : null;

  return (
    <main className="flex min-h-screen flex-col">
      {view === "home" && (
        <HomeView
          profilesState={state}
          onSelectProfile={selectProfile}
          onAddProfile={addProfile}
          onNavigate={(v) => setView(v)}
        />
      )}
      {view === "review" && (
        <ReviewView
          activeProfileId={activeProfileId}
          onBack={() => setView("home")}
        />
      )}
      {view === "settings" && (
        <SettingsView
          activeProfileId={activeProfileId}
          onBack={() => setView("home")}
        />
      )}
    </main>
  );
}
