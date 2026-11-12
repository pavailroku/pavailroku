import { AppShell } from "@/components/AppShell";
import { DigestView } from "@/components/DigestView";
import { Glossary } from "@/components/Glossary";
import { buildDigest } from "@/lib/digest/build";

export const dynamic = "force-dynamic";

export default async function WeeklyReport() {
  const digest = await buildDigest("weekly");
  return (
    <AppShell>
      <DigestView initial={digest} />
      <Glossary />
    </AppShell>
  );
}
