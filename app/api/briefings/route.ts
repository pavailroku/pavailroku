import { createBriefing, listBriefings } from "@/lib/repo/memory";
import type { BriefingInput } from "@/lib/domain/types";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(listBriefings());
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<BriefingInput>;
  if (!body.role || !body.countrySet || !body.budget) {
    return NextResponse.json({ error: "Role, country, and budget are required." }, { status: 400 });
  }
  const briefing = createBriefing({
    title: body.title || body.role,
    role: body.role,
    skills: body.skills ?? [],
    whyHiring: body.whyHiring,
    countrySet: body.countrySet,
    budget: Number(body.budget),
    currency: body.currency ?? (body.countrySet === "US" ? "USD" : "GBP"),
    visaRequired: Boolean(body.visaRequired),
    expedite: Boolean(body.expedite),
    hmNotes: body.hmNotes,
  });
  return NextResponse.json(briefing);
}
