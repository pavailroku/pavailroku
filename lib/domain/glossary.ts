/** First-use expansions and leader-facing definitions. Keep each to one line. */

export type GlossaryTerm = {
  abbr: string;
  expand: string;
  meaning: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    abbr: "HM",
    expand: "Hiring manager",
    meaning: "The leader who owns the role and the hire decision.",
  },
  {
    abbr: "TI",
    expand: "LinkedIn Talent Insights",
    meaning: "LinkedIn’s licensed talent-pool reports. Optional upload — not required to run a briefing.",
  },
  {
    abbr: "COL",
    expand: "Cost of living",
    meaning: "How expensive everyday life is in a city versus the national average (100).",
  },
  {
    abbr: "CPI",
    expand: "Consumer Price Index",
    meaning: "Official monthly inflation — how fast prices are rising.",
  },
  {
    abbr: "CPIH",
    expand: "CPI including owner-occupiers’ housing costs",
    meaning: "UK inflation measure that also includes housing costs. From the ONS.",
  },
  {
    abbr: "ONS",
    expand: "Office for National Statistics",
    meaning: "UK official statistics agency (inflation, prices, labour market).",
  },
  {
    abbr: "BEA",
    expand: "Bureau of Economic Analysis",
    meaning: "US agency that publishes regional price parities — relative cost of living by metro.",
  },
  {
    abbr: "RPP",
    expand: "Regional Price Parities",
    meaning: "BEA’s US cost-of-living index. National average = 100.",
  },
  {
    abbr: "RRCPL",
    expand: "Relative Regional Consumer Price Levels",
    meaning: "ONS regional price index. UK average = 100.",
  },
  {
    abbr: "BLS",
    expand: "Bureau of Labor Statistics",
    meaning: "US agency for CPI inflation and occupational wages.",
  },
  {
    abbr: "OEWS",
    expand: "Occupational Employment and Wage Statistics",
    meaning: "BLS survey of what jobs pay in each metro.",
  },
  {
    abbr: "P50",
    expand: "50th percentile (likely)",
    meaning: "Half of similar hires would be in seat by this date — the planning midpoint, not a promise.",
  },
  {
    abbr: "P75",
    expand: "75th percentile (conservative)",
    meaning: "Three in four similar hires would be in seat by this date. Use this when you cannot slip.",
  },
  {
    abbr: "TTH",
    expand: "Time to hire",
    meaning: "Calendar from req open to accepted offer. Different from start date (notice still runs).",
  },
  {
    abbr: "SLA",
    expand: "Service level agreement",
    meaning: "The recruiting clock: days to an accepted offer, not days until they walk in.",
  },
  {
    abbr: "YoE",
    expand: "Years of experience",
    meaning: "How long people in this talent pool have worked full-time.",
  },
  {
    abbr: "ATS",
    expand: "Applicant tracking system",
    meaning: "Where candidates are processed (at Roku: Greenhouse). This product is not an ATS.",
  },
  {
    abbr: "JD",
    expand: "Job description",
    meaning: "The written role. Paste it to sharpen skills and watchlist.",
  },
  {
    abbr: "GDPR",
    expand: "General Data Protection Regulation",
    meaning: "EU/UK privacy law. Named employees are internal-only; we do not log people fields.",
  },
  {
    abbr: "FX",
    expand: "Foreign exchange",
    meaning: "Currency conversion. UK and US budgets are compared within country, not as £ = $.",
  },
];

const BY_ABBR = new Map(GLOSSARY.map((t) => [t.abbr.toUpperCase(), t]));

export function define(abbr: string): GlossaryTerm | undefined {
  return BY_ABBR.get(abbr.toUpperCase());
}

export function label(abbr: string): string {
  const t = define(abbr);
  return t ? `${t.abbr} (${t.expand})` : abbr;
}
