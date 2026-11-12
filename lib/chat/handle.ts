import { randomUUID } from "crypto";
import { classifyIntel } from "@/lib/sources/ingest";
import { buildDigest } from "@/lib/digest/build";
import { runEngine } from "@/lib/fusion";
import { addUpload, createBriefing, getBriefing, patchBriefing } from "@/lib/repo/memory";
import type { Briefing } from "@/lib/domain/types";
import { answerFromDigest, answerFromEngine, type ChatAnswer } from "./answer";
import { assumptionLine, fillAsk } from "./defaults";
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

  if (parsed.intent === "digest") {
    const digest = await buildDigest(parsed.cadence ?? "weekly");
    answer = answerFromDigest(digest);
  } else if (parsed.intent === "paste") {
    const existing = session.briefingId ? getBriefing(session.briefingId) : undefined;
    if (!existing) {
      const d = fillAsk(parsed);
      const briefing = createBriefing({
        title: d.role,
        role: d.role,
        skills: d.skills,
        whyHiring: text.slice(0, 400),
        countrySet: d.countrySet,
        budget: d.budget,
        currency: d.currency,
        visaRequired: Boolean(parsed.visaRequired),
        hmNotes: text,
      });
      const next = addUpload(briefing.id, {
        id: randomUUID(),
        kind: classifyIntel(text),
        text: text.slice(0, 20000),
        addedAt: new Date().toISOString(),
      });
      session.briefingId = briefing.id;
      answer = answerFromEngine(await runEngine(next ?? briefing));
      const note = assumptionLine(d.assumed);
      if (note) answer = { ...answer, text: `${note}\n\n${answer.text}` };
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
      const d = fillAsk(parsed);
      const briefing = createBriefing({
        title: d.role,
        role: d.role,
        skills: d.skills,
        whyHiring: text.slice(0, 400),
        countrySet: d.countrySet,
        budget: d.budget,
        currency: d.currency,
        visaRequired: Boolean(parsed.visaRequired),
        hmNotes: text,
      });
      session.briefingId = briefing.id;
      answer = answerFromEngine(await runEngine(briefing), { locationHint: parsed.locationHint });
      const note = assumptionLine(d.assumed);
      if (note) answer = { ...answer, text: `${note}\n\n${answer.text}` };
    } else {
      const next = applyParse(existing, parsed) ?? existing;
      answer = answerFromEngine(await runEngine(next), {
        followup: true,
        locationHint: parsed.locationHint,
      });
    }
  } else {
    const d = fillAsk(parsed);
    const briefing = createBriefing({
      title: d.role,
      role: d.role,
      skills: d.skills,
      whyHiring: text.slice(0, 400),
      countrySet: d.countrySet,
      budget: d.budget,
      currency: d.currency,
      visaRequired: Boolean(parsed.visaRequired),
      hmNotes: text,
    });
    session.briefingId = briefing.id;
    answer = answerFromEngine(await runEngine(briefing), { locationHint: parsed.locationHint });
    const note = assumptionLine(d.assumed);
    if (note) answer = { ...answer, text: `${note}\n\n${answer.text}` };
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
