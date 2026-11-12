import { fetchJson } from "./http";

export async function fetchNumbeo(cityQuery: string): Promise<{
  cpi: number;
  rent: number;
  asOf: string;
} | null> {
  const key = process.env.NUMBEO_API_KEY;
  if (!key) return null;
  const json = await fetchJson<{ cpi_index?: number; rent_index?: number }>(
    `https://www.numbeo.com/api/indices?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(cityQuery)}`,
  );
  if (json.cpi_index == null) return null;
  return {
    cpi: json.cpi_index,
    rent: json.rent_index ?? 0,
    asOf: new Date().toISOString().slice(0, 10),
  };
}
