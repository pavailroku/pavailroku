import { describe, expect, it } from "vitest";
import { LOCATIONS } from "./domain/locations";
import { forecastStart } from "./time-to-hire";

const asOf = new Date("2026-11-12T00:00:00Z");

describe("time-to-hire", () => {
  it("UK senior notice dominates the calendar versus US", () => {
    const uk = forecastStart({
      location: LOCATIONS.find((l) => l.id === "cambridge")!,
      asOf,
      tightness: 1,
      talent: 80,
      belowMarket: false,
      visaRequired: false,
    });
    const us = forecastStart({
      location: LOCATIONS.find((l) => l.id === "austin")!,
      asOf,
      tightness: 1,
      talent: 80,
      belowMarket: false,
      visaRequired: false,
    });
    expect(uk.p50Start > us.p50Start).toBe(true);
    expect(uk.stages.some((s) => s.id === "notice" && s.p50Days === 56)).toBe(true);
    expect(us.stages.some((s) => s.id === "notice" && s.p50Days === 14)).toBe(true);
    expect(uk.modelled).toBe(true);
  });

  it("visa required moves the target start", () => {
    const base = forecastStart({
      location: LOCATIONS.find((l) => l.id === "cambridge")!,
      asOf,
      tightness: 1,
      talent: 80,
      belowMarket: false,
      visaRequired: false,
    });
    const visa = forecastStart({
      location: LOCATIONS.find((l) => l.id === "cambridge")!,
      asOf,
      tightness: 1,
      talent: 80,
      belowMarket: false,
      visaRequired: true,
    });
    expect(visa.p50Start > base.p50Start).toBe(true);
    expect(visa.stages.some((s) => s.id === "visa")).toBe(true);
  });

  it("below-market budget adds retry time", () => {
    const ok = forecastStart({
      location: LOCATIONS.find((l) => l.id === "manchester")!,
      asOf,
      tightness: 1,
      talent: 70,
      belowMarket: false,
      visaRequired: false,
    });
    const low = forecastStart({
      location: LOCATIONS.find((l) => l.id === "manchester")!,
      asOf,
      tightness: 1,
      talent: 70,
      belowMarket: true,
      visaRequired: false,
    });
    expect(low.p50OfferDays).toBeGreaterThan(ok.p50OfferDays);
  });
});
