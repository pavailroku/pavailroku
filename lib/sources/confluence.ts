import { fetchJson } from "./http";

export async function fetchConfluencePage(pageId: string): Promise<string | null> {
  const base = process.env.CONFLUENCE_BASE_URL;
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;
  if (!base || !email || !token) return null;
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const json = await fetchJson<{ body?: { storage?: { value?: string } } }>(
    `${base.replace(/\/$/, "")}/wiki/rest/api/content/${pageId}?expand=body.storage`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  return json.body?.storage?.value ?? null;
}
