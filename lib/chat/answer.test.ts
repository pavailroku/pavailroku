import { describe, expect, it } from "vitest";
import { assembleDigest } from "@/lib/digest/build";
import type { EngineResult, LocationCard } from "@/lib/domain/types";
import { answerFromDigest, answerFromEngine, clarifyText } from "./answer";

function card(partial: Partial<LocationCard> & Pick<LocationCard, "locationId" | "name">): LocationCard {
  return {
    country: "UK",
    exploratory: false,
    employingPresence: true,
    currency: "GBP",
    talent: 70,
    colIndex: 100,
    colScope: "city",
    housingPressure: 1,
    inflationPct: 3.8,
    marketPay: 85000,
    budget: 90000,
    budgetFit: 1,
    realWageIndex: 1,
    livingStandardVsAnchorPct: 0,
    marketHeat: 0.2,
    presenceScore: 0.8,
    p50Weeks: 8,
    composite: 72,
    scores: {
      talent: 1,
      budgetFit: 1,
      realWage: 1,
      housing: 1,
      inflation: 1,
      marketEvents: 1,
      rokuPresence: 1,
      speed: 1,
    },
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
      p50OfferDays: 30,
      p75OfferDays: 45,
      p50Start: "2026-04-01",
      p75Start: "2026-05-01",
      earliestStart: "2026-03-20",
      firstPayrollMonth: "2026-04",
      inSeatWeek: "2026-W14",
      stages: [],
      slipRisks: [],
    },
    ...partial,
  };
}

describe("chat answers stay grounded", () => {
  it("uses the engine decision line and city names, not invented layoffs", () => {
    const engine = {
      briefing: { id: "b1" },
      cards: [
        card({ locationId: "cambridge", name: "Cambridge", composite: 80 }),
        card({ locationId: "manchester", name: "Manchester", composite: 70, verdict: "Talent-rich and cheaper" }),
      ],
      recommendedId: "cambridge",
      evidence: [],
      events: [],
      completeness: { banner: "Does not include LinkedIn Talent Insights." },
      grounding: {
        ok: true,
        recommendation: {
          decisionLine: "Recommend Cambridge — highest composite on talent, money, and start date. £90,000 P50 in-seat 2026-04-01; P75 2026-05-01.",
          why: "Cambridge balances talent access.",
          risks: [],
          citations: [],
        },
      },
      sourceStatus: { "talent-risk": "live" },
    } as unknown as EngineResult;
    const a = answerFromEngine(engine);
    expect(a.text).toContain("Cambridge");
    expect(a.text).toMatch(/£90,000|90000|90,000/);
    expect(a.text).not.toMatch(/AcmeCorp laid off/);
    expect(a.locations[0].name).toBe("Cambridge");
    expect(a.locations[0].talent).toBe(70);
  });

  it("quiet digest does not fabricate a company cut", () => {
    const digest = assembleDigest("weekly", [], true, new Date("2026-11-12T00:00:00Z"));
    const a = answerFromDigest(digest);
    expect(a.text).toMatch(/Quiet period/i);
    expect(a.text).not.toMatch(/laid off 400/);
  });

  it("clarify has no fake numbers", () => {
    const a = clarifyText(["budget"], true);
    expect(a.text).toMatch(/budget/i);
    expect(a.live).toBe(false);
  });
});
