import { fetchJson } from "./http";

type AdzunaSearch = { count?: number; mean?: number };

export type AdzunaPoint = {
  locationId: string;
  vacancyCount?: number;
  meanSalary?: number;
  asOf: string;
};

export async function fetchAdzuna(
  country: "gb" | "us",
  where: string,
  what: string,
): Promise<AdzunaPoint | null> {
  const id = process.env.ADZUNA_APP_ID;
  const key = process.env.ADZUNA_APP_KEY;
  if (!id || !key) return null;
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${id}&app_key=${key}&results_per_page=1&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}`;
  const json = await fetchJson<AdzunaSearch>(url);
  return {
    locationId: where,
    vacancyCount: json.count,
    meanSalary: json.mean,
    asOf: new Date().toISOString().slice(0, 10),
  };
}
