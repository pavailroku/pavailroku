import { colFor } from "@/lib/sources/official-tables";

export function realWageIndex(budget: number, colIndex: number): number {
  if (colIndex <= 0) return 0;
  return Math.round((budget / colIndex) * 100) / 100;
}

export function livingStandardDeltaPct(
  budget: number,
  thisCol: number,
  anchorCol: number,
): number {
  if (thisCol <= 0 || anchorCol <= 0) return 0;
  const here = budget / thisCol;
  const there = budget / anchorCol;
  return Math.round(((here - there) / there) * 1000) / 10;
}

export function budgetFit(budget: number, marketPay: number): number {
  if (marketPay <= 0) return 0;
  const ratio = budget / marketPay;
  return Math.max(0, Math.min(1, ratio));
}

export function seatsForPool(pool: number, marketPay: number): number {
  if (marketPay <= 0) return 0;
  return Math.round((pool / marketPay) * 10) / 10;
}

export function moneyVerdict(args: {
  budgetFit: number;
  housingPressure: number;
  talent: number;
  colIndex: number;
  nationalCol?: number;
}): "Budget lands well" | "Tight vs housing" | "Below market" | "Talent-rich and cheaper" {
  const national = args.nationalCol ?? 100;
  if (args.budgetFit < 0.9) return "Below market";
  if (args.housingPressure >= 85 && args.budgetFit < 1.15) return "Tight vs housing";
  if (args.talent >= 70 && args.colIndex < national) return "Talent-rich and cheaper";
  return "Budget lands well";
}

export function economicsForLocation(locationId: string, budget: number) {
  const row = colFor(locationId);
  const rw = realWageIndex(budget, row.indexVsNational);
  return {
    colIndex: row.indexVsNational,
    colScope: row.scope,
    housingPressure: row.housingPressure,
    marketPay: row.marketPayGbpOrUsd,
    realWageIndex: rw,
    budgetFit: budgetFit(budget, row.marketPayGbpOrUsd),
    asOf: row.asOf,
    sourceName: row.sourceName,
    url: row.url,
    talent: row.talent,
    skills: row.skills,
    yoe: row.yoe,
    employers: row.employers,
  };
}
