import { handleChat } from "@/lib/chat/handle";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = (await req.json()) as { message?: string; sessionId?: string };
  const message = body.message?.trim() ?? "";
  if (!message) {
    return NextResponse.json({ error: "Type a hiring question first." }, { status: 400 });
  }
  const { session, answer } = await handleChat(body.sessionId, message);
  return NextResponse.json({
    sessionId: session.id,
    briefingId: session.briefingId,
    answer,
  });
}
