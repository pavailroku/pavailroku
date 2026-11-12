import { ground, templateDecision } from "@/lib/guardrails/ground";
import type {
  Evidence,
  GroundingResult,
  LocationCard,
  Recommendation,
} from "@/lib/domain/types";

export function recommend(args: {
  evidence: Evidence[];
  cards: LocationCard[];
  recommendedId: string | null;
  modelPayload?: Recommendation;
}): GroundingResult {
  const payload = args.modelPayload ?? templateDecision(args.cards, args.recommendedId);
  return ground({
    payload,
    evidence: args.evidence,
    cards: args.cards,
    recommendedId: args.recommendedId,
  });
}
