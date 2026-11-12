import { describe, expect, it } from "vitest";
import { parseChat } from "./parse";

describe("parseChat", () => {
  it("reads a hiring manager question into a live briefing", () => {
    const p = parseChat(
      "Where should I hire a Senior Software Engineer in the UK on £90k with Kubernetes and Go?",
      false,
    );
    expect(p.intent).toBe("briefing");
    expect(p.role).toBe("Senior Software Engineer");
    expect(p.countrySet).toBe("UK");
    expect(p.budget).toBe(90000);
    expect(p.currency).toBe("GBP");
    expect(p.skills).toContain("Kubernetes");
    expect(p.skills).toContain("Go");
    expect(p.missing).toEqual([]);
  });

  it("treats weekly digest as the recruiter product", () => {
    const p = parseChat("weekly digest please", false);
    expect(p.intent).toBe("digest");
    expect(p.cadence).toBe("weekly");
  });

  it("asks for the missing budget instead of inventing one", () => {
    const p = parseChat("Senior SWE in Manchester", false);
    expect(p.intent).toBe("clarify");
    expect(p.missing).toContain("budget");
    expect(p.locationHint).toBe("manchester");
  });

  it("updates an open briefing when the user types a new number", () => {
    const p = parseChat("make the budget £110k", true);
    expect(p.intent).toBe("followup");
    expect(p.budget).toBe(110000);
  });
});
