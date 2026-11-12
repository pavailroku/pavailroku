"use client";

import { fromCards, InsightGrid } from "@/components/viz/InsightCharts";
import type { EngineResult, ViewerRole } from "@/lib/domain/types";
import { money, prettyDate } from "@/lib/format";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Glossary } from "./Glossary";
import { Term as Abbr } from "./Term";

function roleHint(role: ViewerRole): string {
  if (role === "finance") return "You are on the finance view: first payroll month is the number that matters.";
  if (role === "engineering") return "You are on the engineering view: in-seat week is when the person is actually here.";
  if (role === "recruiter") return "You are on the recruiter view: add intelligence to raise confidence. LinkedIn is optional.";
  return "You are on the hiring manager view: location, money, and start date first.";
}

export function Dashboard({ initial }: { initial: EngineResult }) {
  const [engine, setEngine] = useState(initial);
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const rec = engine.cards.find((c) => c.locationId === engine.recommendedId);
  const decision = engine.grounding.recommendation;

  async function patch(body: object) {
    setBusy(true);
    const res = await fetch(`/api/briefings/${engine.briefing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEngine(await res.json());
    setBusy(false);
  }

  async function addIntel() {
    if (!paste.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/briefings/${engine.briefing.id}/intelligence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: paste }),
    });
    setEngine(await res.json());
    setPaste("");
    setBusy(false);
  }

  const bars = useMemo(() => {
    const max = Math.max(...engine.cards.map((c) => c.realWageIndex), 1);
    return engine.cards.map((c) => ({
      id: c.locationId,
      name: c.name,
      pct: (c.realWageIndex / max) * 100,
      currency: c.currency,
    }));
  }, [engine.cards]);

  return (
    <div className="grid gap-6">
      <div className="no-print flex flex-wrap items-center gap-3 justify-between">
        <div>
          <p className="kicker">Roku Talent Intelligence</p>
          <h1 className="display h1" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>{engine.briefing.role}</h1>
          <p className="lede" style={{ marginTop: "0.6rem" }}>{roleHint(engine.briefing.viewerRole)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["hiring_manager", "Hiring manager"],
              ["recruiter", "Recruiter"],
              ["finance", "Finance"],
              ["engineering", "Engineering"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={`btn ${engine.briefing.viewerRole === id ? "btn-primary" : "btn-ghost"}`}
              onClick={() => patch({ viewerRole: id })}
              type="button"
            >
              {label}
            </button>
          ))}
          <Link className="btn btn-ghost no-underline" href={`/briefings/${engine.briefing.id}/report`}>
            Shareable report
          </Link>
          {engine.briefing.viewerRole === "recruiter" ? (
            <Link className="btn btn-ghost no-underline" href={`/briefings/${engine.briefing.id}/workspace`}>
              Workspace
            </Link>
          ) : null}
        </div>
      </div>

      <section className="card" style={{ background: "linear-gradient(120deg, #853dff 0%, #4f01a3 58%, #20004c 100%)" }}>
        <p className="kicker" style={{ color: "rgba(255,255,255,0.88)" }}>Decision</p>
        <h2 className="display h2 mt-3 text-white">{decision.decisionLine}</h2>
        <p className="mt-3 text-white/85 max-w-3xl">{decision.why}</p>
        {!engine.grounding.ok ? (
          <p className="chip chip-orange mt-3">
            AI narrative withheld — failed source check. Scorecards below are still computed in code, not by the model.
          </p>
        ) : null}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-[#9b8bb3]">Recommended city</p>
          <p className="display text-3xl mt-2">{rec?.name ?? "—"}</p>
          {rec?.exploratory ? (
            <p className="chip chip-orange mt-2">Exploratory — no Roku employing presence</p>
          ) : (
            <p className="chip chip-teal mt-2">Employing presence</p>
          )}
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-[#9b8bb3]">Where the money lands</p>
          <p className="display text-3xl tabular mt-2">
            {rec ? money(rec.budget, rec.currency) : "—"}
          </p>
          <p className="text-sm text-[#cbbbe3] mt-1">{rec?.verdict}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-[#9b8bb3]">
            <Abbr abbr="P50" /> in-seat
          </p>
          <p className="display text-3xl tabular mt-2">
            {rec ? prettyDate(rec.start.p50Start) : "—"}
          </p>
          <p className="text-sm text-[#cbbbe3] mt-1">
            Conservative <Abbr abbr="P75" /> {rec ? prettyDate(rec.start.p75Start) : "—"} ·{" "}
            {rec?.start.modelled ? "Modelled from market + notice norms" : "Measured from Greenhouse"}
          </p>
        </div>
      </section>

      <section className="card">
        <p className="kicker">Visual intelligence</p>
        <h2 className="display h2">Talent density, score, and money</h2>
        <p className="lede" style={{ fontSize: "1rem" }}>
          Same briefing, drawn not just written. Bars and the scatter use the scored cities above — not decoration.
        </p>
        <InsightGrid rows={fromCards(engine.cards)} />
      </section>

      <section className="card">
        <h2 className="display text-xl">Completeness — more data is better, never required</h2>
        <p className="text-sm mt-2 text-[#cbbbe3]">{engine.completeness.banner}</p>
        <p className="mt-2">
          Confidence: <strong>{engine.completeness.level}</strong>
          {" "}
          (cannot be high without LinkedIn <Abbr abbr="TI" /> and a live economics fetch)
        </p>
        <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
          {engine.completeness.items.map((i) => (
            <li key={i.id}>
              <span className={i.present ? "chip chip-teal" : "chip"}>{i.present ? "Present" : "Missing"}</span>{" "}
              <strong>{i.label}</strong> — {i.impact}
            </li>
          ))}
        </ul>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="display text-xl mb-1">Location scorecard</h2>
        <p className="text-sm text-[#cbbbe3] mb-4">
          Composite is a visible mix of talent, budget fit, real wage (
          <Abbr abbr="COL" />), housing, inflation, market events, Roku presence, and speed to in-seat.
          Exploratory cities are capped and are not the default open-req recommendation.
        </p>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Talent</th>
              <th>
                <Abbr abbr="COL" />
              </th>
              <th>Market pay</th>
              <th>Verdict</th>
              <th>
                <Abbr abbr="P50" /> start
              </th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {engine.cards.map((c) => (
              <tr key={c.locationId} className={c.locationId === engine.recommendedId ? "bg-white/5" : ""}>
                <td>
                  <strong>{c.name}</strong>
                  <div className="text-xs text-[#9b8bb3]">
                    {c.country}
                    {c.exploratory ? " · Exploratory — no employing presence" : " · Roku can employ here"}
                  </div>
                </td>
                <td className="tabular">{c.talent}</td>
                <td className="tabular">
                  {c.colIndex} ({c.colScope})
                </td>
                <td className="tabular">{money(c.marketPay, c.currency)}</td>
                <td>
                  <span className={c.verdict === "Below market" || c.verdict === "Tight vs housing" ? "chip chip-orange" : "chip chip-teal"}>
                    {c.verdict}
                  </span>
                </td>
                <td className="tabular">{prettyDate(c.start.p50Start)}</td>
                <td className="tabular font-bold">{c.composite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="display text-xl">Where the same budget lands</h2>
        <p className="text-sm text-[#cbbbe3] mb-4">
          Taller bar = more living standard from the same cash. UK and US stay in their own currency.
        </p>
        <div className="grid gap-2">
          {bars.map((b) => (
            <div key={b.id} className="grid grid-cols-[9rem_1fr] items-center gap-3">
              <span className="text-sm">{b.name}</span>
              <div className="h-3 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${b.pct}%`, background: "var(--roku-teal)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="display text-xl">Market Pulse</h2>
          <p className="text-sm text-[#cbbbe3]">
            Live layoffs and freezes from Talent Risk and layoffs.uk. No URL = we do not show it.
            Credit: Talent Risk (CC BY 4.0) and layoffs.uk.
          </p>
          <p className="text-xs mt-2 text-[#9b8bb3]">
            Last live fetch — Talent Risk: {engine.lastLiveFetch["talent-risk"] ?? "offline"} · layoffs.uk:{" "}
            {engine.lastLiveFetch["layoffs-uk"] ?? "offline"} · ONS: {engine.lastLiveFetch.ons ?? "offline"}
          </p>
          <ul className="mt-3 grid gap-3">
            {engine.events.slice(0, 8).map((e) => (
              <li key={e.id} className="border-t border-white/10 pt-3">
                <a href={e.url} target="_blank" rel="noreferrer" className="font-bold">
                  {e.company}
                </a>{" "}
                <span className="chip">{e.type}</span>
                <div className="text-xs text-[#cbbbe3]">
                  {e.date} · {e.publisher} · {e.tier}
                  {e.jobs ? ` · ${e.jobs} jobs` : ""}
                </div>
                <p className="text-sm m-0 mt-1">{e.summary}</p>
              </li>
            ))}
            {engine.events.length === 0 ? (
              <li className="text-sm text-[#cbbbe3]">
                No sourced watchlist events in the last 90 days (or live feed is offline). We will not invent a layoff to fill this panel.
              </li>
            ) : null}
          </ul>
        </div>
        <div className="card">
          <h2 className="display text-xl">
            Start-date plan — finance, recruiting, engineering
          </h2>
          {rec ? (
            <>
              <dl className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <dt className="text-[#9b8bb3]">Likely start (<Abbr abbr="P50" />)</dt>
                  <dd className="m-0 font-bold">{prettyDate(rec.start.p50Start)}</dd>
                </div>
                <div>
                  <dt className="text-[#9b8bb3]">Conservative (<Abbr abbr="P75" />)</dt>
                  <dd className="m-0 font-bold">{prettyDate(rec.start.p75Start)}</dd>
                </div>
                <div>
                  <dt className="text-[#9b8bb3]">First payroll month</dt>
                  <dd className="m-0 font-bold">{rec.start.firstPayrollMonth}</dd>
                </div>
                <div>
                  <dt className="text-[#9b8bb3]">Engineering in-seat week</dt>
                  <dd className="m-0 font-bold">{prettyDate(rec.start.inSeatWeek)}</dd>
                </div>
                <div>
                  <dt className="text-[#9b8bb3]">Recruiting <Abbr abbr="SLA" /> (days to offer)</dt>
                  <dd className="m-0 font-bold">{rec.start.p50OfferDays}–{rec.start.p75OfferDays}</dd>
                </div>
              </dl>
              <ol className="mt-4 text-sm">
                {rec.start.stages.map((s) => (
                  <li key={s.id} className="flex justify-between border-t border-white/10 py-2">
                    <span>
                      {s.label} <span className="text-[#9b8bb3]">({s.owner})</span>
                    </span>
                    <span className="tabular">
                      {s.p50Days}–{s.p75Days} days
                    </span>
                  </li>
                ))}
              </ol>
              <ul className="text-sm text-[#cbbbe3] mt-3">
                {rec.start.slipRisks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <section className="card">
        <h2 className="display text-xl">Roku presence (internal)</h2>
        <p className="text-sm text-[#cbbbe3]">
          Demo org data until Glean / Confluence credentials are set. Names are internal employees, not external candidates.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {engine.cards
            .filter((c) => c.employingPresence)
            .map((c) => (
              <div key={c.locationId}>
                <h3 className="font-bold">
                  {c.name} <span className="chip">Demo</span>
                </h3>
                <p className="text-sm">{c.work}</p>
                <p className="text-xs text-[#9b8bb3]">{c.teams.join(" · ")}</p>
                {engine.briefing.viewerRole !== "finance" ? (
                  <ul className="text-sm mt-2">
                    {c.people.map((p) => (
                      <li key={p.name}>
                        {p.name} — {p.title}, {p.team}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">Headcount {c.people.length} (names hidden on finance view)</p>
                )}
              </div>
            ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {rec ? (
          <>
            <div className="card">
              <h3 className="font-bold">Skills in market (modelled unless <Abbr abbr="TI" /> attached)</h3>
              <ul className="text-sm mt-2">
                {rec.skills.map((s) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="tabular">{s.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-bold">
                <Abbr abbr="YoE" />
              </h3>
              <ul className="text-sm mt-2">
                {rec.yoe.map((s) => (
                  <li key={s.bucket} className="flex justify-between">
                    <span>{s.bucket}</span>
                    <span className="tabular">{s.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-bold">Current employers (sample)</h3>
              <ul className="text-sm mt-2">
                {rec.employers.map((s) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="tabular">{s.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </section>

      <section className="card no-print">
        <h2 className="display text-xl">Add intelligence</h2>
        <p className="text-sm text-[#cbbbe3]">
          Paste a job description, LinkedIn Talent Insights export, Greenhouse time-to-fill notes, or a competitor list.
          The briefing still runs without this.
        </p>
        <textarea
          className="mt-3"
          rows={5}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="Paste here…"
        />
        <button className="btn btn-primary mt-3" type="button" onClick={addIntel} disabled={busy}>
          Drop into this briefing
        </button>
      </section>

      <details className="card text-sm">
        <summary className="cursor-pointer font-bold">Evidence (source + date on every number)</summary>
        <ul className="mt-3 grid gap-2">
          {engine.evidence.slice(0, 40).map((e) => (
            <li key={e.id}>
              <span className="chip">{e.kind}</span> {e.label}: {String(e.value)} · {e.sourceName} · {e.asOf} ·{" "}
              {e.confidence}
              {e.url ? (
                <>
                  {" "}
                  <a href={e.url} target="_blank" rel="noreferrer">
                    source
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </details>

      <Glossary />
    </div>
  );
}
