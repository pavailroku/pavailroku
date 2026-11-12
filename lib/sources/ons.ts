import { fetchJson } from "./http";

type OnsObs = {
  observations?: { observation?: string }[];
};

export async function fetchCpihYoY(): Promise<{ pct: number; asOf: string }> {
  const meta = await fetchJson<{
    links?: { latest_version?: { href?: string } };
  }>("https://api.beta.ons.gov.uk/v1/datasets/cpih01");
  const latest = meta.links?.latest_version?.href;
  if (!latest) throw new Error("ONS CPIH latest version missing");
  const dim = await fetchJson<{ items?: { id?: string; label?: string }[] }>(
    `${latest}/editions/time-series/versions/`,
  ).catch(() => ({ items: [] }));
  void dim;
  const obs = await fetchJson<OnsObs>(
    `${latest}/observations?time=latest&geography=K02000001&aggregate=cpih1dim1A0`,
  ).catch(async () => {
    return fetchJson<OnsObs>(
      "https://api.beta.ons.gov.uk/v1/datasets/cpih01/editions/time-series/versions/1/observations?time=*&geography=K02000001&aggregate=cpih1dim1A0",
    );
  });
  const raw = obs.observations?.[0]?.observation;
  const pct = raw ? Number(raw) : NaN;
  if (!Number.isFinite(pct)) {
    throw new Error("ONS CPIH observation missing");
  }
  return { pct, asOf: new Date().toISOString().slice(0, 10) };
}
