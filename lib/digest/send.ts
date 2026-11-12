import { digestEmailHtml, type Digest } from "./build";

export async function sendDigestEmail(digest: Digest): Promise<{ sent: boolean; reason: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.DIGEST_TO;
  const from = process.env.DIGEST_FROM || "Roku Talent Intelligence <talent-intelligence@roku.com>";
  if (!key || !to) {
    return {
      sent: false,
      reason:
        "Email is not configured. Set RESEND_API_KEY and DIGEST_TO (comma-separated recruiter inboxes). Preview still works.",
    };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      subject: digest.title,
      html: digestEmailHtml(digest),
    }),
  });
  if (!res.ok) {
    return { sent: false, reason: `Resend HTTP ${res.status}` };
  }
  return { sent: true, reason: `Queued to ${to}` };
}
