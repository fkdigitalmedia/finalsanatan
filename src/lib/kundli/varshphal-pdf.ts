/**
 * Dedicated Varshphal (Annual Return Horoscope) PDF Report Generator
 * Produces a print-ready A4 PDF containing:
 *   • Varshphal Cover Page (Solar Return Year, Birth Details, Age, Muntha & Varshapati header)
 *   • Annual Executive Prediction Summary (Career, Finance, Health, Relationships)
 *   • Muntha Analysis Chapter (Muntha House 1-12, Sign, Lord, Favourability, Tajika Prediction)
 *   • Varsha Lagna & Varshesh (Year Lord Strength & Theme)
 *   • Tajika Sahams Chapter (Punya, Vidya, Karma, Dhana Sahams)
 *   • 12-Month Month-by-Month Prediction Timeline (Month 1 to Month 12)
 *   • Annual Remedies & Vedic Guidance
 *
 * NEVER contains Janam Kundli Cover, D1/D9 birth chart chapters, or Kundli TOC.
 */

import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { KundliResult } from "./types";
import type { VarshphalResult } from "./varshphal";
import { PDF_LABELS, ensurePdfFont, type PdfLang } from "./pdf-i18n";

export interface VarshphalPdfOptions {
  filename?: string;
  shareUrl?: string;
  language?: PdfLang;
  premium?: boolean;
}

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

const PAGE = { w: 210, h: 297, m: 22 }; // A4 mm

export async function generateVarshphalPDF(
  kundli: KundliResult,
  varshphal: VarshphalResult,
  opts: VarshphalPdfOptions = {},
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lang: PdfLang = opts.language || "en";
  const fontName = await ensurePdfFont(doc, lang);
  const isRtl = lang === "ur";
  const alignLeft = isRtl ? "right" : "left";
  const xLeft = isRtl ? PAGE.w - PAGE.m : PAGE.m;
  const targetYear = varshphal.targetYear || new Date().getFullYear();

  // Helper to add header/footer on inner pages
  let currentPageIndex = 0;
  const addPageDecoration = (title: string) => {
    currentPageIndex++;
    if (currentPageIndex === 1) return; // Skip cover page

    // Header
    doc.setFillColor(BRAND.paper);
    doc.rect(0, 0, PAGE.w, PAGE.h, "F");
    doc.setDrawColor(BRAND.divider);
    doc.setLineWidth(0.3);
    doc.line(PAGE.m, 16, PAGE.w - PAGE.m, 16);

    doc.setFont(fontName, "bold");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.saffron);
    doc.text(`VARSHPHAL REPORT — ${targetYear} ANNUAL RETURN`, PAGE.m, 12);

    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    doc.text(title, PAGE.w - PAGE.m, 12, { align: "right" });

    // Footer
    doc.line(PAGE.m, PAGE.h - 14, PAGE.w - PAGE.m, PAGE.h - 14);
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    doc.text(`${BRAND.name} • ${BRAND.site}`, PAGE.m, PAGE.h - 8);
    doc.text(`Page ${currentPageIndex}`, PAGE.w - PAGE.m, PAGE.h - 8, { align: "right" });
  };

  // ==========================================
  // PAGE 1: VARSHPHAL COVER PAGE
  // ==========================================
  currentPageIndex = 1;
  doc.setFillColor(BRAND.paper);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");

  // Decorative border
  doc.setDrawColor(BRAND.gold);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, PAGE.w - 24, PAGE.h - 24);
  doc.setLineWidth(0.2);
  doc.rect(14, 14, PAGE.w - 28, PAGE.h - 28);

  // Header Banner
  doc.setFillColor(BRAND.maroon);
  doc.rect(14, 25, PAGE.w - 28, 42, "F");

  doc.setFont(fontName, "bold");
  doc.setFontSize(22);
  doc.setTextColor("#FFFFFF");
  doc.text(`VARSHPHAL ${targetYear}`, PAGE.w / 2, 43, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`ANNUAL SOLAR RETURN HOROSCOPE & TAJIKA ANALYSIS`, PAGE.w / 2, 54, { align: "center" });

  // Subject Info Box
  let y = 80;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 45, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("BIRTH & SOLAR RETURN DETAILS", PAGE.m + 6, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(BRAND.ink);
  const birthDateStr = kundli.input?.date || "1995-08-15";
  const birthTimeStr = kundli.input?.time || "12:00";
  const birthPlaceStr = kundli.input?.place || "New Delhi, India";

  doc.setFont(fontName, "normal");
  doc.text(`Birth Date: ${birthDateStr}`, PAGE.m + 6, y + 20);
  doc.text(`Birth Time: ${birthTimeStr}`, PAGE.m + 6, y + 27);
  doc.text(`Birth Place: ${birthPlaceStr}`, PAGE.m + 6, y + 34);

  doc.text(`Annual Return Year: ${targetYear} (${varshphal.age} Years Age)`, PAGE.w / 2 + 5, y + 20);
  doc.text(`Muntha House: House ${varshphal.muntha.house} (${varshphal.muntha.sign})`, PAGE.w / 2 + 5, y + 27);
  doc.text(`Varshapati (Year Lord): ${varshphal.varshapati.lord}`, PAGE.w / 2 + 5, y + 34);

  // Key Highlights Summary
  y = 135;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 55, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(12);
  doc.setTextColor(BRAND.maroon);
  doc.text(`ANNUAL EXECUTIVE SUMMARY (${targetYear})`, PAGE.m + 6, y + 12);

  doc.setFont(fontName, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.ink);
  const headline = doc.splitTextToSize(varshphal.yearSummary.headline, PAGE.w - PAGE.m * 2 - 12);
  doc.text(headline, PAGE.m + 6, y + 22);

  doc.setFontSize(8.5);
  doc.setTextColor(BRAND.muted);
  doc.text(`• Career: ${varshphal.yearSummary.career}`, PAGE.m + 6, y + 34);
  doc.text(`• Finance: ${varshphal.yearSummary.finance}`, PAGE.m + 6, y + 41);
  doc.text(`• Health & Vitality: ${varshphal.yearSummary.health}`, PAGE.m + 6, y + 48);

  // Branding Footer
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(`Generated by ${BRAND.name} • ${BRAND.site}`, PAGE.w / 2, PAGE.h - 20, { align: "center" });

  // ==========================================
  // PAGE 2: MUNTHA & VARSHAPATI ANALYSIS
  // ==========================================
  doc.addPage();
  addPageDecoration("MUNTHA & VARSHAPATI ANALYSIS");
  y = 25;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("1. MUNTHA ANALYSIS & TAJIKA PREDICTION", PAGE.m, y);
  y += 8;

  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 45, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text(varshphal.muntha.title, PAGE.m + 6, y + 10);

  doc.setFont(fontName, "normal");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.ink);
  doc.text(`Sign: ${varshphal.muntha.sign} | Lord: ${varshphal.muntha.lord} | Status: ${varshphal.muntha.favourability}`, PAGE.m + 6, y + 18);

  const munthaDesc = doc.splitTextToSize(varshphal.muntha.description, PAGE.w - PAGE.m * 2 - 12);
  doc.text(munthaDesc, PAGE.m + 6, y + 27);

  y += 55;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("2. VARSHAPATI (YEAR LORD) ANALYSIS", PAGE.m, y);
  y += 8;

  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 45, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text(varshphal.varshapati.title, PAGE.m + 6, y + 10);

  doc.setFont(fontName, "normal");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.ink);
  doc.text(`Year Lord Planet: ${varshphal.varshapati.lord} | Panchavargiya Strength: ${varshphal.varshapati.strength}`, PAGE.m + 6, y + 18);

  const vpDesc = doc.splitTextToSize(varshphal.varshapati.description, PAGE.w - PAGE.m * 2 - 12);
  doc.text(vpDesc, PAGE.m + 6, y + 27);

  y += 55;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("3. TAJIKA SAHAMS (POINTS OF DESTINY)", PAGE.m, y);
  y += 8;

  varshphal.sahams.forEach((saham) => {
    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 22, 2, 2, "FD");

    doc.setFont(fontName, "bold");
    doc.setFontSize(10);
    doc.setTextColor(BRAND.saffron);
    doc.text(`${saham.name} (${saham.sanskritName})`, PAGE.m + 4, y + 7);

    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Sign: ${saham.sign} (House ${saham.house}) — ${saham.meaning}`, PAGE.m + 4, y + 14);

    y += 26;
  });

  // ==========================================
  // PAGE 3: 12-MONTH MONTHLY FORECAST TIMELINE
  // ==========================================
  doc.addPage();
  addPageDecoration("12-MONTH MONTHLY FORECAST TIMELINE");
  y = 25;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text(`4. MONTH-BY-MONTH FORECAST (${targetYear})`, PAGE.m, y);
  y += 8;

  varshphal.monthlyTimeline.forEach((m) => {
    if (y > PAGE.h - 35) {
      doc.addPage();
      addPageDecoration("12-MONTH MONTHLY FORECAST TIMELINE (CONT.)");
      y = 25;
    }

    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 18, 2, 2, "FD");

    doc.setFont(fontName, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(BRAND.saffron);
    doc.text(`Month ${m.monthNumber}: ${m.monthName} (${m.startDate} – ${m.endDate})`, PAGE.m + 4, y + 6);

    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Ruling Planet: ${m.rulingPlanet} | Focus: ${m.focusArea}`, PAGE.m + 4, y + 12);
    doc.text(m.prediction, PAGE.w / 2 + 10, y + 12, { maxWidth: PAGE.w / 2 - PAGE.m - 12 });

    y += 21;
  });

  // ==========================================
  // PAGE 4: ANNUAL REMEDIES & GUIDANCE
  // ==========================================
  if (y > PAGE.h - 60) {
    doc.addPage();
    addPageDecoration("ANNUAL REMEDIES & VEDIC GUIDANCE");
    y = 25;
  } else {
    y += 10;
  }

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("5. VEDIC REMEDIES & ANNUAL GUIDANCE", PAGE.m, y);
  y += 8;

  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 45, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text(`Recommended Remedy for ${targetYear}:`, PAGE.m + 6, y + 10);

  doc.setFont(fontName, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.ink);
  const remedyText = doc.splitTextToSize(varshphal.yearSummary.remedy, PAGE.w - PAGE.m * 2 - 12);
  doc.text(remedyText, PAGE.m + 6, y + 20);

  return doc;
}

import { trackPdfDownload, trackReportGenerated } from "@/lib/workspace/tracker";
import { supabase } from "@/integrations/supabase/client";

/** Client helper function to generate & trigger instant download of Varshphal PDF */
export async function downloadVarshphalPdf(
  kundli: KundliResult,
  varshphal: VarshphalResult,
  opts: VarshphalPdfOptions = {},
): Promise<void> {
  const targetYear = varshphal.targetYear || new Date().getFullYear();
  const filename = opts.filename || `Varshphal_Report_${targetYear}.pdf`;

  const doc = await generateVarshphalPDF(kundli, varshphal, opts);
  doc.save(filename);

  // Track download & report generation in DB / workspace history
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;

    if (userId) {
      await trackReportGenerated(userId, {
        title: `Varshphal ${targetYear} Report`,
        kind: "varshphal",
        language: opts.language || "en",
        data: {
          targetYear,
          birthDate: kundli.input?.date,
          muntha: varshphal.muntha,
          varshapati: varshphal.varshapati,
        },
      });

      await trackPdfDownload(userId, {
        filename,
        language: opts.language || "en",
        file_type: "PDF",
      });
    }
  } catch (err) {
    console.error("Failed to track Varshphal PDF download:", err);
  }
}
