import type { Digest } from "./build";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pretty(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Roku-branded HTML email. Inline CSS only. Logo on solid Primary Purple. */
export function digestEmailHtml(d: Digest): string {
  const span = `${pretty(d.periodStart)} – ${pretty(d.periodEnd)}`;
  const cadence = d.cadence === "weekly" ? "Weekly" : "Monthly";
  const desks = new Set(d.items.flatMap((i) => i.desks.map((x) => x.office))).size;

  const actionBlocks = d.actions
    .map((a, n) => {
      const [lead, ...rest] = a.split(": ");
      return `<tr>
        <td style="width:36px;padding:12px 0;color:#1BCECB;font-weight:700;vertical-align:top">${String(n + 1).padStart(2, "0")}</td>
        <td style="padding:12px 0;border-bottom:1px solid #3a1a6a">
          <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#1BCECB">${escapeHtml(lead)}</div>
          <div style="color:#ffffff;font-size:15px;line-height:1.4;margin-top:4px">${escapeHtml(rest.join(": "))}</div>
        </td>
      </tr>`;
    })
    .join("");

  const eventBlocks = d.items
    .slice(0, 16)
    .map((i) => {
      const desk = i.desks.map((x) => `${x.office} · ${x.family}`).join(" · ");
      const jobs = i.event.jobs ? ` · ${i.event.jobs} roles named` : "";
      return `<tr>
        <td style="padding:16px 0;border-bottom:1px solid #3a1a6a">
          <a href="${escapeHtml(i.event.url)}" style="color:#ffffff;text-decoration:none;font-size:18px;font-weight:700">${escapeHtml(i.event.company)}</a>
          <div style="color:#1BCECB;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin:6px 0">${escapeHtml(i.event.type)} · ${pretty(i.event.date)}${jobs}</div>
          <div style="color:#E8D7FF;font-size:13px"><strong style="color:#ffffff">Maps to:</strong> ${escapeHtml(desk)}</div>
          <div style="color:#C8B7E0;font-size:13px;margin-top:4px"><strong style="color:#ffffff">Why it is here:</strong> ${escapeHtml(i.reasons.join(" "))}</div>
        </td>
      </tr>`;
    })
    .join("");

  const core = d.quiet
    ? `<p style="font-size:16px;line-height:1.5;color:#F4EEFC">Quiet ${d.cadence}. ${d.dropped} public items were in this window. None mapped to a Roku hiring desk (skill + competitor + UK/US). This email is still the report — we do not fill it with unrelated tech news.</p>`
    : `
      <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#1BCECB;margin:28px 0 8px">What to source</p>
      <table width="100%" cellpadding="0" cellspacing="0">${actionBlocks}</table>
      <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#1BCECB;margin:32px 0 8px">Market moves that made the cut</p>
      <table width="100%" cellpadding="0" cellspacing="0">${eventBlocks}</table>`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(d.title)}</title></head>
<body style="margin:0;padding:0;background:#0A0018;color:#F4EEFC">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0018;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:94%">
        <tr>
          <td style="background:#4F01A3;padding:20px 28px">
            <table width="100%"><tr>
              <td style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:0.18em">ROKU</td>
              <td align="right" style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase">Talent Intelligence</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#20004C;padding:28px 28px 12px;font-family:Arial,Helvetica,sans-serif">
            <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1BCECB">${cadence} · For recruiters · UK &amp; US desks</div>
            <h1 style="margin:10px 0 8px;font-size:28px;line-height:1.2;color:#ffffff">Sourcing pulse — only what maps to roles we hire</h1>
            <p style="margin:0;color:#E8D7FF;font-size:14px">${span}. Not a candidate list. Not a tech magazine.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#20004C;padding:8px 28px 24px;font-family:Arial,Helvetica,sans-serif">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#4F01A3;border-radius:4px">
              <tr>
                <td style="padding:16px;width:33%;text-align:center;border-right:1px solid rgba(255,255,255,0.15)">
                  <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C8B7E0">Kept</div>
                  <div style="font-size:26px;font-weight:700;color:#ffffff">${d.items.length}</div>
                  <div style="font-size:11px;color:#E8D7FF">relevant moves</div>
                </td>
                <td style="padding:16px;width:33%;text-align:center;border-right:1px solid rgba(255,255,255,0.15)">
                  <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C8B7E0">Desks</div>
                  <div style="font-size:26px;font-weight:700;color:#ffffff">${desks}</div>
                  <div style="font-size:11px;color:#E8D7FF">Roku offices hit</div>
                </td>
                <td style="padding:16px;width:33%;text-align:center">
                  <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C8B7E0">Dropped</div>
                  <div style="font-size:26px;font-weight:700;color:#ffffff">${d.dropped}</div>
                  <div style="font-size:11px;color:#E8D7FF">not our market</div>
                </td>
              </tr>
            </table>
            ${core}
            <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#1BCECB;margin:28px 0 8px">How we filter</p>
            <p style="font-size:13px;line-height:1.5;color:#C8B7E0;margin:0">An item ships only if it hits a live Roku hiring family — Cambridge embedded / ML, Manchester cloud-native, Bay Area player / OS, Austin cloud / device, New York ads — plus UK or US geography. Competitor + skill beats a headline.</p>
            <p style="font-size:11px;color:#8A7AA8;margin:24px 0 0">${escapeHtml(d.attribution.join(" · "))}${d.live ? "" : " · Live feeds offline this run"}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#4F01A3;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff">
            Roku · Internal · Talent Intelligence
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
