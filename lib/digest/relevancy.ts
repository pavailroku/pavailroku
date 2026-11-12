import { NOISE_SKILLS, ROKU_HIRING_DESKS, type HiringDesk } from "@/lib/domain/roku-hiring";
import type { MarketEvent } from "@/lib/domain/types";

export type ScoredItem = {
  event: MarketEvent;
  score: number;
  desks: HiringDesk[];
  reasons: string[];
};

const MIN_SCORE = 3;

function haystack(event: MarketEvent): string {
  return `${event.company} ${event.type} ${event.summary} ${event.locationHint ?? ""}`.toLowerCase();
}

function geoOk(event: MarketEvent, desk: HiringDesk): boolean {
  const cc = event.countries.map((c) => c.toUpperCase());
  if (!cc.length) return true;
  if (desk.country === "UK") return cc.some((c) => ["UK", "GB", "IE"].includes(c));
  return cc.includes("US");
}

export function scoreEvent(event: MarketEvent): ScoredItem | null {
  const text = haystack(event);
  if (NOISE_SKILLS.some((n) => text.includes(n))) return null;

  const reasons: string[] = [];
  const desks: HiringDesk[] = [];
  let score = 0;

  for (const desk of ROKU_HIRING_DESKS) {
    if (!geoOk(event, desk)) continue;
    let deskScore = 0;
    const companyHit = desk.competitors.some((c) =>
      text.includes(c.toLowerCase()) || event.company.toLowerCase().includes(c.toLowerCase()),
    );
    const skillHit = desk.skills.some((s) => text.includes(s.toLowerCase()));
    if (companyHit) deskScore += 2;
    if (skillHit) deskScore += 2;
    if (companyHit && skillHit) deskScore += 1;
    if (deskScore >= 2) {
      score += deskScore;
      desks.push(desk);
      reasons.push(
        `${desk.office} ${desk.family}: ${companyHit ? "competitor movement" : ""}${companyHit && skillHit ? " + " : ""}${skillHit ? "skill keywords match what we hire" : ""}`.trim(),
      );
    }
  }

  const layoff = /cut|layoff|freeze|redundan/i.test(event.type + event.summary);
  if (layoff && desks.length) {
    score += 1;
    reasons.push("Cuts/freeze = possible inbound window for sourcing, not a news clip.");
  }

  if (score < MIN_SCORE || desks.length === 0) return null;
  return { event, score, desks, reasons };
}

export function rankRelevant(events: MarketEvent[]): ScoredItem[] {
  const uniq = new Map<string, ScoredItem>();
  for (const e of events) {
    const scored = scoreEvent(e);
    if (!scored) continue;
    const prev = uniq.get(e.id);
    if (!prev || scored.score > prev.score) uniq.set(e.id, scored);
  }
  return [...uniq.values()].sort((a, b) => b.score - a.score || b.event.date.localeCompare(a.event.date));
}

export function sourcingActions(items: ScoredItem[]): string[] {
  return items.slice(0, 8).map((i) => {
    const desk = i.desks[0];
    return `Source ${desk.family} in ${desk.office}: ${i.event.company} ${i.event.type.toLowerCase()} (${i.event.date}). ${i.reasons[0]}`;
  });
}
