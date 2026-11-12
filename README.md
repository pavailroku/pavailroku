# Roku Talent Intelligence

Internal **headcount decision engine** for hiring managers, recruiters, finance, and engineering.

It answers: where to open the req, what the same budget buys in real life, whether Roku already has a team there, and **when the person is in seat**. It is not a candidate database and it does not replace LinkedIn Recruiter, Juicebox, or Greenhouse.

Pavail Aqeel — Sr Technical Recruiter, Roku (Cambridge & Manchester).

## Run

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **New briefing**. Role, country, budget. LinkedIn is optional.

### Recruiter digest (weekly / monthly)

`/reports/weekly` and `/reports/monthly` — a sourcing pulse mapped to **Roku desks we hire** (Cambridge embedded/ML, Manchester Kubernetes/Go/Java, Bay Area player/OS, Austin cloud/device, NY ads). Unrelated tech news is dropped. Quiet weeks still say so; we do not pad.

Email: set `RESEND_API_KEY` and `DIGEST_TO` (recruiter inboxes). Optional GitHub Action in `.github/workflows/digest.yml` (set `DIGEST_BASE_URL`).

## Words this product uses

| Short | Means |
|---|---|
| HM | Hiring manager — owns the role |
| TI | LinkedIn Talent Insights — optional licensed export |
| COL | Cost of living vs national 100 |
| ONS | Office for National Statistics (UK) |
| CPIH | UK inflation including housing costs |
| BEA | Bureau of Economic Analysis (US) |
| RPP | Regional Price Parities — US COL index |
| BLS | Bureau of Labor Statistics (US) |
| P50 / P75 | Likely / conservative start dates — not a promise |
| YoE | Years of experience |
| SLA | Recruiting clock to accepted offer |
| GDPR | UK/EU privacy law — named staff are internal-only |

## Quality

- `npm test` — scoring, economics, time-to-hire, hallucination guardrails
- `npm run eval:hallucination` — canned evidence stores
- Numbers are computed in TypeScript. The model may only narrate evidence IDs. Invented layoffs or dates are withheld.

## Env (all optional)

`GLEAN_API_TOKEN`, `GLEAN_BASE_URL`, `CONFLUENCE_*`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `BEA_API_KEY`, `BLS_API_KEY`, `NUMBEO_API_KEY`

Without them the engine still runs: published ONS/BEA tables, live Talent Risk / layoffs.uk when the network allows, demo Roku org labelled **Demo**.
