/**
 * What Roku is actually hiring for. The weekly digest is scored against this
 * list — not against “all of tech.”
 */
export type HiringDesk = {
  id: string;
  office: string;
  country: "UK" | "US";
  family: string;
  skills: string[];
  /** Companies whose movement usually frees or tightens this desk’s market. */
  competitors: string[];
  whyItMatters: string;
};

export const ROKU_HIRING_DESKS: HiringDesk[] = [
  {
    id: "uk-cambridge-player-device",
    office: "Cambridge",
    country: "UK",
    family: "Player, device OS, embedded",
    skills: [
      "embedded linux",
      "linux kernel",
      "c++",
      "c/c++",
      "device",
      "firmware",
      "player",
      "streaming hardware",
    ],
    competitors: ["arm", "qualcomm", "amazon", "raspberry pi", "broadcom"],
    whyItMatters: "Cambridge Player / Device seats — senior C/C++ and embedded Linux.",
  },
  {
    id: "uk-cambridge-mlcv",
    office: "Cambridge",
    country: "UK",
    family: "ML and computer vision",
    skills: [
      "computer vision",
      "machine learning",
      "ml",
      "inference",
      "on-device",
      "python",
    ],
    competitors: ["arm", "qualcomm", "google", "deepmind"],
    whyItMatters: "On-device ML / CV for streaming hardware in Cambridge.",
  },
  {
    id: "uk-manchester-cloud",
    office: "Manchester",
    country: "UK",
    family: "Cloud native platform",
    skills: [
      "kubernetes",
      "k8s",
      "prometheus",
      "observability",
      "golang",
      "go",
      "java",
      "distributed systems",
      "platform engineering",
      "cloud native",
    ],
    competitors: ["amazon", "bbc", "booking.com", "microsoft", "google"],
    whyItMatters: "Manchester platform / observability / large-scale backends.",
  },
  {
    id: "us-sanjose-player",
    office: "San Jose / Bay Area",
    country: "US",
    family: "Player, OS, streaming",
    skills: ["player", "roku os", "streaming", "c++", "video", "ads"],
    competitors: ["netflix", "amazon", "apple", "google", "meta", "nvidia"],
    whyItMatters: "HQ player / OS / streaming talent in the Bay Area.",
  },
  {
    id: "us-austin-cloud-device",
    office: "Austin",
    country: "US",
    family: "Cloud and device",
    skills: ["cloud", "device", "c++", "distributed systems", "java"],
    competitors: ["apple", "amazon", "oracle", "tesla", "samsung"],
    whyItMatters: "Austin cloud and device software seats.",
  },
  {
    id: "us-ny-ads-data",
    office: "New York",
    country: "US",
    family: "Ads and data",
    skills: ["ads", "advertising", "data", "streaming"],
    competitors: ["google", "meta", "amazon", "spotify", "bloomberg"],
    whyItMatters: "NY ads / data for the channel store.",
  },
];

export const NOISE_SKILLS = [
  "cashier",
  "retail store",
  "warehouse picker",
  "call centre",
  "call center",
  "truck driver",
  "nurse",
  "physician",
];
