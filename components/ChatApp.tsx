"use client";

import type { ChatAnswer } from "@/lib/chat/answer";
import type { Digest } from "@/lib/digest/build";
import type { EngineResult } from "@/lib/domain/types";
import { Dashboard } from "@/components/Dashboard";
import { DigestView } from "@/components/DigestView";
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

export function ChatApp() {
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Type a hiring question. The live dashboard opens under the box.");
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [headline, setHeadline] = useState<string | null>(null);
  const [engine, setEngine] = useState<EngineResult | null>(null);
  const [digest, setDigest] = useState<Digest | null>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (engine || digest) boardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [engine, digest]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setError(null);
    setDraft("");
    setBusy(true);
    setQuestion(message);
    setStatus("Pulling live market, economics, and talent metrics…");
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
      setHeadline(answer.text);
      if (answer.engine) {
        setEngine(answer.engine);
        setDigest(null);
      }
      if (answer.digest) {
        setDigest(answer.digest);
        setEngine(null);
      }
      if (!answer.engine && !answer.digest) {
        setError("No dashboard came back. Try the example chips.");
      }
      setStatus(
        answer.live
          ? "Live dashboard ready. Ask a follow-up in the box to re-score."
          : "Dashboard ready. Some live feeds were offline — dated tables still used.",
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

  const hasBoard = Boolean(engine || digest);

  return (
    <div className={`chat-app ${hasBoard ? "has-board" : ""}`}>
      <div className="chat-thread">
        {!hasBoard ? (
          <section className="chat-hero" aria-labelledby="chat-title">
            <p className="kicker">Roku · Live talent intelligence</p>
            <h1 id="chat-title" className="display h1">
              Ask where to hire.
              <span className="h1-break"> Get a live dashboard.</span>
            </h1>
            <p className="lede">
              Type the role, country, and budget. The engine scores cities, talent density, money,
              start dates, and live market events — then draws the dashboard you demo.
            </p>
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
          </section>
        ) : (
          <section className="chat-hero chat-hero-compact" aria-live="polite">
            <p className="kicker">Live from your question</p>
            <h1 className="display h2">{question}</h1>
            {headline ? <p className="lede">{headline}</p> : null}
          </section>
        )}

        {busy ? (
          <p className="live-wait" role="status">
            Pulling live market and talent metrics…
          </p>
        ) : null}

        <div ref={boardRef}>
          {engine ? <Dashboard key={engine.fetchedAt} initial={engine} /> : null}
          {digest ? <DigestView key={digest.generatedAt} initial={digest} /> : null}
        </div>
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
        <p className="composer-hint">Enter to send · dashboard updates in place with live talent metrics</p>
      </form>
    </div>
  );
}
