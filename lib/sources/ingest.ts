import type { UploadedIntel } from "@/lib/domain/types";

export function classifyIntel(text: string, filename?: string): UploadedIntel["kind"] {
  const blob = `${filename ?? ""} ${text}`.toLowerCase();
  if (blob.includes("talent insights") || blob.includes("linkedin") || /\.pdf$/i.test(filename ?? "")) {
    if (blob.includes("talent") || blob.includes("linkedin")) return "linkedin_ti";
  }
  if (blob.includes("greenhouse") || blob.includes("time to fill") || blob.includes("talent wall")) {
    return "greenhouse";
  }
  if (blob.includes("market map") || blob.includes("competitor")) return "market_map";
  if (blob.includes("job description") || blob.startsWith("we are looking")) return "jd";
  return "notes";
}

export function parseGreenhouseOfferDays(text: string): number | undefined {
  const m = text.match(/(?:time[- ]to[- ](?:fill|offer)|days to offer)\D{0,12}(\d{2,3})/i);
  if (!m) return undefined;
  return Number(m[1]);
}

export function parseTalentBoost(text: string): number {
  if (/linkedin|talent insights/i.test(text)) return 8;
  return 0;
}
