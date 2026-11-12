import { describe, expect, it } from "vitest";
import { DEFAULT_WEIGHTS } from "./domain/types";
import { compositeOf, componentScores, pickRecommended } from "./score";
import type { LocationCard } from "./domain/types";

function card(partial: Partial<LocationCard> & { locationId: string; composite: number; employingPresence: boolean }): LocationCard {
  return {
    name: partial.locationId,
    country: "UK",
    exploratory: !partial.employingPresence,
    currency: "GBP",
    talent: 70,
    colIndex: 100,
    colScope: "region",
    housingPressure: 50,
    inflationPct: 3,
    marketPay: 80000,
    budget: 90000,
    budgetFit: 1,
    realWageIndex: 900,
    livingStandardVsAnchorPct: 0,
    marketHeat: 0,
    presenceScore: 50,
    p50Weeks: 16,
    scores: componentScores({
      talent: 70,
      budgetFit: 1,
      colIndex: 100,
      housingPressure: 50,
      inflationPct: 3,
      marketHeat: 0,
      presenceScore: 50,
      p50Weeks: 16,
    }),
    verdict: "Budget lands well",
    teams: [],
    people: [],
    work: "",
    presenceSource: "demo",
    skills: [],
    yoe: [],
    employers: [],
    vacancyTrend: 0,
    start: {
      locationId: partial.locationId,
      modelled: true,
      p50OfferDays: 40,
      p75OfferDays: 60,
      p50Start: "2026-06-14",
      p75Start: "2026-07-21",
      earliestStart: "2026-05-01",
      firstPayrollMonth: "2026-06",
      inSeatWeek: "2026-06-15",
      stages: [],
      slipRisks: [],
    },
    ...partial,
  };
}

describe("score", () => {
  it("weights sum to a 0–100 composite", () => {
    const scores = componentScores({
      talent: 100,
      budgetFit: 1,
      colIndex: 90,
      housingPressure: 40,
      inflationPct: 2,
      marketHeat: 0.2,
      presenceScore: 80,
      p50Weeks: 12,
    });
    const n = compositeOf(scores, DEFAULT_WEIGHTS);
    expect(n).toBeGreaterThan(50);
    expect(n).toBeLessThanOrEqual(100);
  });

  it("does not default-recommend an exploratory city", () => {
    const id = pickRecommended([
      card({ locationId: "cardiff", composite: 90, employingPresence: false }),
      card({ locationId: "cambridge", composite: 80, employingPresence: true }),
    ]);
    expect(id).toBe("cambridge");
  });
});
