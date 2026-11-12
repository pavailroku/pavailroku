import type { CountrySet } from "@/lib/domain/types";

export type ChatIntent = "briefing" | "digest" | "paste" | "followup" | "clarify";

export type ParsedChat = {
  intent: ChatIntent;
  cadence?: "weekly" | "monthly";
  role?: string;
  skills: string[];
  countrySet?: CountrySet;
  budget?: number;
  currency?: "GBP" | "USD";
  visaRequired?: boolean;
  locationHint?: string;
  missing: ("role" | "country" | "budget")[];
};

const ROLES = [
  "principal software engineer",
  "staff software engineer",
  "senior software engineer",
  "software engineer",
  "staff ml engineer",
  "senior ml engineer",
  "ml engineer",
  "machine learning engineer",
  "data scientist",
  "data engineer",
  "sre",
  "site reliability engineer",
  "embedded engineer",
  "firmware engineer",
  "backend engineer",
  "frontend engineer",
  "full stack engineer",
  "ios engineer",
  "android engineer",
  "product manager",
  "engineering manager",
  "staff swe",
  "senior swe",
  "sr swe",
  "swe",
];

const SKILLS = [
  "kubernetes",
  "k8s",
  "golang",
  "go",
  "embedded linux",
  "linux",
  "c++",
  "cpp",
  "python",
  "java",
  "typescript",
  "react",
  "distributed systems",
  "machine learning",
  "ml",
  "pytorch",
  "tensorflow",
  "aws",
  "gcp",
  "azure",
  "streaming",
  "video",
  "ads",
  "firmware",
  "rtos",
  "rust",
  "kotlin",
  "swift",
];

const LOCATIONS: { hint: string; re: RegExp; country: CountrySet }[] = [
  { hint: "cambridge", re: /\bcambridge\b/i, country: "UK" },
  { hint: "manchester", re: /\bmanchester\b/i, country: "UK" },
  { hint: "cardiff", re: /\bcardiff\b/i, country: "UK" },
  { hint: "london", re: /\blondon\b/i, country: "UK" },
  { hint: "remote-uk", re: /\bremote uk\b|\buk remote\b/i, country: "UK" },
  { hint: "san-jose", re: /\bsan jose\b|\bbay area\b|\bsilicon valley\b/i, country: "US" },
  { hint: "austin", re: /\baustin\b/i, country: "US" },
  { hint: "new-york", re: /\bnew york\b|\bnyc\b/i, country: "US" },
  { hint: "los-angeles", re: /\blos angeles\b|\bla\b/i, country: "US" },
  { hint: "remote-us", re: /\bremote us\b|\bus remote\b/i, country: "US" },
];

function parseBudget(text: string): { budget?: number; currency?: "GBP" | "USD" } {
  const gbpK = text.match(/£\s*([\d,]+(?:\.\d+)?)\s*k\b/i);
  if (gbpK) return { budget: Math.round(Number(gbpK[1].replace(/,/g, "")) * 1000), currency: "GBP" };
  const usdK = text.match(/\$\s*([\d,]+(?:\.\d+)?)\s*k\b/i);
  if (usdK) return { budget: Math.round(Number(usdK[1].replace(/,/g, "")) * 1000), currency: "USD" };
  const gbp = text.match(/£\s*([\d,]+)/);
  if (gbp) {
    const n = Number(gbp[1].replace(/,/g, ""));
    return { budget: n < 1000 ? n * 1000 : n, currency: "GBP" };
  }
  const usd = text.match(/\$\s*([\d,]+)/);
  if (usd) {
    const n = Number(usd[1].replace(/,/g, ""));
    return { budget: n < 1000 ? n * 1000 : n, currency: "USD" };
  }
  const k = text.match(/\b([\d,]+(?:\.\d+)?)\s*k\b/i);
  if (k) return { budget: Math.round(Number(k[1].replace(/,/g, "")) * 1000) };
  const raw = text.match(/\b(?:budget|comp|salary|pay)\D{0,12}([\d,]{4,7})\b/i);
  if (raw) return { budget: Number(raw[1].replace(/,/g, "")) };
  return {};
}

function parseRole(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const role of ROLES) {
    if (lower.includes(role)) {
      if (role === "swe" || role === "sr swe" || role === "senior swe" || role === "staff swe") {
        return role
          .replace("staff swe", "Staff Software Engineer")
          .replace("senior swe", "Senior Software Engineer")
          .replace("sr swe", "Senior Software Engineer")
          .replace("swe", "Software Engineer");
      }
      return role.replace(/\b\w/g, (c) => c.toUpperCase()).replace("Ml ", "ML ");
    }
  }
  const hire = text.match(
    /\b(?:hire|hiring|req for|open(?:ing)?(?: a)?)\s+(?:an?\s+)?([A-Za-z][A-Za-z /+-]{3,40})/i,
  );
  if (hire) return hire[1].trim().replace(/\s+/g, " ");
  return undefined;
}

function parseSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const skill of SKILLS) {
    if (skill === "go") {
      if (/\bgo(?:lang)?\b/i.test(text) && !/\bgoing\b/i.test(text)) hits.push("Go");
      continue;
    }
    if (skill === "ml") {
      if (/\bml\b/i.test(text)) hits.push("ML");
      continue;
    }
    if (lower.includes(skill)) {
      const label =
        skill === "k8s"
          ? "Kubernetes"
          : skill === "c++" || skill === "cpp"
            ? "C++"
            : skill.replace(/\b\w/g, (c) => c.toUpperCase());
      if (!hits.includes(label)) hits.push(label);
    }
  }
  return hits;
}

function parseCountry(text: string, locationHint?: string, currency?: "GBP" | "USD"): CountrySet | undefined {
  if (/\bboth\b|\buk and us\b|\bus and uk\b/i.test(text)) return "both";
  if (/\bunited kingdom\b|\buk\b|\bbritain\b|\bengland\b|\bwales\b|\bscotland\b/i.test(text)) return "UK";
  if (/\bunited states\b|\busa\b|\bu\.s\.|\bus\b|\bamerica\b/i.test(text)) return "US";
  if (currency === "GBP") return "UK";
  if (currency === "USD") return "US";
  const loc = LOCATIONS.find((l) => l.hint === locationHint);
  return loc?.country;
}

export function parseChat(message: string, hasBriefing: boolean): ParsedChat {
  const text = message.trim();
  const { budget, currency } = parseBudget(text);
  const loc = LOCATIONS.find((l) => l.re.test(text));
  const role = parseRole(text);
  const skills = parseSkills(text);
  const countrySet = parseCountry(text, loc?.hint, currency);
  const visaRequired = /\bvisa\b|\bsponsor/i.test(text) ? true : undefined;

  const wantsDigest =
    /\bdigest\b|\bthis week\b|\bthis month\b|\bwhat moved\b|\bweekly pulse\b|\brecruiter (?:report|update|pulse)\b/i.test(
      text,
    );
  const cadence: "weekly" | "monthly" | undefined = wantsDigest
    ? /\bmonth/i.test(text)
      ? "monthly"
      : "weekly"
    : undefined;

  const looksPaste =
    text.length > 380 ||
    /linkedin talent insights|talent wall|time to fill|greenhouse/i.test(text);

  const followHint =
    hasBriefing &&
    (Boolean(loc) ||
      Boolean(budget) ||
      visaRequired === true ||
      /\bstart date\b|\bp50\b|\bp75\b|\bcompare\b|\bwhat about\b|\binstead\b|\bpaste\b/i.test(
        text,
      ));

  let intent: ChatIntent = "clarify";
  if (wantsDigest) intent = "digest";
  else if (looksPaste) intent = hasBriefing ? "paste" : role ? "briefing" : "paste";
  else if (role && (countrySet || budget || loc)) intent = "briefing";
  else if (role && countrySet) intent = "briefing";
  else if (followHint) intent = "followup";
  else if (role || budget || countrySet) intent = "briefing";
  else intent = "clarify";

  const missing: ParsedChat["missing"] = [];
  if (intent === "briefing") {
    if (!role) missing.push("role");
    if (!countrySet) missing.push("country");
    if (!budget) missing.push("budget");
    if (missing.length) intent = followHint ? "followup" : "clarify";
  }

  return {
    intent,
    cadence,
    role,
    skills,
    countrySet,
    budget,
    currency: currency ?? (countrySet === "US" ? "USD" : countrySet ? "GBP" : undefined),
    visaRequired,
    locationHint: loc?.hint,
    missing,
  };
}
