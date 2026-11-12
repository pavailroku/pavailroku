import type { Briefing, Completeness, Confidence } from "@/lib/domain/types";

export function completenessOf(
  briefing: Briefing,
  liveEconomics: boolean,
): Completeness {
  const linkedInAttached = briefing.uploads.some((u) => u.kind === "linkedin_ti");
  const greenhouseAttached = briefing.uploads.some((u) => u.kind === "greenhouse");
  const gleanOrOrg = briefing.uploads.some(
    (u) => u.kind === "notes" && /glean|org chart|confluence/i.test(u.text),
  );
  const map = briefing.uploads.some((u) => u.kind === "market_map");

  const items = [
    {
      id: "role-budget",
      label: "Role and budget",
      present: Boolean(briefing.role && briefing.budget > 0),
      impact: "Required. Without these the engine cannot score.",
    },
    {
      id: "live-econ",
      label: "Live economics (ONS / BEA / BLS)",
      present: liveEconomics,
      impact:
        "Inflation and official prices. Offline still uses published ONS RRCPL / BEA RPP tables with as-of dates.",
    },
    {
      id: "glean",
      label: "Internal org (Glean / Confluence)",
      present: gleanOrOrg,
      impact: "Named team presence. Demo org is labelled Demo until Glean is connected.",
    },
    {
      id: "linkedin",
      label: "LinkedIn Talent Insights (TI) export",
      present: linkedInAttached,
      impact:
        "Raises talent density, employers, and YoE (years of experience) from modelled to measured. Optional.",
    },
    {
      id: "greenhouse",
      label: "Greenhouse history",
      present: greenhouseAttached,
      impact: "Turns time-to-hire from modelled notice norms into measured days-to-offer.",
    },
    {
      id: "map",
      label: "Recruiter market map",
      present: map,
      impact: "Adds competitor lists you already trust.",
    },
  ];

  let level: Confidence = "low";
  if (items[0].present && liveEconomics) level = "medium";
  if (linkedInAttached && liveEconomics && items[0].present) level = "high";
  if (!linkedInAttached && level === "high") level = "medium";

  const banner = linkedInAttached
    ? "LinkedIn Talent Insights is attached. Talent charts can be treated as measured for this briefing. Do not redistribute raw TI pages outside licensed users."
    : "This recommendation does not include LinkedIn Talent Insights. It is still valid for location, money, and start date. Adding a TI export and Greenhouse history will raise confidence on talent density, employers, and time-to-hire from modelled to measured.";

  return {
    level,
    linkedInAttached,
    greenhouseAttached,
    liveEconomics,
    items,
    banner,
  };
}
