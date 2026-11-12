import { buildDigest, type DigestCadence } from "@/lib/digest/build";
import { sendDigestEmail } from "@/lib/digest/send";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cadence = (new URL(req.url).searchParams.get("cadence") ||
    ((await req.json().catch(() => ({}))) as { cadence?: string }).cadence) as DigestCadence;
  if (cadence !== "weekly" && cadence !== "monthly") {
    return NextResponse.json({ error: "cadence=weekly|monthly" }, { status: 400 });
  }
  const digest = await buildDigest(cadence);
  const result = await sendDigestEmail(digest);
  return NextResponse.json({ ...result, itemCount: digest.items.length, quiet: digest.quiet });
}

export async function GET(req: Request) {
  return POST(req);
}
