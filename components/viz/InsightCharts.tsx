import type { ChatLocationPeek } from "@/lib/chat/answer";
import type { LocationCard } from "@/lib/domain/types";
import { money } from "@/lib/format";

export function fromCards(cards: LocationCard[]): ChatLocationPeek[] {
  return [...cards]
    .sort((a, b) => b.composite - a.composite)
    .map((c) => ({
      id: c.locationId,
      name: c.name,
      verdict: c.verdict,
      p50Start: c.start.p50Start,
      composite: Math.round(c.composite),
      talent: Math.round(c.talent),
      colIndex: Math.round(c.colIndex),
      housingPressure: Math.round(c.housingPressure),
      marketPay: c.marketPay,
      budget: c.budget,
      currency: c.currency,
    }));
}

function BarRow({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "teal" | "purple" | "orange";
}) {
  const pct = Math.max(4, Math.min(100, (value / Math.max(max, 1)) * 100));
  const fill = tone === "teal" ? "var(--roku-teal)" : tone === "orange" ? "var(--roku-orange)" : "var(--roku-electric)";
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track" aria-hidden="true">
        <div className="bar-fill" style={{ width: `${pct}%`, background: fill }} />
      </div>
      <span className="bar-value tabular">{value}</span>
    </div>
  );
}

export function TalentDensityChart({
  rows,
  title = "Talent density",
}: {
  rows: ChatLocationPeek[];
  title?: string;
}) {
  const max = Math.max(...rows.map((r) => r.talent), 1);
  return (
    <figure className="viz-card" aria-labelledby="viz-talent">
      <figcaption id="viz-talent" className="kicker">
        {title}
      </figcaption>
      <p className="viz-hint">Higher bar = thicker local talent for this role (modelled; LinkedIn TI lifts it).</p>
      <div className="bar-stack">
        {rows.map((r) => (
          <BarRow key={r.id} label={r.name} value={r.talent} max={max} tone="teal" />
        ))}
      </div>
    </figure>
  );
}

export function CompositeChart({ rows }: { rows: ChatLocationPeek[] }) {
  const max = Math.max(...rows.map((r) => r.composite), 1);
  return (
    <figure className="viz-card" aria-labelledby="viz-score">
      <figcaption id="viz-score" className="kicker">
        Composite score
      </figcaption>
      <p className="viz-hint">Talent + money + presence + speed. Exploratory cities are already capped.</p>
      <div className="bar-stack">
        {rows.map((r, i) => (
          <BarRow
            key={r.id}
            label={r.name}
            value={r.composite}
            max={max}
            tone={i === 0 ? "teal" : "purple"}
          />
        ))}
      </div>
    </figure>
  );
}

export function MoneyColChart({ rows }: { rows: ChatLocationPeek[] }) {
  if (!rows.length) return null;
  const currency = rows[0].currency;
  return (
    <figure className="viz-card" aria-labelledby="viz-money">
      <figcaption id="viz-money" className="kicker">
        Budget vs local market
      </figcaption>
      <p className="viz-hint">
        Same {currency === "GBP" ? "£" : "$"} budget. Dot left of 100 = cheaper than advertised market.
      </p>
      <svg viewBox="0 0 320 160" className="scatter" role="img" aria-label="Budget versus market pay by city">
        <line x1="36" y1="140" x2="310" y2="140" stroke="rgba(255,255,255,0.2)" />
        <line x1="36" y1="12" x2="36" y2="140" stroke="rgba(255,255,255,0.2)" />
        <text x="36" y="154" fill="#d9ccec" fontSize="8">
          Cheaper COL
        </text>
        <text x="250" y="154" fill="#d9ccec" fontSize="8">
          Richer talent
        </text>
        {rows.map((r, i) => {
          const x = 40 + (r.talent / 100) * 250;
          const y = 130 - ((r.budget / Math.max(r.marketPay, 1)) * 50);
          const cy = Math.max(18, Math.min(132, y));
          return (
            <g key={r.id}>
              <circle cx={x} cy={cy} r={i === 0 ? 8 : 6} fill={i === 0 ? "#1bcecb" : "#853dff"} />
              <text x={x + 8} y={cy + 3} fill="#fff8ff" fontSize="8">
                {r.name.split(" / ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="viz-legend">
        {rows.slice(0, 5).map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> {money(r.budget, r.currency)} budget vs {money(r.marketPay, r.currency)}{" "}
            market · COL {r.colIndex}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function InsightGrid({ rows }: { rows: ChatLocationPeek[] }) {
  if (!rows.length) return null;
  return (
    <div className="insight-grid">
      <CompositeChart rows={rows} />
      <TalentDensityChart rows={rows} />
      <MoneyColChart rows={rows} />
    </div>
  );
}
