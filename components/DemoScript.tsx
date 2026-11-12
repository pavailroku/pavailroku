import Link from "next/link";

export function DemoScript() {
  return (
    <section className="card mb-6 no-print">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--roku-teal)] m-0">
        How to show this (2 minutes)
      </p>
      <ol className="mt-3 grid gap-2 text-sm text-[#e8d7ff] m-0 pl-5">
        <li>
          <strong className="text-white">Decision line</strong> — where to open the req, whether the
          money lands, when they are in seat.
        </li>
        <li>
          <strong className="text-white">Three numbers</strong> — city, budget verdict, P50 (likely
          start). Toggle Hiring manager / Finance / Engineering: same facts, different emphasis.
        </li>
        <li>
          <strong className="text-white">Market Pulse</strong> — live layoffs with source links. If
          a row has no URL, we do not show it.
        </li>
        <li>
          <strong className="text-white">Completeness</strong> — this demo does not need LinkedIn.
          Glean is labelled Demo until we connect it on the Roku network.
        </li>
        <li>
          Then open{" "}
          <Link href="/reports/weekly" className="text-white">
            Live digest
          </Link>{" "}
          — the second product: this week’s sourcing pulse, mapped to desks we hire.
        </li>
      </ol>
    </section>
  );
}
