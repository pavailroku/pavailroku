import type { MarketEvent } from "@/lib/domain/types";
import { fetchText } from "./http";

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') {
      q = !q;
    } else if (ch === "," && !q) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export async function fetchLayoffsUk(): Promise<{ events: MarketEvent[]; asOf: string }> {
  const csv = await fetchText("https://layoffs.uk/data.csv", { timeoutMs: 10000 });
  const rows = parseCsv(csv);
  const cutoff = Date.now() - 90 * 24 * 3600 * 1000;
  const events: MarketEvent[] = [];
  for (const row of rows) {
    const date =
      row.announcement_date ||
      row.date ||
      row.announced ||
      row.published ||
      "";
    const t = Date.parse(date);
    if (!Number.isFinite(t) || t < cutoff) continue;
    const employer = row.employer || row.company || row.name || "";
    if (!employer) continue;
    const url = row.source_url || row.url || "https://layoffs.uk/";
    events.push({
      id: `luk-${employer}-${date}`.toLowerCase().replace(/\s+/g, "-"),
      company: employer,
      type: row.status || "UK job cuts",
      jobs: Number(row.uk_jobs || row.jobs || row.confirmed || "") || undefined,
      date: date.slice(0, 10),
      url,
      publisher: row.publisher || "layoffs.uk",
      sourceName: "layoffs.uk",
      tier: "Major outlet",
      countries: ["UK"],
      summary: `${employer} UK job cuts`,
      locationHint: row.region || row.sites || row.nation,
    });
  }
  return { events, asOf: new Date().toISOString() };
}
