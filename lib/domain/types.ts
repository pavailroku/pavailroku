export type Country = "UK" | "US";
export type CountrySet = "UK" | "US" | "both";
export type ViewerRole =
  | "hiring_manager"
  | "recruiter"
  | "finance"
  | "engineering";
export type Confidence = "high" | "medium" | "low";
export type SourceStatus = "live" | "cached" | "offline" | "demo";
export type EvidenceKind =
  | "layoff"
  | "col"
  | "vacancy"
  | "salary"
  | "presence"
  | "tth-assumption"
  | "upload"
  | "inflation"
  | "housing"
  | "market-pay";

export type EvidenceId = string;

export type Evidence = {
  id: EvidenceId;
  kind: EvidenceKind;
  value: number | string;
  unit?: string;
  asOf: string;
  url?: string;
  sourceName: string;
  confidence: Confidence;
  locationId?: string;
  label: string;
  company?: string;
};

export type ScoreWeights = {
  talent: number;
  budgetFit: number;
  realWage: number;
  housing: number;
  inflation: number;
  marketEvents: number;
  rokuPresence: number;
  speed: number;
};

export const DEFAULT_WEIGHTS: ScoreWeights = {
  talent: 0.22,
  budgetFit: 0.16,
  realWage: 0.16,
  housing: 0.1,
  inflation: 0.08,
  marketEvents: 0.12,
  rokuPresence: 0.1,
  speed: 0.06,
};

export type LocationDefinition = {
  id: string;
  name: string;
  country: Country;
  region: string;
  employingPresence: boolean;
  remote: boolean;
  currency: "GBP" | "USD";
  adzunaWhere: string;
  watchlist: string[];
};

export type TimelineStage = {
  id: string;
  label: string;
  p50Days: number;
  p75Days: number;
  owner: "recruiting" | "finance" | "engineering" | "candidate";
};

export type StartPlan = {
  locationId: string;
  modelled: boolean;
  p50OfferDays: number;
  p75OfferDays: number;
  p50Start: string;
  p75Start: string;
  earliestStart: string;
  firstPayrollMonth: string;
  inSeatWeek: string;
  stages: TimelineStage[];
  slipRisks: string[];
};

export type MoneyVerdict =
  | "Budget lands well"
  | "Tight vs housing"
  | "Below market"
  | "Talent-rich and cheaper";

export type LocationCard = {
  locationId: string;
  name: string;
  country: Country;
  exploratory: boolean;
  employingPresence: boolean;
  currency: "GBP" | "USD";
  talent: number;
  colIndex: number;
  colScope: "city" | "region" | "national";
  housingPressure: number;
  inflationPct: number;
  marketPay: number;
  budget: number;
  budgetFit: number;
  realWageIndex: number;
  livingStandardVsAnchorPct: number;
  marketHeat: number;
  presenceScore: number;
  p50Weeks: number;
  composite: number;
  scores: Record<keyof ScoreWeights, number>;
  verdict: MoneyVerdict;
  teams: string[];
  people: { name: string; title: string; team: string }[];
  work: string;
  presenceSource: SourceStatus;
  skills: { name: string; share: number }[];
  yoe: { bucket: string; share: number }[];
  employers: { name: string; share: number }[];
  vacancyTrend: number;
  start: StartPlan;
};

export type MarketEvent = {
  id: string;
  company: string;
  type: string;
  jobs?: number;
  date: string;
  url: string;
  publisher: string;
  sourceName: string;
  tier: "Official" | "Major outlet" | "Trade press";
  countries: string[];
  summary: string;
  locationHint?: string;
  pinned?: boolean;
};

export type CompletenessItem = {
  id: string;
  label: string;
  present: boolean;
  impact: string;
};

export type Completeness = {
  level: Confidence;
  linkedInAttached: boolean;
  greenhouseAttached: boolean;
  liveEconomics: boolean;
  items: CompletenessItem[];
  banner: string;
};

export type Recommendation = {
  decisionLine: string;
  why: string;
  risks: string[];
  citations: EvidenceId[];
};

export type GroundingResult =
  | { ok: true; recommendation: Recommendation }
  | {
      ok: false;
      reason: string;
      recommendation: Recommendation;
      withheld: true;
    };

export type BriefingInput = {
  title: string;
  role: string;
  skills: string[];
  whyHiring?: string;
  countrySet: CountrySet;
  budget: number;
  currency: "GBP" | "USD";
  visaRequired: boolean;
  expedite?: boolean;
  reqApprovedOn?: string;
  hmNotes?: string;
};

export type UploadedIntel = {
  id: string;
  kind: "linkedin_ti" | "greenhouse" | "market_map" | "notes" | "jd" | "other";
  filename?: string;
  text: string;
  addedAt: string;
};

export type Briefing = BriefingInput & {
  id: string;
  createdAt: string;
  viewerRole: ViewerRole;
  weights: ScoreWeights;
  uploads: UploadedIntel[];
  dismissedEventIds: string[];
  pinnedEventIds: string[];
};

export type EngineResult = {
  briefing: Briefing;
  evidence: Evidence[];
  cards: LocationCard[];
  recommendedId: string | null;
  events: MarketEvent[];
  completeness: Completeness;
  grounding: GroundingResult;
  fetchedAt: string;
  sourceStatus: Record<string, SourceStatus>;
  lastLiveFetch: Record<string, string | null>;
};
