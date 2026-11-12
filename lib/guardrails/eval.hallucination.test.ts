import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import type { Evidence, LocationCard, Recommendation } from "../domain/types";
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
    budgetFit: 1,
    realWageIndex: 937.5,
    livingStandardVsAnchorPct: 6,
    marketHeat: 0,
    presenceScore: 80,
    p50Weeks: 16,
    composite: 71,
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

type Case = {
  id: string;
  expect: "pass" | "fail";
  useTemplate?: boolean;
  extraEvidence?: Evidence[];
  payload?: Recommendation;
};

const pack = JSON.parse(
  readFileSync(new URL("../../evals/hallucination.json", import.meta.url), "utf8"),
) as { cases: Case[] };

describe("hallucination eval pack", () => {
  for (const c of pack.cases) {
    it(c.id, () => {
      const ev = [...evidence, ...(c.extraEvidence ?? [])];
      const payload = c.useTemplate
        ? templateDecision(cards, "manchester")
        : c.payload!;
      const result = ground({
        payload,
        evidence: ev,
        cards,
        recommendedId: "manchester",
      });
      if (c.expect === "pass") expect(result.ok).toBe(true);
      else expect(result.ok).toBe(false);
    });
  }
});
