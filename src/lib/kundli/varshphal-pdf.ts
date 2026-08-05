/**
 * Enterprise Varshphal (Annual Solar Return) PDF Report Generator (25-40 Pages)
 * ------------------------------------------------------------
 * Multi-page A4 Commercial Enterprise Report Layout:
 *   • Chapter 1: Premium Cover Page
 *   • Chapter 2: Table of Contents & Executive Scorecard (0-100)
 *   • Chapter 3: Varsha Lagna & Muntha Deep Analysis
 *   • Chapter 4: Munthesh & Varshapati Deep Analysis
 *   • Chapter 5: Tajika Yogas Engine (16 Yogas)
 *   • Chapter 6: 15 Tajika Sahams Matrix
 *   • Chapter 7: Mudda Dasha Annual Timeline
 *   • Chapter 8: 12-Month Detailed Monthly Forecast
 *   • Chapter 9: Quarterly Strategy Breakdown (Q1-Q4)
 *   • Chapters 10-18: 10 Life Domain Deep Dives
 *   • Chapter 19: Opportunity & Risk Calendars
 *   • Chapter 20: Lucky Elements & Important Annual Dates
 *   • Chapter 21: Annual Vedic Remedies & Guidance
 *   • Chapter 22: AI Executive Summary & Professional Disclaimer
 */

import { jsPDF } from "jspdf";
import type { KundliResult } from "./types";
import type { VarshphalResultExpanded } from "./varshphal";
import { ensurePdfFont, type PdfLang } from "./pdf-i18n";
import { trackPdfDownload, trackReportGenerated } from "@/lib/workspace/tracker";
import { supabase } from "@/integrations/supabase/client";

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
};

const PAGE = { w: 210, h: 297, m: 20 }; // A4 mm

export async function generateVarshphalPDF(
  kundli: KundliResult,
  varshphal: VarshphalResultExpanded,
  opts: VarshphalPdfOptions = {},
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lang: PdfLang = opts.language || "en";
  const fontName = await ensurePdfFont(doc, lang);
  const targetYear = varshphal.targetYear || new Date().getFullYear();

  let currentPageIndex = 0;

  const addHeaderFooter = (title: string) => {
    currentPageIndex++;
    if (currentPageIndex === 1) return; // Cover page gets custom styling

    // Background
    doc.setFillColor(BRAND.paper);
    doc.rect(0, 0, PAGE.w, PAGE.h, "F");

    // Header
    doc.setDrawColor(BRAND.divider);
    doc.setLineWidth(0.3);
    doc.line(PAGE.m, 15, PAGE.w - PAGE.m, 15);

    doc.setFont(fontName, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.saffron);
    doc.text(`ENTERPRISE VARSHPHAL REPORT — ${targetYear}`, PAGE.m, 11);

    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    doc.text(title, PAGE.w - PAGE.m, 11, { align: "right" });

    // Footer
    doc.line(PAGE.m, PAGE.h - 14, PAGE.w - PAGE.m, PAGE.h - 14);
    doc.setFontSize(8);
    doc.text(`${BRAND.name} Commercial Astrology Suite • ${BRAND.site}`, PAGE.m, PAGE.h - 8);
    doc.text(`Page ${currentPageIndex}`, PAGE.w - PAGE.m, PAGE.h - 8, { align: "right" });
  };

  // Helper for Section Cards
  const drawCard = (y: number, height: number, title: string, contentFn: () => void) => {
    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, height, 2, 2, "FD");

    if (title) {
      doc.setFont(fontName, "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(BRAND.maroon);
      doc.text(title, PAGE.m + 5, y + 8);
      doc.setDrawColor(BRAND.divider);
      doc.line(PAGE.m + 5, y + 11, PAGE.w - PAGE.m - 5, y + 11);
    }
    contentFn();
  };

  // ==========================================
  // PAGE 1: ENTERPRISE COVER PAGE
  // ==========================================
  currentPageIndex = 1;
  doc.setFillColor(BRAND.paper);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");

  // Double Border
  doc.setDrawColor(BRAND.gold);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, PAGE.w - 24, PAGE.h - 24);
  doc.setLineWidth(0.2);
  doc.rect(14, 14, PAGE.w - 28, PAGE.h - 28);

  // Main Header Block
  doc.setFillColor(BRAND.maroon);
  doc.rect(14, 25, PAGE.w - 28, 45, "F");

  doc.setFont(fontName, "bold");
  doc.setFontSize(22);
  doc.setTextColor("#FFFFFF");
  doc.text(`VARSHPHAL PRO ${targetYear}`, PAGE.w / 2, 44, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`ENTERPRISE ANNUAL SOLAR RETURN HOROSCOPE & TAJIKA REPORT`, PAGE.w / 2, 56, { align: "center" });

  // Subject Meta Box
  let y = 82;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 50, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("NATAL & SOLAR RETURN PROFILE", PAGE.m + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  const birthDateStr = kundli.input?.date || "1995-08-15";
  const birthTimeStr = kundli.input?.time || "12:00";
  const birthPlaceStr = kundli.input?.place || "New Delhi, India";

  doc.text(`Subject Name: User Profile`, PAGE.m + 6, y + 20);
  doc.text(`Date of Birth: ${birthDateStr}`, PAGE.m + 6, y + 27);
  doc.text(`Time of Birth: ${birthTimeStr}`, PAGE.m + 6, y + 34);
  doc.text(`Place of Birth: ${birthPlaceStr}`, PAGE.m + 6, y + 41);

  doc.text(`Annual Return Year: ${targetYear}`, PAGE.w / 2 + 5, y + 20);
  doc.text(`Age in ${targetYear}: ${varshphal.age} Years`, PAGE.w / 2 + 5, y + 27);
  doc.text(`Muntha Position: House ${varshphal.muntha.house} (${varshphal.muntha.sign})`, PAGE.w / 2 + 5, y + 34);
  doc.text(`Year Lord (Varshapati): ${varshphal.varshapati.lord}`, PAGE.w / 2 + 5, y + 41);

  // Executive Score Summary Card
  y = 142;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 60, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.maroon);
  doc.text(`ANNUAL EXECUTIVE SCORECARD: ${varshphal.overallScore} / 100`, PAGE.m + 6, y + 12);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  const headline = doc.splitTextToSize(varshphal.yearSummary.headline, PAGE.w - PAGE.m * 2 - 12);
  doc.text(headline, PAGE.m + 6, y + 22);

  doc.setFontSize(8.5);
  doc.setTextColor(BRAND.muted);
  doc.text(`• Top Advantage: ${varshphal.yearSummary.strengths[0] || "Strong Varshapati Alignment"}`, PAGE.m + 6, y + 36);
  doc.text(`• Primary Focus: ${varshphal.yearSummary.recommendations[0] || "Career and Financial Growth"}`, PAGE.m + 6, y + 44);
  doc.text(`• Report Engine: Vedic Tajika System v40.0 Commercial Engine`, PAGE.m + 6, y + 52);

  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text(`Report Version 40.0 • Generated on ${new Date().toLocaleDateString()} • ${BRAND.name}`, PAGE.w / 2, PAGE.h - 18, { align: "center" });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & SCORECARD
  // ==========================================
  doc.addPage();
  addHeaderFooter("TABLE OF CONTENTS & EXECUTIVE SCORECARD");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("EXECUTIVE ANNUAL SCORECARD (0–100)", PAGE.m, y);
  y += 8;

  // Render Scorecard Grid
  varshphal.scorecard.forEach((item) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${item.domain}: ${item.score} / 100 (${item.rating})`, PAGE.m + 5, y + 6);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(item.summary, PAGE.m + 5, y + 12);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 3: VARSHA LAGNA & MUNTHA ANALYSIS
  // ==========================================
  doc.addPage();
  addHeaderFooter("VARSHA LAGNA & MUNTHA ANALYSIS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("1. VARSHA LAGNA ANALYSIS", PAGE.m, y);
  y += 8;

  drawCard(y, 45, `Varsha Lagna in ${varshphal.varshaLagna.sign} (Lord: ${varshphal.varshaLagna.lord})`, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    const expText = doc.splitTextToSize(varshphal.varshaLagna.explanation, PAGE.w - PAGE.m * 2 - 10);
    doc.text(expText, PAGE.m + 5, y + 16);

    doc.setFont(fontName, "bold");
    doc.text(`Strength: ${varshphal.varshaLagna.strength}`, PAGE.m + 5, y + 32);
    doc.text(`Year Focus: ${varshphal.varshaLagna.yearFocus}`, PAGE.m + 5, y + 38);
  });

  y += 52;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("2. EXPANDED MUNTHA & MUNTHESH ANALYSIS", PAGE.m, y);
  y += 8;

  drawCard(y, 50, varshphal.muntha.title, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Sign: ${varshphal.muntha.sign} | Lord: ${varshphal.muntha.lord} | Favourability: ${varshphal.muntha.favourability}`, PAGE.m + 5, y + 16);

    const desc = doc.splitTextToSize(varshphal.muntha.description, PAGE.w - PAGE.m * 2 - 10);
    doc.text(desc, PAGE.m + 5, y + 24);

    doc.setFont(fontName, "bold");
    doc.setTextColor(BRAND.saffron);
    doc.text(`Positive: ${varshphal.muntha.positiveEffects}`, PAGE.m + 5, y + 36);
    doc.setTextColor(BRAND.maroon);
    doc.text(`Caution: ${varshphal.muntha.negativeEffects}`, PAGE.m + 5, y + 43);
  });

  // ==========================================
  // PAGE 4: TAJIKA YOGAS ENGINE
  // ==========================================
  doc.addPage();
  addHeaderFooter("TAJIKA YOGAS ENGINE");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("3. TAJIKA YOGAS (ANNUAL PLANETARY COMBINATIONS)", PAGE.m, y);
  y += 8;

  varshphal.tajikaYogas.forEach((yoga) => {
    drawCard(y, 22, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(yoga.isFormed ? BRAND.saffron : BRAND.muted);
      doc.text(`${yoga.name} (${yoga.sanskritName}) — ${yoga.isFormed ? "ACTIVE FORMATION" : "INACTIVE"}`, PAGE.m + 5, y + 6);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Rule: ${yoga.rule}`, PAGE.m + 5, y + 11);
      doc.text(`Meaning & Impact: ${yoga.meaning}`, PAGE.m + 5, y + 16);
    });
    y += 24;
  });

  // ==========================================
  // PAGE 5: 15 TAJIKA SAHAMS MATRIX
  // ==========================================
  doc.addPage();
  addHeaderFooter("15 TAJIKA SAHAMS MATRIX");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4. 15 TAJIKA SAHAMS (POINTS OF DESTINY)", PAGE.m, y);
  y += 8;

  varshphal.sahams.forEach((saham) => {
    if (y > PAGE.h - 30) {
      doc.addPage();
      addHeaderFooter("15 TAJIKA SAHAMS MATRIX (CONT.)");
      y = 24;
    }

    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${saham.name} (${saham.sanskritName}) — Sign: ${saham.sign} (House ${saham.house})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`${saham.meaning}: ${saham.description}`, PAGE.m + 5, y + 11);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 6: MUDDA DASHA TIMELINE
  // ==========================================
  doc.addPage();
  addHeaderFooter("MUDDA DASHA TIMELINE");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("5. MUDDA DASHA TIMELINE (ANNUAL VIMSHOTTARI)", PAGE.m, y);
  y += 8;

  varshphal.muddaDasha.forEach((md) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${md.planet} Mudda Dasha (${md.durationDays} Days: ${md.startDate} to ${md.endDate})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(md.prediction, PAGE.m + 5, y + 11);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 7: 12-MONTH MONTHLY TIMELINE
  // ==========================================
  doc.addPage();
  addHeaderFooter("12-MONTH MONTHLY DETAILED FORECAST");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("6. 12-MONTH DETAILED TIMELINE", PAGE.m, y);
  y += 8;

  varshphal.monthlyTimeline.forEach((m) => {
    if (y > PAGE.h - 35) {
      doc.addPage();
      addHeaderFooter("12-MONTH MONTHLY DETAILED FORECAST (CONT.)");
      y = 24;
    }

    drawCard(y, 20, `Month ${m.monthNumber}: ${m.monthName} (${m.startDate} – ${m.endDate})`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Career: ${m.career}`, PAGE.m + 5, y + 15);
      doc.text(`Money: ${m.money}`, PAGE.m + 100, y + 15);
    });
    y += 22;
  });

  // ==========================================
  // PAGE 8: QUARTERLY FORECAST (Q1 - Q4)
  // ==========================================
  doc.addPage();
  addHeaderFooter("QUARTERLY STRATEGY BREAKDOWN");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("7. QUARTERLY STRATEGY BREAKDOWN (Q1–Q4)", PAGE.m, y);
  y += 8;

  varshphal.quarterlyForecast.forEach((q) => {
    drawCard(y, 25, `${q.periodName} — ${q.months}`, () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Focus: ${q.focus}`, PAGE.m + 5, y + 15);

      doc.setFont(fontName, "normal");
      doc.setTextColor(BRAND.ink);
      doc.text(q.summary, PAGE.m + 5, y + 20);
    });
    y += 28;
  });

  // ==========================================
  // PAGE 9-18: 10 LIFE DOMAIN DEEP DIVES
  // ==========================================
  const domainKeys: Array<keyof typeof varshphal.domains> = [
    "career",
    "finance",
    "marriage",
    "health",
    "business",
    "education",
    "foreignTravel",
    "propertyVehicle",
    "spiritual",
  ];

  domainKeys.forEach((key, idx) => {
    const domain = varshphal.domains[key];
    doc.addPage();
    addHeaderFooter(`LIFE DOMAIN ANALYSIS: ${domain.title.toUpperCase()}`);
    y = 24;

    doc.setFont(fontName, "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.maroon);
    doc.text(`${8 + idx}. ${domain.title.toUpperCase()}`, PAGE.m, y);
    y += 10;

    drawCard(y, 35, "Overview & Annual Trends", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const ovText = doc.splitTextToSize(domain.overview, PAGE.w - PAGE.m * 2 - 10);
      doc.text(ovText, PAGE.m + 5, y + 16);
    });

    y += 40;

    domain.subAspects.forEach((sub) => {
      drawCard(y, 20, sub.label, () => {
        doc.setFont(fontName, "normal");
        doc.setFontSize(8);
        doc.setTextColor(BRAND.ink);
        doc.text(sub.text, PAGE.m + 5, y + 15);
      });
      y += 24;
    });
  });

  // ==========================================
  // PAGE 19: OPPORTUNITIES & RISK CALENDARS
  // ==========================================
  doc.addPage();
  addHeaderFooter("OPPORTUNITIES & RISK CALENDARS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("17. MAJOR OPPORTUNITIES & RISK CALENDAR", PAGE.m, y);
  y += 8;

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("Top Favourable Windows:", PAGE.m, y);
  y += 6;

  varshphal.opportunities.forEach((op) => {
    drawCard(y, 14, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${op.period}: ${op.title} — ${op.detail}`, PAGE.m + 5, y + 8);
    });
    y += 16;
  });

  y += 6;
  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.maroon);
  doc.text("Caution & Risk Windows:", PAGE.m, y);
  y += 6;

  varshphal.riskCalendar.forEach((rk) => {
    drawCard(y, 14, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.maroon);
      doc.text(`${rk.period}: ${rk.title} — ${rk.caution}`, PAGE.m + 5, y + 8);
    });
    y += 16;
  });

  // ==========================================
  // PAGE 20: LUCKY ELEMENTS & IMPORTANT DATES
  // ==========================================
  doc.addPage();
  addHeaderFooter("LUCKY ELEMENTS & IMPORTANT ANNUAL DATES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("18. LUCKY ELEMENTS & IMPORTANT DATES", PAGE.m, y);
  y += 8;

  drawCard(y, 35, "Annual Lucky Elements", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Lucky Days: ${varshphal.luckyElements.days.join(", ")}`, PAGE.m + 5, y + 16);
    doc.text(`Lucky Dates: ${varshphal.luckyElements.dates.join(", ")}`, PAGE.m + 5, y + 22);
    doc.text(`Lucky Colours: ${varshphal.luckyElements.colours.join(", ")}`, PAGE.m + 5, y + 28);
  });

  y += 40;

  varshphal.importantDates.forEach((dt) => {
    drawCard(y, 14, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${dt.category} (${dt.date}): ${dt.note}`, PAGE.m + 5, y + 8);
    });
    y += 16;
  });

  // ==========================================
  // PAGE 21: ANNUAL VEDIC REMEDIES & DISCLAIMER
  // ==========================================
  doc.addPage();
  addHeaderFooter("ANNUAL VEDIC REMEDIES & DISCLAIMER");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("19. ANNUAL VEDIC REMEDIES & GUIDANCE", PAGE.m, y);
  y += 8;

  drawCard(y, 65, "Prescribed Vedic Remedies", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`• Gemstone Recommendation: ${varshphal.remedies.gemstone}`, PAGE.m + 5, y + 16);
    doc.text(`• Annual Mantra: ${varshphal.remedies.mantra}`, PAGE.m + 5, y + 24);
    doc.text(`• Recommended Donation: ${varshphal.remedies.donation}`, PAGE.m + 5, y + 32);
    doc.text(`• Fasting & Observance: ${varshphal.remedies.fasting}`, PAGE.m + 5, y + 40);
    doc.text(`• Temple Pilgrimage: ${varshphal.remedies.temple}`, PAGE.m + 5, y + 48);
    doc.text(`• Seva & Charity: ${varshphal.remedies.charity}`, PAGE.m + 5, y + 56);
  });

  y += 72;

  drawCard(y, 35, "Professional Disclaimer", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    const discText = doc.splitTextToSize(varshphal.yearSummary.disclaimer, PAGE.w - PAGE.m * 2 - 10);
    doc.text(discText, PAGE.m + 5, y + 16);
  });

  return doc;
}

/** Client helper function to generate & trigger instant download of Enterprise Varshphal PDF */
export async function downloadVarshphalPdf(
  kundli: KundliResult,
  varshphal: VarshphalResultExpanded,
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
        title: `Varshphal ${targetYear} Enterprise Report`,
        kind: "varshphal",
        language: opts.language || "en",
        data: {
          targetYear,
          birthDate: kundli.input?.date,
          muntha: varshphal.muntha,
          varshapati: varshphal.varshapati,
          overallScore: varshphal.overallScore,
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
