import { randomUUID } from "crypto";
import { classifyIntel } from "@/lib/sources/ingest";
import { buildDigest } from "@/lib/digest/build";
import { runEngine } from "@/lib/fusion";
import { addUpload, createBriefing, getBriefing, patchBriefing } from "@/lib/repo/memory";
import type { Briefing } from "@/lib/domain/types";
import { answerFromDigest, answerFromEngine, clarifyText, type ChatAnswer } from "./answer";
import { parseChat } from "./parse";

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  answer?: ChatAnswer;
};

export type ChatSession = {
  id: string;
  briefingId?: string;
  turns: ChatTurn[];
};

const sessions = new Map<string, ChatSession>();

export function getSession(id: string): ChatSession | undefined {
  return sessions.get(id);
}

export function createSession(): ChatSession {
  const session: ChatSession = { id: randomUUID(), turns: [] };
  sessions.set(session.id, session);
  return session;
}

function mergeSkills(current: string[], extra: string[]): string[] {
  const out = [...current];
  for (const s of extra) {
    if (!out.some((x) => x.toLowerCase() === s.toLowerCase())) out.push(s);
  }
  return out;
}

function applyParse(briefing: Briefing, parsed: ReturnType<typeof parseChat>): Briefing | undefined {
  return patchBriefing(briefing.id, {
    role: parsed.role ?? briefing.role,
    title: parsed.role ?? briefing.title,
    skills: parsed.skills.length ? mergeSkills(briefing.skills, parsed.skills) : briefing.skills,
    countrySet: parsed.countrySet ?? briefing.countrySet,
    budget: parsed.budget ?? briefing.budget,
    currency: parsed.currency ?? briefing.currency,
    visaRequired: parsed.visaRequired ?? briefing.visaRequired,
    hmNotes: briefing.hmNotes,
  });
}

export async function handleChat(sessionId: string | undefined, message: string): Promise<{
  session: ChatSession;
  answer: ChatAnswer;
}> {
  const session = (sessionId && sessions.get(sessionId)) || createSession();
  const text = message.trim();
  session.turns.push({
    id: randomUUID(),
    role: "user",
    text,
    createdAt: new Date().toISOString(),
  });

  const parsed = parseChat(text, Boolean(session.briefingId));
  let answer: ChatAnswer;

  if (parsed.intent === "clarify") {
    answer = clarifyText(parsed.missing, Boolean(parsed.role || parsed.budget || parsed.countrySet));
  } else if (parsed.intent === "digest") {
    const digest = await buildDigest(parsed.cadence ?? "weekly");
    answer = answerFromDigest(digest);
  } else if (parsed.intent === "paste") {
    const existing = session.briefingId ? getBriefing(session.briefingId) : undefined;
    if (!existing) {
      answer = {
        ...clarifyText(["role", "country", "budget"], false),
        text: "Paste after a briefing is open — first type the role, country, and budget, then drop LinkedIn / Greenhouse notes here.",
      };
    } else {
      const next = addUpload(existing.id, {
        id: randomUUID(),
        kind: classifyIntel(text),
        text: text.slice(0, 20000),
        addedAt: new Date().toISOString(),
      });
      answer = answerFromEngine(await runEngine(next ?? existing), { followup: true });
    }
  } else if (parsed.intent === "followup") {
    const existing = session.briefingId ? getBriefing(session.briefingId) : undefined;
    if (!existing) {
      answer = clarifyText(parsed.missing.length ? parsed.missing : ["role", "country", "budget"], true);
    } else {
      const next = applyParse(existing, parsed) ?? existing;
      answer = answerFromEngine(await runEngine(next), {
        followup: true,
        locationHint: parsed.locationHint,
      });
    }
  } else {
    const briefing = createBriefing({
      title: parsed.role ?? "Hiring question",
      role: parsed.role ?? "Role",
      skills: parsed.skills,
      whyHiring: text.slice(0, 400),
      countrySet: parsed.countrySet ?? "UK",
      budget: parsed.budget ?? 0,
      currency: parsed.currency ?? (parsed.countrySet === "US" ? "USD" : "GBP"),
      visaRequired: Boolean(parsed.visaRequired),
      hmNotes: text,
    });
    session.briefingId = briefing.id;
    answer = answerFromEngine(await runEngine(briefing), { locationHint: parsed.locationHint });
  }

  if (answer.briefingId) session.briefingId = answer.briefingId;

  session.turns.push({
    id: randomUUID(),
    role: "assistant",
    text: answer.text,
    createdAt: new Date().toISOString(),
    answer,
  });
  sessions.set(session.id, session);
  return { session, answer };
}
