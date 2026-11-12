import { locationsFor } from "@/lib/domain/locations";
import type { Briefing } from "@/lib/domain/types";

const SKILL_COMPANIES: Record<string, string[]> = {
  kubernetes: ["amazon", "google", "microsoft", "booking.com"],
  "c++": ["arm", "qualcomm", "apple", "nvidia"],
  embedded: ["arm", "qualcomm", "raspberry-pi"],
  streaming: ["netflix", "amazon", "sky", "disney"],
  ml: ["google", "deepmind", "meta", "nvidia"],
};

export function watchlistFor(briefing: Briefing): string[] {
  const locs = locationsFor(briefing.countrySet);
  const set = new Set<string>();
  for (const l of locs) l.watchlist.forEach((w) => set.add(w));
  for (const skill of briefing.skills) {
    const extra = SKILL_COMPANIES[skill.toLowerCase()];
    extra?.forEach((c) => set.add(c));
  }
  for (const u of briefing.uploads) {
    if (u.kind === "market_map") {
      u.text
        .split(/[\n,;]+/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 2 && s.length < 40)
        .forEach((s) => set.add(s));
    }
  }
  return [...set];
}

export function countriesFor(briefing: Briefing): string[] {
  if (briefing.countrySet === "both") return ["UK", "US", "GB"];
  if (briefing.countrySet === "UK") return ["UK", "GB"];
  return ["US"];
}
