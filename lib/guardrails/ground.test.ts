import { describe, expect, it } from "vitest";
import type { Evidence, LocationCard } from "../domain/types";
import { ground, templateDecision } from "./ground";

const evidence: Evidence[] = [
  {
    id: "ev_col_manchester",
    kind: "col",
    value: 96,
    asOf: "2016",
    sourceName: "ONS RRCPL",
    url: "https://www.ons.gov.uk",
    confidence: "high",
    label: "Manchester COL",
    locationId: "manchester",
  },
];

const cards: LocationCard[] = [
  {
    locationId: "manchester",
    name: "Manchester",
    country: "UK",
    exploratory: false,
    employingPresence: true,
    currency: "GBP",
    talent: 74,
    colIndex: 96,
    colScope: "region",
    housingPressure: 52,
    inflationPct: 3.2,
    marketPay: 82000,
    budget: 90000,
    budgetFit: 1.1,
    realWageIndex: 937.5,
    livingStandardVsAnchorPct: 6.2,
    marketHeat: 0,
    presenceScore: 80,
    p50Weeks: 16,
    composite: 71.2,
    scores: {
      talent: 0.7,
      budgetFit: 1,
      realWage: 0.8,
      housing: 0.5,
      inflation: 0.8,
      marketEvents: 0.5,
      rokuPresence: 0.8,
      speed: 0.6,
    },
    verdict: "Talent-rich and cheaper",
    teams: [],
    people: [],
    work: "",
    presenceSource: "demo",
    skills: [],
    yoe: [],
    employers: [],
    vacancyTrend: 0,
    start: {
      locationId: "manchester",
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
  },
];

describe("ground", () => {
  it("rejects an invented Amazon layoff", () => {
    const result = ground({
      payload: {
        decisionLine: "Amazon Cambridge cut 200 — hire there now",
        why: "Layoffs",
        risks: [],
        citations: [],
      },
      evidence,
      cards,
      recommendedId: "manchester",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.withheld).toBe(true);
      expect(result.recommendation.why).toMatch(/withheld/i);
    }
  });

  it("rejects invented currency and dates", () => {
    const money = ground({
      payload: {
        decisionLine: "Pay them £85,000 in Manchester",
        why: "guess",
        risks: [],
        citations: [],
      },
      evidence,
      cards,
      recommendedId: "manchester",
    });
    expect(money.ok).toBe(false);

    const date = ground({
      payload: {
        decisionLine: "Start 12 June 2027",
        why: "guess",
        risks: [],
        citations: [],
      },
      evidence,
      cards,
      recommendedId: "manchester",
    });
    expect(date.ok).toBe(false);
  });

  it("passes a citation of Manchester COL and matching P50 date", () => {
    const result = ground({
      payload: {
        decisionLine: "Recommend Manchester. P50 in-seat 2026-06-14.",
        why: "COL index 96.",
        risks: [],
        citations: ["ev_col_manchester"],
      },
      evidence,
      cards,
      recommendedId: "manchester",
    });
    expect(result.ok).toBe(true);
  });

  it("template decision stays grounded in computed cards", () => {
    const payload = templateDecision(cards, "manchester");
    const result = ground({
      payload,
      evidence,
      cards,
      recommendedId: "manchester",
    });
    expect(result.ok).toBe(true);
  });
});
