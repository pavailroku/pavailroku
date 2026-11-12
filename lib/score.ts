import type { LocationCard, ScoreWeights } from "@/lib/domain/types";
import { DEFAULT_WEIGHTS } from "@/lib/domain/types";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function componentScores(args: {
  talent: number;
  budgetFit: number;
  colIndex: number;
  housingPressure: number;
  inflationPct: number;
  marketHeat: number;
  presenceScore: number;
  p50Weeks: number;
}): Record<keyof ScoreWeights, number> {
  return {
    talent: clamp01(args.talent / 100),
    budgetFit: clamp01(args.budgetFit),
    realWage: clamp01(1.15 - args.colIndex / 100 / 1.1),
    housing: clamp01(1 - args.housingPressure / 100),
    inflation: clamp01(1 - Math.max(0, args.inflationPct - 2) / 8),
    marketEvents: clamp01(0.5 + args.marketHeat),
    rokuPresence: clamp01(args.presenceScore / 100),
    speed: clamp01(1 - (args.p50Weeks - 8) / 24),
  };
}

export function compositeOf(
  scores: Record<keyof ScoreWeights, number>,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): number {
  const total = (Object.keys(weights) as (keyof ScoreWeights)[]).reduce(
    (sum, k) => sum + scores[k] * weights[k],
    0,
  );
  return Math.round(total * 1000) / 10;
}

export function pickRecommended(cards: LocationCard[]): string | null {
  const employable = cards.filter((c) => c.employingPresence);
  const pool = employable.length ? employable : cards;
  if (!pool.length) return null;
  return [...pool].sort((a, b) => b.composite - a.composite)[0]?.locationId ?? null;
}
