import { AppShell } from "@/components/AppShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppShell>
      <div className="card">
        <h1 className="display text-3xl">Briefing not found</h1>
        <p className="text-[#cbbbe3]">
          Briefings live in this server’s memory. If the app restarted, open a new one — it takes 30 seconds.
        </p>
        <Link href="/briefings/new" className="btn btn-primary inline-block mt-4 no-underline">
          New briefing
        </Link>
      </div>
    </AppShell>
  );
}
