import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";

const PURPLE = "4F01A3";
const MIDNIGHT = "20004C";
const INK = "0A0018";
const TEAL = "1BCECB";
const ELECTRIC = "853DFF";
const PAPER = "F6F1FF";
const WHITE = "FFFFFF";
const MUTE = "D9CCEC";

const outDir = path.join(process.cwd(), "docs");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "Roku-Talent-Intelligence-Leadership-Deck.pptx");

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Pavail Aqeel";
pptx.title = "Roku Talent Intelligence";
pptx.subject = "Headcount decision engine for TA and Engineering leadership";

function base(slide, { dark = true } = {}) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: dark ? INK : PAPER },
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.16,
    h: 7.5,
    fill: { color: TEAL },
  });
  slide.addText("ROKU  ·  TALENT INTELLIGENCE  ·  INTERNAL", {
    x: 0.5,
    y: 0.22,
    w: 10,
    h: 0.28,
    fontSize: 10,
    fontFace: "Arial",
    bold: true,
    color: TEAL,
    charSpacing: 3,
  });
}

function footer(slide, n, total) {
  slide.addText(`${n}  /  ${total}`, {
    x: 11.4,
    y: 7.1,
    w: 1.5,
    h: 0.25,
    fontSize: 10,
    fontFace: "Arial",
    color: MUTE,
    align: "right",
  });
}

const TOTAL = 12;

// 1 Title
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: MIDNIGHT } });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { type: "solid", color: PURPLE },
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: MIDNIGHT } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: TEAL } });
  s.addText("ROKU", {
    x: 0.7,
    y: 1.5,
    w: 8,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    bold: true,
    color: TEAL,
    charSpacing: 6,
  });
  s.addText("Where should this\nreq live?", {
    x: 0.7,
    y: 2.0,
    w: 12,
    h: 2.2,
    fontSize: 42,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
    margin: 0,
  });
  s.addText("Talent Intelligence  ·  a live chat that scores city, money, and start date.\nThen a recruiter digest that only keeps events mapped to desks we hire.", {
    x: 0.7,
    y: 4.5,
    w: 11,
    h: 1.0,
    fontSize: 16,
    fontFace: "Arial",
    color: MUTE,
  });
  s.addText("Pavail Aqeel  ·  Sr Technical Recruiter  ·  Cambridge & Manchester  ·  For TA + Engineering leadership", {
    x: 0.7,
    y: 6.6,
    w: 11,
    h: 0.35,
    fontSize: 12,
    fontFace: "Arial",
    color: TEAL,
  });
  footer(s, 1, TOTAL);
}

// 2 Problem
{
  const s = pptx.addSlide();
  base(s);
  s.addText("The problem", {
    x: 0.5,
    y: 0.6,
    w: 12,
    h: 0.6,
    fontSize: 32,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  const cards = [
    ["Hiring managers", "Ask “UK or not, Cambridge or Manchester, does £90k land?” and get a vibe, a spreadsheet, or a LinkedIn screenshot."],
    ["Recruiters", "Get a flood of layoff news. Most of it is not our market. Quiet weeks get padded so the cadence looks busy."],
    ["Finance & engineering", "Need one start date. Finance wants first payroll month. Engineering wants in-seat week. They rarely get both."],
  ];
  cards.forEach((c, i) => {
    const y = 1.45 + i * 1.7;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 1.5,
      fill: { color: MIDNIGHT },
      rectRadius: 0.1,
    });
    s.addText(c[0], {
      x: 0.75,
      y: y + 0.18,
      w: 11.8,
      h: 0.4,
      fontSize: 18,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(c[1], {
      x: 0.75,
      y: y + 0.6,
      w: 11.8,
      h: 0.7,
      fontSize: 15,
      fontFace: "Arial",
      color: PAPER,
    });
  });
  footer(s, 2, TOTAL);
}

// 3 What it is
{
  const s = pptx.addSlide();
  base(s);
  s.addText("What it is", {
    x: 0.5,
    y: 0.6,
    w: 12,
    h: 0.5,
    fontSize: 32,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addText("A standalone app. You type a hiring question. It pulls live public market + official economics. It answers with a city, a money verdict, a start date, and charts — not a candidate list.", {
    x: 0.5,
    y: 1.25,
    w: 12.3,
    h: 1.2,
    fontSize: 18,
    fontFace: "Arial",
    color: PAPER,
  });
  const boxes = [
    ["1", "Ask", "Role, country, budget in one box. Follow-ups in the same thread."],
    ["2", "Briefing", "Where / cost / when. Talent density, COL, P50/P75, first payroll month."],
    ["3", "Digest", "Weekly pulse. Only events that map to Roku desks. Quiet is allowed."],
  ];
  boxes.forEach((b, i) => {
    const x = 0.5 + i * 4.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 2.7,
      w: 3.95,
      h: 3.5,
      fill: { color: MIDNIGHT },
      rectRadius: 0.12,
    });
    s.addText(b[0], {
      x,
      y: 2.9,
      w: 3.95,
      h: 0.5,
      fontSize: 22,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
      align: "center",
    });
    s.addText(b[1], {
      x: x + 0.2,
      y: 3.45,
      w: 3.55,
      h: 0.5,
      fontSize: 22,
      fontFace: "Arial",
      bold: true,
      color: WHITE,
      align: "center",
    });
    s.addText(b[2], {
      x: x + 0.25,
      y: 4.15,
      w: 3.45,
      h: 1.6,
      fontSize: 14,
      fontFace: "Arial",
      color: MUTE,
      align: "center",
    });
  });
  footer(s, 3, TOTAL);
}

// 4 Not this
{
  const s = pptx.addSlide();
  base(s);
  s.addText("What it is not", {
    x: 0.5,
    y: 0.6,
    w: 12,
    h: 0.55,
    fontSize: 32,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  const rows = [
    ["Not LinkedIn Recruiter / Juicebox", "We do not source people. We decide where the req should live."],
    ["Not Greenhouse", "We do not write offers. Paste time-to-fill later if you have it."],
    ["Not a Claude Project", "Numbers are computed in code. Invented layoffs are withheld."],
    ["Not “AI said Cambridge”", "Every city score is on screen. Glean off = org labelled Demo."],
  ];
  rows.forEach((r, i) => {
    const y = 1.4 + i * 1.25;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 1.1,
      fill: { color: MIDNIGHT },
      rectRadius: 0.1,
    });
    s.addText(r[0], {
      x: 0.75,
      y: y + 0.15,
      w: 12,
      h: 0.35,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(r[1], {
      x: 0.75,
      y: y + 0.52,
      w: 12,
      h: 0.4,
      fontSize: 15,
      fontFace: "Arial",
      color: PAPER,
    });
  });
  footer(s, 4, TOTAL);
}

// 5 Live example
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Live example  ·  Senior SWE  ·  UK  ·  £90k", {
    x: 0.5,
    y: 0.55,
    w: 12.3,
    h: 0.55,
    fontSize: 26,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addText("Typed into the chat on 12 Nov 2026. Talent Risk was live. Glean / ONS / Adzuna were not — and we said so.", {
    x: 0.5,
    y: 1.15,
    w: 12.3,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    color: MUTE,
  });
  s.addChart(
    pptx.charts.BAR,
    [
      {
        name: "Composite",
        labels: ["Manchester", "Cambridge", "Remote UK", "London", "Cardiff"],
        values: [71, 70, 65, 50, 46],
      },
    ],
    {
      x: 0.4,
      y: 1.65,
      w: 7.4,
      h: 5.2,
      barGapWidthPct: 40,
      showValue: true,
      showLegend: false,
      chartColors: [TEAL],
      valAxisMinValue: 0,
      valAxisMaxValue: 100,
      catAxisLabelColor: PAPER,
      valAxisLabelColor: MUTE,
    },
  );
  const facts = [
    "Recommend Manchester",
    "£90k vs ~£82k market",
    "COL 96 vs national 100",
    "P50 in-seat 12 Mar 2027",
    "P75 5 May 2027",
    "First payroll Mar 2027",
    "London: below market £115k",
    "Org names labelled Demo",
  ];
  facts.forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.05,
      y: 1.7 + i * 0.62,
      w: 4.75,
      h: 0.55,
      fill: { color: MIDNIGHT },
      rectRadius: 0.08,
    });
    s.addText(f, {
      x: 8.2,
      y: 1.78 + i * 0.62,
      w: 4.45,
      h: 0.4,
      fontSize: 13,
      fontFace: "Arial",
      color: WHITE,
    });
  });
  footer(s, 5, TOTAL);
}

// 6 Density
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Talent density vs cost of living", {
    x: 0.5,
    y: 0.55,
    w: 12,
    h: 0.5,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addChart(
    pptx.charts.BAR,
    [
      {
        name: "Talent (0–100)",
        labels: ["Manchester", "Cambridge", "Remote UK", "London", "Cardiff"],
        values: [74, 82, 70, 92, 48],
      },
      {
        name: "COL index (100 = national)",
        labels: ["Manchester", "Cambridge", "Remote UK", "London", "Cardiff"],
        values: [96, 102, 100, 107, 94],
      },
    ],
    {
      x: 0.4,
      y: 1.2,
      w: 6.3,
      h: 5.5,
      barGrouping: "clustered",
      showLegend: true,
      legendPos: "b",
      chartColors: [TEAL, ELECTRIC],
      catAxisLabelColor: PAPER,
      valAxisLabelColor: MUTE,
    },
  );
  s.addText("Read this as a hiring manager", {
    x: 6.9,
    y: 1.3,
    w: 5.8,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    bold: true,
    color: TEAL,
  });
  s.addText("London has the thickest talent and the worst money fit at £90k.\n\nCambridge has more specialised talent (Player / device / vision) but housing is tighter.\n\nManchester wins the composite: talent is “enough”, £90k is rich vs local market, Roku already employs (Cloud Native — Demo until Glean).\n\nCardiff is cheaper. It is exploratory. Do not open a req there without entity review.", {
    x: 6.9,
    y: 1.85,
    w: 5.8,
    h: 4.6,
    fontSize: 15,
    fontFace: "Arial",
    color: PAPER,
  });
  footer(s, 6, TOTAL);
}

// 7 Live market
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Live market  ·  this week", {
    x: 0.5,
    y: 0.55,
    w: 12,
    h: 0.5,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addText("Cited from Talent Risk (CC BY 4.0). We do not invent a cut if the feed is quiet.", {
    x: 0.5,
    y: 1.1,
    w: 12,
    h: 0.35,
    fontSize: 14,
    fontFace: "Arial",
    color: MUTE,
  });
  const ev = [
    ["Qualcomm  ·  11 Nov 2026", "Performance-focused cuts (internal memo). Maps to Cambridge Player / embedded and Cambridge ML."],
    ["Amazon  ·  3 Nov 2026", "Stores + devices/software cuts, US / India / UK. Watchlist, not a candidate list."],
    ["Microsoft  ·  27 Oct 2026", "WSJ: reducing headcount without a classic layoff wave. Kept only if a desk matches."],
  ];
  ev.forEach((e, i) => {
    const y = 1.6 + i * 1.55;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 1.4,
      fill: { color: MIDNIGHT },
      rectRadius: 0.1,
    });
    s.addText(e[0], {
      x: 0.75,
      y: y + 0.2,
      w: 12,
      h: 0.35,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(e[1], {
      x: 0.75,
      y: y + 0.65,
      w: 12,
      h: 0.5,
      fontSize: 15,
      fontFace: "Arial",
      color: PAPER,
    });
  });
  footer(s, 7, TOTAL);
}

// 8 Digest
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Recruiter digest  ·  relevancy is the product", {
    x: 0.5,
    y: 0.55,
    w: 12.3,
    h: 0.55,
    fontSize: 26,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addChart(
    pptx.charts.DOUGHNUT,
    [
      {
        name: "This week",
        labels: ["Kept — maps to a Roku desk", "Dropped — not our market"],
        values: [1, 7],
      },
    ],
    {
      x: 0.4,
      y: 1.4,
      w: 6.2,
      h: 5.2,
      showPercent: true,
      showLegend: true,
      legendPos: "b",
      chartColors: [TEAL, "3A2A55"],
    },
  );
  s.addText("5–12 Nov 2026\n\nKept 1. Dropped 7.\n\nAction: source Player / device OS / embedded in Cambridge off the Qualcomm window.\n\nIf next week is zero, the email still goes: “Quiet period.” We do not pad. That is how TA learns to trust the cadence.", {
    x: 6.8,
    y: 1.8,
    w: 5.9,
    h: 4.5,
    fontSize: 16,
    fontFace: "Arial",
    color: PAPER,
  });
  footer(s, 8, TOTAL);
}

// 9 Guardrails
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Guardrails leaders should hear", {
    x: 0.5,
    y: 0.55,
    w: 12,
    h: 0.55,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  const g = [
    ["No invented numbers", "TypeScript scores cities. The narrative is checked against evidence. Failed check = withheld."],
    ["Human still decides", "The engine recommends. HM / TA / finance sign the req. There is always a human review step."],
    ["GDPR / Glean", "Named staff only when Glean is on the Roku network. Until then, Demo labels."],
    ["Bias", "We score places and money, not people. No CV ranking. LinkedIn TI is optional and labelled."],
    ["Systems", "Public Talent Risk + layoffs.uk. Optional Glean, Confluence, Adzuna, Resend. No ATS write."],
  ];
  g.forEach((row, i) => {
    const y = 1.25 + i * 1.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 0.95,
      fill: { color: MIDNIGHT },
      rectRadius: 0.08,
    });
    s.addText(row[0], {
      x: 0.75,
      y: y + 0.12,
      w: 12,
      h: 0.3,
      fontSize: 15,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(row[1], {
      x: 0.75,
      y: y + 0.44,
      w: 12,
      h: 0.4,
      fontSize: 14,
      fontFace: "Arial",
      color: PAPER,
    });
  });
  footer(s, 9, TOTAL);
}

// 10 Demo run of show
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Live demo  ·  3 minutes", {
    x: 0.5,
    y: 0.55,
    w: 12,
    h: 0.5,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  const steps = [
    ["00:00", "Open the chat. One box. No extra tiles."],
    ["00:20", "Click “UK Senior SWE, £90k” or type it. Wait for Live briefing."],
    ["01:10", "Point at Manchester vs Cambridge vs London. Bars = density and score. Scatter = money."],
    ["01:50", "Say: finance = first payroll month. Engineering = in-seat week. TA = cited events only."],
    ["02:20", "Type weekly digest. Qualcomm kept. Seven dropped. Quiet would also be a valid answer."],
    ["02:50", "Honest close: Glean is off from this machine. LinkedIn is optional. This is not a sourcer."],
  ];
  steps.forEach((st, i) => {
    const y = 1.25 + i * 0.9;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 0.8,
      fill: { color: MIDNIGHT },
      rectRadius: 0.08,
    });
    s.addText(st[0], {
      x: 0.7,
      y: y + 0.2,
      w: 1.5,
      h: 0.4,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(st[1], {
      x: 2.3,
      y: y + 0.2,
      w: 10.2,
      h: 0.4,
      fontSize: 16,
      fontFace: "Arial",
      color: WHITE,
    });
  });
  footer(s, 10, TOTAL);
}

// 11 Scale
{
  const s = pptx.addSlide();
  base(s);
  s.addText("Scale, cost, what we need", {
    x: 0.5,
    y: 0.55,
    w: 12,
    h: 0.5,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  const bits = [
    ["Setup", "Open the URL. Type. Optional: Glean token on Roku network, Adzuna keys, Resend for email."],
    ["Users now", "Pilot: Pavail + TA leadership demo. Not a production user count yet."],
    ["Token cost", "Chat turn = our compute + free public feeds. No LLM required for scores. If a model narrates later, pennies per briefing."],
    ["Maintain", "Pavail (DRI). Code on GitHub + GitLab. Tests include hallucination evals."],
    ["To go further", "Glean on corp network, Greenhouse read (not write), branded host, weekly Resend to UK/US desks."],
  ];
  bits.forEach((b, i) => {
    const y = 1.25 + i * 1.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5,
      y,
      w: 12.3,
      h: 0.95,
      fill: { color: MIDNIGHT },
      rectRadius: 0.08,
    });
    s.addText(b[0], {
      x: 0.75,
      y: y + 0.12,
      w: 12,
      h: 0.28,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: TEAL,
    });
    s.addText(b[1], {
      x: 0.75,
      y: y + 0.44,
      w: 12,
      h: 0.4,
      fontSize: 14,
      fontFace: "Arial",
      color: PAPER,
    });
  });
  footer(s, 11, TOTAL);
}

// 12 Close
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: MIDNIGHT } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: TEAL } });
  s.addText("Open the req where the talent, the money, and the start date agree.", {
    x: 0.8,
    y: 2.1,
    w: 11.5,
    h: 1.8,
    fontSize: 32,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
  });
  s.addText("Then let’s look at the live chat.", {
    x: 0.8,
    y: 4.2,
    w: 11.5,
    h: 0.6,
    fontSize: 20,
    fontFace: "Arial",
    color: TEAL,
  });
  s.addText("Pavail Aqeel  ·  paqeel@roku.com  ·  GitLab: paqeel/roku-talent-intelligence-engine", {
    x: 0.8,
    y: 6.5,
    w: 11.5,
    h: 0.35,
    fontSize: 13,
    fontFace: "Arial",
    color: MUTE,
  });
  footer(s, 12, TOTAL);
}

await pptx.writeFile({ fileName: outFile });
console.log(outFile);
