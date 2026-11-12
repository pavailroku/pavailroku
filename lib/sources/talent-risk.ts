import type { MarketEvent } from "@/lib/domain/types";
import { fetchJson } from "./http";

type TalentRiskEvent = {
  id: string;
  name: string;
  employer: string;
  type: string;
  label: string;
  jobs?: number;
  first_reported: string;
  last_reported?: string;
  countries?: string[];
  market?: string;
  summary?: string;
  best_source?: string;
  best_source_tier?: number;
  sources?: { url: string; publisher: string; date: string; tier?: number }[];
};

type TalentRiskPayload = {
  updated?: string;
  events: TalentRiskEvent[];
};

function tierLabel(t?: number, name?: string): MarketEvent["tier"] {
  if (t === 1 || name === "Official") return "Official";
  if (t === 2 || name === "Major outlet") return "Major outlet";
  return "Trade press";
}

export async function fetchTalentRiskEvents(): Promise<{
  events: MarketEvent[];
  asOf: string;
}> {
  const payload = await fetchJson<TalentRiskPayload>(
    "https://talentrisk.com/v1/events.json",
    { timeoutMs: 10000 },
  );
  const cutoff = Date.now() - 90 * 24 * 3600 * 1000;
  const events: MarketEvent[] = payload.events
    .filter((e) => {
      const d = Date.parse(e.last_reported || e.first_reported);
      return Number.isFinite(d) && d >= cutoff;
    })
    .map((e) => {
      const src = e.sources?.[0];
      return {
        id: e.id,
        company: e.name || e.employer,
        type: e.label || e.type,
        jobs: e.jobs,
        date: e.last_reported || e.first_reported,
        url: src?.url || `https://talentrisk.com/companies/${e.employer}`,
        publisher: src?.publisher || "Talent Risk",
        sourceName: "Talent Risk",
        tier: tierLabel(e.best_source_tier, e.best_source),
        countries: e.countries ?? [],
        summary: e.summary || `${e.name} — ${e.label}`,
      };
    });
  return { events, asOf: payload.updated ?? new Date().toISOString() };
}

export function relevantEvents(
  events: MarketEvent[],
  watchlist: string[],
  countries: string[],
): MarketEvent[] {
  const wl = watchlist.map((w) => w.toLowerCase());
  const cc = countries.map((c) => c.toUpperCase());
  return events.filter((e) => {
    const name = e.company.toLowerCase();
    const hit = wl.some((w) => name.includes(w) || w.includes(name.replace(/\s+/g, "-")));
    const geo =
      !e.countries.length ||
      e.countries.some((c) => cc.includes(c.toUpperCase())) ||
      (cc.includes("UK") && e.countries.some((c) => ["GB", "UK"].includes(c.toUpperCase()))) ||
      (cc.includes("US") && e.countries.some((c) => c.toUpperCase() === "US"));
    return hit && geo;
  });
}
