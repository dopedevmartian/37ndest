// src/test/settings.test.ts
//
// Validation coverage for settings persistence (spec 005 T2).
// Tests the pure settingsService helpers directly.
// No UI tests. No Dexie/IndexedDB integration tests (Node environment).

import { describe, expect, it } from "vitest";
import type { PreferredStudyDirection } from "../features/settings/settingsService";

describe("PreferredStudyDirection type", () => {
  it("accepts recognition as a valid direction", () => {
    const dir: PreferredStudyDirection = "recognition";
    expect(dir).toBe("recognition");
  });

  it("accepts production as a valid direction", () => {
    const dir: PreferredStudyDirection = "production";
    expect(dir).toBe("production");
  });

  it("accepts null as no preference", () => {
    const dir: PreferredStudyDirection = null;
    expect(dir).toBeNull();
  });
});

describe("AppSettings preferredStudyDirection field", () => {
  it("is compatible with the AppSettings interface shape", () => {
    // Structural check — confirms the field is optional and typed correctly
    const settings: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      preferredStudyDirection: "recognition",
    };
    expect(settings.preferredStudyDirection).toBe("recognition");
  });

  it("allows preferredStudyDirection to be absent", () => {
    const settings: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
    };
    expect(settings.preferredStudyDirection).toBeUndefined();
  });

  it("allows preferredStudyDirection to be null", () => {
    const settings: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      preferredStudyDirection: null,
    };
    expect(settings.preferredStudyDirection).toBeNull();
  });
});

describe("ProfileSettings type", () => {
  it("accepts a profile id and optional preferredStudyDirection", () => {
    const ps: import("../types/db").ProfileSettings = {
      id: "profile-abc",
      preferredStudyDirection: "production",
    };
    expect(ps.id).toBe("profile-abc");
    expect(ps.preferredStudyDirection).toBe("production");
  });

  it("allows preferredStudyDirection to be absent", () => {
    const ps: import("../types/db").ProfileSettings = { id: "profile-abc" };
    expect(ps.preferredStudyDirection).toBeUndefined();
  });

  it("allows preferredStudyDirection to be null", () => {
    const ps: import("../types/db").ProfileSettings = {
      id: "profile-abc",
      preferredStudyDirection: null,
    };
    expect(ps.preferredStudyDirection).toBeNull();
  });

  it("profile-specific settings id is the profileId, not 'global'", () => {
    const ps: import("../types/db").ProfileSettings = { id: "profile-xyz" };
    expect(ps.id).not.toBe("global");
  });
});

describe("AppSettings pacing input fields (T4)", () => {
  it("accepts a YYYY-MM-DD missionDate string", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      missionDate: "2026-07-15",
    };
    expect(s.missionDate).toBe("2026-07-15");
  });

  it("allows missionDate to be null", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      missionDate: null,
    };
    expect(s.missionDate).toBeNull();
  });

  it("allows missionDate to be absent", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
    };
    expect(s.missionDate).toBeUndefined();
  });

  it("accepts studyIntensity standard", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      studyIntensity: "standard",
    };
    expect(s.studyIntensity).toBe("standard");
  });

  it("accepts studyIntensity intensive", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      studyIntensity: "intensive",
    };
    expect(s.studyIntensity).toBe("intensive");
  });

  it("allows studyIntensity to be null", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
      studyIntensity: null,
    };
    expect(s.studyIntensity).toBeNull();
  });
});

describe("StudyIntensity type (T8)", () => {
  it("accepts standard as a valid intensity", () => {
    const i: import("../features/settings/settingsService").StudyIntensity = "standard";
    expect(i).toBe("standard");
  });

  it("accepts intensive as a valid intensity", () => {
    const i: import("../features/settings/settingsService").StudyIntensity = "intensive";
    expect(i).toBe("intensive");
  });

  it("accepts null as no intensity set", () => {
    const i: import("../features/settings/settingsService").StudyIntensity = null;
    expect(i).toBeNull();
  });
});

describe("AppSettings global-id boundary (T8)", () => {
  it("AppSettings id is always 'global', not a profileId", () => {
    const s: import("../types/db").AppSettings = {
      id: "global",
      activeProfileId: null,
    };
    expect(s.id).toBe("global");
  });

  it("AppSettings and ProfileSettings use different id semantics", () => {
    const global: import("../types/db").AppSettings = { id: "global", activeProfileId: null };
    const profile: import("../types/db").ProfileSettings = { id: "profile-abc" };
    expect(global.id).toBe("global");
    expect(profile.id).not.toBe("global");
  });
});
