import type {
  Evidence,
  GroundingResult,
  LocationCard,
  Recommendation,
} from "@/lib/domain/types";

const NUMBER_RE =
  /(?:£|\$)\s?[\d,]+(?:\.\d+)?|\b\d{1,3}(?:\.\d+)?%|\b20\d{2}-\d{2}-\d{2}\b|\b\d{1,2}\s(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s?20\d{2}\b/gi;

const LAYOFF_RE =
  /\b([A-Z][A-Za-z0-9&.\-]+(?:\s[A-Z][A-Za-z0-9&.\-]+){0,3})\s+(?:cut|cuts|laid off|layoff|layoffs|hiring freeze|froze hiring|job cuts)\b|\b(?:cut|cuts|laid off|layoff|layoffs|hiring freeze)\b.{0,40}\b([A-Z][A-Za-z0-9&.\-]+)/gi;

const MONTHS: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

export function templateDecision(cards: LocationCard[], recommendedId: string | null): Recommendation {
  const rec = cards.find((c) => c.locationId === recommendedId) ?? cards[0];
  if (!rec) {
    return {
      decisionLine: "No locations in scope — add a country set and budget.",
      why: "The engine needs a role, country, and budget before it can score.",
      risks: [],
      citations: [],
    };
  }
  const money = rec.currency === "GBP" ? `£${rec.budget.toLocaleString("en-GB")}` : `$${rec.budget.toLocaleString("en-US")}`;
  const extra = rec.exploratory
    ? " Exploratory — no Roku employing presence; do not open a req here without entity review."
    : "";
  return {
    decisionLine: `Recommend ${rec.name} — highest composite on talent, money, and start date. ${money} P50 in-seat ${rec.start.p50Start}; P75 ${rec.start.p75Start}.${extra}`,
    why: rec.exploratory
      ? `${rec.name} scored well on cost but is not an employing location.`
      : `${rec.name} balances talent access, where the budget lands, Roku presence, and time-to-in-seat.`,
    risks: rec.start.slipRisks,
    citations: [],
  };
}

function normalizeAmount(token: string): string[] {
  const t = token.replace(/,/g, "").replace(/\s/g, "").toLowerCase();
  const out = new Set<string>([t, token.trim()]);
  const human = t.match(/^(\d{1,2})(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*20(\d{2})$/);
  if (human) {
    const mm = MONTHS[human[2]];
    if (mm) out.add(`20${human[3]}-${mm}-${human[1].padStart(2, "0")}`);
  }
  const spaced = token.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})$/,
  );
  if (spaced) {
    const mm = MONTHS[spaced[2].toLowerCase()];
    if (mm) out.add(`${spaced[3]}-${mm}-${spaced[1].padStart(2, "0")}`);
  }
  return [...out];
}

function allowedTokens(evidence: Evidence[], cards: LocationCard[]): Set<string> {
  const allowed = new Set<string>();
  const add = (v: string | number) => {
    if (typeof v === "number") {
      allowed.add(String(v));
      allowed.add(String(Math.round(v)));
      allowed.add(v.toFixed(1));
      allowed.add(v.toLocaleString("en-GB"));
      allowed.add(v.toLocaleString("en-US"));
    } else {
      allowed.add(v);
      for (const n of normalizeAmount(v)) allowed.add(n);
    }
  };
  for (const e of evidence) add(e.value);
  for (const c of cards) {
    add(c.budget);
    add(c.marketPay);
    add(c.colIndex);
    add(c.composite);
    add(c.realWageIndex);
    add(c.livingStandardVsAnchorPct);
    add(c.inflationPct);
    add(c.p50Weeks);
    add(c.start.p50Start);
    add(c.start.p75Start);
    add(c.start.earliestStart);
    add(c.start.firstPayrollMonth);
    add(c.start.inSeatWeek);
    add(c.start.p50OfferDays);
    add(c.start.p75OfferDays);
  }
  return allowed;
}

function layoffCompanies(evidence: Evidence[]): Set<string> {
  const s = new Set<string>();
  for (const e of evidence) {
    if (e.kind === "layoff" && e.company) s.add(e.company.toLowerCase());
    if (e.kind === "layoff") s.add(String(e.value).toLowerCase());
  }
  return s;
}

export function ground(args: {
  payload: Recommendation;
  evidence: Evidence[];
  cards: LocationCard[];
  recommendedId: string | null;
}): GroundingResult {
  const { payload, evidence, cards, recommendedId } = args;
  const text = `${payload.decisionLine} ${payload.why} ${payload.risks.join(" ")}`;
  const ids = new Set(evidence.map((e) => e.id));
  for (const c of payload.citations) {
    if (!ids.has(c)) {
      return fail(`Unknown evidence id ${c}`, cards, recommendedId);
    }
  }

  const allowed = allowedTokens(evidence, cards);
  const numbers = text.match(NUMBER_RE) ?? [];
  for (const raw of numbers) {
    const variants = normalizeAmount(raw);
    const ok = variants.some((v) => {
      if (allowed.has(v) || allowed.has(v.replace(/[£$%]/g, ""))) return true;
      const n = Number(v.replace(/[£$%,]/g, ""));
      if (!Number.isFinite(n)) return false;
      return [...allowed].some((a) => Number(a) === n);
    });
    if (!ok) {
      return fail(`Ungrounded number: ${raw}`, cards, recommendedId);
    }
  }

  const known = layoffCompanies(evidence);
  const layoffHits = [...text.matchAll(LAYOFF_RE)];
  for (const m of layoffHits) {
    const company = (m[1] || m[2] || "").toLowerCase();
    if (!company) continue;
    const hit = [...known].some(
      (k) => k.includes(company) || company.includes(k),
    );
    if (!hit) {
      return fail(`Ungrounded layoff claim: ${company}`, cards, recommendedId);
    }
  }

  if (/\b(candidate|applicant)\s+[A-Z][a-z]+ [A-Z][a-z]+\b/.test(text)) {
    return fail("External candidate named in narrative", cards, recommendedId);
  }

  return { ok: true, recommendation: payload };
}

function fail(
  reason: string,
  cards: LocationCard[],
  recommendedId: string | null,
): GroundingResult {
  const rec = templateDecision(cards, recommendedId);
  rec.why = `AI narrative withheld — failed source check (${reason}). ${rec.why}`;
  return {
    ok: false,
    reason,
    withheld: true,
    recommendation: rec,
  };
}
