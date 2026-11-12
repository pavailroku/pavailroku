# Roku Talent Intelligence

A tool that helps Roku decide **where to hire someone**, **what the money is really worth there**, and **when they can start**.

It is a **chat**. You type a question. It looks at live public market data and official UK/US numbers. Then it answers. It is **not** a list of people to call. It does **not** replace LinkedIn Recruiter or Greenhouse.

Made for hiring managers, recruiters, finance, and engineering. Built by Pavail Aqeel, Sr Technical Recruiter (Cambridge & Manchester).

---

## What it is (plain English)

Imagine you want to hire a Senior Software Engineer in the UK for £90,000.

You type that into the box.

The tool then:

1. Looks at **cities** Roku already uses (Cambridge, Manchester, and others).
2. Checks **live news about job cuts** at companies we care about (not random tech gossip).
3. Checks **official prices** (UK inflation from the Office for National Statistics; US tables from the government).
4. Tells you **which city looks best**, **whether £90k is enough there**, and **a likely start date** (P50 = typical, P75 = slower / safer).
5. If you type **weekly digest**, it tells recruiters **what moved this week** for the desks we actually hire (Cambridge chips/ML, Manchester cloud, US player/cloud/ads). If nothing maps to those desks, it says **quiet**. It does not make news up.

Internal team names are marked **Demo** until Glean (Roku’s internal search) is connected on the Roku network.

---

## How to try it

### Fastest (no install)

Open the live chat (this link only works while the demo machine is on):

**Ask the box a question. Do not hunt for extra pages.**

1. Click **UK Senior SWE, £90k** (or type your own role, country, and budget).
2. Wait for **Live briefing**. Read the city, money, and start dates.
3. Type **weekly digest**. That is the recruiter pulse.

### On your computer

```bash
npm install
npm test
npm run demo
```

Open [http://localhost:3000](http://localhost:3000)

Or with Docker (no `npm` after that):

```bash
docker compose up --build
```

---

## What to type (examples)

- `Where should I hire a Senior Software Engineer in the UK on £90k with Kubernetes and Go?`
- `Staff ML Engineer in Cambridge on £110k`
- `weekly digest`
- After a briefing is open: `what about Manchester` or `make the budget £110k`
- Paste LinkedIn Talent Insights or Greenhouse notes into the same box

If you forget the budget, it **asks**. It does not invent £90k.

---

## What it will never do

- Invent a layoff or a number that is not in a source
- Pretend Glean/Confluence is connected when it is not
- Source candidates or write into Greenhouse
- Need LinkedIn to run (LinkedIn only makes the answer more confident)

---

## Short words

| You see | It means |
|---|---|
| HM | Hiring manager — the person who owns the job |
| P50 / P75 | Typical start date / slower start date. Not a promise |
| COL | Cost of living. 100 = national average |
| ONS / CPIH | UK stats office / UK inflation including housing |
| BEA / RPP | US stats / US regional prices |
| TI | LinkedIn Talent Insights — optional extra file |
| Digest | Weekly or monthly note for recruiters |
| Demo | Fake-safe internal names until Glean is on |

---

## For engineers

- Next.js App Router. Chat is `/` and `POST /api/chat`.
- Scoring, money, and dates are TypeScript (`lib/fusion.ts`). The model is not allowed to make up numbers (`lib/guardrails/ground.ts`).
- Tests: `npm test` (includes hallucination evals). Chat parse tests live in `lib/chat/`.
- Env is optional. See `.env.example`. Without keys: Talent Risk + layoffs.uk still go live; official tables still date-stamp; org stays Demo.

GitHub: this repo. GitLab (Roku): [gitlab.eng.roku.com/paqeel/roku-talent-intelligence-engine](https://gitlab.eng.roku.com/paqeel/roku-talent-intelligence-engine)

---

## Leadership deck

PowerPoint (Roku purple, charts, 3-minute demo script):

`docs/Roku-Talent-Intelligence-Leadership-Deck.pptx`

Rebuild: `npm run deck`

TA inventory form answers: `docs/TA-TOOL-INVENTORY.md`

## Demo talk (TA + Engineering leadership, ~3 minutes)

1. Open the chat. **One box.** Type like a human.
2. Run **UK Senior SWE £90k**. Point at: recommended city, budget vs market, P50/P75, first payroll month, live/offline source chips.
3. Say out loud: **finance** cares about first payroll month; **engineering** cares about in-seat week; **TA** cares that events only count if they map to a Roku desk.
4. Type **weekly digest**. If it is quiet, that is the product working — we do not pad.
5. Be honest: Glean is not connected from this machine. Internal people stay **Demo**. LinkedIn is optional.
6. Close: this is a **headcount decision engine**, not another sourcing chatbot.
