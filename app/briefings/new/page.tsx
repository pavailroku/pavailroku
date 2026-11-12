import { AppShell } from "@/components/AppShell";
import { Glossary } from "@/components/Glossary";
import { IntakeForm } from "@/components/IntakeForm";

export default function NewBriefing() {
  return (
    <AppShell>
      <IntakeForm />
      <Glossary />
    </AppShell>
  );
}
