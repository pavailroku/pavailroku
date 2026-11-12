import type { LocationCard } from "@/lib/domain/types";

type Presence = Pick<LocationCard, "teams" | "people" | "work" | "presenceScore">;

const DEMO: Record<string, Presence> = {
  cambridge: {
    presenceScore: 88,
    teams: ["Player", "Device OS", "Computer vision"],
    work: "TV player, embedded Linux, device OS, and on-device ML for streaming hardware.",
    people: [
      { name: "Alex Chen", title: "Staff SWE", team: "Player" },
      { name: "Priya Shah", title: "Sr SWE", team: "Device OS" },
      { name: "Tom Hughes", title: "Eng Manager", team: "Player" },
    ],
  },
  manchester: {
    presenceScore: 80,
    teams: ["Cloud Native", "Observability", "Platform"],
    work: "Cloud native platform engineering, Kubernetes, Prometheus, and large-scale streaming backends.",
    people: [
      { name: "Jordan Hale", title: "Sr SWE", team: "Cloud Native" },
      { name: "Samira Ali", title: "Staff SWE", team: "Observability" },
    ],
  },
  "san-jose": {
    presenceScore: 94,
    teams: ["Player", "Cloud", "Ads", "OS"],
    work: "HQ product, player, ads, and platform for Roku OS and streaming services.",
    people: [
      { name: "Morgan Lee", title: "Principal SWE", team: "Player" },
      { name: "Chris Patel", title: "Director", team: "Cloud" },
    ],
  },
  austin: {
    presenceScore: 72,
    teams: ["Cloud", "Device"],
    work: "Cloud services and device software supporting US product lines.",
    people: [{ name: "Riley Nguyen", title: "Sr SWE", team: "Cloud" }],
  },
  "new-york": {
    presenceScore: 58,
    teams: ["Ads", "Data"],
    work: "Advertising technology and data for the Roku channel store and ads platform.",
    people: [{ name: "Jamie Ortiz", title: "Sr SWE", team: "Ads" }],
  },
  "remote-uk": {
    presenceScore: 40,
    teams: ["Distributed ICs"],
    work: "Selected UK remote seats attached to Cambridge or Manchester orgs.",
    people: [],
  },
  "remote-us": {
    presenceScore: 45,
    teams: ["Distributed ICs"],
    work: "Selected US remote seats attached to Bay Area or Austin orgs.",
    people: [],
  },
  cardiff: {
    presenceScore: 0,
    teams: [],
    work: "No Roku employing presence. Exploratory market only.",
    people: [],
  },
  london: {
    presenceScore: 8,
    teams: [],
    work: "No dedicated Roku engineering office. Exploratory market; hiring here needs entity/policy review.",
    people: [],
  },
  "los-angeles": {
    presenceScore: 6,
    teams: [],
    work: "No dedicated Roku engineering office. Exploratory market.",
    people: [],
  },
};

export function demoPresence(locationId: string): Presence {
  return (
    DEMO[locationId] ?? {
      presenceScore: 0,
      teams: [],
      work: "No recorded Roku presence.",
      people: [],
    }
  );
}
