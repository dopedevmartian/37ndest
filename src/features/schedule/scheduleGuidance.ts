// src/features/schedule/scheduleGuidance.ts
//
// Schedule guidance calculation boundary for 37NDEST.
// Pure, deterministic function — no db access, no async, no adaptive logic.
// Consumes the persisted pacing inputs (missionDate, studyIntensity) and
// produces a narrow, honest ScheduleGuidance result for later UI display.
//
// suggestedDailyNew is derived from the schedule config's normal_new_per_day_range [6, 12]:
//   standard  → 6 (lower bound — steady, sustainable pace)
//   intensive → 12 (upper bound — pushing harder toward the deadline)
// These values map directly to the named intensity profiles in the schedule config.

import type { StudyIntensity } from "../settings/settingsService";
import type { ScheduleGuidance, ScheduleStatus } from "../../types/schedule";

/** The plan window in weeks — matches the 14-week schedule config. */
const PLAN_WEEKS = 14;

/** Suggested daily new items by intensity, from the schedule config normal range [6, 12]. */
const SUGGESTED_DAILY_NEW: Record<"standard" | "intensive", number> = {
  standard: 6,
  intensive: 12,
};

/**
 * Calculate narrow, honest schedule guidance from the given pacing inputs.
 *
 * @param missionDate - YYYY-MM-DD string or null if not set.
 * @param studyIntensity - "standard" | "intensive" | null if not set.
 * @param today - Optional override for the current date (for testing). Defaults to new Date().
 * @returns A ScheduleGuidance result.
 */
export function calculateScheduleGuidance(
  missionDate: string | null,
  studyIntensity: StudyIntensity,
  today: Date = new Date()
): ScheduleGuidance {
  if (!missionDate) {
    return {
      status: "no-date-set",
      remainingDays: 0,
      remainingWeeks: 0,
      suggestedDailyNew: null,
    };
  }

  // Parse the mission date as a local date at midnight to avoid timezone drift.
  const [year, month, day] = missionDate.split("-").map(Number);
  const mission = new Date(year, month - 1, day);

  // Guard against malformed date strings that produce an invalid Date.
  if (isNaN(mission.getTime())) {
    return {
      status: "invalid-input",
      remainingDays: 0,
      remainingWeeks: 0,
      suggestedDailyNew: null,
    };
  }

  // Normalize today to midnight for a clean day-level comparison.
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = mission.getTime() - todayMidnight.getTime();
  const remainingDays = Math.max(0, Math.floor(diffMs / msPerDay));
  const remainingWeeks = Math.floor(remainingDays / 7);

  let status: ScheduleStatus;
  if (diffMs < 0) {
    status = "past";
  } else if (remainingWeeks < 1) {
    status = "behind";
  } else if (remainingWeeks <= PLAN_WEEKS) {
    status = "on-track";
  } else {
    status = "ahead";
  }

  const suggestedDailyNew =
    studyIntensity && status !== "past"
      ? SUGGESTED_DAILY_NEW[studyIntensity]
      : null;

  return {
    status,
    remainingDays,
    remainingWeeks,
    suggestedDailyNew,
  };
}
