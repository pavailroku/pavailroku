import { fetchJson } from "./http";

export type GleanHit = {
  title: string;
  url: string;
  snippet: string;
  datasource?: string;
};

export async function searchGlean(query: string): Promise<GleanHit[] | null> {
  const token = process.env.GLEAN_API_TOKEN;
  const host = process.env.GLEAN_BASE_URL;
  if (!token || !host) return null;
  const json = await fetchJson<{
    results?: {
      title?: string;
      url?: string;
      snippets?: { snippet?: string }[];
      metadata?: { datasource?: string };
    }[];
  }>(`${host.replace(/\/$/, "")}/rest/api/v1/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      query,
      pageSize: 8,
      requestOptions: {
        datasourcesFilter: ["confluence"],
        facetBucketSize: 20,
      },
    },
  });
  return (
    json.results?.map((r) => ({
      title: r.title ?? "Untitled",
      url: r.url ?? "",
      snippet: r.snippets?.[0]?.snippet ?? "",
      datasource: r.metadata?.datasource,
    })) ?? []
  );
}
