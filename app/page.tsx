import { AppShell } from "@/components/AppShell";
import { ChatApp } from "@/components/ChatApp";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <AppShell variant="chat">
      <ChatApp />
    </AppShell>
  );
}
