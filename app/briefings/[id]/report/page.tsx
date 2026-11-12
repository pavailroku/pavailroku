import { AppShell } from "@/components/AppShell";
import { Glossary } from "@/components/Glossary";
import { getBriefing } from "@/lib/repo/memory";
import { runEngine } from "@/lib/fusion";
import { money, prettyDate } from "@/lib/format";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const briefing = getBriefing(id);
  if (!briefing) notFound();
  const engine = await runEngine(briefing);
  const rec = engine.cards.find((c) => c.locationId === engine.recommendedId);
  return (
    <AppShell>
      <article className="card">
        <p className="chip chip-purple">Shareable planning pack</p>
        <h1 className="display text-4xl mt-3">{engine.briefing.role}</h1>
        <p className="text-sm text-[#cbbbe3]">
          For hiring managers, finance, recruiting, and engineering. Not a LinkedIn Talent Insights dump.
        </p>
        <h2 className="display text-2xl mt-6">Decision</h2>
        <p className="text-lg">{engine.grounding.recommendation.decisionLine}</p>
        {!engine.grounding.ok ? (
          <p>AI narrative withheld — failed source check. Numbers below are computed.</p>
        ) : null}
        {rec ? (
          <section className="mt-6 grid md:grid-cols-3 gap-4">
            <div>
              <h3>Finance</h3>
              <p className="tabular">First payroll month {rec.start.firstPayrollMonth}</p>
              <p className="tabular">Band {money(rec.budget, rec.currency)}</p>
            </div>
            <div>
              <h3>Recruiting</h3>
              <p>
                Days to offer {rec.start.p50OfferDays}–{rec.start.p75OfferDays} (SLA = service level: clock to accepted offer)
              </p>
            </div>
            <div>
              <h3>Engineering</h3>
              <p>In-seat week {prettyDate(rec.start.inSeatWeek)}</p>
              <p>
                Likely start {prettyDate(rec.start.p50Start)} · conservative {prettyDate(rec.start.p75Start)}
              </p>
            </div>
          </section>
        ) : null}
        <h2 className="display text-2xl mt-8">Locations</h2>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Score</th>
              <th>COL</th>
              <th>P50 start</th>
              <th>Presence</th>
            </tr>
          </thead>
          <tbody>
            {engine.cards.map((c) => (
              <tr key={c.locationId}>
                <td>
                  {c.name}
                  {c.exploratory ? " (exploratory)" : ""}
                </td>
                <td className="tabular">{c.composite}</td>
                <td className="tabular">{c.colIndex}</td>
                <td className="tabular">{prettyDate(c.start.p50Start)}</td>
                <td>{c.employingPresence ? "Employing" : "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="display text-2xl mt-8">Market events (sourced)</h2>
        <ul>
          {engine.events.slice(0, 12).map((e) => (
            <li key={e.id}>
              <a href={e.url}>{e.company}</a> — {e.type} — {e.date} — {e.sourceName}
            </li>
          ))}
        </ul>
        <p className="text-xs mt-6">
          Completeness: {engine.completeness.level}. {engine.completeness.banner}
        </p>
      </article>
      <Glossary />
    </AppShell>
  );
}
