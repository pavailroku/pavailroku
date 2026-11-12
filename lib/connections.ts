export type ConnectionName = "glean" | "confluence" | "adzuna" | "resend";

export type Connection = {
  id: ConnectionName;
  label: string;
  connected: boolean;
  forDemo: string;
};

export function connections(): Connection[] {
  return [
    {
      id: "glean",
      label: "Glean (internal search, includes Confluence)",
      connected: Boolean(process.env.GLEAN_API_TOKEN && process.env.GLEAN_BASE_URL),
      forDemo:
        "Not connected in this run. Org presence is labelled Demo. Market pulse still live.",
    },
    {
      id: "confluence",
      label: "Confluence (live page fetch)",
      connected: Boolean(
        process.env.CONFLUENCE_BASE_URL &&
          process.env.CONFLUENCE_EMAIL &&
          process.env.CONFLUENCE_API_TOKEN,
      ),
      forDemo: "Optional. Glean already indexes Confluence when Roku Glean is on.",
    },
    {
      id: "adzuna",
      label: "Adzuna (live advertised pay)",
      connected: Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
      forDemo: "Without keys we use published pay tables, labelled indicative.",
    },
    {
      id: "resend",
      label: "Email digest (Resend)",
      connected: Boolean(process.env.RESEND_API_KEY && process.env.DIGEST_TO),
      forDemo: "Preview the weekly pack on /reports/weekly even without email.",
    },
  ];
}

export function gleanReady(): boolean {
  return connections().find((c) => c.id === "glean")?.connected ?? false;
}
