import { classifyIntel } from "@/lib/sources/ingest";
import { addUpload, getBriefing } from "@/lib/repo/memory";
import { runEngine } from "@/lib/fusion";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getBriefing(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as { text?: string; filename?: string };
  if (!body.text?.trim()) {
    return NextResponse.json({ error: "Paste text or drop a file." }, { status: 400 });
  }
  const kind = classifyIntel(body.text, body.filename);
  const briefing = addUpload(id, {
    id: randomUUID(),
    kind,
    filename: body.filename,
    text: body.text.slice(0, 20000),
    addedAt: new Date().toISOString(),
  });
  if (!briefing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await runEngine(briefing));
}
