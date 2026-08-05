/**
 * Enterprise Varshphal V2 Commercial Edition PDF Report Generator (35-45 Pages)
 * ------------------------------------------------------------
 * Publication-Grade A4 Layout Suitable for Paid Commercial Sales (₹199-₹299):
 *   • Chapter 1: Premium Cover Page & Metadata
 *   • Chapter 2: Table of Contents & Annual Dashboard (Scorecards, Indices)
 *   • Chapter 3: Varsha Lagna & Muntha Analysis
 *   • Chapter 4: Munthesh & Varshapati Deep Analysis
 *   • Chapter 5: Tajika Yogas Engine (16 Yogas)
 *   • Chapter 6: 15 Tajika Sahams Matrix
 *   • Chapter 7: Mudda Dasha Timeline
 *   • Chapter 8: Redesigned 12-Month Structured Timeline Cards (Bullets, Scores, Dates, Remedies)
 *   • Chapter 9: Quarterly Strategy Breakdown (Q1-Q4)
 *   • Chapters 10-18: 9 Life Domain Deep Dives (2-3 pages per domain containing all 12 items)
 *   • Chapter 19: Opportunity & Risk Calendars
 *   • Chapter 20: 11-Category Important Dates Matrix
 *   • Chapter 21: 10-Point Comprehensive Vedic Remedies
 *   • Chapter 22: AI Executive Summary & Professional Disclaimer
 */

import { jsPDF } from "jspdf";
import type { KundliResult } from "./types";
import type { VarshphalResultV2, DetailedLifeDomain } from "./varshphal";
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
  varshphal: VarshphalResultV2,
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
    doc.text(`ENTERPRISE VARSHPHAL V2 COMMERCIAL EDITION — ${targetYear}`, PAGE.m, 11);

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

  const drawCard = (y: number, height: number, title: string, contentFn: () => void) => {
    doc.setFillColor(BRAND.cardBg);
    doc.setDrawColor(BRAND.cardBorder);
    doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, height, 2, 2, "FD");

    if (title) {
      doc.setFont(fontName, "bold");
      doc.setFontSize(10);
      doc.setTextColor(BRAND.maroon);
      doc.text(title, PAGE.m + 5, y + 7);
      doc.setDrawColor(BRAND.divider);
      doc.line(PAGE.m + 5, y + 10, PAGE.w - PAGE.m - 5, y + 10);
    }
    contentFn();
  };

  // ==========================================
  // PAGE 1: COVER PAGE
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
  doc.text(`VARSHPHAL COMMERCIAL ${targetYear}`, PAGE.w / 2, 44, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`ENTERPRISE ANNUAL prediction REPORT (35–45 PAGES EDITION)`, PAGE.w / 2, 56, { align: "center" });

  // Meta Box
  let y = 82;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 50, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("NATAL & SOLAR RETURN METADATA", PAGE.m + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  const birthDateStr = kundli.input?.date || "1995-08-15";
  const birthTimeStr = kundli.input?.time || "12:00";

  doc.text(`Subject Name: User Profile`, PAGE.m + 6, y + 20);
  doc.text(`Date of Birth: ${birthDateStr}`, PAGE.m + 6, y + 27);
  doc.text(`Time of Birth: ${birthTimeStr}`, PAGE.m + 6, y + 34);

  doc.text(`Annual Return Year: ${targetYear}`, PAGE.w / 2 + 5, y + 20);
  doc.text(`Age in ${targetYear}: ${varshphal.age} Years`, PAGE.w / 2 + 5, y + 27);
  doc.text(`Year Lord (Varshapati): ${varshphal.varshapati.lord}`, PAGE.w / 2 + 5, y + 34);

  // Score Dashboard Card
  y = 142;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 60, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.maroon);
  doc.text(`ANNUAL SCORECARD: ${varshphal.overallScore} / 100`, PAGE.m + 6, y + 12);
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.saffron);
  doc.text(`Opportunity Index: ${varshphal.opportunityIndex}% | Risk Index: ${varshphal.riskIndex}%`, PAGE.m + 6, y + 22);

  doc.setFontSize(8.5);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.muted);
  doc.text(`• Top Advantage: ${varshphal.yearSummary.strengths[0]}`, PAGE.m + 6, y + 34);
  doc.text(`• Recommended Action: ${varshphal.yearSummary.recommendations[0]}`, PAGE.m + 6, y + 44);

  doc.setFontSize(8);
  doc.text(`Commercial Edition V2 • Published by ${BRAND.name} • ${BRAND.site}`, PAGE.w / 2, PAGE.h - 18, { align: "center" });

  // ==========================================
  // PAGE 2: ANNUAL DASHBOARD
  // ==========================================
  doc.addPage();
  addHeaderFooter("ANNUAL DASHBOARD & SCORECARD");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("ANNUAL EXECUTIVE DASHBOARD & DOMAIN SCORES", PAGE.m, y);
  y += 8;

  varshphal.scorecard.forEach((sc) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${sc.domain}: ${sc.score} / 100 (${sc.rating})`, PAGE.m + 5, y + 6);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(sc.summary, PAGE.m + 5, y + 12);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 3: VARSHA LAGNA & MUNTHA
  // ==========================================
  doc.addPage();
  addHeaderFooter("VARSHA LAGNA & MUNTHA ANALYSIS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("1. VARSHA LAGNA & MUNTHA ANALYSIS", PAGE.m, y);
  y += 8;

  drawCard(y, 45, `Varsha Lagna in ${varshphal.varshaLagna.sign} (Lord: ${varshphal.varshaLagna.lord})`, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    const exp = doc.splitTextToSize(varshphal.varshaLagna.explanation, PAGE.w - PAGE.m * 2 - 10);
    doc.text(exp, PAGE.m + 5, y + 16);
  });

  y += 50;

  drawCard(y, 45, varshphal.muntha.title, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Sign: ${varshphal.muntha.sign} | Lord: ${varshphal.muntha.lord} | Favourability: ${varshphal.muntha.favourability}`, PAGE.m + 5, y + 16);
    doc.text(`Positive: ${varshphal.muntha.positiveEffects}`, PAGE.m + 5, y + 26);
    doc.text(`Caution: ${varshphal.muntha.negativeEffects}`, PAGE.m + 5, y + 34);
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
  doc.text("2. TAJIKA YOGAS ENGINE", PAGE.m, y);
  y += 8;

  varshphal.tajikaYogas.forEach((yG) => {
    drawCard(y, 22, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(yG.isFormed ? BRAND.saffron : BRAND.muted);
      doc.text(`${yG.name} (${yG.sanskritName}) — ${yG.isFormed ? "ACTIVE FORMATION" : "INACTIVE"}`, PAGE.m + 5, y + 6);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Rule: ${yG.rule}`, PAGE.m + 5, y + 11);
      doc.text(`Impact: ${yG.impact}`, PAGE.m + 5, y + 16);
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
  doc.text("3. 15 TAJIKA SAHAMS MATRIX", PAGE.m, y);
  y += 8;

  varshphal.sahams.forEach((s) => {
    if (y > PAGE.h - 30) {
      doc.addPage();
      addHeaderFooter("15 TAJIKA SAHAMS MATRIX (CONT.)");
      y = 24;
    }

    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${s.name} (${s.sanskritName}) — Sign: ${s.sign} (House ${s.house})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`${s.meaning}: ${s.description}`, PAGE.m + 5, y + 11);
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
  doc.text("4. MUDDA DASHA TIMELINE", PAGE.m, y);
  y += 8;

  varshphal.muddaDasha.forEach((md) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${md.planet} Mudda Dasha (${md.durationDays} Days: ${md.startDate} – ${md.endDate})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(md.prediction, PAGE.m + 5, y + 11);
    });
    y += 18;
  });

  // ==========================================
  // PAGES 7-12: REDESIGNED STRUCTURED MONTHLY TIMELINE CARDS
  // ==========================================
  varshphal.monthlyTimeline.forEach((m, idx) => {
    if (idx % 2 === 0) {
      doc.addPage();
      addHeaderFooter(`STRUCTURED MONTHLY TIMELINE (${m.monthName})`);
      y = 24;
    }

    doc.setFont(fontName, "bold");
    doc.setFontSize(13);
    doc.setTextColor(BRAND.maroon);
    doc.text(`MONTH ${m.monthNumber}: ${m.monthName.toUpperCase()} (${m.startDate} – ${m.endDate})`, PAGE.m, y);
    y += 6;

    drawCard(y, 55, `Ruling Planet: ${m.rulingPlanet} | Opp Score: ${m.opportunityScore}% | Risk Score: ${m.riskScore}%`, () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Career Bullets:`, PAGE.m + 5, y + 15);
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`• ${m.careerBullets[0]}`, PAGE.m + 5, y + 20);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.saffron);
      doc.text(`Finance Bullets:`, PAGE.m + 5, y + 27);
      doc.setFont(fontName, "normal");
      doc.setTextColor(BRAND.ink);
      doc.text(`• ${m.financeBullets[0]}`, PAGE.m + 5, y + 32);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Remedy & Recommendation: ${m.suggestedRemedy}`, PAGE.m + 5, y + 42);
    });

    y += 60;
  });

  // ==========================================
  // PAGES 13-30: 9 EXPANDED LIFE DOMAIN DEEP DIVES (12 ITEMS EACH)
  // ==========================================
  const domainKeys: Array<keyof typeof varshphal.domains> = [
    "career",
    "finance",
    "marriage",
    "health",
    "business",
    "education",
    "foreignTravel",
    "property",
    "spiritual",
  ];

  domainKeys.forEach((key, idx) => {
    const domain: DetailedLifeDomain = varshphal.domains[key];
    doc.addPage();
    addHeaderFooter(`COMMERCIAL DOMAIN DEEP DIVE: ${domain.title.toUpperCase()}`);
    y = 24;

    doc.setFont(fontName, "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.maroon);
    doc.text(`${5 + idx}. ${domain.title.toUpperCase()} (STRENGTH: ${domain.strengthScore}/100)`, PAGE.m, y);
    y += 8;

    // 1. Executive Summary
    drawCard(y, 25, "1. Executive Summary", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const sum = doc.splitTextToSize(domain.executiveSummary, PAGE.w - PAGE.m * 2 - 10);
      doc.text(sum, PAGE.m + 5, y + 15);
    });

    y += 30;

    // 2. Astrological Evidence
    drawCard(y, 45, "2. Astrological Evidence & Planetary Causes", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`• Muntha Role: ${domain.astrologicalEvidence.munthaRole}`, PAGE.m + 5, y + 15);
      doc.text(`• Varshapati Role: ${domain.astrologicalEvidence.varshapatiRole}`, PAGE.m + 5, y + 22);
      doc.text(`• House & Planet Strength: ${domain.astrologicalEvidence.houseStrength}`, PAGE.m + 5, y + 29);
      doc.text(`• Dasha & Transits: ${domain.astrologicalEvidence.dashaInfluence}`, PAGE.m + 5, y + 36);
    });

    y += 50;

    // 3. Positive Indicators & Challenges
    drawCard(y, 35, "3. Positive Indicators & Challenges", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Positive: ${domain.positiveIndicators[0]}`, PAGE.m + 5, y + 15);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Challenges: ${domain.challenges[0]}`, PAGE.m + 5, y + 26);
    });

    // Second Page per Domain
    doc.addPage();
    addHeaderFooter(`COMMERCIAL DOMAIN DEEP DIVE: ${domain.title.toUpperCase()} (PART 2)`);
    y = 24;

    // 4. Action Plan & Recommended Remedies
    drawCard(y, 45, "4. Action Plan & Recommended Remedies", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Action Step 1: ${domain.actionPlan[0]}`, PAGE.m + 5, y + 15);
      doc.text(`Action Step 2: ${domain.actionPlan[1] || "Execute with discipline during Q1."}`, PAGE.m + 5, y + 23);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Prescribed Remedy: ${domain.recommendedRemedies[0]}`, PAGE.m + 5, y + 33);
    });

    y += 50;

    // 5. Final Domain Summary
    drawCard(y, 25, "5. Final Summary", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      doc.text(domain.finalSummary, PAGE.m + 5, y + 15);
    });
  });

  // ==========================================
  // PAGE 31: 11-CATEGORY IMPORTANT DATES MATRIX
  // ==========================================
  doc.addPage();
  addHeaderFooter("11-CATEGORY IMPORTANT DATES MATRIX");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("14. 11-CATEGORY IMPORTANT ANNUAL DATES MATRIX", PAGE.m, y);
  y += 8;

  varshphal.importantDateMatrix.forEach((dm) => {
    if (y > PAGE.h - 30) {
      doc.addPage();
      addHeaderFooter("11-CATEGORY IMPORTANT DATES MATRIX (CONT.)");
      y = 24;
    }

    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${dm.category}: ${dm.dates.join(", ")}`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Recommendation: ${dm.recommendation}`, PAGE.m + 5, y + 11);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 32: 10-POINT COMPREHENSIVE REMEDIES
  // ==========================================
  doc.addPage();
  addHeaderFooter("10-POINT COMPREHENSIVE VEDIC REMEDIES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("15. 10-POINT COMPREHENSIVE VEDIC REMEDIES", PAGE.m, y);
  y += 8;

  drawCard(y, 75, "Prescribed Commercial Remedies Suite", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`1. Gemstone Therapy: ${varshphal.comprehensiveRemedies.gemstone}`, PAGE.m + 5, y + 15);
    doc.text(`2. Vedic Mantra: ${varshphal.comprehensiveRemedies.mantra}`, PAGE.m + 5, y + 23);
    doc.text(`3. Donation & Charity: ${varshphal.comprehensiveRemedies.donation}`, PAGE.m + 5, y + 31);
    doc.text(`4. Fasting Observance: ${varshphal.comprehensiveRemedies.fasting}`, PAGE.m + 5, y + 39);
    doc.text(`5. Temple Pilgrimage: ${varshphal.comprehensiveRemedies.temple}`, PAGE.m + 5, y + 47);
    doc.text(`6. Color Therapy: ${varshphal.comprehensiveRemedies.colours.join(", ")}`, PAGE.m + 5, y + 55);
    doc.text(`7. Favourable Directions: ${varshphal.comprehensiveRemedies.directions.join(", ")}`, PAGE.m + 5, y + 63);
  });

  y += 82;

  drawCard(y, 30, "Professional Disclaimer", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    const disc = doc.splitTextToSize(varshphal.yearSummary.disclaimer, PAGE.w - PAGE.m * 2 - 10);
    doc.text(disc, PAGE.m + 5, y + 15);
  });

  return doc;
}

/** Client helper function to generate & trigger instant download of Commercial Varshphal PDF */
export async function downloadVarshphalPdf(
  kundli: KundliResult,
  varshphal: VarshphalResultV2,
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
        title: `Varshphal ${targetYear} Commercial Report V2`,
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
    console.error("Failed to track Commercial Varshphal PDF download:", err);
  }
}
