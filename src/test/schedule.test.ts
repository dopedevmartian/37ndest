// src/test/schedule.test.ts
//
// Validation coverage for the schedule guidance calculation boundary (spec 005 T5).
// Tests calculateScheduleGuidance() directly — pure function, no db dependency.

import { describe, expect, it } from "vitest";
import { calculateScheduleGuidance } from "../features/schedule/scheduleGuidance";

// Helper: create a date N days from a reference date
function daysFrom(ref: Date, days: number): Date {
  const d = new Date(ref);
  d.setDate(d.getDate() + days);
  return d;
}

const TODAY = new Date(2026, 3, 18); // April 18, 2026 (fixed reference for tests)

describe("calculateScheduleGuidance — no date set", () => {
  it("returns no-date-set when missionDate is null", () => {
    const result = calculateScheduleGuidance(null, "standard", TODAY);
    expect(result.status).toBe("no-date-set");
    expect(result.remainingDays).toBe(0);
    expect(result.remainingWeeks).toBe(0);
    expect(result.suggestedDailyNew).toBeNull();
  });

  it("returns no-date-set when missionDate is null regardless of intensity", () => {
    const result = calculateScheduleGuidance(null, "intensive", TODAY);
    expect(result.status).toBe("no-date-set");
    expect(result.suggestedDailyNew).toBeNull();
  });
});

describe("calculateScheduleGuidance — past date", () => {
  it("returns past when mission date has already passed", () => {
    const pastDate = "2026-01-01";
    const result = calculateScheduleGuidance(pastDate, "standard", TODAY);
    expect(result.status).toBe("past");
    expect(result.remainingDays).toBe(0);
    expect(result.suggestedDailyNew).toBeNull();
  });
});

describe("calculateScheduleGuidance — behind (less than 1 week)", () => {
  it("returns behind when fewer than 7 days remain", () => {
    const soonDate = daysFrom(TODAY, 3);
    const dateStr = soonDate.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(result.status).toBe("behind");
    expect(result.remainingDays).toBe(3);
    expect(result.remainingWeeks).toBe(0);
  });
});

describe("calculateScheduleGuidance — on-track (1–14 weeks)", () => {
  it("returns on-track when 7 weeks remain", () => {
    const date = daysFrom(TODAY, 49); // 7 weeks
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(result.status).toBe("on-track");
    expect(result.remainingWeeks).toBe(7);
  });

  it("returns on-track when exactly 14 weeks remain", () => {
    const date = daysFrom(TODAY, 98); // 14 weeks
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(result.status).toBe("on-track");
    expect(result.remainingWeeks).toBe(14);
  });
});

describe("calculateScheduleGuidance — ahead (more than 14 weeks)", () => {
  it("returns ahead when more than 14 weeks remain", () => {
    const date = daysFrom(TODAY, 105); // 15 weeks
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(result.status).toBe("ahead");
    expect(result.remainingWeeks).toBe(15);
  });
});

describe("calculateScheduleGuidance — suggestedDailyNew", () => {
  it("returns 6 for standard intensity when on-track", () => {
    const date = daysFrom(TODAY, 49);
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(result.suggestedDailyNew).toBe(6);
  });

  it("returns 12 for intensive intensity when on-track", () => {
    const date = daysFrom(TODAY, 49);
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "intensive", TODAY);
    expect(result.suggestedDailyNew).toBe(12);
  });

  it("returns null when intensity is null", () => {
    const date = daysFrom(TODAY, 49);
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, null, TODAY);
    expect(result.suggestedDailyNew).toBeNull();
  });

  it("returns null when status is past", () => {
    const result = calculateScheduleGuidance("2026-01-01", "intensive", TODAY);
    expect(result.suggestedDailyNew).toBeNull();
  });
});

describe("calculateScheduleGuidance — invalid input", () => {
  it("returns invalid-input for a malformed date string", () => {
    const result = calculateScheduleGuidance("not-a-date", "standard", TODAY);
    expect(result.status).toBe("invalid-input");
    expect(result.remainingDays).toBe(0);
    expect(result.remainingWeeks).toBe(0);
    expect(result.suggestedDailyNew).toBeNull();
  });

  it("returns invalid-input for a partial date string", () => {
    const result = calculateScheduleGuidance("2026-07", "intensive", TODAY);
    expect(result.status).toBe("invalid-input");
    expect(result.suggestedDailyNew).toBeNull();
  });

  it("returns invalid-input for an empty-ish non-null string", () => {
    const result = calculateScheduleGuidance("   ", null, TODAY);
    expect(result.status).toBe("invalid-input");
  });
});

describe("ScheduleGuidance result shape (T8)", () => {
  it("result has all required fields for a valid on-track case", () => {
    const date = daysFrom(TODAY, 49);
    const dateStr = date.toISOString().slice(0, 10);
    const result = calculateScheduleGuidance(dateStr, "standard", TODAY);
    expect(typeof result.status).toBe("string");
    expect(typeof result.remainingDays).toBe("number");
    expect(typeof result.remainingWeeks).toBe("number");
    expect(result.suggestedDailyNew).not.toBeUndefined();
  });

  it("result has all required fields for the no-date-set case", () => {
    const result = calculateScheduleGuidance(null, null, TODAY);
    expect(result.status).toBe("no-date-set");
    expect(result.remainingDays).toBe(0);
    expect(result.remainingWeeks).toBe(0);
    expect(result.suggestedDailyNew).toBeNull();
  });
});

describe("ScheduleStatus completeness (T8)", () => {
  it("all six status values are reachable", () => {
    const statuses = new Set([
      calculateScheduleGuidance(null, null, TODAY).status,
      calculateScheduleGuidance("not-a-date", null, TODAY).status,
      calculateScheduleGuidance("2026-01-01", null, TODAY).status,
      calculateScheduleGuidance(daysFrom(TODAY, 3).toISOString().slice(0, 10), null, TODAY).status,
      calculateScheduleGuidance(daysFrom(TODAY, 49).toISOString().slice(0, 10), null, TODAY).status,
      calculateScheduleGuidance(daysFrom(TODAY, 105).toISOString().slice(0, 10), null, TODAY).status,
    ]);
    expect(statuses.has("no-date-set")).toBe(true);
    expect(statuses.has("invalid-input")).toBe(true);
    expect(statuses.has("past")).toBe(true);
    expect(statuses.has("behind")).toBe(true);
    expect(statuses.has("on-track")).toBe(true);
    expect(statuses.has("ahead")).toBe(true);
  });
});
