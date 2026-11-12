"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function IntakeForm() {
  const router = useRouter();
  const [role, setRole] = useState("Senior Software Engineer");
  const [countrySet, setCountrySet] = useState<"UK" | "US" | "both">("UK");
  const [currency, setCurrency] = useState<"GBP" | "USD">("GBP");
  const [budget, setBudget] = useState("90000");
  const [whyHiring, setWhyHiring] = useState("");
  const [skills, setSkills] = useState("Kubernetes, Go, distributed systems");
  const [visaRequired, setVisa] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/briefings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        countrySet,
        currency: countrySet === "US" ? "USD" : countrySet === "UK" ? "GBP" : currency,
        budget: Number(budget),
        whyHiring,
        visaRequired,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Could not create briefing");
      return;
    }
    router.push(`/briefings/${json.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 max-w-xl">
      <div>
        <h1 className="display text-3xl">Open a briefing</h1>
        <p className="text-sm text-[#cbbbe3] mt-2">
          Three fields. No Boolean strings, no LinkedIn required. A hiring manager
          can finish this in 30 seconds.
        </p>
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="country">Where are you hiring?</label>
        <select
          id="country"
          value={countrySet}
          onChange={(e) => setCountrySet(e.target.value as "UK" | "US" | "both")}
        >
          <option value="UK">United Kingdom</option>
          <option value="US">United States</option>
          <option value="both">UK and US (compared within each country — not £ vs $)</option>
        </select>
      </div>
      {countrySet === "both" ? (
        <div>
          <label htmlFor="currency">
            Budget currency (FX = foreign exchange: we do not convert £ to $ on the scorecard)
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "GBP" | "USD")}
          >
            <option value="GBP">GBP for UK cities</option>
            <option value="USD">USD for US cities</option>
          </select>
          <p className="text-xs text-[#9b8bb3] mt-1">
            Pick one country set for a serious budget call. “Both” is a scan, not a cross-border offer model.
          </p>
        </div>
      ) : null}
      <div>
        <label htmlFor="budget">
          Budget ({countrySet === "US" || (countrySet === "both" && currency === "USD") ? "USD" : "GBP"} — cash
          only)
        </label>
        <input
          id="budget"
          type="number"
          min={1}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="skills">Skills (optional, comma-separated)</label>
        <input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
      </div>
      <div>
        <label htmlFor="why">Why are you hiring this role? (optional)</label>
        <textarea id="why" rows={3} value={whyHiring} onChange={(e) => setWhyHiring(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="w-auto"
          checked={visaRequired}
          onChange={(e) => setVisa(e.target.checked)}
        />
        Visa / sponsorship likely — this is a separate clock on the start date
      </label>
      {error ? <p className="text-[var(--roku-orange)] text-sm">{error}</p> : null}
      <button className="btn btn-primary" disabled={busy} type="submit">
        {busy ? "Scoring locations…" : "Show me where and when"}
      </button>
    </form>
  );
}
