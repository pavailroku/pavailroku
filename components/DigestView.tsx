"use client";

import type { Digest } from "@/lib/digest/build";
import { prettyDate } from "@/lib/format";
import { useState } from "react";

export function DigestView({ initial }: { initial: Digest }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const desks = new Set(initial.items.flatMap((i) => i.desks.map((d) => d.office))).size;
  const cadence = initial.cadence === "weekly" ? "Weekly" : "Monthly";

  async function send() {
    setBusy(true);
    const res = await fetch(`/api/reports/send?cadence=${initial.cadence}`, { method: "POST" });
    const json = await res.json();
    setMsg(json.reason || (json.sent ? "Sent" : "Not sent"));
    setBusy(false);
  }

  return (
    <article className="digest">
      <header
        className="overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(120deg, #853dff 0%, #4f01a3 42%, #20004c 100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
          <span className="text-sm font-black tracking-[0.28em]">ROKU</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/80">
            Talent Intelligence · Internal
          </span>
        </div>
        <div className="px-6 py-8 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--roku-teal)]">
            {cadence} sourcing pulse · For recruiters · UK & US desks
          </p>
          <h1 className="display text-4xl md:text-5xl mt-3 text-white">
            Only what maps to roles we hire
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">
            {prettyDate(initial.periodStart)} – {prettyDate(initial.periodEnd)}. Not a candidate list.
            Not a tech magazine. If it does not change a sourcing decision, it is not in this pack.
          </p>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-3 mt-6">
        <Stat kicker="Kept" value={String(initial.items.length)} hint="Relevant market moves" />
        <Stat kicker="Desks hit" value={String(desks)} hint="Roku offices in this pack" />
        <Stat kicker="Dropped" value={String(initial.dropped)} hint="Failed relevancy (not our market)" />
      </section>

      {initial.quiet ? (
        <section className="card mt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)]">Quiet period</p>
          <h2 className="display text-2xl mt-2">Nothing cleared the bar — that is the report</h2>
          <p className="text-sm text-[#cbbbe3] mt-2 max-w-2xl">
            {initial.dropped} public items were in this window. None mapped to a live Roku hiring
            family (Cambridge embedded / ML, Manchester cloud-native, Bay Area player / OS, Austin,
            New York ads) with UK or US geography. We still send this so the cadence is trusted.
            We do not pad.
          </p>
        </section>
      ) : (
        <>
          <section className="card mt-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)]">
              What to source
            </p>
            <h2 className="display text-2xl mt-1">Actions for this {initial.cadence}</h2>
            <ol className="mt-5 grid gap-4">
              {initial.actions.map((a, n) => {
                const [lead, ...rest] = a.split(": ");
                return (
                  <li key={a} className="grid grid-cols-[3rem_1fr] gap-3 items-start">
                    <span className="tabular text-[var(--roku-teal)] font-bold">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--roku-teal)] m-0">
                        {lead}
                      </p>
                      <p className="m-0 mt-1 text-[15px] leading-snug">{rest.join(": ")}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="mt-6 grid gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)]">
                Market moves that made the cut
              </p>
              <h2 className="display text-2xl mt-1">Each row is a sourcing door, not a headline</h2>
            </div>
            {initial.items.map((i) => (
              <section key={i.event.id} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="display text-xl m-0">
                    <a href={i.event.url} target="_blank" rel="noreferrer" className="text-white no-underline">
                      {i.event.company}
                    </a>
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--roku-teal)] m-0">
                    {i.event.type} · {prettyDate(i.event.date)}
                    {i.event.jobs ? ` · ${i.event.jobs} roles named` : ""}
                  </p>
                </div>
                <dl className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-[#9b8bb3]">Maps to</dt>
                    <dd className="m-0 mt-1">
                      {i.desks.map((d) => (
                        <div key={d.id}>
                          {d.office} — {d.family}
                        </div>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-[#9b8bb3]">
                      Why it is here
                    </dt>
                    <dd className="m-0 mt-1 text-[#e8d7ff]">{i.reasons.join(" ")}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </section>
        </>
      )}

      <section className="card mt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)]">How we filter</p>
        <p className="text-sm text-[#cbbbe3] mt-2 m-0 max-w-2xl">
          An item ships only if it hits a live hiring family plus UK or US geography. Competitor +
          skill beats a headline. Sources: {initial.attribution.join("; ")}.
          {initial.live ? " Feeds were live this run." : " Live feeds were offline this run."}
        </p>
      </section>

      <section className="card no-print mt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)]">Distribution</p>
        <h2 className="display text-xl mt-1">Email this pack to recruiters</h2>
        <p className="text-sm text-[#cbbbe3]">
          Same branding as this page. Set RESEND_API_KEY and DIGEST_TO (comma-separated inboxes).
          Until then, print or Slack this URL.
        </p>
        <button className="btn btn-primary mt-3" type="button" onClick={send} disabled={busy}>
          {busy ? "Sending…" : `Email ${cadence.toLowerCase()} digest`}
        </button>
        {msg ? <p className="text-sm mt-2">{msg}</p> : null}
      </section>
    </article>
  );
}

function Stat({ kicker, value, hint }: { kicker: string; value: string; hint: string }) {
  return (
    <div className="card">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#9b8bb3] m-0">{kicker}</p>
      <p className="display text-4xl tabular mt-1 m-0">{value}</p>
      <p className="text-xs text-[#cbbbe3] m-0 mt-1">{hint}</p>
    </div>
  );
}
