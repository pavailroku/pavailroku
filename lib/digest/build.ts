import type { MarketEvent } from "@/lib/domain/types";
import { fetchLayoffsUk } from "@/lib/sources/layoffs-uk";
import { fetchTalentRiskEvents } from "@/lib/sources/talent-risk";
import { rankRelevant, sourcingActions, type ScoredItem } from "./relevancy";
export { digestEmailHtml } from "./email";

export type DigestCadence = "weekly" | "monthly";

export type Digest = {
  cadence: DigestCadence;
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  items: ScoredItem[];
  dropped: number;
  actions: string[];
  quiet: boolean;
  live: boolean;
  attribution: string[];
};

function days(cadence: DigestCadence): number {
  return cadence === "weekly" ? 7 : 31;
}

export function period(cadence: DigestCadence, now = new Date()) {
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - days(cadence));
  return { start: start.toISOString().slice(0, 10), end };
}

export function assembleDigest(
  cadence: DigestCadence,
  events: MarketEvent[],
  live: boolean,
  now = new Date(),
): Digest {
  const { start, end } = period(cadence, now);
  const startMs = Date.parse(start);
  const inPeriod = events.filter((e) => Date.parse(e.date) >= startMs);
  const items = rankRelevant(inPeriod);
  const dropped = inPeriod.length - items.length;
  return {
    cadence,
    title:
      cadence === "weekly"
        ? "Weekly Roku Talent Intelligence — recruiter digest"
        : "Monthly Roku Talent Intelligence — recruiter digest",
    periodStart: start,
    periodEnd: end,
    generatedAt: now.toISOString(),
    items,
    dropped,
    actions: sourcingActions(items),
    quiet: items.length === 0,
    live,
    attribution: [
      "Talent Risk (CC BY 4.0) — talentrisk.com",
      "layoffs.uk (CC BY 4.0)",
    ],
  };
}

export async function buildDigest(cadence: DigestCadence): Promise<Digest> {
  let events: MarketEvent[] = [];
  let live = false;
  const settled = await Promise.allSettled([
    fetchTalentRiskEvents(),
    fetchLayoffsUk(),
  ]);
  if (settled[0].status === "fulfilled") {
    events = events.concat(settled[0].value.events);
    live = true;
  }
  if (settled[1].status === "fulfilled") {
    events = events.concat(settled[1].value.events);
    live = true;
  }
  return assembleDigest(cadence, events, live);
}

