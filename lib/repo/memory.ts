import { DEFAULT_WEIGHTS } from "@/lib/domain/types";
import type { Briefing, BriefingInput, UploadedIntel, ViewerRole } from "@/lib/domain/types";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "briefings.json");
const mem = new Map<string, Briefing>();

function load() {
  if (!existsSync(file)) return;
  try {
    const rows = JSON.parse(readFileSync(file, "utf8")) as Briefing[];
    for (const b of rows) {
      if (!mem.has(b.id)) mem.set(b.id, b);
    }
  } catch {
    /* empty */
  }
}

function persist() {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify([...mem.values()], null, 2));
}

export function createBriefing(input: BriefingInput): Briefing {
  load();
  const briefing: Briefing = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    viewerRole: "hiring_manager",
    weights: { ...DEFAULT_WEIGHTS },
    uploads: [],
    dismissedEventIds: [],
    pinnedEventIds: [],
  };
  mem.set(briefing.id, briefing);
  persist();
  return briefing;
}

export function listBriefings(): Briefing[] {
  load();
  return [...mem.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBriefing(id: string): Briefing | undefined {
  load();
  return mem.get(id);
}

export function patchBriefing(
  id: string,
  patch: Partial<
    Pick<
      Briefing,
      | "title"
      | "role"
      | "skills"
      | "whyHiring"
      | "countrySet"
      | "budget"
      | "currency"
      | "visaRequired"
      | "expedite"
      | "hmNotes"
      | "viewerRole"
    >
  >,
): Briefing | undefined {
  load();
  const cur = mem.get(id);
  if (!cur) return undefined;
  const next = { ...cur, ...patch };
  mem.set(id, next);
  persist();
  return next;
}

export function updateBriefing(
  id: string,
  patch: Partial<
    Pick<
      Briefing,
      | "viewerRole"
      | "visaRequired"
      | "expedite"
      | "weights"
      | "pinnedEventIds"
      | "dismissedEventIds"
    >
  >,
): Briefing | undefined {
  load();
  const cur = mem.get(id);
  if (!cur) return undefined;
  const next = { ...cur, ...patch };
  mem.set(id, next);
  persist();
  return next;
}

export function addUpload(id: string, intel: UploadedIntel): Briefing | undefined {
  load();
  const cur = mem.get(id);
  if (!cur) return undefined;
  const next = { ...cur, uploads: [...cur.uploads, intel] };
  mem.set(id, next);
  persist();
  return next;
}

export function setRole(id: string, viewerRole: ViewerRole): Briefing | undefined {
  return updateBriefing(id, { viewerRole });
}
