import type { Digest } from "@/lib/digest/build";
import type { EngineResult, LocationCard, SourceStatus } from "@/lib/domain/types";
import { prettyDate } from "@/lib/format";

export type ChatLocationPeek = {
  id: string;
  name: string;
  verdict: string;
  p50Start: string;
  composite: number;
  talent: number;
  colIndex: number;
  housingPressure: number;
  marketPay: number;
  budget: number;
  currency: "GBP" | "USD";
};

export type ChatAnswer = {
  text: string;
  kind: "briefing" | "digest" | "clarify" | "followup";
  live: boolean;
  sources: { id: string; status: SourceStatus }[];
  locations: ChatLocationPeek[];
  briefingId?: string;
  engine?: EngineResult;
  digest?: Digest;
};

function liveSources(status: Record<string, SourceStatus> | undefined): ChatAnswer["sources"] {
  if (!status) return [];
  return Object.entries(status).map(([id, s]) => ({ id, status: s }));
}

function anyLive(sources: ChatAnswer["sources"]): boolean {
  return sources.some((s) => s.status === "live");
}

function peek(cards: LocationCard[]): ChatLocationPeek[] {
  return [...cards]
    .sort((a, b) => b.composite - a.composite)
    .slice(0, 6)
    .map((c) => ({
      id: c.locationId,
      name: c.name,
      verdict: c.verdict,
      p50Start: c.start.p50Start,
      composite: Math.round(c.composite),
      talent: Math.round(c.talent),
      colIndex: Math.round(c.colIndex),
      housingPressure: Math.round(c.housingPressure),
      marketPay: c.marketPay,
      budget: c.budget,
      currency: c.currency,
    }));
}

function focusCard(engine: EngineResult, hint?: string): LocationCard | undefined {
  if (hint) {
    const hit = engine.cards.find((c) => c.locationId === hint || c.name.toLowerCase().includes(hint.replace(/-/g, " ")));
    if (hit) return hit;
  }
  return engine.cards.find((c) => c.locationId === engine.recommendedId) ?? engine.cards[0];
}

export function answerFromEngine(
  engine: EngineResult,
  opts?: { locationHint?: string; followup?: boolean },
): ChatAnswer {
  const rec = focusCard(engine, opts?.locationHint);
  const decision = engine.grounding.recommendation;
  const sources = liveSources(engine.sourceStatus);
  const live = anyLive(sources);
  const headline =
    opts?.locationHint && rec
      ? `${rec.name}: ${rec.verdict}. P50 in-seat ${prettyDate(rec.start.p50Start)}.`
      : decision.decisionLine;
  return {
    text: `${headline} Dashboard below is the live scorecard — talent density, money, start dates, market pulse.`,
    kind: opts?.followup ? "followup" : "briefing",
    live,
    sources,
    locations: peek(engine.cards),
    briefingId: engine.briefing.id,
    engine,
  };
}

export function answerFromDigest(digest: Digest): ChatAnswer {
  const lines: string[] = [];
  lines.push(
    `${digest.title} (${prettyDate(digest.periodStart)} – ${prettyDate(digest.periodEnd)}). ${digest.live ? "Live sources queried." : "Live sources did not respond."}`,
  );
  if (digest.quiet) {
    lines.push(
      "Quiet period — nothing in this window mapped to Roku hiring desks (Cambridge embedded/ML, Manchester cloud-native, US player/cloud/ads). Noise was dropped, not summarised as news.",
    );
  } else {
    lines.push(
      digest.items
        .slice(0, 8)
        .map((i) => {
          const desks = i.desks.map((d) => `${d.office} ${d.family}`).join(", ");
          return `• ${i.event.company} (${prettyDate(i.event.date)}, ${i.event.sourceName}): ${i.event.summary} — ${i.reasons[0] ?? "maps to a desk we hire"}. Desks: ${desks}.`;
        })
        .join("\n"),
    );
    if (digest.actions[0]) {
      lines.push("What to source this cadence:\n" + digest.actions.slice(0, 6).map((a) => `• ${a}`).join("\n"));
    }
    if (digest.dropped) lines.push(`Kept ${digest.items.length}, dropped ${digest.dropped} off-desk events.`);
  }
  lines.push(digest.attribution.join(" "));
  return {
    text: lines.join("\n\n"),
    kind: "digest",
    live: digest.live,
    sources: [
      { id: "talent-risk", status: digest.live ? "live" : "offline" },
      { id: "layoffs-uk", status: digest.live ? "live" : "offline" },
    ],
    locations: [],
    digest,
  };
}

export function clarifyText(missing: ("role" | "country" | "budget")[], hasAnything: boolean): ChatAnswer {
  const need = missing.length
    ? missing.join(", ").replace("country", "UK or US").replace("role", "job title").replace("budget", "budget (£ or $)")
    : "job title, UK or US, and budget";
  const example = "Senior Software Engineer UK £90k Kubernetes and Go";
  return {
    text: hasAnything
      ? `I can run live scoring once I have ${need}. Example: ${example}`
      : `Ask a hiring question and I pull live market + economics for it. I need ${need}. Example: ${example}\n\nOr type “weekly digest” for the recruiter pulse (only desks Roku hires).`,
    kind: "clarify",
    live: false,
    sources: [],
    locations: [],
  };
}
