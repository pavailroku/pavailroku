import type { LocationDefinition, StartPlan, TimelineStage } from "@/lib/domain/types";

export type TimeToHireInput = {
  location: LocationDefinition;
  asOf: Date;
  tightness: number;
  talent: number;
  belowMarket: boolean;
  visaRequired: boolean;
  expedite?: boolean;
  greenhouseOfferDays?: number;
};

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const n = new Date(d);
  n.setUTCDate(n.getUTCDate() + days);
  return n;
}

function mondayOf(d: Date): string {
  const n = new Date(d);
  const day = n.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  n.setUTCDate(n.getUTCDate() + diff);
  return iso(n);
}

function payrollMonth(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function forecastStart(input: TimeToHireInput): StartPlan {
  const talentFactor = Math.max(0.7, Math.min(1.5, 1.2 - input.talent / 200));
  const tight = Math.max(0.8, Math.min(1.4, input.tightness));
  let sourcingP50 = Math.round(5 * 7 * talentFactor * tight);
  let sourcingP75 = Math.round(sourcingP50 * 1.4);
  if (input.expedite) {
    sourcingP50 = Math.round(sourcingP50 * 0.75);
    sourcingP75 = Math.round(sourcingP75 * 0.8);
  }
  const interviewP50 = input.expedite ? 14 : 28;
  const interviewP75 = input.expedite ? 21 : 35;
  const offerP50 = 7;
  const offerP75 = 14;
  const uk = input.location.country === "UK";
  const noticeP50 = uk ? 56 : 14;
  const noticeP75 = uk ? 84 : 28;
  const visaP50 = input.visaRequired ? (uk ? 56 : 42) : 0;
  const visaP75 = input.visaRequired ? (uk ? 84 : 70) : 0;
  const retryP50 = input.belowMarket ? 21 : 0;
  const retryP75 = input.belowMarket ? 35 : 0;
  const onboard = 5;

  const gh = input.greenhouseOfferDays;
  const p50OfferDays =
    gh ?? sourcingP50 + interviewP50 + offerP50 + retryP50;
  const p75OfferDays = gh
    ? Math.round(gh * 1.35)
    : sourcingP75 + interviewP75 + offerP75 + retryP75;

  const p50Total = p50OfferDays + noticeP50 + visaP50;
  const p75Total = p75OfferDays + noticeP75 + visaP75;
  const earliestTotal = Math.round(p50OfferDays * 0.85) + (uk ? 28 : 10) + visaP50;

  const startP50 = addDays(input.asOf, p50Total);
  const startP75 = addDays(input.asOf, p75Total);
  const earliest = addDays(input.asOf, earliestTotal);
  const inSeat = addDays(startP50, onboard);

  const stages: TimelineStage[] = [
    {
      id: "sourcing",
      label: "Sourcing to interview-ready",
      p50Days: sourcingP50,
      p75Days: sourcingP75,
      owner: "recruiting",
    },
    {
      id: "interview",
      label: "Interview loop",
      p50Days: interviewP50,
      p75Days: interviewP75,
      owner: "recruiting",
    },
    {
      id: "offer",
      label: "Offer and approval",
      p50Days: offerP50,
      p75Days: offerP75,
      owner: "recruiting",
    },
  ];
  if (retryP50) {
    stages.push({
      id: "retry",
      label: "Offer-decline retry (below-market band)",
      p50Days: retryP50,
      p75Days: retryP75,
      owner: "recruiting",
    });
  }
  stages.push({
    id: "notice",
    label: uk ? "UK notice period" : "US notice period",
    p50Days: noticeP50,
    p75Days: noticeP75,
    owner: "candidate",
  });
  if (visaP50) {
    stages.push({
      id: "visa",
      label: uk ? "UK Skilled Worker visa" : "US work authorisation",
      p50Days: visaP50,
      p75Days: visaP75,
      owner: "recruiting",
    });
  }
  stages.push({
    id: "onboard",
    label: "Onboarding buffer (in-seat)",
    p50Days: onboard,
    p75Days: onboard,
    owner: "engineering",
  });

  const slipRisks: string[] = [];
  if (input.talent < 55) slipRisks.push("Thin skill density — sourcing may stretch.");
  if (input.belowMarket) slipRisks.push("Band is below local advertised pay — expect decline/retry.");
  if (input.visaRequired) slipRisks.push("Visa path is a separate clock, not hidden in recruiting SLA.");
  if (uk) slipRisks.push("Senior UK notice (8–12 weeks) dominates the calendar after accept.");

  return {
    locationId: input.location.id,
    modelled: gh === undefined,
    p50OfferDays,
    p75OfferDays,
    p50Start: iso(startP50),
    p75Start: iso(startP75),
    earliestStart: iso(earliest),
    firstPayrollMonth: payrollMonth(startP50),
    inSeatWeek: mondayOf(inSeat),
    stages,
    slipRisks,
  };
}
