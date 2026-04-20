// SettingsView — settings surface for 37NDEST.
//
// Spec 008: V1-era dark styling replaced with V2 design system tokens.
// List-row pattern preserved. Settings logic, state, and behavior unchanged.

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

// Divider-style section header — renders a rule on each side of the label.
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-8">
      <div className="h-px flex-1" style={{ background: "var(--rule)" }} />
      <div
        className="text-[0.65rem] tracking-[0.18em] uppercase"
        style={{ color: "var(--ink-faint)" }}
      >
        {label}
      </div>
      <div className="h-px flex-1" style={{ background: "var(--rule)" }} />
    </div>
  );
}

export function SettingsView({ activeProfileId, onBack }: SettingsViewProps) {
  const [preferredDirection, setPreferredDirection] =
    useState<PreferredStudyDirection>(null);
  const [missionDate, setMissionDateState] = useState<string>("");
  const [studyIntensity, setStudyIntensityState] = useState<StudyIntensity>(null);
  const [loading, setLoading] = useState(true);
  // `now` is updated on visibilitychange and at midnight so that
  // calculateScheduleGuidance always receives the current date.
  const [now, setNow] = useState(() => new Date());

  // Refresh `now` when the app returns to the foreground.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        setNow(new Date());
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Refresh `now` at the next midnight so the count rolls over automatically.
  useEffect(() => {
    const n = new Date();
    const msUntilMidnight =
      new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime() - n.getTime();
    const timer = setTimeout(() => setNow(new Date()), msUntilMidnight);
    return () => clearTimeout(timer);
  }, [now]); // re-schedule after each midnight tick

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

  const guidance = calculateScheduleGuidance(
    missionDate === "" ? null : missionDate,
    studyIntensity,
    now
  );

  return (
    <section
      className="flex flex-col min-h-screen overflow-y-auto px-5 py-8"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-inter text-sm transition"
        style={{ color: "var(--ink-muted)" }}
      >
        <span aria-hidden="true">←</span> Back
      </button>

      <h2
        className="font-inter text-xl font-semibold tracking-tight mb-2"
        style={{ color: "var(--ink)" }}
      >
        Settings
      </h2>

      {loading ? (
        <p className="mt-6 font-inter text-sm" style={{ color: "var(--ink-faint)" }}>
          Loading…
        </p>
      ) : (
        <>
          {/* ── Profile ─────────────────────────────────────────── */}
          <SectionHeader label="Profile" />
          <div className="mt-2" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="py-3" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm" style={{ color: "var(--ink-muted)" }}>
                Profile management coming in a later phase.
              </p>
            </div>
          </div>

          {/* ── Study preferences ───────────────────────────────── */}
          <SectionHeader label="Study Preferences" />
          <div className="mt-2" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="py-3" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm font-medium" style={{ color: "var(--ink)" }}>
                Default study direction
              </p>
              <p className="mt-1 font-inter text-xs" style={{ color: "var(--ink-faint)" }}>
                {activeProfileId
                  ? "Saved for this profile. You can still choose a different direction when starting a session."
                  : "No profile active. Select a profile to save a profile-specific preference."}
              </p>
              <div className="mt-3 flex gap-2">
                {(["recognition", "production", null] as PreferredStudyDirection[]).map((dir) => {
                  const label =
                    dir === "recognition" ? "Recognition"
                    : dir === "production" ? "Production"
                    : "No preference";
                  const isActive = preferredDirection === dir;
                  return (
                    <button
                      key={String(dir)}
                      onClick={() => handleSetDirection(dir)}
                      className="flex-1 rounded-lg px-2 py-1.5 font-inter text-xs font-medium transition"
                      style={{
                        backgroundColor: isActive ? "var(--ink)" : "var(--paper-deep)",
                        color: isActive ? "var(--paper)" : "var(--ink-muted)",
                        border: isActive ? "none" : "1px solid var(--rule)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Trip pacing ─────────────────────────────────────── */}
          <SectionHeader label="Trip Pacing" />
          <div className="mt-2" style={{ borderTop: "1px solid var(--rule)" }}>

            {/* Mission date */}
            <div className="py-3" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm font-medium" style={{ color: "var(--ink)" }}>
                Mission trip date
              </p>
              <p className="mt-1 font-inter text-xs" style={{ color: "var(--ink-faint)" }}>
                Used for pacing guidance.
              </p>
              <input
                type="date"
                value={missionDate}
                onChange={(e) => handleMissionDateChange(e.target.value)}
                className="mt-3 w-full max-w-full rounded-lg px-3 py-2 font-inter text-sm focus:outline-none box-border"
                style={{
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--paper-deep)",
                  color: "var(--ink)",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Study intensity */}
            <div className="py-3" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm font-medium" style={{ color: "var(--ink)" }}>
                Study intensity
              </p>
              <p className="mt-1 font-inter text-xs" style={{ color: "var(--ink-faint)" }}>
                Used for pacing guidance.
              </p>
              <div className="mt-3 flex gap-2">
                {(["standard", "intensive"] as const).map((val) => {
                  const isActive = studyIntensity === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleSetIntensity(val)}
                      className="flex-1 rounded-lg px-2 py-1.5 font-inter text-xs font-medium capitalize transition"
                      style={{
                        backgroundColor: isActive ? "var(--ink)" : "var(--paper-deep)",
                        color: isActive ? "var(--paper)" : "var(--ink-muted)",
                        border: isActive ? "none" : "1px solid var(--rule)",
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pacing guidance output */}
            <div className="py-3" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                Pacing guidance
              </p>
              <p className="font-inter text-sm" style={{ color: "var(--ink-soft)" }}>
                {statusLabel(guidance)}
              </p>
              {guidance.remainingWeeks > 0 && (
                <p className="mt-1 font-inter text-xs" style={{ color: "var(--ink-muted)" }}>
                  {guidance.remainingWeeks} week{guidance.remainingWeeks !== 1 ? "s" : ""} remaining
                  {" "}({guidance.remainingDays} day{guidance.remainingDays !== 1 ? "s" : ""})
                </p>
              )}
              {guidance.suggestedDailyNew !== null && (
                <p className="mt-1 font-inter text-xs" style={{ color: "var(--ink-muted)" }}>
                  Suggested: ~{guidance.suggestedDailyNew} new items per day
                </p>
              )}
            </div>
          </div>

          {/* ── About ───────────────────────────────────────────── */}
          <SectionHeader label="About" />
          <div className="mt-2" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="py-3 space-y-1" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p className="font-inter text-sm font-medium" style={{ color: "var(--ink)" }}>
                37NDEST
              </p>
              <p className="font-source-serif text-xs" style={{ color: "var(--ink-muted)" }}>
                A focused Japanese conversation trainer for two people preparing for a
                mission trip to Sapporo, Japan.
              </p>
              <p className="font-source-serif text-xs" style={{ color: "var(--ink-muted)" }}>
                Built for practical conversational use — not academic completeness.
              </p>
              <p className="font-inter text-xs pt-1" style={{ color: "var(--ink-faint)" }}>
                Version 0.1
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
