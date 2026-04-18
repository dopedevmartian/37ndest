// SettingsView — minimal settings surface for 37NDEST.
// T1: structural, honest settings page with Study and About sections.
// T2: global study direction preference persisted via settingsService.
// T3: profile-specific study direction preference when a profile is active.
// T4: mission date and study intensity pacing inputs.
// T6: schedule guidance display derived from saved pacing inputs.

import { useEffect, useState } from "react";
import {
  getPreferredStudyDirection,
  setPreferredStudyDirection,
  getProfilePreferredStudyDirection,
  setProfilePreferredStudyDirection,
  getMissionDate,
  setMissionDate,
  getStudyIntensity,
  setStudyIntensity,
  type PreferredStudyDirection,
  type StudyIntensity,
} from "../features/settings/settingsService";
import { calculateScheduleGuidance } from "../features/schedule/scheduleGuidance";
import type { ScheduleGuidance } from "../types/schedule";

type SettingsViewProps = {
  activeProfileId: string | null;
  onBack: () => void;
};

function statusLabel(guidance: ScheduleGuidance): string {
  switch (guidance.status) {
    case "no-date-set":    return "No date set yet.";
    case "invalid-input":  return "Mission date is not valid. Please check the date.";
    case "past":           return "Mission date has passed.";
    case "behind":         return "Less than a week remaining.";
    case "on-track":       return "On track.";
    case "ahead":          return "Ahead of schedule.";
  }
}

export function SettingsView({ activeProfileId, onBack }: SettingsViewProps) {
  const [preferredDirection, setPreferredDirection] =
    useState<PreferredStudyDirection>(null);
  const [missionDate, setMissionDateState] = useState<string>("");
  const [studyIntensity, setStudyIntensityState] = useState<StudyIntensity>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [dir, date, intensity] = await Promise.all([
        activeProfileId
          ? getProfilePreferredStudyDirection(activeProfileId)
          : getPreferredStudyDirection(),
        getMissionDate(),
        getStudyIntensity(),
      ]);
      if (!cancelled) {
        setPreferredDirection(dir);
        setMissionDateState(date ?? "");
        setStudyIntensityState(intensity);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeProfileId]);

  async function handleSetDirection(direction: PreferredStudyDirection) {
    if (activeProfileId) {
      await setProfilePreferredStudyDirection(activeProfileId, direction);
    } else {
      await setPreferredStudyDirection(direction);
    }
    setPreferredDirection(direction);
  }

  async function handleMissionDateChange(value: string) {
    setMissionDateState(value);
    await setMissionDate(value === "" ? null : value);
  }

  async function handleSetIntensity(intensity: StudyIntensity) {
    await setStudyIntensity(intensity);
    setStudyIntensityState(intensity);
  }

  // Derive guidance synchronously from current state — pure calculator, no async needed.
  const guidance = calculateScheduleGuidance(
    missionDate === "" ? null : missionDate,
    studyIntensity
  );

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <h2 className="text-xl font-semibold tracking-tight text-white">
          Settings
        </h2>

        {loading ? (
          <p className="mt-6 text-sm text-slate-600">Loading…</p>
        ) : (
          <>
            {/* Study section */}
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
                Study
              </p>
              <div className="space-y-2">
                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-sm font-medium text-slate-300">
                    Default study direction
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {activeProfileId
                      ? "Saved for this profile. You can still choose a different direction when starting a session."
                      : "No profile active. Select a profile to save a profile-specific preference."}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {(["recognition", "production", null] as PreferredStudyDirection[]).map((dir) => {
                      const label = dir === "recognition" ? "Recognition" : dir === "production" ? "Production" : "No preference";
                      const isActive = preferredDirection === dir;
                      return (
                        <button
                          key={String(dir)}
                          onClick={() => handleSetDirection(dir)}
                          className={[
                            "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition",
                            isActive
                              ? "bg-blue-600 text-white"
                              : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule section — inputs */}
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
                Schedule
              </p>
              <div className="space-y-2">
                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-sm font-medium text-slate-300">
                    Mission trip date
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Used for pacing guidance.
                  </p>
                  <input
                    type="date"
                    value={missionDate}
                    onChange={(e) => handleMissionDateChange(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-sm font-medium text-slate-300">
                    Study intensity
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Used for pacing guidance.
                  </p>
                  <div className="mt-3 flex gap-2">
                    {(["standard", "intensive"] as const).map((val) => {
                      const isActive = studyIntensity === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleSetIntensity(val)}
                          className={[
                            "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium capitalize transition",
                            isActive
                              ? "bg-blue-600 text-white"
                              : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Pacing guidance — calculated output, clearly separate from inputs */}
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
                Pacing guidance
              </p>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-4 space-y-2">
                <p className="text-sm text-slate-300">{statusLabel(guidance)}</p>
                {guidance.remainingWeeks > 0 && (
                  <p className="text-xs text-slate-400">
                    {guidance.remainingWeeks} week{guidance.remainingWeeks !== 1 ? "s" : ""} remaining
                    {" "}({guidance.remainingDays} day{guidance.remainingDays !== 1 ? "s" : ""})
                  </p>
                )}
                {guidance.suggestedDailyNew !== null && (
                  <p className="text-xs text-slate-400">
                    Suggested: ~{guidance.suggestedDailyNew} new items per day
                  </p>
                )}
              </div>
            </div>

            {/* About section */}
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
                About
              </p>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-4 space-y-1">
                <p className="text-sm font-medium text-white">37NDEST</p>
                <p className="text-xs text-slate-400">
                  Japanese conversation trainer
                </p>
                <p className="text-xs text-slate-500">
                  A focused study tool for two users preparing for a mission trip.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
