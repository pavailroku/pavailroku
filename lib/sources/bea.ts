import { fetchJson } from "./http";
import { BEA_RPP_ASOF, BEA_RPP_URL } from "./official-tables";

/**
 * BEA Regional Price Parities (RPP) need an API key for the live table.
 * Without BEA_API_KEY we return the published snapshot already in official-tables
 * and mark status offline-for-live-api (the table itself is still official).
 */
export async function fetchBeaPing(): Promise<{ ok: boolean; asOf: string; url: string }> {
  const key = process.env.BEA_API_KEY;
  if (!key) {
    return { ok: false, asOf: BEA_RPP_ASOF, url: BEA_RPP_URL };
  }
  try {
    await fetchJson(
      `https://apps.bea.gov/api/data/?UserID=${encodeURIComponent(key)}&method=GETDATASETLIST&ResultFormat=JSON`,
      { timeoutMs: 8000 },
    );
    return { ok: true, asOf: new Date().toISOString().slice(0, 10), url: BEA_RPP_URL };
  } catch {
    return { ok: false, asOf: BEA_RPP_ASOF, url: BEA_RPP_URL };
  }
}
