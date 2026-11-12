import { connections } from "@/lib/connections";
import { createBriefing, listBriefings } from "@/lib/repo/memory";
import type { Briefing } from "@/lib/domain/types";

export const TA_DEMO_TITLE = "TA DEMO · Senior Software Engineer · UK";

export function seedTaDemo(): Briefing {
  const existing = listBriefings().find((b) => b.title === TA_DEMO_TITLE);
  if (existing) return existing;
  return createBriefing({
    title: TA_DEMO_TITLE,
    role: "Senior Software Engineer",
    skills: ["Kubernetes", "Go", "embedded Linux", "C++", "distributed systems"],
    whyHiring:
      "TA leadership demo: one senior IC for UK Player / platform. Show location, money, start date, and the weekly digest.",
    countrySet: "UK",
    budget: 90000,
    currency: "GBP",
    visaRequired: false,
    hmNotes:
      "Demo briefing. Glean/Confluence are not required to run this. Org names are labelled Demo until Glean is connected on the Roku network.",
  });
}

export function demoStatus() {
  return {
    gleanConnected: connections().some((c) => c.id === "glean" && c.connected),
    confluenceConnected: connections().some((c) => c.id === "confluence" && c.connected),
    connections: connections(),
  };
}
