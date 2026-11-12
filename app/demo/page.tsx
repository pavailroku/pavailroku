import { seedTaDemo } from "@/lib/demo/seed";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** One click for a TA leadership walkthrough. */
export default function TaDemo() {
  const briefing = seedTaDemo();
  redirect(`/briefings/${briefing.id}`);
}
