import { describe, expect, it } from "vitest";
import { relevantEvents } from "./talent-risk";
import type { MarketEvent } from "../domain/types";

const events: MarketEvent[] = [
  {
    id: "1",
    company: "Amazon",
    type: "Cuts announced",
    date: "2026-10-01",
    url: "https://example.com/amz",
    publisher: "FT",
    sourceName: "Talent Risk",
    tier: "Major outlet",
    countries: ["UK"],
    summary: "Amazon UK cuts",
  },
  {
    id: "2",
    company: "Bosch",
    type: "Cuts announced",
    date: "2026-10-01",
    url: "https://example.com/b",
    publisher: "FAZ",
    sourceName: "Talent Risk",
    tier: "Major outlet",
    countries: ["DE"],
    summary: "Bosch DE cuts",
  },
];

describe("talent-risk filter", () => {
  it("keeps watchlist companies in the requested country", () => {
    const hit = relevantEvents(events, ["amazon"], ["UK", "GB"]);
    expect(hit.map((e) => e.company)).toEqual(["Amazon"]);
  });
});
