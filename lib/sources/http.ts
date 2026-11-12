export class SourceError extends Error {
  constructor(
    message: string,
    readonly status: "offline" | "live" | "cached" = "offline",
  ) {
    super(message);
  }
}

export async function fetchJson<T>(
  url: string,
  opts: {
    timeoutMs?: number;
    headers?: Record<string, string>;
    method?: string;
    body?: unknown;
  } = {},
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      method: opts.method ?? (opts.body ? "POST" : "GET"),
      headers: {
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...opts.headers,
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) throw new SourceError(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export async function fetchText(
  url: string,
  opts: { timeoutMs?: number } = {},
): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new SourceError(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}
