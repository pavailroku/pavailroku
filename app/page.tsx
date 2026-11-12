import { AppShell } from "@/components/AppShell";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell>
      <section className="max-w-3xl">
        <p className="chip chip-purple">Internal · Roku Talent Intelligence</p>
        <h1 className="display text-5xl mt-4">
          The headcount decision engine — not another candidate search.
        </h1>
        <p className="text-lg text-[#cbbbe3] mt-4">
          Tell us the role, the country, and the budget. We tell you where the money
          actually lands, whether talent exists, and when finance, recruiting, and
          engineering should plan for someone in seat.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/briefings/new" className="btn btn-primary no-underline">
            New briefing (30 seconds)
          </Link>
          <Link href="/reports/weekly" className="btn btn-ghost no-underline">
            Weekly recruiter digest
          </Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4 mt-12">
        {[
          ["Where", "Cambridge vs Cardiff vs Manchester vs Austin — talent, cost of living, and whether Roku can actually employ there."],
          ["Money", "Official prices from the ONS (Office for National Statistics, UK) and BEA (Bureau of Economic Analysis, US). Same band, different living standard. Finance sees first payroll month."],
          ["When", "P50 (likely) and P75 (conservative) start dates. UK notice is not US notice. Engineering sees in-seat week."],
        ].map(([t, d]) => (
          <article key={t} className="card">
            <h2 className="display text-2xl">{t}</h2>
            <p className="text-sm text-[#cbbbe3]">{d}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
