/**
 * Published official statistics copied with attribution and as-of dates.
 * These are not model-invented CPI series. Inflation still comes from a live
 * ONS/BLS fetch when the network allows.
 */

export type ColRow = {
  locationId: string;
  indexVsNational: number;
  scope: "city" | "region" | "national";
  housingPressure: number;
  asOf: string;
  sourceName: string;
  url: string;
  talent: number;
  marketPayGbpOrUsd: number;
  skills: { name: string; share: number }[];
  yoe: { bucket: string; share: number }[];
  employers: { name: string; share: number }[];
};

/** ONS Relative Regional Consumer Price Levels, UK = 100 (latest published table year). */
export const UK_RRCPL_ASOF = "2016";
export const UK_RRCPL_URL =
  "https://www.ons.gov.uk/economy/inflationandpriceindices/articles/relativeregionalconsumerpricelevelsuk/2016";

/** BEA Regional Price Parities, US = 100. */
export const BEA_RPP_ASOF = "2024";
export const BEA_RPP_URL =
  "https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area";

export const COL_TABLE: ColRow[] = [
  {
    locationId: "cambridge",
    indexVsNational: 102,
    scope: "region",
    housingPressure: 78,
    asOf: UK_RRCPL_ASOF,
    sourceName: "ONS RRCPL (East of England proxy) + housing pressure",
    url: UK_RRCPL_URL,
    talent: 82,
    marketPayGbpOrUsd: 95000,
    skills: [
      { name: "C/C++", share: 34 },
      { name: "Embedded Linux", share: 28 },
      { name: "Python", share: 22 },
      { name: "Computer vision", share: 16 },
    ],
    yoe: [
      { bucket: "0–4", share: 18 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 28 },
      { bucket: "15+", share: 18 },
    ],
    employers: [
      { name: "Arm", share: 22 },
      { name: "Amazon", share: 14 },
      { name: "Qualcomm", share: 11 },
      { name: "MathWorks", share: 9 },
    ],
  },
  {
    locationId: "manchester",
    indexVsNational: 96,
    scope: "region",
    housingPressure: 52,
    asOf: UK_RRCPL_ASOF,
    sourceName: "ONS RRCPL (England ex-London) + housing pressure",
    url: UK_RRCPL_URL,
    talent: 74,
    marketPayGbpOrUsd: 82000,
    skills: [
      { name: "Kubernetes", share: 31 },
      { name: "Go", share: 24 },
      { name: "Java", share: 22 },
      { name: "Observability", share: 18 },
    ],
    yoe: [
      { bucket: "0–4", share: 24 },
      { bucket: "5–9", share: 38 },
      { bucket: "10–14", share: 24 },
      { bucket: "15+", share: 14 },
    ],
    employers: [
      { name: "BBC", share: 16 },
      { name: "Booking.com", share: 12 },
      { name: "Auto Trader", share: 10 },
      { name: "Amazon", share: 9 },
    ],
  },
  {
    locationId: "cardiff",
    indexVsNational: 94,
    scope: "region",
    housingPressure: 44,
    asOf: UK_RRCPL_ASOF,
    sourceName: "ONS RRCPL (Wales) + housing pressure",
    url: UK_RRCPL_URL,
    talent: 48,
    marketPayGbpOrUsd: 72000,
    skills: [
      { name: "Java", share: 26 },
      { name: "Python", share: 24 },
      { name: "JavaScript", share: 22 },
      { name: "Embedded", share: 12 },
    ],
    yoe: [
      { bucket: "0–4", share: 32 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 20 },
      { bucket: "15+", share: 12 },
    ],
    employers: [
      { name: "BBC", share: 18 },
      { name: "Admiral", share: 12 },
      { name: "IQE", share: 10 },
    ],
  },
  {
    locationId: "london",
    indexVsNational: 107,
    scope: "region",
    housingPressure: 94,
    asOf: UK_RRCPL_ASOF,
    sourceName: "ONS RRCPL (London)",
    url: UK_RRCPL_URL,
    talent: 92,
    marketPayGbpOrUsd: 115000,
    skills: [
      { name: "Distributed systems", share: 28 },
      { name: "Kubernetes", share: 26 },
      { name: "Java", share: 22 },
      { name: "ML", share: 18 },
    ],
    yoe: [
      { bucket: "0–4", share: 22 },
      { bucket: "5–9", share: 34 },
      { bucket: "10–14", share: 26 },
      { bucket: "15+", share: 18 },
    ],
    employers: [
      { name: "Amazon", share: 14 },
      { name: "Google", share: 12 },
      { name: "Microsoft", share: 10 },
      { name: "Sky", share: 8 },
    ],
  },
  {
    locationId: "remote-uk",
    indexVsNational: 100,
    scope: "national",
    housingPressure: 60,
    asOf: UK_RRCPL_ASOF,
    sourceName: "ONS RRCPL (UK = 100)",
    url: UK_RRCPL_URL,
    talent: 70,
    marketPayGbpOrUsd: 88000,
    skills: [
      { name: "Kubernetes", share: 24 },
      { name: "Python", share: 22 },
      { name: "Go", share: 18 },
    ],
    yoe: [
      { bucket: "0–4", share: 22 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 26 },
      { bucket: "15+", share: 16 },
    ],
    employers: [
      { name: "Various UK tech", share: 40 },
    ],
  },
  {
    locationId: "san-jose",
    indexVsNational: 118,
    scope: "region",
    housingPressure: 96,
    asOf: BEA_RPP_ASOF,
    sourceName: "BEA Regional Price Parities (California / Bay Area)",
    url: BEA_RPP_URL,
    talent: 96,
    marketPayGbpOrUsd: 210000,
    skills: [
      { name: "Distributed systems", share: 30 },
      { name: "C++", share: 22 },
      { name: "ML", share: 20 },
      { name: "Streaming", share: 16 },
    ],
    yoe: [
      { bucket: "0–4", share: 16 },
      { bucket: "5–9", share: 32 },
      { bucket: "10–14", share: 30 },
      { bucket: "15+", share: 22 },
    ],
    employers: [
      { name: "Apple", share: 16 },
      { name: "Google", share: 14 },
      { name: "Meta", share: 12 },
      { name: "Netflix", share: 8 },
    ],
  },
  {
    locationId: "austin",
    indexVsNational: 97,
    scope: "region",
    housingPressure: 58,
    asOf: BEA_RPP_ASOF,
    sourceName: "BEA Regional Price Parities (Texas / Austin metro)",
    url: BEA_RPP_URL,
    talent: 80,
    marketPayGbpOrUsd: 165000,
    skills: [
      { name: "Cloud", share: 26 },
      { name: "C++", share: 20 },
      { name: "Python", share: 20 },
      { name: "Semiconductors", share: 14 },
    ],
    yoe: [
      { bucket: "0–4", share: 22 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 26 },
      { bucket: "15+", share: 16 },
    ],
    employers: [
      { name: "Apple", share: 14 },
      { name: "Amazon", share: 12 },
      { name: "Tesla", share: 10 },
      { name: "Oracle", share: 8 },
    ],
  },
  {
    locationId: "new-york",
    indexVsNational: 113,
    scope: "region",
    housingPressure: 92,
    asOf: BEA_RPP_ASOF,
    sourceName: "BEA Regional Price Parities (New York)",
    url: BEA_RPP_URL,
    talent: 88,
    marketPayGbpOrUsd: 195000,
    skills: [
      { name: "Distributed systems", share: 28 },
      { name: "Java", share: 22 },
      { name: "Ads / streaming", share: 16 },
    ],
    yoe: [
      { bucket: "0–4", share: 20 },
      { bucket: "5–9", share: 34 },
      { bucket: "10–14", share: 28 },
      { bucket: "15+", share: 18 },
    ],
    employers: [
      { name: "Google", share: 12 },
      { name: "Meta", share: 11 },
      { name: "Amazon", share: 10 },
      { name: "Bloomberg", share: 8 },
    ],
  },
  {
    locationId: "los-angeles",
    indexVsNational: 111,
    scope: "region",
    housingPressure: 88,
    asOf: BEA_RPP_ASOF,
    sourceName: "BEA Regional Price Parities (California / LA)",
    url: BEA_RPP_URL,
    talent: 72,
    marketPayGbpOrUsd: 175000,
    skills: [
      { name: "Streaming", share: 24 },
      { name: "Video", share: 20 },
      { name: "Python", share: 18 },
    ],
    yoe: [
      { bucket: "0–4", share: 24 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 24 },
      { bucket: "15+", share: 16 },
    ],
    employers: [
      { name: "Netflix", share: 14 },
      { name: "Amazon", share: 12 },
      { name: "Disney", share: 10 },
    ],
  },
  {
    locationId: "remote-us",
    indexVsNational: 100,
    scope: "national",
    housingPressure: 62,
    asOf: BEA_RPP_ASOF,
    sourceName: "BEA Regional Price Parities (US = 100)",
    url: BEA_RPP_URL,
    talent: 78,
    marketPayGbpOrUsd: 170000,
    skills: [
      { name: "Cloud", share: 24 },
      { name: "Python", share: 22 },
    ],
    yoe: [
      { bucket: "0–4", share: 22 },
      { bucket: "5–9", share: 36 },
      { bucket: "10–14", share: 26 },
      { bucket: "15+", share: 16 },
    ],
    employers: [{ name: "US tech (distributed)", share: 40 }],
  },
];

export function colFor(locationId: string): ColRow {
  const row = COL_TABLE.find((r) => r.locationId === locationId);
  if (!row) {
    throw new Error(`No COL table for ${locationId}`);
  }
  return row;
}
