import type { CountrySet } from "@/lib/domain/types";
import type { ParsedChat } from "./parse";

export type FilledAsk = {
  role: string;
  countrySet: CountrySet;
  budget: number;
  currency: "GBP" | "USD";
  skills: string[];
  assumed: string[];
};

export function fillAsk(parsed: ParsedChat): FilledAsk {
  const assumed: string[] = [];
  const countrySet: CountrySet = parsed.countrySet ?? "UK";
  if (!parsed.countrySet) assumed.push("country = UK");
  const currency: "GBP" | "USD" =
    parsed.currency ?? (countrySet === "US" ? "USD" : "GBP");
  const role = parsed.role ?? "Senior Software Engineer";
  if (!parsed.role) assumed.push("role = Senior Software Engineer");
  const budget =
    parsed.budget ?? (currency === "USD" ? 180000 : 90000);
  if (!parsed.budget) {
    assumed.push(currency === "USD" ? "budget = $180,000" : "budget = £90,000");
  }
  return {
    role,
    countrySet,
    budget,
    currency,
    skills: parsed.skills,
    assumed,
  };
}

export function assumptionLine(assumed: string[]): string | null {
  if (!assumed.length) return null;
  return `You did not specify everything, so I still ran live data with: ${assumed.join("; ")}. Type a different role, country, or budget to re-run.`;
}
