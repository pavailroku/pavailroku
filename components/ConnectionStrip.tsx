import { connections } from "@/lib/connections";

export function ConnectionStrip() {
  const rows = connections();
  const glean = rows.find((c) => c.id === "glean");
  return (
    <aside className="card mb-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--roku-teal)] m-0">
        Connections for this demo
      </p>
      <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
        {rows.map((c) => (
          <li key={c.id}>
            <span className={c.connected ? "chip chip-teal" : "chip chip-orange"}>
              {c.connected ? "Connected" : "Not connected"}
            </span>{" "}
            <strong>{c.label}</strong>
            <div className="text-xs text-[#cbbbe3] mt-1">{c.forDemo}</div>
          </li>
        ))}
      </ul>
      {!glean?.connected ? (
        <p className="text-sm text-[#cbbbe3] mt-3 m-0">
          You are not on Glean or Confluence from this machine. The TA demo still runs: live
          layoffs (Talent Risk), UK cuts (layoffs.uk), published cost of living. Internal org
          names are labelled <strong>Demo</strong> so leadership is not shown invented Glean
          people. To connect later: GLEAN_API_TOKEN + GLEAN_BASE_URL on the Roku network.
        </p>
      ) : null}
    </aside>
  );
}
