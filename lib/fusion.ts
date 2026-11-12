import { completenessOf } from "@/lib/completeness";
import { locationsFor } from "@/lib/domain/locations";
import type {
  Briefing,
  EngineResult,
  Evidence,
  LocationCard,
  MarketEvent,
  SourceStatus,
} from "@/lib/domain/types";
import {
  budgetFit as budgetFitFn,
  economicsForLocation,
  livingStandardDeltaPct,
  moneyVerdict,
} from "@/lib/economics";
import { recommend } from "@/lib/recommend";
import { compositeOf, componentScores, pickRecommended } from "@/lib/score";
import { parseGreenhouseOfferDays, parseTalentBoost } from "@/lib/sources/ingest";
import { demoPresence } from "@/lib/sources/demo-presence";
import { fetchAdzuna } from "@/lib/sources/adzuna";
import { fetchLayoffsUk } from "@/lib/sources/layoffs-uk";
import { fetchCpihYoY } from "@/lib/sources/ons";
import { fetchTalentRiskEvents, relevantEvents } from "@/lib/sources/talent-risk";
import { forecastStart } from "@/lib/time-to-hire";
import { countriesFor, watchlistFor } from "@/lib/watchlist";

export type AdzunaHit = {
  loc: string;
  p: { vacancyCount?: number; meanSalary?: number } | null;
};

export type LiveBundle = {
  events: MarketEvent[];
  ukInflation?: { pct: number; asOf: string };
  sourceStatus: Record<string, SourceStatus>;
  lastLiveFetch: Record<string, string | null>;
  adzuna?: AdzunaHit[];
};

export async function fetchLive(briefing: Briefing): Promise<LiveBundle> {
  const sourceStatus: Record<string, SourceStatus> = {
    "talent-risk": "offline",
    "layoffs-uk": "offline",
    ons: "offline",
    adzuna: process.env.ADZUNA_APP_ID ? "offline" : "offline",
    glean: process.env.GLEAN_API_TOKEN ? "offline" : "offline",
  };
  const lastLiveFetch: Record<string, string | null> = {
    "talent-risk": null,
    "layoffs-uk": null,
    ons: null,
    adzuna: null,
  };
  const events: MarketEvent[] = [];

  const [tr, luk, ons] = await Promise.allSettled([
    fetchTalentRiskEvents(),
    briefing.countrySet !== "US" ? fetchLayoffsUk() : Promise.resolve(null),
    briefing.countrySet !== "US" ? fetchCpihYoY() : Promise.resolve(null),
  ]);

  if (tr.status === "fulfilled") {
    events.push(...tr.value.events);
    sourceStatus["talent-risk"] = "live";
    lastLiveFetch["talent-risk"] = tr.value.asOf;
  }
  if (luk.status === "fulfilled" && luk.value) {
    events.push(...luk.value.events);
    sourceStatus["layoffs-uk"] = "live";
    lastLiveFetch["layoffs-uk"] = luk.value.asOf;
  }
  let ukInflation: { pct: number; asOf: string } | undefined;
  if (ons.status === "fulfilled" && ons.value) {
    ukInflation = ons.value;
    sourceStatus.ons = "live";
    lastLiveFetch.ons = ons.value.asOf;
  }

  const what = briefing.skills.slice(0, 3).join(" ") || briefing.role;
  const adzunaJobs = locationsFor(briefing.countrySet).map((loc) =>
    fetchAdzuna(loc.country === "UK" ? "gb" : "us", loc.adzunaWhere, what)
      .then((p) => ({ loc: loc.id, p }))
      .catch(() => ({ loc: loc.id, p: null })),
  );
  const adz = await Promise.all(adzunaJobs);
  if (adz.some((a) => a.p)) {
    sourceStatus.adzuna = "live";
    lastLiveFetch.adzuna = new Date().toISOString();
  }

  return { events, ukInflation, sourceStatus, lastLiveFetch, adzuna: adz };
}

export function fuse(briefing: Briefing, live: LiveBundle): EngineResult {
  const fetchedAt = new Date().toISOString();
  const asOf = briefing.reqApprovedOn ? new Date(briefing.reqApprovedOn) : new Date();
  const locs = locationsFor(briefing.countrySet);
  const watch = watchlistFor(briefing);
  const geo = countriesFor(briefing);
  const pulse = relevantEvents(live.events, watch, geo).slice(0, 40);
  const ghDays = briefing.uploads
    .map((u) => parseGreenhouseOfferDays(u.text))
    .find((n) => n != null);
  const talentBoost = briefing.uploads.reduce(
    (n, u) => n + parseTalentBoost(u.text),
    0,
  );

  const evidence: Evidence[] = [];
  const inflationUk = live.ukInflation?.pct;
  const inflationUs = 2.6;

  if (live.ukInflation) {
    evidence.push({
      id: "ev_cpih_uk",
      kind: "inflation",
      value: live.ukInflation.pct,
      unit: "%",
      asOf: live.ukInflation.asOf,
      url: "https://www.ons.gov.uk/economy/inflationandpriceindices",
      sourceName: "ONS CPIH (CPI including housing costs)",
      confidence: "high",
      label: "UK CPIH inflation",
    });
  }

  const cards: LocationCard[] = locs.map((loc) => {
    const econ = economicsForLocation(loc.id, briefing.budget);
    const presence = demoPresence(loc.id);
    const locEvents = pulse.filter((e) => {
      const n = e.company.toLowerCase();
      return loc.watchlist.some((w) => n.includes(w));
    });
    const heat = Math.min(0.45, locEvents.length * 0.08) - 0.05;
    const vacancy = live.adzuna?.find((a) => a.loc === loc.id)?.p;
    const marketPay = vacancy?.meanSalary || econ.marketPay;
    const below = briefing.budget < marketPay * 0.9;
    const tightness = vacancy?.vacancyCount
      ? Math.min(1.4, Math.max(0.8, vacancy.vacancyCount / 400))
      : 1;
    const inflationPct =
      loc.country === "UK" ? (inflationUk ?? 2) : inflationUs;
    const talent = Math.min(100, econ.talent + talentBoost);
    const start = forecastStart({
      location: loc,
      asOf,
      tightness,
      talent,
      belowMarket: below,
      visaRequired: briefing.visaRequired,
      expedite: briefing.expedite,
      greenhouseOfferDays: ghDays,
    });
    const p50Weeks = Math.round(start.p50OfferDays / 7 + (loc.country === "UK" ? 8 : 2));
    const scores = componentScores({
      talent,
      budgetFit: budgetFitFn(briefing.budget, marketPay),
      colIndex: econ.colIndex,
      housingPressure: econ.housingPressure,
      inflationPct,
      marketHeat: heat,
      presenceScore: presence.presenceScore,
      p50Weeks,
    });
    let composite = compositeOf(scores, briefing.weights);
    if (!loc.employingPresence) composite = Math.round(composite * 0.85 * 10) / 10;

    const anchor = locs.find((l) => l.employingPresence && l.country === loc.country);
    const anchorCol = anchor
      ? economicsForLocation(anchor.id, briefing.budget).colIndex
      : 100;

    evidence.push({
      id: `ev_col_${loc.id}`,
      kind: "col",
      value: econ.colIndex,
      unit: "index",
      asOf: econ.asOf,
      url: econ.url,
      sourceName: econ.sourceName,
      confidence: "high",
      locationId: loc.id,
      label: `${loc.name} cost of living vs national 100`,
    });
    evidence.push({
      id: `ev_pay_${loc.id}`,
      kind: "market-pay",
      value: marketPay,
      unit: loc.currency,
      asOf: vacancy ? fetchedAt.slice(0, 10) : econ.asOf,
      sourceName: vacancy ? "Adzuna mean advertised salary" : "Location pay table (indicative until Adzuna keys)",
      confidence: vacancy ? "medium" : "low",
      locationId: loc.id,
      label: `${loc.name} market pay`,
    });
    evidence.push({
      id: `ev_tth_${loc.id}`,
      kind: "tth-assumption",
      value: start.p50Start,
      asOf: fetchedAt.slice(0, 10),
      sourceName: ghDays
        ? "Greenhouse history + notice norms"
        : "Modelled from market tightness + notice norms",
      confidence: ghDays ? "high" : "medium",
      locationId: loc.id,
      label: `${loc.name} P50 start date`,
    });
    if (presence.people.length) {
      evidence.push({
        id: `ev_presence_${loc.id}`,
        kind: "presence",
        value: presence.presenceScore,
        asOf: fetchedAt.slice(0, 10),
        sourceName: "Demo org (not Glean)",
        confidence: "low",
        locationId: loc.id,
        label: `${loc.name} Roku presence (demo)`,
      });
    }

    for (const ev of locEvents) {
      const layoffId = `ev_layoff_${ev.id}`;
      if (evidence.some((x) => x.id === layoffId)) continue;
      evidence.push({
        id: layoffId,
        kind: "layoff",
        value: ev.company,
        asOf: ev.date,
        url: ev.url,
        sourceName: ev.sourceName,
        confidence: ev.tier === "Official" ? "high" : "medium",
        company: ev.company,
        locationId: loc.id,
        label: `${ev.company} ${ev.type}`,
      });
    }

    const card: LocationCard = {
      locationId: loc.id,
      name: loc.name,
      country: loc.country,
      exploratory: !loc.employingPresence,
      employingPresence: loc.employingPresence,
      currency: loc.currency,
      talent,
      colIndex: econ.colIndex,
      colScope: econ.colScope,
      housingPressure: econ.housingPressure,
      inflationPct,
      marketPay,
      budget: briefing.budget,
      budgetFit: budgetFitFn(briefing.budget, marketPay),
      realWageIndex: econ.realWageIndex,
      livingStandardVsAnchorPct: livingStandardDeltaPct(
        briefing.budget,
        econ.colIndex,
        anchorCol,
      ),
      marketHeat: heat,
      presenceScore: presence.presenceScore,
      p50Weeks,
      composite,
      scores,
      verdict: moneyVerdict({
        budgetFit: budgetFitFn(briefing.budget, marketPay),
        housingPressure: econ.housingPressure,
        talent,
        colIndex: econ.colIndex,
      }),
      teams: presence.teams,
      people: presence.people,
      work: presence.work,
      presenceSource: "demo",
      skills: econ.skills,
      yoe: econ.yoe,
      employers: econ.employers,
      vacancyTrend: vacancy?.vacancyCount ?? 0,
      start,
    };
    return card;
  });

  const recommendedId = pickRecommended(cards);
  const completeness = completenessOf(
    briefing,
    Boolean(live.ukInflation) || briefing.countrySet !== "UK",
  );

  const grounding = recommend({ evidence, cards, recommendedId });

  const pinned = new Set(briefing.pinnedEventIds);
  const dismissed = new Set(briefing.dismissedEventIds);
  const events = pulse
    .filter((e) => !dismissed.has(e.id))
    .map((e) => ({ ...e, pinned: pinned.has(e.id) }))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));

  return {
    briefing,
    evidence,
    cards: [...cards].sort((a, b) => b.composite - a.composite),
    recommendedId,
    events,
    completeness,
    grounding,
    fetchedAt,
    sourceStatus: live.sourceStatus,
    lastLiveFetch: live.lastLiveFetch,
  };
}

export async function runEngine(briefing: Briefing): Promise<EngineResult> {
  try {
    const live = await fetchLive(briefing);
    return fuse(briefing, live);
  } catch {
    return fuse(briefing, {
      events: [],
      sourceStatus: {
        "talent-risk": "offline",
        "layoffs-uk": "offline",
        ons: "offline",
        adzuna: "offline",
      },
      lastLiveFetch: {
        "talent-risk": null,
        "layoffs-uk": null,
        ons: null,
        adzuna: null,
      },
    });
  }
}
