import { AppShell } from "@/components/AppShell";
import { ConnectionStrip } from "@/components/ConnectionStrip";
import { Dashboard } from "@/components/Dashboard";
import { getBriefing } from "@/lib/repo/memory";
import { runEngine } from "@/lib/fusion";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const briefing = getBriefing(id);
  if (!briefing) notFound();
  const engine = await runEngine(briefing);
  return (
    <AppShell>
      <ConnectionStrip />
      <Dashboard initial={engine} />
    </AppShell>
  );
}
