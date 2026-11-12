"use client";

import type { ChatAnswer } from "@/lib/chat/answer";
import { InsightGrid } from "@/components/viz/InsightCharts";
import { prettyDate } from "@/lib/format";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const EXAMPLES = [
  {
    label: "UK Senior SWE, £90k",
    text: "Where should I hire a Senior Software Engineer in the UK on £90k with Kubernetes and Go?",
  },
  {
    label: "Weekly digest",
    text: "weekly digest",
  },
  {
    label: "Staff ML, Cambridge, £110k",
    text: "Staff ML Engineer in Cambridge on £110k",
  },
] as const;

type Bubble = {
  id: string;
  role: "user" | "assistant";
  text: string;
  answer?: ChatAnswer;
};

function headingOf(text: string): { title: string; body: string } {
  const parts = text.split(/\n\n+/);
  return { title: parts[0] ?? text, body: parts.slice(1).join("\n\n") };
}

export function ChatApp() {
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready. Type a role, country, and budget.");
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<Bubble[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [turns, busy]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setError(null);
    setDraft("");
    setBusy(true);
    setStatus("Pulling live market and economics…");
    setTurns((t) => [
      ...t,
      { id: `u-${Date.now()}`, role: "user", text: message },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: sessionId ?? sessionStorage.getItem("ti-session") ?? undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not run that question.");
        setStatus("Could not run that question.");
        return;
      }
      setSessionId(json.sessionId);
      sessionStorage.setItem("ti-session", json.sessionId);
      const answer = json.answer as ChatAnswer;
      setTurns((t) => [
        ...t,
        { id: `a-${Date.now()}`, role: "assistant", text: answer.text, answer },
      ]);
      setStatus(
        answer.live
          ? "Live sources answered. Ask a follow-up or paste notes."
          : "Answer ready. Some live sources were offline — dated tables still used.",
      );
    } catch {
      setError("Network error — try again.");
      setStatus("Network error — try again.");
    } finally {
      setBusy(false);
      boxRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  }

  return (
    <div className="chat-app">
      <div className="chat-thread" ref={listRef} aria-live="polite" aria-relevant="additions">
        <section className="chat-hero" aria-labelledby="chat-title">
          <p className="kicker">Roku · Live talent intelligence</p>
          <h1 id="chat-title" className="display h1">
            Ask where to hire.
            <span className="h1-break"> Get a live answer.</span>
          </h1>
          <p className="lede">
            Type the role, country, and budget. I score cities, money, and start dates from live
            market feeds — then you can ask for this week’s recruiter digest in the same thread.
          </p>
        </section>

        {turns.length === 0 ? (
          <div className="example-row" role="group" aria-label="Try an example">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                className="example-chip"
                onClick={() => void send(ex.text)}
              >
                {ex.label}
              </button>
            ))}
          </div>
        ) : null}

        {turns.map((turn) =>
          turn.role === "user" ? (
            <article key={turn.id} className="bubble bubble-user" aria-label="You asked">
              <p className="bubble-meta">You</p>
              <p className="bubble-text">{turn.text}</p>
            </article>
          ) : (
            <AssistantBubble key={turn.id} turn={turn} />
          ),
        )}

        {busy ? (
          <p className="live-wait" role="status">
            Pulling live market…
          </p>
        ) : null}
      </div>

      <form className="composer" onSubmit={onSubmit} aria-busy={busy}>
        {error ? (
          <p className="composer-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="composer-status" role="status">
            {status}
          </p>
        )}
        <div className="composer-box">
          <label htmlFor="ask" className="sr-only">
            Ask Talent Intelligence
          </label>
          <textarea
            id="ask"
            ref={boxRef}
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            placeholder="e.g. Senior Software Engineer UK £90k Kubernetes"
            disabled={busy}
          />
          <button className="btn btn-primary composer-send" type="submit" disabled={busy || !draft.trim()}>
            Send
          </button>
        </div>
        <p className="composer-hint">Enter to send · Shift+Enter for a new line · Paste notes after a briefing is open</p>
      </form>
    </div>
  );
}

function AssistantBubble({ turn }: { turn: Bubble }) {
  const { title, body } = headingOf(turn.text);
  const a = turn.answer;
  const level = a?.kind === "clarify" ? "h3" : "h2";
  const Heading = level;
  return (
    <article className="bubble bubble-ai" aria-label="Talent Intelligence answer">
      <p className="kicker">
        {a?.kind === "digest"
          ? "Live digest"
          : a?.kind === "clarify"
            ? "Need a little more"
            : "Live briefing"}
        {a?.live ? " · Live sources" : ""}
      </p>
      <Heading className="display h2 bubble-heading">{title}</Heading>
      {body ? (
        <div className="bubble-body">
          {body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
      {a?.locations && a.locations.length > 0 ? (
        <section className="city-strip" aria-label="Cities scored">
          <h3 className="kicker city-strip-title">Cities scored</h3>
          <ol>
            {a.locations.map((c) => (
              <li key={c.id}>
                <span className="city-name">{c.name}</span>
                <span className="city-meta">
                  {c.verdict} · talent {c.talent} · P50 {prettyDate(c.p50Start)}
                </span>
              </li>
            ))}
          </ol>
          <InsightGrid rows={a.locations} />
        </section>
      ) : null}
      {a?.sources && a.sources.length > 0 ? (
        <ul className="source-row" aria-label="Data sources">
          {a.sources.map((s) => (
            <li key={s.id}>
              <span className={s.status === "live" ? "chip chip-teal" : "chip"}>{s.status}</span>{" "}
              {s.id}
            </li>
          ))}
        </ul>
      ) : null}
      {a?.briefingId ? (
        <p className="full-link">
          <Link href={`/briefings/${a.briefingId}`}>Open full scorecard</Link>
        </p>
      ) : null}
    </article>
  );
}
