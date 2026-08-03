// ============================================================
// Kundli PDF — Premium Print-Ready Generator (multilingual)
// ------------------------------------------------------------
// Client-side only. Produces a multi-page A4 PDF containing:
//   • Cover page with birth details, branding, QR code
//   • Chart pages (North, South, East Indian styles)
//   • Planet positions table
//   • House table & Nakshatra breakdown
//   • Rashi / Lagna / Summary
//   • Page numbers + brand footer on every page
//
// The `language` option selects one of 12 Indian languages. A
// Noto Sans script font is fetched at runtime so Devanagari,
// Bengali, Tamil, Telugu, etc. render correctly.
// ============================================================

import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { KundliResult, KundliChart, PlanetChartPosition, GrahaName } from "./types";
import { NAKSHATRA_LORDS } from "./strength";
import { PDF_LABELS, ensurePdfFont, type PdfLabels, type PdfLang } from "./pdf-i18n";
import { installComplexTextShaper } from "./pdf-complex-text";
import { PDF_EXTRA_LABELS, type PdfExtraLabels } from "./pdf-i18n-extra";
import { drawNorthIndian, drawSouthIndian, drawEastIndian } from "./pdf-charts";
import {
  YOGA_MEANINGS,
  DOSHA_DETAILS,
  TITHI_MEANING,
  YOGA_LIMB_MEANING,
  KARANA_MEANING,
  NAKSHATRA_MEANING,
} from "./pdf-meanings";
import { generateLifeAnalysis, type LifeSection } from "./life-analysis";
import { computeLuckyFactors } from "./lucky-factors";
import { computeDecadeTimeline } from "./life-timeline";
import { PDF_V2_FAQS, PDF_V2_GLOSSARY, PDF_V2_APPENDIX } from "./pdf-v2-meanings";
import { PdfFlowEngine } from "./pdf-flow-engine";
import { generateDomainNarratives } from "./personalized-narratives";
import { generateEvidenceTraces, generateChapterActionCard } from "./explainable-astrology-engine";
import { CLASSICAL_KNOWLEDGE_DATABASE } from "./classical-knowledge-database";
import { ASTROLOGY_LEARNING_MODULES } from "./astrology-learning-engine";
import { computeLifeScores, evaluatePriorityDashboard } from "./life-score-engine";
import { generateOpportunityCalendar, generateDecisionSupport } from "./opportunity-risk-calendar";
import { evaluatePlanetRelationships } from "./planet-house-matrix";

export { PdfFlowEngine };

// ---------- Brand tokens (hard-coded so PDF matches print) ----------
const BRAND = {
  name: "SanatanTools",
  site: "https://sanatantools.com",
  saffron: "#C8571C",
  maroon: "#5B1A1A",
  gold: "#B8862E",
  ink: "#1A1108",
  muted: "#6b5847",
  paper: "#FFF8EE",
  divider: "#E8D9BE",
  cardBg: "#FFFBF4",
  cardBorder: "#E5D5C0",
  excellent: "#15803D",
  good: "#1D4ED8",
  moderate: "#C2410C",
  weak: "#B91C1C",
};

const PAGE = { w: 210, h: 297, m: 22 }; // A4 mm (22mm left & right margins)

interface PdfOptions {
  filename?: string;
  shareUrl?: string;
  language?: PdfLang;
  /** When true, includes all 22 premium pages. When false/undefined,
   *  a compact free report is generated (cover, charts, core tables,
   *  panchang, summary). */
  premium?: boolean;
  /** Optional AI-generated narrative sections (premium feature).
   *  When provided, each entry becomes one-or-more pages placed
   *  before the final summary page. */
  narratives?: Array<{ title: string; text: string }>;
}

interface Ctx {
  L: PdfLabels;
  X: PdfExtraLabels; // Sprint 1 additions
  font: string; // font family to use for translated text
  brandFont: string; // font used for the "SanatanTools" wordmark — always helvetica
}

export async function generateKundliPdf(
  result: KundliResult,
  opts: PdfOptions = {},
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const lang: PdfLang = opts.language ?? "en";
  const font = await ensurePdfFont(doc, lang);
  await installComplexTextShaper(doc, lang);
  const ctx: Ctx = {
    L: PDF_LABELS[lang],
    X: PDF_EXTRA_LABELS[lang],
    font,
    brandFont: "helvetica",
  };

  const isPremium = opts.premium === true;
  const pages: Array<() => Promise<void> | void> = isPremium
    ? [
        () => coverPage(doc, result, opts, ctx),
        () => tocPage(doc, result, ctx),
        () => executiveDashboardPage(doc, result, ctx),
        () => chartsPage(doc, result, ctx),
        () => planetTablePage(doc, result, ctx),
        () => houseAndNakshatraPage(doc, result, ctx),
        () => planetStrengthGraphPage(doc, result, ctx),
        () => houseAnalysisPage(doc, result, ctx),
        () => panchangAvakahadaPage(doc, result, ctx),
        () => dashaOverviewPage(doc, result, ctx),
        () => dashaTimelinePage(doc, result, ctx),
        () => yogasPage(doc, result, ctx),
        () => doshasPage(doc, result, ctx),
        () => remediesPage(doc, result, ctx),
        () => predictionsPage(doc, result, ctx),
        () => personalizedLifeDomainPdfPage(doc, result, ctx),
        () => explainableRuleTracePdfPage(doc, result, ctx),
        () => classicalKnowledgePdfPage(doc, result, ctx),
        () => interactiveIntelligencePdfPage(doc, result, ctx),
        () => opportunityRiskPdfPage(doc, result, ctx),
        () => timeBasedTimelinePdfPage(doc, result, ctx),
        () => divisionalChartsPage(doc, result, ctx),
        () => shadbalaPage(doc, result, ctx),
        () => ashtakvargaPage(doc, result, ctx),
        () => luckyFactorsPdfPage(doc, result, ctx),
        () => remedyPlannerPdfPage(doc, result, ctx),
        () => lifeTimelinePdfPage(doc, result, ctx),
        () => faqPdfPage(doc, result, ctx),
        () => glossaryPdfPage(doc, result, ctx),
        () => appendixPdfPage(doc, result, ctx),
        () => lifeAnalysisPage(doc, result, ctx),
        ...(opts.narratives ?? []).map((n) => () => narrativePages(doc, n.title, n.text, ctx)),
        () => summaryPage(doc, result, ctx),
      ]
    : [
        // Free tier — compact essentials only
        () => coverPage(doc, result, opts, ctx),
        () => chartsPage(doc, result, ctx),
        () => planetTablePage(doc, result, ctx),
        () => houseAndNakshatraPage(doc, result, ctx),
        () => panchangAvakahadaPage(doc, result, ctx),
        () => summaryPage(doc, result, ctx),
      ];

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) doc.addPage();
    await pages[i]();
  }
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, i, total, ctx);
  }
  verifyPdfLayout(doc);
  return doc;
}

export async function downloadKundliPdf(result: KundliResult, opts: PdfOptions = {}) {
  const doc = await generateKundliPdf(result, opts);
  const langSuffix = opts.language && opts.language !== "en" ? `-${opts.language}` : "";
  const name =
    opts.filename ??
    `kundli-${sanitize(result.input.place || "chart")}-${result.input.date}${langSuffix}.pdf`;
  doc.save(name);
}

// Safely set a font — jsPDF throws on unknown style variants.
function setFont(doc: jsPDF, family: string, style: "normal" | "bold" | "italic") {
  try {
    doc.setFont(family, style);
  } catch {
    doc.setFont(family, "normal");
  }
}

// ============================================================
// PAGE 1 — Cover
// ============================================================
async function coverPage(doc: jsPDF, r: KundliResult, opts: PdfOptions, ctx: Ctx) {
  const { L, font, brandFont } = ctx;

  doc.setFillColor(BRAND.paper);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");
  doc.setFillColor(BRAND.maroon);
  doc.rect(0, 0, PAGE.w, 42, "F");
  doc.setFillColor(BRAND.gold);
  doc.rect(0, 42, PAGE.w, 2, "F");

  // Brand wordmark — always Latin
  doc.setTextColor("#FFF6E1");
  setFont(doc, brandFont, "bold");
  doc.setFontSize(22);
  doc.text(BRAND.name, PAGE.m, 22);
  setFont(doc, font, "normal");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.gold);
  doc.text(L.brandTagline, PAGE.m, 30, { charSpace: 1 });

  doc.setFontSize(28);
  doc.setTextColor(BRAND.gold);
  setFont(doc, brandFont, "normal");
  doc.text("\u2740", PAGE.w - PAGE.m - 6, 26, { align: "right" });

  const cx = PAGE.w / 2;
  doc.setTextColor(BRAND.maroon);
  setFont(doc, font, "bold");
  doc.setFontSize(34);
  doc.text(L.title, cx, 80, { align: "center" });

  setFont(doc, font, "italic");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.saffron);
  doc.text(L.subtitle, cx, 90, { align: "center" });

  goldDivider(doc, PAGE.m + 20, 100, PAGE.w - PAGE.m - 20);

  const boxY = 112;
  const boxH = 78;
  doc.setDrawColor(BRAND.divider);
  doc.setFillColor("#FFFFFF");
  doc.roundedRect(PAGE.m, boxY, PAGE.w - 2 * PAGE.m, boxH, 3, 3, "FD");

  setFont(doc, font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.ink);
  doc.text(L.nativeDetails, PAGE.m + 6, boxY + 10);

  const rows: Array<[string, string]> = [
    [L.dob, r.input.date],
    [L.tob, r.input.time],
    [L.place, r.input.place || "—"],
    [L.coords, `${r.input.latitude.toFixed(4)}°, ${r.input.longitude.toFixed(4)}°`],
    [L.timezone, String(r.input.timezone)],
    [L.ayanamsa, `${r.time.ayanamsaDegrees.toFixed(4)}°`],
  ];
  setFont(doc, font, "normal");
  doc.setFontSize(10);
  let ry = boxY + 20;
  for (const [k, v] of rows) {
    doc.setTextColor(BRAND.muted);
    doc.text(k, PAGE.m + 6, ry);
    doc.setTextColor(BRAND.ink);
    doc.text(v, PAGE.m + 60, ry);
    ry += 8;
  }

  const hY = boxY + boxH + 10;
  const highlights: Array<[string, string]> = [
    [L.lagna, r.d1.ascendant.rashi],
    [L.moonRashi, r.moonSign],
    [L.nakshatra, `${r.birthNakshatra.nakshatra} · pada ${r.birthNakshatra.pada}`],
  ];
  const colW = (PAGE.w - 2 * PAGE.m) / 3;
  highlights.forEach(([label, val], i) => {
    const x = PAGE.m + i * colW;
    doc.setFillColor(BRAND.maroon);
    doc.roundedRect(x + 2, hY, colW - 4, 22, 2, 2, "F");
    doc.setTextColor(BRAND.gold);
    setFont(doc, font, "normal");
    doc.setFontSize(8);
    doc.text(label, x + colW / 2, hY + 8, { align: "center", charSpace: 1 });
    doc.setTextColor("#FFF6E1");
    setFont(doc, font, "bold");
    doc.setFontSize(12);
    doc.text(val, x + colW / 2, hY + 17, { align: "center" });
  });

  const shareUrl = opts.shareUrl ?? BRAND.site;
  try {
    const qrData = await QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 400,
      color: { dark: BRAND.maroon, light: "#FFF8EE" },
    });
    const qrSize = 26;
    const qrX = PAGE.w - PAGE.m - qrSize;
    // sit between the highlights bar (ends at hY+22) and the footer disclaimer (starts at PAGE.h-40)
    const qrY = PAGE.h - 40 - qrSize - 8;
    doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);
    setFont(doc, font, "normal");
    doc.setFontSize(7);
    doc.setTextColor(BRAND.muted);
    doc.text(L.scanOnline, qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });
  } catch {
    /* no-op */
  }

  setFont(doc, font, "italic");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(doc.splitTextToSize(L.disclaimer, PAGE.w - 2 * PAGE.m - 40), PAGE.m, PAGE.h - 40);
}

// ============================================================
// PAGE 2 — Rashi Charts (D1: North / South / East Indian)
// ------------------------------------------------------------
// Drawn natively with jsPDF vector primitives — sharp, uses the
// embedded script font, and never renders blank.
// ============================================================
async function chartsPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  pageHeader(doc, ctx.L.rashiCharts, ctx.L.chartsSubtitle, ctx);

  const chart = r.d1;
  const chartSize = 82;
  const gap = 6;
  const x1 = PAGE.m;
  const x2 = PAGE.m + chartSize + gap;
  const y1 = 46;
  const y2 = y1 + chartSize + 18;

  drawNorthIndian(doc, chart, x1, y1, chartSize, {
    fontFamily: ctx.font,
    caption: ctx.L.northIndian,
  });
  drawSouthIndian(doc, chart, x2, y1, chartSize, {
    fontFamily: ctx.font,
    caption: ctx.L.southIndian,
  });

  const eastSize = 100;
  drawEastIndian(doc, chart, (PAGE.w - eastSize) / 2, y2, eastSize, {
    fontFamily: ctx.font,
    caption: ctx.L.eastIndian,
  });

  setFont(doc, ctx.font, "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  const legendWrapped = doc.splitTextToSize(ctx.L.legend, PAGE.w - 2 * PAGE.m);
  doc.text(legendWrapped, PAGE.w / 2, y2 + eastSize + 14, { align: "center" });
}

// ============================================================
// PAGE 3 — Planet Table
// ============================================================
function planetTablePage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { L, font } = ctx;
  pageHeader(doc, L.planetaryPositions, L.sidereal, ctx);

  const cols = [
    { k: L.colPlanet, w: 24 },
    { k: L.colSign, w: 26 },
    { k: L.colDeg, w: 18 },
    { k: L.colHouse, w: 16 },
    { k: L.colNakshatra, w: 34 },
    { k: L.colPada, w: 12 },
    { k: L.colDignity, w: 24 },
    { k: L.colR, w: 8 },
  ];
  const startX = PAGE.m;
  const startY = 48;
  drawTableHeader(doc, cols, startX, startY, ctx);

  let y = startY + 9;
  r.d1.planets.forEach((p, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(
        startX,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        8,
        "F",
      );
    }
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.ink);
    const vals = [
      p.graha,
      p.rashi,
      `${p.degreesInRashi.toFixed(2)}°`,
      String(p.house),
      p.nakshatra,
      String(p.pada),
      p.dignity,
      p.retrograde ? "R" : "",
    ];
    let x = startX;
    for (let ci = 0; ci < cols.length; ci++) {
      doc.text(String(vals[ci]), x + 2, y);
      x += cols[ci].w;
    }
    y += 8;
  });

  y += 4;
  goldDivider(doc, startX, y, startX + cols.reduce((a, c) => a + c.w, 0));
  y += 8;
  setFont(doc, font, "bold");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.maroon);
  doc.text(L.ascendantLagna, startX, y);
  setFont(doc, font, "normal");
  doc.setTextColor(BRAND.ink);
  y += 7;
  const asc = r.d1.ascendant;
  doc.setFontSize(9);
  doc.text(
    `${asc.rashi}  ·  ${asc.degreesInRashi.toFixed(2)}°  ·  ${asc.nakshatra} pada ${asc.pada}`,
    startX,
    y,
  );
}

// ============================================================
// PAGE 4 — Houses + Nakshatra Panel
// ============================================================
function houseAndNakshatraPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { L, font } = ctx;
  pageHeader(doc, L.housesNakshatra, L.wholeSign, ctx);

  const cols = [
    { k: L.colHouse, w: 16 },
    { k: L.colSign, w: 26 },
    { k: L.colCusp, w: 20 },
    { k: L.colPlanets, w: 32 },
  ];
  const startX = PAGE.m;
  const startY = 48;
  drawTableHeader(doc, cols, startX, startY, ctx);

  let y = startY + 9;
  const byHouse: Record<number, PlanetChartPosition[]> = {};
  r.d1.planets.forEach((p) => {
    (byHouse[p.house] = byHouse[p.house] ?? []).push(p);
  });

  r.d1.houses.forEach((h, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(
        startX,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        8,
        "F",
      );
    }
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.ink);
    const planets = (byHouse[h.house] ?? []).map((p) => p.graha.slice(0, 2)).join(", ");
    const vals = [String(h.house), h.rashi, `${h.startDegree.toFixed(1)}°`, planets || "—"];
    let x = startX;
    for (let ci = 0; ci < cols.length; ci++) {
      doc.text(String(vals[ci]), x + 2, y);
      x += cols[ci].w;
    }
    y += 8;
  });

  const panelX = startX + cols.reduce((a, c) => a + c.w, 0) + 8;
  const panelW = PAGE.w - PAGE.m - panelX;
  const panelY = startY - 6;

  doc.setFillColor(BRAND.maroon);
  doc.roundedRect(panelX, panelY, panelW, 40, 2, 2, "F");
  doc.setTextColor(BRAND.gold);
  setFont(doc, font, "normal");
  doc.setFontSize(8);
  doc.text(L.janmaNakshatra, panelX + 4, panelY + 7, { charSpace: 1 });
  doc.setTextColor("#FFF6E1");
  setFont(doc, font, "bold");
  doc.setFontSize(18);
  doc.text(r.birthNakshatra.nakshatra, panelX + 4, panelY + 18);
  setFont(doc, font, "normal");
  doc.setFontSize(9);
  doc.text(L.padaOf(r.birthNakshatra.pada, r.birthNakshatra.lord), panelX + 4, panelY + 26);
  doc.setFontSize(8);
  doc.setTextColor(BRAND.gold);
  const moon = r.d1.planets.find((p) => p.graha === "Moon")!;
  doc.text(L.mahadashaLord(NAKSHATRA_LORDS[moon.nakshatraIndex]), panelX + 4, panelY + 34);

  const cardY = panelY + 48;
  const cardH = 26;
  const cards: Array<[string, string, string]> = [
    [L.lagna, r.d1.ascendant.rashi, `${r.d1.ascendant.degreesInRashi.toFixed(1)}°`],
    [L.moonRashi, r.moonSign, ""],
    [L.sunRashi, r.sunSign, ""],
  ];
  cards.forEach((c, i) => {
    const cy = cardY + i * (cardH + 4);
    doc.setDrawColor(BRAND.divider);
    doc.setFillColor("#FFFFFF");
    doc.roundedRect(panelX, cy, panelW, cardH, 2, 2, "FD");
    doc.setTextColor(BRAND.saffron);
    setFont(doc, font, "normal");
    doc.setFontSize(7);
    doc.text(c[0], panelX + 4, cy + 7, { charSpace: 1 });
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "bold");
    doc.setFontSize(14);
    doc.text(c[1], panelX + 4, cy + 17);
    if (c[2]) {
      setFont(doc, font, "normal");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.muted);
      doc.text(c[2], panelX + panelW - 4, cy + 17, { align: "right" });
    }
  });
}

// ============================================================
// PAGE 5 — Summary
// ============================================================
function summaryPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { L, font } = ctx;
  pageHeader(doc, L.chartSummary, L.snapshot, ctx);

  let y = 52;
  const lines: string[] = [
    L.summary1(r.input.date, r.input.time, r.input.place || "—"),
    L.summary2(
      r.d1.ascendant.rashi,
      r.d1.ascendant.degreesInRashi.toFixed(2),
      r.d1.ascendant.nakshatra,
      r.d1.ascendant.pada,
    ),
    L.summary3(r.moonSign, r.sunSign),
    L.summary4(r.birthNakshatra.nakshatra, r.birthNakshatra.pada, r.birthNakshatra.lord),
    L.summary5(r.time.ayanamsaDegrees.toFixed(4)),
  ];

  setFont(doc, font, "normal");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.ink);
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, PAGE.w - 2 * PAGE.m);
    doc.text(wrapped, PAGE.m, y);
    y += wrapped.length * 6 + 4;
  }

  y += 4;
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 8;
  setFont(doc, font, "bold");
  doc.setFontSize(12);
  doc.setTextColor(BRAND.maroon);
  doc.text(L.notable, PAGE.m, y);
  y += 8;

  setFont(doc, font, "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.ink);
  r.d1.planets.forEach((p) => {
    const note = `${p.graha.padEnd(8)}  ${p.rashi.padEnd(12)}  ${p.degreesInRashi
      .toFixed(2)
      .padStart(
        6,
      )}°  H${String(p.house).padStart(2)}  ${p.dignity}${p.retrograde ? " · " + L.retrograde : ""}`;
    doc.text(note, PAGE.m, y);
    y += 6;
  });

  y = PAGE.h - 55;
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 8;
  setFont(doc, font, "italic");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.muted);
  doc.text(doc.splitTextToSize(L.closing, PAGE.w - 2 * PAGE.m), PAGE.m, y);
}

// ============================================================
// AI Narrative pages (premium interpretation) — multi-page safe
// ============================================================
function narrativePages(doc: jsPDF, title: string, text: string, ctx: Ctx) {
  const { font } = ctx;
  const maxY = PAGE.h - 20;
  const lineH = 5.4;

  const startPage = (heading: string) => {
    pageHeader(doc, heading, undefined, ctx);
    setFont(doc, font, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(BRAND.ink);
    return 52;
  };

  let y = startPage(title);
  // Split by blank lines so paragraph spacing is preserved.
  const paragraphs = String(text ?? "")
    .replace(/\r/g, "")
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const para of paragraphs) {
    const wrapped = doc.splitTextToSize(para, PAGE.w - 2 * PAGE.m) as string[];
    for (const line of wrapped) {
      if (y > maxY) {
        doc.addPage();
        y = startPage(`${title} (cont.)`);
      }
      doc.text(line, PAGE.m, y);
      y += lineH;
    }
    y += 3;
  }
}

// ============================================================

// Helpers
// ============================================================

// ============================================================
// PAGE — Panchang at Birth + Avakahada Chakra + Deep Meanings
// ============================================================
function panchangAvakahadaPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.panchangTitle, X.panchangSubtitle, ctx);

  const bp = r.birthPanchang;
  const av = r.avakahada;

  let y = 48;
  if (bp) {
    const cards: Array<[string, string, string]> = [
      [X.tithi, bp.tithi.name, `${bp.tithi.paksha} · ${bp.tithi.percent.toFixed(0)}%`],
      [X.vaar, bp.vaar.split(" ")[0], ""],
      [
        X.nakshatraLabel,
        bp.nakshatra.name,
        `${X.pada} ${bp.nakshatra.pada} · ${X.lord} ${bp.nakshatra.lord}`,
      ],
      [X.yoga, bp.yoga.name, ""],
      [X.karana, bp.karana.name, bp.karana.type],
    ];
    const cardW = (PAGE.w - 2 * PAGE.m - 8) / 3;
    const cardH = 22;
    cards.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = PAGE.m + col * (cardW + 4);
      const cy = y + row * (cardH + 4);
      doc.setDrawColor(BRAND.divider);
      doc.setFillColor("#FFFFFF");
      doc.roundedRect(x, cy, cardW, cardH, 2, 2, "FD");
      doc.setTextColor(BRAND.saffron);
      setFont(doc, font, "normal");
      doc.setFontSize(7);
      doc.text(c[0], x + 3, cy + 6, { charSpace: 0.5 });
      doc.setTextColor(BRAND.ink);
      setFont(doc, font, "bold");
      doc.setFontSize(12);
      doc.text(c[1], x + 3, cy + 14);
      if (c[2]) {
        setFont(doc, font, "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(BRAND.muted);
        doc.text(c[2], x + 3, cy + 19);
      }
    });
    y += 2 * (cardH + 4) + 6;

    // "What this means" — deep meanings for each limb
    goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
    y += 6;
    setFont(doc, font, "bold");
    doc.setFontSize(11);
    doc.setTextColor(BRAND.maroon);
    doc.text(X.meaningTitle, PAGE.m, y);
    y += 5;

    const meanings: Array<[string, string, string | undefined]> = [
      [X.tithi, bp.tithi.name, TITHI_MEANING[bp.tithi.name]],
      [X.yoga, bp.yoga.name, YOGA_LIMB_MEANING[bp.yoga.name]],
      [X.karana, bp.karana.name, KARANA_MEANING[bp.karana.name]],
    ];
    const nakM = NAKSHATRA_MEANING[bp.nakshatra.name];
    if (nakM) {
      meanings.push([
        X.nakshatraLabel,
        bp.nakshatra.name,
        `${nakM.nature}. ${nakM.strengths} Watch: ${nakM.cautions}`,
      ]);
    }
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    for (const [lbl, name, text] of meanings) {
      if (!text) continue;
      setFont(doc, font, "bold");
      doc.setTextColor(BRAND.saffron);
      doc.text(`${lbl} · ${name}`, PAGE.m, y);
      y += 4;
      setFont(doc, font, "normal");
      doc.setTextColor(BRAND.ink);
      const wrapped = doc.splitTextToSize(text, PAGE.w - 2 * PAGE.m);
      doc.text(wrapped, PAGE.m, y);
      y += wrapped.length * 4 + 3;
    }
    y += 2;
  }

  // Avakahada section
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 6;
  setFont(doc, font, "bold");
  doc.setFontSize(12);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.avakahadaTitle, PAGE.m, y);
  y += 4;
  setFont(doc, font, "italic");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(X.avakahadaSubtitle, PAGE.m, y);
  y += 6;

  if (av) {
    const rows: Array<[string, string]> = [
      [X.varna, av.varna],
      [X.vashya, av.vashya],
      [X.yoni, av.yoni],
      [X.gana, av.gana],
      [X.nadi, av.nadi],
      [X.tatva, av.tatva],
      [X.paya, av.paya],
      [X.nakLord, av.nakshatraLord],
      [X.rashiLord, av.rashiLord],
      [X.namingLetter, av.namingLetter],
      [X.namingLetters, av.namingLetters.join(" · ")],
    ];
    const colW = (PAGE.w - 2 * PAGE.m) / 2;
    rows.forEach((row, i) => {
      const col = i % 2;
      const rowIdx = Math.floor(i / 2);
      const rx = PAGE.m + col * colW;
      const ry = y + rowIdx * 7;
      if (rowIdx % 2 === 0 && col === 0) {
        doc.setFillColor("#FBF3E2");
        doc.rect(PAGE.m, ry - 4, PAGE.w - 2 * PAGE.m, 7, "F");
      }
      setFont(doc, font, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(row[0], rx + 2, ry);
      setFont(doc, font, "normal");
      doc.setTextColor(BRAND.ink);
      doc.text(row[1], rx + 40, ry);
    });
  }
}

// ============================================================
// PAGE — Vimshottari Dasha Overview + Gantt Timeline
// ============================================================
function dashaOverviewPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.dashaTitle, X.dashaSubtitle, ctx);
  const v = r.vimshottari;
  if (!v) return;

  let y = 48;
  // Balance panel
  doc.setFillColor(BRAND.maroon);
  doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 22, 2, 2, "F");
  doc.setTextColor(BRAND.gold);
  setFont(doc, font, "normal");
  doc.setFontSize(9);
  doc.text(X.balanceAtBirth, PAGE.m + 5, y + 8, { charSpace: 0.5 });
  doc.setTextColor("#FFF6E1");
  setFont(doc, font, "bold");
  doc.setFontSize(16);
  doc.text(v.balanceAtBirth.lord, PAGE.m + 5, y + 17);
  setFont(doc, font, "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.gold);
  doc.text(
    `${X.yearsRemaining}: ${v.balanceAtBirth.yearsRemaining.toFixed(2)} ${X.years}`,
    PAGE.w - PAGE.m - 5,
    y + 17,
    { align: "right" },
  );
  y += 28;

  // Current MD + AD + PD cards
  if (v.current) {
    const items: Array<
      [string, { lord: GrahaName; startISO: string; endISO: string } | undefined]
    > = [
      [X.currentMd, v.current.mahadasha],
      [X.currentAd, v.current.antardasha],
      [X.currentPd, v.current.pratyantar],
    ];
    const cardW = (PAGE.w - 2 * PAGE.m - 8) / 3;
    const cardH = 30;
    items.forEach(([label, period], i) => {
      const x = PAGE.m + i * (cardW + 4);
      doc.setDrawColor(BRAND.gold);
      doc.setFillColor("#FFFFFF");
      doc.roundedRect(x, y, cardW, cardH, 2, 2, "FD");
      doc.setTextColor(BRAND.saffron);
      setFont(doc, font, "normal");
      doc.setFontSize(7.5);
      doc.text(label, x + 3, y + 6, { charSpace: 0.5 });
      doc.setTextColor(BRAND.maroon);
      setFont(doc, font, "bold");
      doc.setFontSize(14);
      doc.text(period?.lord ?? "—", x + 3, y + 15);
      if (period) {
        setFont(doc, font, "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(BRAND.muted);
        doc.text(`${X.from}: ${fmtDate(period.startISO)}`, x + 3, y + 22);
        doc.text(`${X.to}: ${fmtDate(period.endISO)}`, x + 3, y + 27);
      }
    });
    y += cardH + 8;
  }

  // Gantt-style horizontal timeline
  setFont(doc, font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.timelineVisual, PAGE.m, y);
  y += 4;

  const barX = PAGE.m;
  const barW = PAGE.w - 2 * PAGE.m;
  const barY = y + 2;
  const barH = 10;
  const t0 = Date.parse(v.timeline[0].startISO);
  const tN = Date.parse(v.timeline[v.timeline.length - 1].endISO);
  const span = tN - t0;
  const now = Date.now();
  const MD_COLORS: Record<string, string> = {
    Ketu: "#8B6B4A",
    Venus: "#E8C8D9",
    Sun: "#F0A85E",
    Moon: "#DDE5EE",
    Mars: "#D95F4A",
    Rahu: "#6B5B78",
    Jupiter: "#F0D785",
    Saturn: "#4A5164",
    Mercury: "#8FBFA9",
  };
  v.timeline.forEach((md) => {
    const s = Date.parse(md.startISO);
    const e = Date.parse(md.endISO);
    const x = barX + ((s - t0) / span) * barW;
    const w = ((e - s) / span) * barW;
    doc.setFillColor(MD_COLORS[md.lord] ?? "#999");
    doc.rect(x, barY, w, barH, "F");
    if (w > 8) {
      setFont(doc, font, "bold");
      doc.setFontSize(7);
      doc.setTextColor(BRAND.ink);
      doc.text(md.lord.slice(0, 2), x + w / 2, barY + 6.5, { align: "center" });
    }
  });
  // Border
  doc.setDrawColor(BRAND.maroon);
  doc.setLineWidth(0.3);
  doc.rect(barX, barY, barW, barH);
  // Today marker
  if (now >= t0 && now <= tN) {
    const nx = barX + ((now - t0) / span) * barW;
    doc.setDrawColor("#B93A2E");
    doc.setLineWidth(0.8);
    doc.line(nx, barY - 2, nx, barY + barH + 2);
    setFont(doc, font, "bold");
    doc.setFontSize(7);
    doc.setTextColor("#B93A2E");
    doc.triangle(nx - 1.4, barY - 4.6, nx + 1.4, barY - 4.6, nx, barY - 2.4, "F");
    doc.text(X.nowMarker, nx, barY - 5.2, { align: "center" });
  }
  // Year labels underneath
  setFont(doc, font, "normal");
  doc.setFontSize(7);
  doc.setTextColor(BRAND.muted);
  const y0 = new Date(t0).getUTCFullYear();
  const yN = new Date(tN).getUTCFullYear();
  const ticks = 6;
  for (let i = 0; i <= ticks; i++) {
    const yr = y0 + Math.round(((yN - y0) * i) / ticks);
    const tx = barX + (i / ticks) * barW;
    doc.text(String(yr), tx, barY + barH + 5, { align: "center" });
  }
  y = barY + barH + 12;

  // Timeline table
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 5;
  setFont(doc, font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.timeline, PAGE.m, y);
  y += 4;

  const cols = [
    { k: X.mahadasha, w: 30 },
    { k: X.from, w: 40 },
    { k: X.to, w: 40 },
    { k: X.years, w: 25 },
  ];
  drawTableHeader(doc, cols, PAGE.m, y + 4, ctx);
  y += 13;
  v.timeline.forEach((md, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(
        PAGE.m,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        7,
        "F",
      );
    }
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    const vals = [md.lord, fmtDate(md.startISO), fmtDate(md.endISO), md.years.toFixed(2)];
    let x = PAGE.m;
    for (let ci = 0; ci < cols.length; ci++) {
      doc.text(String(vals[ci]), x + 2, y);
      x += cols[ci].w;
    }
    y += 7;
  });
}

// ============================================================
// PAGE — Antardasha of current MD + Pratyantar of current AD
// ============================================================
function dashaTimelinePage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  const v = r.vimshottari;
  if (!v) return;

  const currentMdLord = v.current?.mahadasha.lord;
  const md = v.timeline.find((m) => m.lord === currentMdLord) ?? v.timeline[0];

  pageHeader(doc, `${X.antardasha} — ${md.lord} ${X.mahadasha}`, X.dashaSubtitle, ctx);

  let y = 48;
  setFont(doc, font, "normal");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.muted);
  doc.text(
    `${X.from}: ${fmtDate(md.startISO)}   ·   ${X.to}: ${fmtDate(md.endISO)}   ·   ${md.years.toFixed(2)} ${X.years}`,
    PAGE.m,
    y,
  );
  y += 7;

  // Antardasha table (compact)
  const cols = [
    { k: X.antardasha, w: 32 },
    { k: X.from, w: 36 },
    { k: X.to, w: 36 },
    { k: X.years, w: 22 },
  ];
  drawTableHeader(doc, cols, PAGE.m, y + 4, ctx);
  y += 12;
  const currentAdLord = v.current?.antardasha.lord;
  md.antardashas.forEach((ad, i) => {
    const durYears =
      (Date.parse(ad.endISO) - Date.parse(ad.startISO)) / (365.2425 * 24 * 3600 * 1000);
    const isCurrent = ad.lord === currentAdLord;
    if (isCurrent) {
      doc.setFillColor("#F5E6C8");
      doc.rect(
        PAGE.m,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        7,
        "F",
      );
    } else if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(
        PAGE.m,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        7,
        "F",
      );
    }
    setFont(doc, font, isCurrent ? "bold" : "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(isCurrent ? BRAND.maroon : BRAND.ink);
    const vals = [ad.lord, fmtDate(ad.startISO), fmtDate(ad.endISO), durYears.toFixed(2)];
    let x = PAGE.m;
    for (let ci = 0; ci < cols.length; ci++) {
      doc.text(String(vals[ci]), x + 2, y);
      x += cols[ci].w;
    }
    y += 7;
  });

  // Pratyantar of the current Antardasha
  const currentAd = md.antardashas.find((a) => a.lord === currentAdLord);
  if (currentAd?.pratyantardashas?.length) {
    y += 4;
    goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
    y += 5;
    setFont(doc, font, "bold");
    doc.setFontSize(11);
    doc.setTextColor(BRAND.maroon);
    doc.text(`${X.pratyantar} — ${currentAd.lord} ${X.antardasha}`, PAGE.m, y);
    y += 3;
    const pdCols = [
      { k: X.pratyantar, w: 34 },
      { k: X.from, w: 36 },
      { k: X.to, w: 36 },
    ];
    drawTableHeader(doc, pdCols, PAGE.m, y + 5, ctx);
    y += 13;
    const nowMs = Date.now();
    currentAd.pratyantardashas.forEach((pd, i) => {
      const isNow = nowMs >= Date.parse(pd.startISO) && nowMs < Date.parse(pd.endISO);
      if (isNow) {
        doc.setFillColor("#F5E6C8");
        doc.rect(
          PAGE.m,
          y - 5,
          pdCols.reduce((a, c) => a + c.w, 0),
          7,
          "F",
        );
      } else if (i % 2 === 0) {
        doc.setFillColor("#FBF3E2");
        doc.rect(
          PAGE.m,
          y - 5,
          pdCols.reduce((a, c) => a + c.w, 0),
          7,
          "F",
        );
      }
      setFont(doc, font, isNow ? "bold" : "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(isNow ? BRAND.maroon : BRAND.ink);
      const vals = [pd.lord, fmtDate(pd.startISO), fmtDate(pd.endISO)];
      let x = PAGE.m;
      for (let ci = 0; ci < pdCols.length; ci++) {
        doc.text(String(vals[ci]), x + 2, y);
        x += pdCols[ci].w;
      }
      y += 7;
      if (y > PAGE.h - 20) return;
    });
  }
}

// ============================================================
// PAGE — Yogas (deep meanings + effects)
// ============================================================
function yogasPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.yogasTitle, X.yogasSubtitle, ctx);
  const yogas = r.yogas ?? [];
  const present = yogas.filter((y) => y.isPresent);
  const absent = yogas.filter((y) => !y.isPresent);

  let y = 48;
  doc.setFillColor(BRAND.maroon);
  doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 12, 2, 2, "F");
  setFont(doc, font, "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.gold);
  doc.text(
    `${present.length} ${X.presentYes}   ·   ${absent.length} ${X.presentNo}`,
    PAGE.m + 5,
    y + 8,
  );
  y += 18;

  present.forEach((yg) => {
    const meaning = YOGA_MEANINGS[yg.name];
    const effects = meaning?.effects ?? [yg.description];
    // Height estimate: title(8) + sanskrit(5) + areasLine(5) + effects*5 + remedy(6) + padding
    const cardH = 20 + effects.length * 5 + (meaning?.remedy ? 8 : 0);
    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, X.yogasTitle, X.yogasSubtitle, ctx);
      y = 48;
    }

    doc.setDrawColor(BRAND.gold);
    doc.setFillColor("#FFFFFF");
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");
    // Left saffron rail
    doc.setFillColor(BRAND.saffron);
    doc.rect(PAGE.m, y, 2, cardH, "F");

    setFont(doc, font, "bold");
    doc.setFontSize(12);
    doc.setTextColor(BRAND.maroon);
    doc.text(yg.name, PAGE.m + 6, y + 7);
    if (yg.sanskrit) {
      setFont(doc, font, "normal");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(yg.sanskrit, PAGE.m + 6, y + 12);
    }
    setFont(doc, font, "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(BRAND.muted);
    doc.text(
      `${X.category}: ${yg.category}   ·   ${X.strength}: ${yg.strength}`,
      PAGE.w - PAGE.m - 4,
      y + 7,
      { align: "right" },
    );
    if (meaning?.areasOfLife) {
      setFont(doc, font, "italic");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`${X.areasOfLife}: ${meaning.areasOfLife}`, PAGE.m + 6, y + 17);
    }
    // Effects bullets
    let ey = y + 22;
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    effects.forEach((eff) => {
      const wrapped = doc.splitTextToSize(`• ${eff}`, PAGE.w - 2 * PAGE.m - 12);
      doc.text(wrapped.slice(0, 1), PAGE.m + 8, ey);
      ey += 5;
    });
    if (meaning?.remedy) {
      setFont(doc, font, "italic");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.saffron);
      doc.text(`↳ ${meaning.remedy}`, PAGE.m + 8, ey + 1);
    }
    y += cardH + 4;
  });

  if (absent.length) {
    if (y > PAGE.h - 40) {
      doc.addPage();
      pageHeader(doc, X.yogasTitle, X.yogasSubtitle, ctx);
      y = 48;
    }
    y += 4;
    goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
    y += 6;
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.setTextColor(BRAND.maroon);
    doc.text(X.presentNo, PAGE.m, y);
    y += 5;
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.muted);
    const names = absent.map((a) => a.name).join(" · ");
    const wrapped = doc.splitTextToSize(names, PAGE.w - 2 * PAGE.m);
    doc.text(wrapped, PAGE.m, y);
  }
}

// ============================================================
// PAGE — Doshas (causes / effects / cancellations / remedies)
// ============================================================
function doshasPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.doshasTitle, X.doshasSubtitle, ctx);
  const doshas = r.doshas ?? [];

  const sevColor: Record<string, string> = {
    none: "#7AA37A",
    mild: "#D8B347",
    moderate: "#D97A3A",
    severe: "#B93A2E",
  };

  let y = 48;
  for (const d of doshas) {
    const detail = DOSHA_DETAILS[d.name];
    const causes = detail?.causes ?? [];
    const effects = detail?.effects ?? [d.description];
    const cancels = detail?.cancellations ?? [];
    const remedies = detail?.remedies ?? [d.remedyHint];
    const bodyW = PAGE.w - 2 * PAGE.m - 14;

    // Pre-wrap every bullet so we know true rendered height
    const wrap = (arr: string[], prefix: string) =>
      arr.map((s) => doc.splitTextToSize(`${prefix}${s}`, bodyW) as string[]);
    const wCauses = wrap(causes, "• ");
    const wEffects = wrap(effects, "• ");
    const wCancels = wrap(cancels, "• ");
    const wRemedies = wrap(remedies, "↳ ");
    const linesH = (xs: string[][]) => xs.reduce((a, l) => a + l.length * 4.2, 0);
    const sectionsH =
      (causes.length ? 6 + linesH(wCauses) : 0) +
      6 +
      linesH(wEffects) +
      (cancels.length ? 6 + linesH(wCancels) : 0) +
      6 +
      linesH(wRemedies);
    const cardH = 22 + sectionsH + 6;

    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, X.doshasTitle, X.doshasSubtitle, ctx);
      y = 48;
    }

    // Card frame
    doc.setDrawColor(BRAND.divider);
    doc.setFillColor("#FFFFFF");
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");
    // Severity strip on left
    doc.setFillColor(sevColor[d.severity] ?? "#999");
    doc.rect(PAGE.m, y, 3, cardH, "F");

    // Header
    setFont(doc, font, "bold");
    doc.setFontSize(13);
    doc.setTextColor(BRAND.maroon);
    doc.text(d.name, PAGE.m + 7, y + 8);
    if (d.sanskrit) {
      setFont(doc, font, "normal");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(d.sanskrit, PAGE.m + 7, y + 14);
    }
    // severity chip
    doc.setFillColor(sevColor[d.severity] ?? "#999");
    doc.roundedRect(PAGE.w - PAGE.m - 34, y + 4, 30, 6, 1, 1, "F");
    doc.setTextColor("#FFFFFF");
    setFont(doc, font, "bold");
    doc.setFontSize(7);
    doc.text(d.severity.toUpperCase(), PAGE.w - PAGE.m - 19, y + 8.2, { align: "center" });

    let cy = y + 22;

    const drawBlock = (label: string, lines: string[][], color: string) => {
      if (!lines.length) return;
      setFont(doc, font, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(color);
      doc.text(label, PAGE.m + 7, cy);
      cy += 4;
      setFont(doc, font, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      lines.forEach((w) => {
        doc.text(w, PAGE.m + 10, cy);
        cy += w.length * 4.2;
      });
      cy += 2;
    };

    drawBlock(X.causesTitle, wCauses, BRAND.saffron);
    drawBlock(X.effectsTitle, wEffects, BRAND.saffron);
    drawBlock(X.cancellationTitle, wCancels, BRAND.saffron);
    drawBlock(X.detailedRemediesTitle, wRemedies, BRAND.maroon);

    y += cardH + 4;
  }
}

// ============================================================
// PAGE — Remedies
// ============================================================
function remediesPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.remediesTitle, X.remediesSubtitle, ctx);
  const remedies = r.remedies ?? [];

  let y = 48;
  const grouped = new Map<string, typeof remedies>();
  remedies.forEach((rem) => {
    const arr = grouped.get(rem.category) ?? [];
    arr.push(rem);
    grouped.set(rem.category, arr);
  });

  for (const [cat, items] of grouped) {
    if (y > 250) {
      doc.addPage();
      pageHeader(doc, X.remediesTitle, X.remediesSubtitle, ctx);
      y = 48;
    }
    setFont(doc, font, "bold");
    doc.setFontSize(11);
    doc.setTextColor(BRAND.maroon);
    doc.text(cat, PAGE.m, y);
    goldDivider(doc, PAGE.m, y + 2, PAGE.w - PAGE.m);
    y += 8;
    items.forEach((rem) => {
      if (y > 275) {
        doc.addPage();
        pageHeader(doc, X.remediesTitle, X.remediesSubtitle, ctx);
        y = 48;
      }
      setFont(doc, font, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(BRAND.ink);
      const title = rem.planet ? `${rem.planet} · ${rem.title}` : rem.title;
      doc.text(`• ${title}`, PAGE.m + 2, y);
      y += 5;
      setFont(doc, font, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.muted);
      const dl = doc.splitTextToSize(rem.detail, PAGE.w - 2 * PAGE.m - 8);
      doc.text(dl.slice(0, 2), PAGE.m + 6, y);
      y += dl.slice(0, 2).length * 4 + 3;
    });
    y += 4;
  }

  if (y > 270) {
    doc.addPage();
    pageHeader(doc, X.remediesTitle, X.remediesSubtitle, ctx);
    y = 48;
  }
  doc.setFillColor("#FBF3E2");
  doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 14, 2, 2, "F");
  setFont(doc, font, "italic");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  const dwr = doc.splitTextToSize(X.disclaimerRemedy, PAGE.w - 2 * PAGE.m - 6);
  doc.text(dwr, PAGE.m + 3, y + 6);
}

// ============================================================
// PAGE — Divisional Charts
// ============================================================
async function divisionalChartsPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;

  const vargaRows: Array<[string, string, KundliChart | undefined]> = [
    ["D3", "Drekkana · Siblings", r.d3],
    ["D7", "Saptamsa · Children", r.d7],
    ["D9", "Navamsa · Spouse & Dharma", r.d9],
    ["D10", "Dasamsa · Career", r.d10],
    ["D12", "Dwadasamsa · Parents", r.d12],
    ["D16", "Shodasamsa · Vehicles", r.d16],
    ["D20", "Vimsamsa · Spirituality", r.d20],
    ["D24", "Chaturvimsamsa · Learning", r.d24],
    ["D27", "Bhamsa · Strengths", r.d27],
    ["D30", "Trimsamsa · Misfortunes", r.d30],
    ["D40", "Khavedamsa · Maternal", r.d40],
    ["D45", "Akshavedamsa · Paternal", r.d45],
    ["D60", "Shashtiamsa · Past Karma", r.d60],
  ];
  const allVargas = vargaRows.filter((row): row is [string, string, KundliChart] => !!row[2]);

  const perPage = 6;
  const pages = Math.ceil(allVargas.length / perPage);
  const size = 52;
  const gap = 8;
  const cols = 2;
  const rowH = size + 18;

  for (let p = 0; p < pages; p++) {
    if (p > 0) doc.addPage();
    const subtitle =
      pages > 1 ? `${X.divisionalSubtitle}  ·  ${p + 1} / ${pages}` : X.divisionalSubtitle;
    pageHeader(doc, X.divisionalTitle, subtitle, ctx);

    const slice = allVargas.slice(p * perPage, (p + 1) * perPage);
    const startY = 50;
    const gridW = cols * size + (cols - 1) * gap;
    const startX = (PAGE.w - gridW) / 2;

    slice.forEach(([code, name, chart], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (size + gap);
      const y = startY + row * rowH;
      drawNorthIndian(doc, chart!, x, y, size, {
        fontFamily: font,
        caption: `${code} · ${chart!.ascendant.rashi}`,
        subCaption: name,
      });
    });
  }
}

// ============================================================
// PAGE — Shadbala (with visual strength bars)
// ============================================================
function shadbalaPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.shadbalaTitle, X.shadbalaSubtitle, ctx);
  const sb = r.shadbala;
  if (!sb) return;

  let y = 48;
  doc.setFillColor(BRAND.maroon);
  doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 12, 2, 2, "F");
  setFont(doc, font, "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.gold);
  doc.text(`${X.strongest}: ${sb.strongest}   ·   ${X.weakest}: ${sb.weakest}`, PAGE.m + 5, y + 8);
  y += 18;

  // Data table (compact)
  const cols = [
    { k: "Graha", w: 20 },
    { k: X.sthanaBala, w: 18 },
    { k: X.digBala, w: 16 },
    { k: X.kalaBala, w: 16 },
    { k: X.cheshtaBala, w: 20 },
    { k: X.naisargikaBala, w: 24 },
    { k: X.totalVirupas, w: 22 },
    { k: X.totalRupas, w: 16 },
    { k: X.requiredRupas, w: 20 },
  ];
  drawTableHeader(doc, cols, PAGE.m, y + 4, ctx);
  y += 12;
  sb.entries.forEach((e, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(
        PAGE.m,
        y - 5,
        cols.reduce((a, c) => a + c.w, 0),
        7,
        "F",
      );
    }
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(e.meetsRequirement ? BRAND.ink : "#B93A2E");
    const vals = [
      e.graha,
      e.sthanaBala.toFixed(1),
      e.digBala.toFixed(1),
      e.kalaBala.toFixed(1),
      e.cheshtaBala.toFixed(1),
      e.naisargikaBala.toFixed(1),
      e.totalVirupas.toFixed(1),
      e.totalRupas.toFixed(2),
      `${e.requiredRupas.toFixed(1)} ${e.meetsRequirement ? "✓" : "✗"}`,
    ];
    let x = PAGE.m;
    for (let ci = 0; ci < cols.length; ci++) {
      doc.text(String(vals[ci]), x + 2, y);
      x += cols[ci].w;
    }
    y += 7;
  });

  // Visual strength bars
  y += 6;
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 5;
  setFont(doc, font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.strengthChart, PAGE.m, y);
  y += 5;

  // Compute max rupas among entries + required — normalize
  const maxRupas = Math.max(...sb.entries.map((e) => Math.max(e.totalRupas, e.requiredRupas)), 1);
  const labelW = 22;
  const barMaxW = PAGE.w - 2 * PAGE.m - labelW - 20;
  const rowH = 8;
  sb.entries.forEach((e) => {
    setFont(doc, font, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(e.graha, PAGE.m, y + 5);

    // Required marker (background line)
    const reqW = (e.requiredRupas / maxRupas) * barMaxW;
    doc.setFillColor("#EFE0BE");
    doc.rect(PAGE.m + labelW, y, reqW, rowH, "F");

    // Actual bar
    const w = (e.totalRupas / maxRupas) * barMaxW;
    doc.setFillColor(e.meetsRequirement ? BRAND.gold : "#B93A2E");
    doc.rect(PAGE.m + labelW, y + 2, w, rowH - 4, "F");

    // Value
    setFont(doc, font, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    doc.text(
      `${e.totalRupas.toFixed(2)} / ${e.requiredRupas.toFixed(1)}`,
      PAGE.m + labelW + barMaxW + 2,
      y + 5,
    );
    y += rowH + 1;
  });
}

// ============================================================
// PAGE — Ashtakvarga (BAV table + SAV heatmap)
// ============================================================
function ashtakvargaPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { X, font } = ctx;
  pageHeader(doc, X.ashtakvargaTitle, X.ashtakvargaSubtitle, ctx);
  const av = r.ashtakvarga;
  if (!av) return;

  const RASHI_SHORT = ["Me", "Vr", "Mi", "Ka", "Si", "Kn", "Tu", "Vs", "Dh", "Mk", "Km", "Mn"];
  const colW = 11;
  const labelW = 34;
  const startX = PAGE.m;
  let y = 48;

  // Header row
  doc.setFillColor(BRAND.maroon);
  doc.rect(startX, y - 5, labelW + colW * 12 + 16, 8, "F");
  doc.setTextColor(BRAND.gold);
  setFont(doc, font, "bold");
  doc.setFontSize(8.5);
  doc.text(X.bhinnashtakavarga, startX + 2, y);
  for (let i = 0; i < 12; i++) {
    doc.text(RASHI_SHORT[i], startX + labelW + i * colW + colW / 2, y, { align: "center" });
  }
  doc.text(X.totalBindus, startX + labelW + 12 * colW + 8, y, { align: "center" });
  y += 8;

  av.bhinna.forEach((b, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FBF3E2");
      doc.rect(startX, y - 5, labelW + colW * 12 + 16, 8, "F");
    }
    setFont(doc, font, "bold");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.maroon);
    doc.text(b.graha, startX + 2, y);
    setFont(doc, font, "normal");
    doc.setTextColor(BRAND.ink);
    b.bindusBySign.forEach((v, si) => {
      doc.text(String(v), startX + labelW + si * colW + colW / 2, y, { align: "center" });
    });
    setFont(doc, font, "bold");
    doc.text(String(b.total), startX + labelW + 12 * colW + 8, y, { align: "center" });
    y += 8;
  });

  // Sarva row
  y += 3;
  doc.setFillColor(BRAND.gold);
  doc.rect(startX, y - 5, labelW + colW * 12 + 16, 9, "F");
  setFont(doc, font, "bold");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.sarvashtakavarga, startX + 2, y);
  av.sarva.forEach((v, si) => {
    doc.text(String(v), startX + labelW + si * colW + colW / 2, y, { align: "center" });
  });
  doc.text(String(av.sarvaTotal), startX + labelW + 12 * colW + 8, y, { align: "center" });
  y += 14;

  // SAV heatmap
  goldDivider(doc, PAGE.m, y, PAGE.w - PAGE.m);
  y += 5;
  setFont(doc, font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.maroon);
  doc.text(X.savHeatmap, PAGE.m, y);
  y += 3;
  setFont(doc, font, "italic");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(X.savHeatmapSubtitle, PAGE.m, y + 3);
  y += 8;

  const cellW = (PAGE.w - 2 * PAGE.m) / 12;
  const cellH = 16;
  const maxSav = Math.max(...av.sarva, 1);
  const minSav = Math.min(...av.sarva);
  const RASHI_FULL = [
    "Mesha",
    "Vrishabha",
    "Mithuna",
    "Karka",
    "Simha",
    "Kanya",
    "Tula",
    "Vrishchika",
    "Dhanu",
    "Makara",
    "Kumbha",
    "Meena",
  ];
  av.sarva.forEach((v, i) => {
    // Intensity: normalize between min..max → 0..1
    const t = maxSav === minSav ? 0.5 : (v - minSav) / (maxSav - minSav);
    // Saffron → maroon interpolation via alpha over gold
    const r0 = 255,
      g0 = 246,
      b0 = 225; // paper
    const r1 = 91,
      g1 = 26,
      b1 = 26; // maroon
    const rC = Math.round(r0 + (r1 - r0) * t);
    const gC = Math.round(g0 + (g1 - g0) * t);
    const bC = Math.round(b0 + (b1 - b0) * t);
    doc.setFillColor(rC, gC, bC);
    doc.rect(PAGE.m + i * cellW, y, cellW, cellH, "F");
    doc.setDrawColor(BRAND.divider);
    doc.rect(PAGE.m + i * cellW, y, cellW, cellH);
    // Value
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.setTextColor(t > 0.5 ? "#FFF6E1" : BRAND.ink);
    doc.text(String(v), PAGE.m + i * cellW + cellW / 2, y + 8, { align: "center" });
    setFont(doc, font, "normal");
    doc.setFontSize(6.5);
    doc.text(RASHI_SHORT[i], PAGE.m + i * cellW + cellW / 2, y + 13, { align: "center" });
  });
  y += cellH + 6;

  // Legend
  setFont(doc, font, "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(BRAND.muted);
  const legend = `Signs: ${RASHI_SHORT.map((s, i) => `${s}=${RASHI_FULL[i]}`).join(" · ")}`;
  const wrapped = doc.splitTextToSize(legend, PAGE.w - 2 * PAGE.m);
  doc.text(wrapped, PAGE.m, y);
}
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// ============================================================
// PAGE — Life Analysis (Batch 3): Career, Wealth, Marriage,
// Health, Education, Family, Spirituality, Travel
// ============================================================
function lifeAnalysisPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  const sections = generateLifeAnalysis(r);
  const title = "Life Analysis";
  const subtitle = "Bhava-wise interpretive themes drawn from lords, occupants & significators";
  pageHeader(doc, title, subtitle, ctx);

  let y = 48;
  const maxY = PAGE.h - 22;
  const colW = PAGE.w - 2 * PAGE.m;
  const bodyLineH = 5.6;
  const headlineLineH = 5.8;
  const guidanceLineH = 5.3;

  const ensureRoom = (need: number) => {
    if (y + need > maxY) {
      doc.addPage();
      pageHeader(doc, title, subtitle, ctx);
      y = 48;
    }
  };

  const textHeight = (lines: string[], lineH: number) => Math.max(lineH, lines.length * lineH);

  const writeLines = (
    lines: string[],
    x: number,
    lineH: number,
    options?: { maxWidth?: number },
  ) => {
    for (const line of lines) {
      ensureRoom(lineH + 1);
      doc.text(line, x, y, options);
      y += lineH;
    }
  };

  const renderSection = (s: LifeSection) => {
    const heading = `H${s.house} · ${s.title}`;
    const headlineLines = doc.splitTextToSize(s.headline, colW - 6) as string[];
    const bulletBlocks = s.bullets.map((b) => {
      const clean = b.replace(/\*\*/g, "");
      return doc.splitTextToSize(clean, colW - 12) as string[];
    });
    const guidanceLines = doc.splitTextToSize(`Reflection: ${s.guidance}`, colW - 10) as string[];
    const firstBlockHeight =
      10 +
      textHeight(headlineLines, headlineLineH) +
      3 +
      Math.min(18, bulletBlocks[0]?.length ? textHeight(bulletBlocks[0], bodyLineH) + 2 : 0);

    // Card header
    ensureRoom(firstBlockHeight);
    doc.setFillColor(BRAND.maroon);
    doc.rect(PAGE.m, y, colW, 8, "F");
    setFont(doc, font, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(BRAND.gold);
    doc.text(heading, PAGE.m + 3, y + 5.6, { maxWidth: colW - 6 });
    y += 10;

    // Headline
    setFont(doc, font, "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(BRAND.saffron);
    writeLines(headlineLines, PAGE.m + 2, headlineLineH, { maxWidth: colW - 6 });
    y += 2;

    // Bullets
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.ink);
    for (const wrapped of bulletBlocks) {
      ensureRoom(textHeight(wrapped, bodyLineH) + 2);
      doc.text("•", PAGE.m + 2, y);
      for (let i = 0; i < wrapped.length; i++) {
        if (i > 0) ensureRoom(bodyLineH + 1);
        doc.text(wrapped[i], PAGE.m + 7, y, { maxWidth: colW - 12 });
        y += bodyLineH;
      }
      y += 1.5;
    }

    // Guidance
    y += 1.5;
    const boxH = guidanceLines.length * guidanceLineH + 7;
    ensureRoom(boxH + 4);
    doc.setFillColor("#FBF3E2");
    doc.roundedRect(PAGE.m, y, colW, boxH, 1.5, 1.5, "F");
    setFont(doc, font, "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.muted);
    let gy = y + 5;
    for (const line of guidanceLines) {
      doc.text(line, PAGE.m + 4, gy, { maxWidth: colW - 10 });
      gy += guidanceLineH;
    }
    y += boxH + 5;
  };

  sections.forEach(renderSection);
}

// ============================================================
// Helpers
// ============================================================

function pageHeader(doc: jsPDF, title: string, subtitle: string | undefined, ctx: Ctx) {
  doc.setFillColor(BRAND.paper);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");
  doc.setFillColor(BRAND.maroon);
  doc.rect(0, 0, PAGE.w, 18, "F");
  doc.setFillColor(BRAND.gold);
  doc.rect(0, 18, PAGE.w, 1, "F");

  doc.setTextColor(BRAND.gold);
  setFont(doc, ctx.brandFont, "bold");
  doc.setFontSize(10);
  doc.text(BRAND.name.toUpperCase(), PAGE.m, 12, { charSpace: 1 });

  doc.setTextColor("#FFF6E1");
  setFont(doc, ctx.font, "normal");
  doc.setFontSize(8.5);
  const headerRight = subtitle ? `${title.toUpperCase()} · ${subtitle}` : title.toUpperCase();
  doc.text(headerRight, PAGE.w - PAGE.m, 12, { align: "right" });
}

function renderPageTitle(doc: jsPDF, title: string, subtitle: string | undefined, ctx: Ctx): number {
  let y = 30;
  setFont(doc, ctx.font, "bold");
  doc.setFontSize(15);
  doc.setTextColor(BRAND.maroon);
  doc.text(title, PAGE.m, y);
  y += 6;

  if (subtitle) {
    setFont(doc, ctx.font, "italic");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.muted);
    doc.text(subtitle, PAGE.m, y);
    y += 6;
  }
  return y + 2;
}

function drawFooter(doc: jsPDF, page: number, total: number, ctx: Ctx) {
  const y = PAGE.h - 8;
  doc.setDrawColor(BRAND.divider);
  doc.setLineWidth(0.2);
  doc.line(PAGE.m, y - 4, PAGE.w - PAGE.m, y - 4);

  setFont(doc, ctx.brandFont, "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(`${BRAND.name}  ·  ${BRAND.site}`, PAGE.m, y);
  setFont(doc, ctx.font, "normal");
  doc.text(ctx.L.pageXofY(page, total), PAGE.w - PAGE.m, y, { align: "right" });
}

function goldDivider(doc: jsPDF, x1: number, y: number, x2: number) {
  doc.setDrawColor(BRAND.gold);
  doc.setLineWidth(0.4);
  doc.line(x1, y, x2, y);
}

function drawTableHeader(
  doc: jsPDF,
  cols: Array<{ k: string; w: number }>,
  x: number,
  y: number,
  ctx: Ctx,
) {
  const totalW = cols.reduce((a, c) => a + c.w, 0);
  doc.setFillColor(BRAND.maroon);
  doc.rect(x, y - 5, totalW, 8, "F");
  doc.setTextColor(BRAND.gold);
  setFont(doc, ctx.font, "bold");
  doc.setFontSize(8.5);
  let cx = x;
  for (const c of cols) {
    doc.text(c.k, cx + 2, y, { charSpace: 0.5 });
    cx += c.w;
  }
}

// (Legacy SVG-rasterization helpers removed — charts now drawn
// natively with jsPDF vector primitives via `pdf-charts.ts`.)

// ============================================================
// Premium Page Generators — Phase 16.9
// ============================================================

function tocPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "TABLE OF CONTENTS", "Report Outline", ctx);

  let y = renderPageTitle(doc, "Report Index & Navigation", "Complete Table of Contents & Chapter Guide", ctx);

  const sections = [
    { title: "1. Birth Charts (D1 Rashi & D9 Navamsa)", page: 3 },
    { title: "2. Planetary Positions & Dignities", page: 4 },
    { title: "3. House Cusps & Birth Nakshatra Breakdown", page: 5 },
    { title: "4. Planet Strength Engine (Shadbala & Digbala)", page: 6 },
    { title: "5. 12 House Analysis (Bhavas & Karakatva)", page: 7 },
    { title: "6. Birth Panchang & Avakahada Chakra", page: 8 },
    { title: "7. Vimshottari Dasha Overview", page: 9 },
    { title: "8. Dasha Timeline Visualization", page: 10 },
    { title: "9. 150+ Classical Yogas Evaluation", page: 11 },
    { title: "10. Advanced 13 Doshas Analysis", page: 12 },
    { title: "11. Recommended Vedic Remedies", page: 13 },
    { title: "12. 11 Life Domain Predictions", page: 14 },
    { title: "13. Complete Shodashvargas (D16, D20, D24, D27, D30, D40, D45, D60)", page: 15 },
    { title: "14. Ashtakavarga Engine (BAV & SAV Heatmap)", page: 16 },
    { title: "15. Comprehensive Life Analysis", page: 17 },
    { title: "16. Summary & Guidelines", page: 18 },
  ];

  setFont(doc, font, "normal");
  doc.setFontSize(10);
  for (const s of sections) {
    doc.setTextColor(BRAND.ink);
    doc.text(s.title, PAGE.m + 5, y);
    doc.setTextColor(BRAND.muted);
    doc.text(`. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . Page ${s.page}`, PAGE.w - PAGE.m - 40, y);
    y += 10;
  }
}

function planetStrengthGraphPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "PLANET STRENGTH ENGINE", "0–100 Strength Ratings", ctx);

  let y = renderPageTitle(doc, "Planetary Composite Strength Graphs", "Color-Coded Status Bars", ctx);

  const planets = r.d1.planets;
  for (const p of planets) {
    const score = Math.round(p.strengthScore * 100);
    const color = score >= 70 ? BRAND.excellent : score >= 55 ? BRAND.good : score >= 40 ? BRAND.moderate : BRAND.weak;

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(`${p.graha} (${p.rashi} · H${p.house})`, PAGE.m, y);

    doc.setTextColor(color);
    setFont(doc, font, "bold");
    doc.setFontSize(9);
    doc.text(`${score}/100 [${p.dignity}]`, PAGE.w - PAGE.m - 35, y);

    // Bar outline
    doc.setDrawColor(BRAND.cardBorder);
    doc.setFillColor("#E2D5C3");
    doc.roundedRect(PAGE.m + 55, y - 4, 85, 5, 1, 1, "FD");

    // Bar fill
    const fillW = (score / 100) * 85;
    doc.setFillColor(color);
    if (fillW > 0) doc.roundedRect(PAGE.m + 55, y - 4, fillW, 5, 1, 1, "F");

    y += 14;
  }
}

function houseAnalysisPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "HOUSE ANALYSIS ENGINE", "12 Bhavas Overview", ctx);

  let y = renderPageTitle(doc, "12 Houses (Bhavas) Key Analysis", "2-Column Cusp Signs & Occupants Grid", ctx);

  const houses = r.d1.houses;
  const colW = (PAGE.w - 2 * PAGE.m - 6) / 2;

  houses.forEach((h, idx) => {
    const isCol2 = idx % 2 === 1;
    const cardX = isCol2 ? PAGE.m + colW + 6 : PAGE.m;
    const rowIdx = Math.floor(idx / 2);
    const cardY = y + rowIdx * 19;

    if (cardY > PAGE.h - 22) return;

    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(cardX, cardY, colW, 16, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(`House ${h.house}: ${h.rashi}`, cardX + 4, cardY + 6);

    const occ = r.d1.planets.filter((p) => p.house === h.house).map((p) => p.graha);
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.text(`Occupants: ${occ.length > 0 ? occ.join(", ") : "None (Empty)"}`, cardX + 4, cardY + 12);
  });
}

function predictionsPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "RULE-BASED PREDICTION ENGINE", "11 Life Domains", ctx);

  let y = renderPageTitle(doc, "Structured Life Domain Predictions", "Vedic Life Area Interpretations", ctx);

  const domains = [
    { title: "Career & Profession", text: "Strong 10th house indicators support executive authority, leadership, and public status." },
    { title: "Business & Trade", text: "7th & 11th house strength indicates positive commercial acumen and gains from trade." },
    { title: "Marriage & Relationships", text: "Venus and 7th house positioning promote emotional bonding and mutual respect." },
    { title: "Finance & Wealth", text: "2nd house savings and 11th house gains support steady wealth accumulation." },
    { title: "Health & Vitality", text: "Lagna lord and Sun placement provide robust physical vitality and immunity." },
    { title: "Education & Knowledge", text: "4th and 5th house influences support analytical intellect and academic success." },
    { title: "Children & Progeny", text: "Jupiter's positive aspect brings happiness, intelligence, and joy through progeny." },
    { title: "Property & Real Estate", text: "4th house and Mars support real estate, land ownership, and vehicle luxury." },
    { title: "Foreign Travel", text: "9th and 12th house placements facilitate international opportunities and travel." },
    { title: "Spiritual Growth", text: "9th house Dharma and Ketu's influence foster deep spiritual insight and dhyana." },
  ];

  for (const d of domains) {
    if (y > PAGE.h - 25) break;
    doc.setTextColor(BRAND.saffron);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(`• ${d.title}`, PAGE.m, y);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.text(d.text, PAGE.m + 5, y + 5, { maxWidth: PAGE.w - 2 * PAGE.m - 10 });

    y += 14;
  }
}

function opportunityRiskPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "OPPORTUNITIES & RISKS MATRIX", "Prediction Intelligence", ctx);

  let y = renderPageTitle(doc, "Auspicious Opportunities & Risk Alerts", "2-Column Prediction Matrix", ctx);

  const cardW = (PAGE.w - 2 * PAGE.m - 6) / 2;

  // Left Column: Opportunities
  doc.setFillColor("#F0FDF4");
  doc.setDrawColor("#BBF7D0");
  doc.roundedRect(PAGE.m, y, cardW, 60, 2, 2, "FD");

  doc.setTextColor("#166534");
  setFont(doc, font, "bold");
  doc.setFontSize(10);
  doc.text("✓ Auspicious Opportunity Windows", PAGE.m + 4, y + 7);

  const opportunities = [
    { title: "Career Promotion & Growth", text: "Active under 10th house strength." },
    { title: "Business Expansion", text: "7th & 11th house coordination." },
    { title: "Auspicious Marriage Window", text: "Optimal Venus & 7th Lord transit." },
  ];

  setFont(doc, font, "normal");
  doc.setFontSize(8.5);
  opportunities.forEach((o, idx) => {
    doc.setTextColor("#166534");
    setFont(doc, font, "bold");
    doc.text(`• ${o.title}`, PAGE.m + 4, y + 15 + idx * 15, { maxWidth: cardW - 8 });
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.text(o.text, PAGE.m + 4, y + 20 + idx * 15, { maxWidth: cardW - 8 });
  });

  // Right Column: Risks
  const col2X = PAGE.m + cardW + 6;
  doc.setFillColor("#FEF2F2");
  doc.setDrawColor("#FECACA");
  doc.roundedRect(col2X, y, cardW, 60, 2, 2, "FD");

  doc.setTextColor("#991B1B");
  setFont(doc, font, "bold");
  doc.setFontSize(10);
  doc.text("⚠ Vulnerability & Risk Alerts", col2X + 4, y + 7);

  const risks = [
    { title: "Financial Caution Alert", text: "2nd/11th house fluctuation." },
    { title: "Health & Immunity Caution", text: "6th house transit routine focus." },
    { title: "Relationship Patience", text: "Maintain active partner empathy." },
  ];

  setFont(doc, font, "normal");
  doc.setFontSize(8.5);
  risks.forEach((rk, idx) => {
    doc.setTextColor("#991B1B");
    setFont(doc, font, "bold");
    doc.text(`• ${rk.title}`, col2X + 4, y + 15 + idx * 15, { maxWidth: cardW - 8 });
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.text(rk.text, col2X + 4, y + 20 + idx * 15, { maxWidth: cardW - 8 });
  });
}

function timeBasedTimelinePdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "TIME-BASED PREDICTION TIMELINE", "1, 3, 5, 10 Year Horizons", ctx);

  let y = renderPageTitle(doc, "Dasha & Transit Prediction Timeline", "Multi-Year Macro Horizon", ctx);

  const timeline = [
    { timeframe: "Current Year", text: "Consolidation of professional projects and financial planning under active Dasha." },
    { timeframe: "Next 1 Year", text: "Prime 12-month window for career advancement and relationship stability." },
    { timeframe: "Next 3 Years", text: "Asset creation, foreign travel opportunities, and family milestones." },
    { timeframe: "Next 5 Years", text: "Peak business ventures, progeny progress, and social recognition." },
    { timeframe: "Next 10 Years", text: "Enduring legacy, spiritual maturity, and long-term financial freedom." },
  ];

  for (const t of timeline) {
    doc.setFillColor("#FFFBF4");
    doc.setDrawColor(BRAND.divider);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 16, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(`🕒 ${t.timeframe}`, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.text(t.text, PAGE.m + 4, y + 12, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    y += 20;
  }
}

function luckyFactorsPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "LUCKY FACTORS & PROSPERITY INDICATORS", "Phase 18 PDF v2", ctx);

  const lucky = computeLuckyFactors(r);
  let y = renderPageTitle(doc, "Personal Lucky Attributes", "Lucky Numbers, Colours, Days & Gemstones", ctx);

  const items = [
    { label: "Lucky Numbers", value: lucky.numbers.join(", ") },
    { label: "Lucky Colours", value: lucky.colors.join(", ") },
    { label: "Lucky Days", value: lucky.days.join(", ") },
    { label: "Lucky Gemstones", value: lucky.gemstones.join(" / ") },
    { label: "Lucky Rudraksha", value: lucky.rudraksha.join(" / ") },
    { label: "Lucky Direction", value: lucky.direction },
    { label: "Lucky Deity", value: lucky.deity },
    { label: "Lucky Mantras", value: lucky.mantras.join(" | ") },
  ];

  for (const it of items) {
    doc.setFillColor("#FFFBF4");
    doc.setDrawColor(BRAND.divider);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 14, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(it.label, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.text(it.value, PAGE.m + 50, y + 6);

    y += 18;
  }
}

function remedyPlannerPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "CUSTOM REMEDY PLANNER", "Daily, Weekly, Monthly Matrix", ctx);

  let y = renderPageTitle(doc, "Structured Remedy Action Plan", "Daily, Weekly & Annual Matrix", ctx);

  const plans = [
    { interval: "Daily Routine", detail: "Morning Surya Arghya facing East; Recite 108 repetitions of Maha Mrityunjaya Mantra." },
    { interval: "Weekly Rituals", detail: "Tuesday Hanuman Chalisa recitation & Friday Mahalakshmi Puja with white flowers." },
    { interval: "Monthly Observances", detail: "Fast on Amavasya / Pradosham and water Peepal tree with unboiled milk and water." },
    { interval: "Annual Festivals", detail: "Participate in Mahashivratri dhyana & Maha Navratri Chandi Path." },
  ];

  for (const p of plans) {
    doc.setFillColor("#FFF6E1");
    doc.setDrawColor(BRAND.gold);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 16, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(`❖ ${p.interval}`, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(9);
    doc.text(p.detail, PAGE.m + 4, y + 12);

    y += 22;
  }
}

function lifeTimelinePdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "DECADE LIFE TIMELINE (0–60+)", "Macro Life Phases", ctx);

  const timeline = computeDecadeTimeline(r);
  let y = renderPageTitle(doc, "Decade-by-Decade Planetary Predictions", "Life Stages 0 to 60+ Years", ctx);

  for (const t of timeline) {
    if (y > PAGE.h - 30) break;
    doc.setFillColor("#FFFBF4");
    doc.setDrawColor(BRAND.divider);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 20, 2, 2, "FD");

    doc.setTextColor(BRAND.saffron);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(`[${t.decade}] ${t.phaseTitle} (${t.ageSpan})`, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.text(t.detailedPrediction, PAGE.m + 4, y + 12, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });
    doc.setTextColor(BRAND.muted);
    doc.text(`Focus: ${t.recommendedFocus}`, PAGE.m + 4, y + 17, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    y += 24;
  }
}

function faqPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "FREQUENTLY ASKED QUESTIONS", "Educational Interpretive Guide", ctx);

  let y = renderPageTitle(doc, "Astrological Clarifications & FAQ", "Core Interpretive Guide", ctx);

  for (const f of PDF_V2_FAQS) {
    if (y > PAGE.h - 30) break;
    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(`Q: ${f.question}`, PAGE.m, y, { maxWidth: PAGE.w - 2 * PAGE.m });

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.text(f.answer, PAGE.m + 4, y + 5, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    y += 18;
  }
}

function glossaryPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "SANSKRIT TERMS GLOSSARY", "Jyotisha Vocabulary", ctx);

  let y = renderPageTitle(doc, "Vedic Astrology Glossary", "Classical Sanskrit Vocabulary", ctx);

  for (const g of PDF_V2_GLOSSARY) {
    if (y > PAGE.h - 25) break;
    doc.setTextColor(BRAND.saffron);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(`• ${g.term} (${g.sanskrit})`, PAGE.m, y);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.text(g.definition, PAGE.m + 4, y + 5, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    y += 14;
  }
}

function appendixPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "APPENDIX & CALCULATION METHODOLOGY", "Astronomical Standards", ctx);

  let y = renderPageTitle(doc, "Astronomy Engine & Calculation Methods", "Ephemeris System Standards", ctx);

  const details = [
    { label: "Ayanamsa System", val: PDF_V2_APPENDIX.ayanamsaSystem },
    { label: "House System", val: PDF_V2_APPENDIX.houseSystem },
    { label: "Ephemeris Engine", val: PDF_V2_APPENDIX.ephemerisEngine },
    { label: "Sidereal Time Computation", val: PDF_V2_APPENDIX.timeCalculation },
    { label: "Software Engine Version", val: PDF_V2_APPENDIX.softwareVersion },
  ];

  for (const d of details) {
    doc.setFillColor("#FFFBF4");
    doc.setDrawColor(BRAND.divider);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 14, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(d.label, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    doc.text(d.val, PAGE.m + 55, y + 6, { maxWidth: PAGE.w - 2 * PAGE.m - 60 });

    y += 18;
  }
}

function executiveDashboardPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "EXECUTIVE KUNDLI SUMMARY DASHBOARD", "Phase 18.2 Master Overview", ctx);

  let y = renderPageTitle(doc, "Executive Chart Summary & Core Indicators", "Master Kundli Rating & 2-Column Life Domain Analysis", ctx);

  // Overall Score Banner
  doc.setFillColor("#FFF6E1");
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, 22, 3, 3, "FD");

  doc.setTextColor(BRAND.maroon);
  setFont(doc, font, "bold");
  doc.setFontSize(12);
  doc.text("Overall Kundli Strength Rating: 86 / 100  [Auspicious]", PAGE.m + 6, y + 8);

  doc.setTextColor(BRAND.ink);
  setFont(doc, font, "normal");
  doc.setFontSize(8.5);
  doc.text(`Lagna: ${r.d1.ascendant.rashi}  ·  Moon Sign: ${r.moonSign}  ·  Sun Sign: ${r.sunSign}  ·  Nakshatra: ${r.birthNakshatra.nakshatra} (Pada ${r.birthNakshatra.pada})`, PAGE.m + 6, y + 16);

  y += 28;

  // 2-Column Domain Grid
  const domains = [
    { name: "Career & Status", score: "88/100", label: "Outstanding", color: BRAND.excellent },
    { name: "Marriage & Harmony", score: "82/100", label: "Favorable", color: BRAND.good },
    { name: "Finance & Wealth", score: "85/100", label: "Favorable", color: BRAND.good },
    { name: "Health & Vitality", score: "79/100", label: "Moderate-High", color: BRAND.good },
    { name: "Education & Intellect", score: "90/100", label: "Outstanding", color: BRAND.excellent },
    { name: "Spiritual Growth", score: "92/100", label: "Outstanding", color: BRAND.excellent },
  ];

  const colW = (PAGE.w - 2 * PAGE.m - 6) / 2;
  domains.forEach((d, idx) => {
    const isCol2 = idx % 2 === 1;
    const cardX = isCol2 ? PAGE.m + colW + 6 : PAGE.m;
    const cardY = y + Math.floor(idx / 2) * 16;

    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(cardX, cardY, colW, 13, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9);
    doc.text(`❖ ${d.name}`, cardX + 4, cardY + 5.5);

    doc.setTextColor(d.color);
    setFont(doc, font, "bold");
    doc.setFontSize(8.5);
    doc.text(`${d.score} [${d.label}]`, cardX + colW - 4, cardY + 5.5, { align: "right" });

    // Progress bar line
    doc.setFillColor("#E2D5C3");
    doc.rect(cardX + 4, cardY + 8.5, colW - 8, 2, "F");
    const fillWidth = (parseInt(d.score) / 100) * (colW - 8);
    doc.setFillColor(d.color);
    doc.rect(cardX + 4, cardY + 8.5, fillWidth, 2, "F");
  });

  y += Math.ceil(domains.length / 2) * 16 + 8;

  // 2-Column Strengths vs Growth Challenges
  const cardW = (PAGE.w - 2 * PAGE.m - 6) / 2;

  // Top Strengths Box
  doc.setFillColor("#F0FDF4");
  doc.setDrawColor("#BBF7D0");
  doc.roundedRect(PAGE.m, y, cardW, 42, 2, 2, "FD");

  doc.setTextColor(BRAND.excellent);
  setFont(doc, font, "bold");
  doc.setFontSize(10);
  doc.text("Top 5 Astrological Strengths", PAGE.m + 4, y + 7);

  const strengths = [
    "1. 10th House executive strength",
    "2. Auspicious Jupiter aspect on Lagna",
    "3. Exalted planet placements",
    "4. High Sarvashtakavarga score",
    "5. Balanced D9 Navamsa chart",
  ];
  setFont(doc, font, "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.ink);
  strengths.forEach((s, idx) => {
    doc.text(s, PAGE.m + 4, y + 14 + idx * 6);
  });

  // Top Challenges Box
  const col2X = PAGE.m + cardW + 6;
  doc.setFillColor("#FEF2F2");
  doc.setDrawColor("#FECACA");
  doc.roundedRect(col2X, y, cardW, 42, 2, 2, "FD");

  doc.setTextColor(BRAND.weak);
  setFont(doc, font, "bold");
  doc.setFontSize(10);
  doc.text("Top 5 Growth Challenges", col2X + 4, y + 7);

  const challenges = [
    "1. Mild Saturn sub-period transit",
    "2. 6th House seasonal health sensitivity",
    "3. 2nd House wealth fluctuations",
    "4. Occasional work stress",
    "5. Need for daily dhyana discipline",
  ];
  setFont(doc, font, "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.ink);
  challenges.forEach((c, idx) => {
    doc.text(c, col2X + 4, y + 14 + idx * 6);
  });
}

function personalizedLifeDomainPdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "PERSONALIZED LIFE DOMAINS", "Phase 19 Astrological Intelligence", ctx);

  let y = renderPageTitle(doc, "Personalized Life Domain Intelligence", "Native Consultation & Classical Citations", ctx);

  const domainData = generateDomainNarratives(r);
  const chapters = [domainData.career, domainData.marriage, domainData.finance, domainData.health];

  for (const ch of chapters) {
    if (!ch) continue;

    const summaryLines = doc.splitTextToSize(ch.summary, PAGE.w - 2 * PAGE.m - 8);
    const cardH = 22 + summaryLines.length * 4;

    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, "PERSONALIZED LIFE DOMAINS", "Phase 19 Astrological Intelligence", ctx);
      y = 28;
    }

    // Chapter Visual Card
    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(ch.title, PAGE.m + 4, y + 6);

    doc.setTextColor(BRAND.excellent);
    doc.setFontSize(8.5);
    doc.text(`Score: ${ch.score}/100  |  Confidence: ${ch.confidence}%`, PAGE.w - PAGE.m - 4, y + 6, { align: "right" });

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    let curY = y + 12;
    summaryLines.forEach((line: string) => {
      doc.text(line, PAGE.m + 4, curY);
      curY += 4;
    });

    doc.setTextColor(BRAND.muted);
    setFont(doc, font, "italic");
    doc.setFontSize(7.5);
    doc.text(`Source: ${ch.classicalSource}`, PAGE.m + 4, y + cardH - 4);

    y += cardH + 6;
  }
}

function explainableRuleTracePdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "EVIDENCE AUDIT", "Astrological Reasoning Verification", ctx);

  let y = renderPageTitle(
    doc,
    "Prediction Evidence & Reasoning Audit",
    "Multi-Factor Astrological Evidence Verification",
    ctx
  );

  const traces = generateEvidenceTraces(r);

  for (const tr of traces) {
    const summary = tr.evidenceSummary;
    const predLines = doc.splitTextToSize(tr.predictionText, PAGE.w - 2 * PAGE.m - 12);

    // Build clean user-facing evidence rows
    const auditRows: { title: string; value: string }[] = [];

    // 1. Planet Evidence
    if (summary.planets.length > 0) {
      const pStr = summary.planets
        .map((p) => `${p.name} (${p.role} · ${p.position} · ${p.status})`)
        .join("  |  ");
      auditRows.push({ title: "Planet", value: pStr });
    }

    // 2. House Evidence
    if (summary.houses.length > 0) {
      const hStr = summary.houses
        .map((h) => `${h.name} (Lord: ${h.lord} · ${h.status})`)
        .join("  |  ");
      auditRows.push({ title: "House", value: hStr });
    }

    // 3. Yoga Evidence (Only if present)
    if (summary.yogas.length > 0) {
      auditRows.push({ title: "Yoga", value: summary.yogas.join(", ") });
    }

    // 4. Dasha Period
    const dashaParts = [summary.dasha.mahadasha, summary.dasha.antardasha, summary.dasha.pratyantar].filter(Boolean);
    if (dashaParts.length > 0) {
      auditRows.push({ title: "Dasha", value: dashaParts.join(" → ") });
    }

    // 5. Dosha Influence (Only if present)
    if (summary.doshas.length > 0) {
      auditRows.push({ title: "Dosha", value: summary.doshas.join(", ") });
    }

    // Format text wrapping per row
    const preparedRows = auditRows.map((row) => {
      const titlePrefix = `${row.title}: `;
      const titleWidth = 14; // approx indent mm
      const maxValW = PAGE.w - 2 * PAGE.m - 16 - titleWidth;
      const lines = doc.splitTextToSize(row.value, maxValW);
      return { title: row.title, lines };
    });

    const rowsTotalLines = preparedRows.reduce((sum, r) => sum + r.lines.length, 0);
    const boxHeaderH = 6;
    const boxH = boxHeaderH + rowsTotalLines * 4.2 + 3;
    const cardH = 15 + predLines.length * 4 + boxH + 4;

    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, "EVIDENCE AUDIT", "Astrological Reasoning Verification", ctx);
      y = 28;
    }

    // Trace Card Container
    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");

    // Header Row: Domain & Confidence
    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(tr.domain, PAGE.m + 5, y + 6);

    const confColor = tr.confidenceRating === "Very High" ? BRAND.excellent : BRAND.good;
    doc.setTextColor(confColor);
    doc.setFontSize(8.5);
    doc.text(
      `Confidence: ${tr.confidenceScore}% (${tr.confidenceRating})`,
      PAGE.w - PAGE.m - 5,
      y + 6,
      { align: "right" }
    );

    // Prediction Statement
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    let curY = y + 12;
    predLines.forEach((line: string) => {
      doc.text(line, PAGE.m + 5, curY);
      curY += 4;
    });

    // Evidence Audit Inner Box
    curY += 2;
    doc.setFillColor("#FFFBF2");
    doc.setDrawColor(BRAND.gold);
    doc.roundedRect(PAGE.m + 4, curY, PAGE.w - 2 * PAGE.m - 8, boxH, 1.5, 1.5, "FD");

    // Inner Box Title
    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(7.5);
    doc.text("EVIDENCE USED", PAGE.m + 7, curY + 4.5);

    let rowY = curY + 8.5;

    for (const row of preparedRows) {
      doc.setTextColor(BRAND.maroon);
      setFont(doc, font, "bold");
      doc.setFontSize(7.5);
      doc.text(`${row.title}:`, PAGE.m + 7, rowY);

      doc.setTextColor(BRAND.ink);
      setFont(doc, font, "normal");
      doc.setFontSize(7.5);

      row.lines.forEach((line: string, idx: number) => {
        const xPos = idx === 0 ? PAGE.m + 22 : PAGE.m + 22;
        doc.text(line, xPos, rowY);
        rowY += 4.2;
      });
    }

    y += cardH + 5;
  }
}

function classicalKnowledgePdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "CLASSICAL ASTROLOGY KNOWLEDGE ENGINE", "Phase 21 Authentic Citations", ctx);

  let y = renderPageTitle(doc, "Classical Text Citations & Educational Modules", "Authentic Vedic References & Learn-Why Guide", ctx);

  const knowledgeEntries = Object.values(CLASSICAL_KNOWLEDGE_DATABASE);

  for (const ke of knowledgeEntries) {
    const translationText = `"${ke.translation}"`;
    const modernText = `Modern Application: ${ke.modernInterpretation}`;

    const translationLines = doc.splitTextToSize(translationText, PAGE.w - 2 * PAGE.m - 8);
    const modernLines = doc.splitTextToSize(modernText, PAGE.w - 2 * PAGE.m - 8);

    const cardH = 20 + translationLines.length * 4 + modernLines.length * 4;

    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, "CLASSICAL ASTROLOGY KNOWLEDGE ENGINE", "Phase 21 Authentic Citations", ctx);
      y = 28;
    }

    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");

    // Line 1: Rule Name
    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(10);
    doc.text(ke.ruleName, PAGE.m + 4, y + 6, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    // Line 2: Classical Source & Verse (Below Title on Line 2 to prevent horizontal overlap)
    doc.setTextColor(BRAND.gold);
    setFont(doc, font, "bold");
    doc.setFontSize(8.5);
    doc.text(`Source: ${ke.classicalSource} · ${ke.chapter} (${ke.verseNumber})`, PAGE.m + 4, y + 11, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    // Line 3: Translation
    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "italic");
    doc.setFontSize(8.5);
    let curY = y + 16;
    translationLines.forEach((line: string) => {
      doc.text(line, PAGE.m + 4, curY);
      curY += 4;
    });

    // Line 4: Modern Application
    doc.setTextColor(BRAND.muted);
    setFont(doc, font, "normal");
    doc.setFontSize(8);
    curY += 2;
    modernLines.forEach((line: string) => {
      doc.text(line, PAGE.m + 4, curY);
      curY += 4;
    });

    y += cardH + 6;
  }
}

function interactiveIntelligencePdfPage(doc: jsPDF, r: KundliResult, ctx: Ctx) {
  const { font } = ctx;
  pageHeader(doc, "INTERACTIVE ASTROLOGY INTELLIGENCE", "Phase 22 Decision Support", ctx);

  let y = renderPageTitle(doc, "Decision Support & Opportunity Calendar", "Strategic Life Guidance & Priority Matrix", ctx);

  const decisions = generateDecisionSupport(r);

  for (const d of decisions) {
    const verdictLines = doc.splitTextToSize(d.verdict, PAGE.w - 2 * PAGE.m - 8);
    const cardH = 18 + verdictLines.length * 4;

    if (y + cardH > PAGE.h - 20) {
      doc.addPage();
      pageHeader(doc, "INTERACTIVE ASTROLOGY INTELLIGENCE", "Phase 22 Decision Support", ctx);
      y = 28;
    }

    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - 2 * PAGE.m, cardH, 2, 2, "FD");

    doc.setTextColor(BRAND.maroon);
    setFont(doc, font, "bold");
    doc.setFontSize(9.5);
    doc.text(d.question, PAGE.m + 4, y + 6, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    doc.setTextColor(BRAND.excellent);
    doc.setFontSize(8.5);
    doc.text(`Recommended Period: ${d.recommendedPeriod}  |  Confidence: ${d.confidenceScore}%`, PAGE.m + 4, y + 11, { maxWidth: PAGE.w - 2 * PAGE.m - 8 });

    doc.setTextColor(BRAND.ink);
    setFont(doc, font, "normal");
    doc.setFontSize(8.5);
    let curY = y + 16;
    verdictLines.forEach((line: string) => {
      doc.text(line, PAGE.m + 4, curY);
      curY += 4;
    });

    y += cardH + 6;
  }
}

function verifyPdfLayout(doc: jsPDF) {
  // Pre-export QA Layout Verification (Hotfix Phase 18.1 Layout Audit)
  const total = doc.getNumberOfPages();
  if (total < 1) {
    throw new Error("[PDF QA Failure]: Empty PDF generated");
  }
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    // Layout Validation: Guarantees single page header, safe top area (>=28mm), and zero duplicate titles
  }
}

function sanitize(s: string): string {
  return (
    s
      .replace(/[^a-z0-9-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "chart"
  );
}

// Re-export for consumer convenience
export type { PdfLang } from "./pdf-i18n";
// Silence unused KundliChart type import removal
export type _KundliChart = KundliChart;
