import { AppShell } from "@/components/AppShell";
import { DigestView } from "@/components/DigestView";
import { Glossary } from "@/components/Glossary";
import { buildDigest } from "@/lib/digest/build";

export const dynamic = "force-dynamic";

export default async function MonthlyReport() {
  const digest = await buildDigest("monthly");
  return (
    <AppShell>
      <DigestView initial={digest} />
      <Glossary />
    </AppShell>
  );
}
