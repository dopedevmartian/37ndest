// src/types/schedule.ts
//
// Type definitions for the schedule guidance calculation boundary.
// These types represent the narrow, honest output of the schedule guidance calculator.
// No adaptive logic, no per-card scheduling, no dashboard output.

/** Simple status bucket for schedule guidance. */
export type ScheduleStatus =
  | "no-date-set"    // mission date has not been entered
  | "invalid-input"  // mission date string is present but not a valid date
  | "past"           // mission date has already passed
  | "behind"         // less than 1 week remaining
  | "on-track"       // 1–14 weeks remaining (within the plan window)
  | "ahead";         // more than 14 weeks remaining (more time than the plan needs)

/**
 * The narrow output of the schedule guidance calculator.
 * Produced by calculateScheduleGuidance() — pure, deterministic, no db access.
 */
export type ScheduleGuidance = {
  /** Simple status bucket. */
  readonly status: ScheduleStatus;
  /** Calendar days remaining until the mission date. 0 if past or no date set. */
  readonly remainingDays: number;
  /** Full weeks remaining (floor of remainingDays / 7). 0 if past or no date set. */
  readonly remainingWeeks: number;
  /**
   * Suggested number of new items to study per day.
   * Based on the study intensity setting and the schedule config ranges.
   * null if no intensity is set or no date is set.
   */
  readonly suggestedDailyNew: number | null;
};
