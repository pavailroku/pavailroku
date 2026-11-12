import { describe, expect, it } from "vitest";
import type { MarketEvent } from "../domain/types";
import { rankRelevant, scoreEvent } from "./relevancy";
import { assembleDigest } from "./build";

function ev(partial: Partial<MarketEvent> & Pick<MarketEvent, "id" | "company" | "summary">): MarketEvent {
  return {
    type: "Cuts announced",
    date: "2026-11-10",
    url: "https://example.com/x",
    publisher: "FT",
    sourceName: "Talent Risk",
    tier: "Major outlet",
    countries: ["UK"],
    ...partial,
  };
}

describe("digest relevancy", () => {
  it("keeps Amazon UK cloud cuts for Manchester platform hiring", () => {
    const hit = scoreEvent(
      ev({
        id: "amz",
        company: "Amazon",
        summary: "Amazon cuts Kubernetes platform roles in the UK",
        countries: ["UK"],
      }),
    );
    expect(hit).toBeTruthy();
    expect(hit?.desks.some((d) => d.office === "Manchester")).toBe(true);
  });

  it("drops a UK retail cashier layoff with no Roku skill overlap", () => {
    const miss = scoreEvent(
      ev({
        id: "shop",
        company: "A supermarket",
        summary: "Warehouse picker and cashier jobs cut in Cardiff",
        countries: ["UK"],
      }),
    );
    expect(miss).toBeNull();
  });

  it("drops German automotive cuts that do not map to a Roku desk", () => {
    const miss = scoreEvent(
      ev({
        id: "bosch",
        company: "Bosch",
        summary: "Bosch announced 750 job cuts at a German automotive site",
        countries: ["DE"],
      }),
    );
    expect(miss).toBeNull();
  });

  it("keeps Arm Cambridge embedded movement", () => {
    const hit = scoreEvent(
      ev({
        id: "arm",
        company: "Arm",
        summary: "Arm freezes hiring for embedded Linux and C++ in Cambridge",
        countries: ["UK"],
      }),
    );
    expect(hit).toBeTruthy();
    expect(hit?.desks.some((d) => d.office === "Cambridge")).toBe(true);
  });

  it("quiet digest when nothing relevant — does not invent filler", () => {
    const d = assembleDigest(
      "weekly",
      [
        ev({
          id: "shop",
          company: "A supermarket",
          summary: "Cashier jobs cut",
          countries: ["UK"],
        }),
      ],
      true,
      new Date("2026-11-12T00:00:00Z"),
    );
    expect(d.quiet).toBe(true);
    expect(d.items).toHaveLength(0);
    expect(d.actions).toHaveLength(0);
  });

  it("ranks relevant events and writes sourcing actions", () => {
    const items = rankRelevant([
      ev({
        id: "amz",
        company: "Amazon",
        summary: "Amazon cuts Kubernetes platform roles in the UK",
      }),
      ev({
        id: "noise",
        company: "Local cafe",
        summary: "Baristas laid off",
      }),
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].event.company).toBe("Amazon");
  });
});
