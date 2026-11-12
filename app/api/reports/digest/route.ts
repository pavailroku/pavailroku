import { buildDigest, type DigestCadence } from "@/lib/digest/build";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cadence = new URL(req.url).searchParams.get("cadence");
  if (cadence !== "weekly" && cadence !== "monthly") {
    return NextResponse.json({ error: "cadence=weekly|monthly" }, { status: 400 });
  }
  const digest = await buildDigest(cadence as DigestCadence);
  return NextResponse.json(digest);
}
