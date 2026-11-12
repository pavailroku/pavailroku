import { getBriefing, updateBriefing } from "@/lib/repo/memory";
import { runEngine } from "@/lib/fusion";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const briefing = getBriefing(id);
  if (!briefing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const engine = await runEngine(briefing);
  return NextResponse.json(engine);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const patch = await req.json();
  const briefing = updateBriefing(id, patch);
  if (!briefing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const engine = await runEngine(briefing);
  return NextResponse.json(engine);
}
