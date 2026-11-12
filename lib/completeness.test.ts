import { describe, expect, it } from "vitest";
import { completenessOf } from "./completeness";
import { DEFAULT_WEIGHTS } from "./domain/types";
import type { Briefing } from "./domain/types";

const base: Briefing = {
  id: "b1",
  title: "Sr SWE",
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

describe("completeness", () => {
  it("cannot be high without LinkedIn Talent Insights", () => {
    const c = completenessOf(base, true);
    expect(c.level).not.toBe("high");
    expect(c.linkedInAttached).toBe(false);
    expect(c.banner).toMatch(/does not include LinkedIn Talent Insights/);
  });

  it("is high only with TI and live economics", () => {
    const c = completenessOf(
      {
        ...base,
        uploads: [
          {
            id: "u1",
            kind: "linkedin_ti",
            text: "Talent Insights export",
            addedAt: "2026-11-12",
          },
        ],
      },
      true,
    );
    expect(c.level).toBe("high");
  });
});
