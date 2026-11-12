import { AppShell } from "@/components/AppShell";
import { Dashboard } from "@/components/Dashboard";
import { getBriefing, setRole } from "@/lib/repo/memory";
import { runEngine } from "@/lib/fusion";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const briefing = setRole(id, "recruiter") ?? getBriefing(id);
  if (!briefing) notFound();
  const engine = await runEngine(briefing);
  return (
    <AppShell>
      <p className="chip mb-4">Recruiter workspace — uploads, watchlist, same facts as the hiring manager</p>
      <Dashboard initial={engine} />
    </AppShell>
  );
}
