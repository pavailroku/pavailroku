import { describe, expect, it } from "vitest";
import { assembleDigest } from "./build";
import { digestEmailHtml } from "./email";
import type { MarketEvent } from "../domain/types";

const event: MarketEvent = {
  id: "amz",
  company: "Amazon",
  type: "Cuts announced",
  date: "2026-11-10",
  url: "https://example.com/amz",
  publisher: "FT",
  sourceName: "Talent Risk",
  tier: "Major outlet",
  countries: ["UK"],
  summary: "Amazon cuts Kubernetes platform roles in the UK",
};

describe("digest email branding", () => {
  it("uses Roku primary purple and labelled sections", () => {
    const digest = assembleDigest("weekly", [event], true, new Date("2026-11-12T00:00:00Z"));
    const html = digestEmailHtml(digest);
    expect(html).toContain("#4F01A3");
    expect(html).toContain("#20004C");
    expect(html).toContain("ROKU");
    expect(html).toContain("What to source");
    expect(html).toContain("Why it is here");
    expect(html).toContain("Maps to:");
    expect(html).toContain("Not a tech magazine");
  });
});
