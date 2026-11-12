import { describe, expect, it } from "vitest";
import {
  budgetFit,
  livingStandardDeltaPct,
  moneyVerdict,
  realWageIndex,
  seatsForPool,
} from "./economics";

describe("economics", () => {
  it("computes real wage as budget / COL index", () => {
    expect(realWageIndex(90000, 90)).toBe(1000);
    expect(realWageIndex(90000, 120)).toBe(750);
  });

  it("shows Manchester stretching a pound further than Cambridge", () => {
    const pct = livingStandardDeltaPct(90000, 96, 102);
    expect(pct).toBeGreaterThan(0);
  });

  it("flags below-market bands", () => {
    expect(budgetFit(70000, 95000)).toBeLessThan(0.9);
    expect(moneyVerdict({
      budgetFit: 0.7,
      housingPressure: 40,
      talent: 80,
      colIndex: 96,
    })).toBe("Below market");
  });

  it("counts extra senior seats in a cheaper market", () => {
    expect(seatsForPool(180000, 72000)).toBe(2.5);
  });
});
