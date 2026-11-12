import { fetchJson } from "./http";

type BlsPayload = {
  status?: string;
  Results?: { series?: { data?: { year: string; periodName: string; value: string }[] }[] };
};

export async function fetchBlscpi(): Promise<{ pct: number; asOf: string } | null> {
  const key = process.env.BLS_API_KEY;
  const body = {
    seriesid: ["CUSR0000SA0"],
    startyear: String(new Date().getUTCFullYear() - 1),
    endyear: String(new Date().getUTCFullYear()),
    ...(key ? { registrationkey: key } : {}),
  };
  try {
    const res = await fetchJson<BlsPayload>("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      timeoutMs: 8000,
      headers: { "Content-Type": "application/json" },
    });
    void body;
    const point = res.Results?.series?.[0]?.data?.[0];
    if (!point) return null;
    return {
      pct: Number(point.value),
      asOf: `${point.periodName} ${point.year}`,
    };
  } catch {
    return null;
  }
}
