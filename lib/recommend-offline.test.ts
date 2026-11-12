import { describe, expect, it } from "vitest";
import { DEFAULT_WEIGHTS } from "./domain/types";
import { fuse } from "./fusion";
import type { Briefing } from "./domain/types";

const briefing: Briefing = {
  id: "offline",
  title: "Sr SWE UK",
  role: "Senior Software Engineer",
  skills: ["Kubernetes"],
  countrySet: "UK",
  budget: 90000,
  currency: "GBP",
  visaRequired: false,
  createdAt: "2026-11-12",
  viewerRole: "hiring_manager",
  weights: DEFAULT_WEIGHTS,
  uploads: [],
  dismissedEventIds: [],
  pinnedEventIds: [],
};

describe("recommend offline", () => {
  it("produces a template decision and no invented pulse events", () => {
    const result = fuse(briefing, {
      events: [],
      sourceStatus: {
        "talent-risk": "offline",
        "layoffs-uk": "offline",
        ons: "offline",
        adzuna: "offline",
      },
      lastLiveFetch: {
        "talent-risk": null,
        "layoffs-uk": null,
        ons: null,
        adzuna: null,
      },
    });
    expect(result.events).toEqual([]);
    expect(result.grounding.ok).toBe(true);
    expect(result.recommendedId).toBeTruthy();
    const rec = result.cards.find((c) => c.locationId === result.recommendedId);
    expect(rec?.employingPresence).toBe(true);
    expect(result.completeness.level).not.toBe("high");
  });
});
