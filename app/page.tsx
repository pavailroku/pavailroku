import { AppShell } from "@/components/AppShell";
import { ConnectionStrip } from "@/components/ConnectionStrip";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <AppShell>
      <p className="chip chip-purple">Roku Talent Intelligence · Live demo</p>
      <h1 className="display text-5xl mt-4 max-w-3xl">Two things this engine does</h1>
      <p className="text-lg text-[#cbbbe3] mt-4 max-w-2xl">
        Open either. No setup. Market data is live (layoffs, UK cuts). Internal org is labelled
        Demo until Glean is on the Roku network.
      </p>
      <section className="grid md:grid-cols-2 gap-6 mt-10">
        <Link href="/demo" className="card no-underline text-white block hover:border-[var(--roku-teal)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)] m-0">1 · Decision</p>
          <h2 className="display text-3xl mt-2">Where to hire, what it costs, when they start</h2>
          <p className="text-sm text-[#cbbbe3] mt-3">
            Hiring manager briefing: UK Senior Software Engineer, £90k. Location scorecard, money,
            P50/P75 start dates for finance and engineering. Live Market Pulse.
          </p>
          <p className="mt-4 font-bold text-[var(--roku-teal)]">Open live briefing →</p>
        </Link>
        <Link href="/reports/weekly" className="card no-underline text-white block hover:border-[var(--roku-teal)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)] m-0">2 · Digest</p>
          <h2 className="display text-3xl mt-2">Live weekly pulse for recruiters</h2>
          <p className="text-sm text-[#cbbbe3] mt-3">
            What moved this week in our market — only events mapped to Roku desks (Cambridge
            embedded/ML, Manchester cloud-native, US player/cloud/ads). Not a tech magazine.
          </p>
          <p className="mt-4 font-bold text-[var(--roku-teal)]">Open live digest →</p>
        </Link>
      </section>
      <div className="mt-10">
        <ConnectionStrip />
      </div>
    </AppShell>
  );
}
