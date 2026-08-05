/**
 * Enterprise Numerology V2 Commercial Edition PDF Report Generator (30-40 Pages)
 * ------------------------------------------------------------
 * Publication-Grade A4 Layout Suitable for Paid Commercial Sales (₹199-₹299):
 *   • Chapter 1: Cover Page & Profile Metadata (Page 1)
 *   • Chapter 2: Table of Contents & Executive Dashboard (Page 2)
 *   • Chapters 3-12: 10 Core Number Deep Dives (1 Full Page Each -> Pages 3-12)
 *   • Chapter 13: 4 Pinnacle Cycles Deep Dive (Pages 13-14)
 *   • Chapter 14: 4 Challenge Cycles Deep Dive (Pages 15-16)
 *   • Chapter 15: Personal Time Cycles & Year Forecast (Pages 17-18)
 *   • Chapter 16: Redesigned 12-Month Unique Timeline Cards (Pages 19-24)
 *   • Chapters 17-20: 4 Life Domain Deep Dives (Pages 25-28)
 *   • Chapter 21: Expanded Practical Asset Numerology (Pages 29-30)
 *   • Chapter 22: Lucky Elements & 10-Point Vedic Remedies (Page 31)
 *   • Chapter 23: AI Executive Summary & Professional Disclaimer (Page 32)
 */

import { jsPDF } from "jspdf";
import type { NumerologyReportResultV2, CoreNumberDetailV2 } from "./engine";
import { ensurePdfFont, type PdfLang } from "@/lib/kundli/pdf-i18n";
import { trackPdfDownload, trackReportGenerated } from "@/lib/workspace/tracker";
import { supabase } from "@/integrations/supabase/client";

export interface NumerologyPdfOptions {
  filename?: string;
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

export async function generateNumerologyPDF(
  data: NumerologyReportResultV2,
  opts: NumerologyPdfOptions = {},
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lang: PdfLang = opts.language || "en";
  const fontName = await ensurePdfFont(doc, lang);

  let currentPageIndex = 0;

  const addHeaderFooter = (title: string) => {
    currentPageIndex++;
    if (currentPageIndex === 1) return; // Cover page custom styling

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
    doc.text(`ENTERPRISE NUMEROLOGY V2 COMMERCIAL REPORT`, PAGE.m, 11);

    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    doc.text(title, PAGE.w - PAGE.m, 11, { align: "right" });

    // Footer
    doc.line(PAGE.m, PAGE.h - 14, PAGE.w - PAGE.m, PAGE.h - 14);
    doc.setFontSize(8);
    doc.text(`${BRAND.name} Commercial Numerology Suite • ${BRAND.site}`, PAGE.m, PAGE.h - 8);
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
  // PAGE 1: PREMIUM COVER PAGE
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

  // Header Banner
  doc.setFillColor(BRAND.maroon);
  doc.rect(14, 25, PAGE.w - 28, 45, "F");

  doc.setFont(fontName, "bold");
  doc.setFontSize(22);
  doc.setTextColor("#FFFFFF");
  doc.text(`NUMEROLOGY PRO V2`, PAGE.w / 2, 44, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`COMMERCIAL EDITION (30–40 PAGES ENTERPRISE REPORT)`, PAGE.w / 2, 56, { align: "center" });

  // Metadata Box
  let y = 82;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 48, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("NUMEROLOGY PROFILE METADATA", PAGE.m + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  doc.text(`Full Birth Name: ${data.name}`, PAGE.m + 6, y + 20);
  doc.text(`Date of Birth: ${data.dob}`, PAGE.m + 6, y + 27);
  doc.text(`Overall Score: ${data.overallScore} / 100`, PAGE.m + 6, y + 34);

  doc.text(`Life Path Number: ${data.coreNumbers.lifePath.number} (${data.coreNumbers.lifePath.rulingPlanet})`, PAGE.w / 2 + 5, y + 20);
  doc.text(`Destiny Number: ${data.coreNumbers.destiny.number} (${data.coreNumbers.destiny.rulingPlanet})`, PAGE.w / 2 + 5, y + 27);
  doc.text(`Soul Urge Number: ${data.coreNumbers.soulUrge.number}`, PAGE.w / 2 + 5, y + 34);

  // Score Dashboard Card
  y = 140;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 60, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.maroon);
  doc.text(`EXECUTIVE NUMEROLOGY SCORE: ${data.overallScore} / 100`, PAGE.m + 6, y + 12);
  doc.setFontSize(9.5);
  doc.setTextColor(BRAND.saffron);
  doc.text(`Career Potential: ${data.careerPotential}% | Financial Potential: ${data.financialPotential}%`, PAGE.m + 6, y + 22);

  doc.setFontSize(8.5);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.muted);
  doc.text(`• Top Advantage: ${data.summary.strengths[0]}`, PAGE.m + 6, y + 36);
  doc.text(`• Primary Focus: ${data.summary.recommendations[0]}`, PAGE.m + 6, y + 44);

  doc.setFontSize(8);
  doc.text(`Report Version 40.0 Commercial Edition V2 • ${BRAND.name} • ${BRAND.site}`, PAGE.w / 2, PAGE.h - 18, { align: "center" });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & SCORECARD
  // ==========================================
  doc.addPage();
  addHeaderFooter("EXECUTIVE SCORECARD & DOMAIN POTENTIALS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("EXECUTIVE SCORECARD & LIFE POTENTIAL METERS", PAGE.m, y);
  y += 8;

  data.scorecard.forEach((sc) => {
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
  // PAGES 3-12: 10 CORE NUMBER CHAPTERS (1 FULL PAGE EACH)
  // ==========================================
  const coreList: CoreNumberDetailV2[] = [
    data.coreNumbers.lifePath,
    data.coreNumbers.destiny,
    data.coreNumbers.soulUrge,
    data.coreNumbers.personality,
    data.coreNumbers.birthday,
    data.coreNumbers.maturity,
    data.coreNumbers.attitude,
    data.coreNumbers.balance,
    data.coreNumbers.hiddenPassion,
  ];

  coreList.forEach((cn, idx) => {
    doc.addPage();
    addHeaderFooter(`CORE NUMBER DEEP DIVE: ${cn.title.toUpperCase()}`);
    y = 24;

    doc.setFont(fontName, "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.maroon);
    doc.text(`${idx + 1}. ${cn.title.toUpperCase()} — NUMBER ${cn.number} (${cn.rulingPlanet})`, PAGE.m, y);
    y += 8;

    drawCard(y, 40, "1. Core Meaning & Ruling Vibration", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const mean = doc.splitTextToSize(`Meaning: ${cn.meaning}`, PAGE.w - PAGE.m * 2 - 10);
      doc.text(mean, PAGE.m + 5, y + 15);
      doc.text(`Ruling Force: ${cn.rulingPlanet}`, PAGE.m + 5, y + 30);
    });

    y += 45;

    drawCard(y, 55, "2. Strengths, Weaknesses & Leadership Style", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Key Strengths: ${cn.strengths.join(", ")}`, PAGE.m + 5, y + 15);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Weaknesses to Guard: ${cn.weaknesses.join(", ")}`, PAGE.m + 5, y + 25);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.ink);
      doc.text(`Leadership Style: ${cn.leadershipStyle}`, PAGE.m + 5, y + 35);
      doc.text(`Communication Style: ${cn.communicationStyle}`, PAGE.m + 5, y + 43);
    });

    y += 60;

    drawCard(y, 60, "3. Domain Impacts & Recommended Actions", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      doc.text(`• Career Impact: ${cn.careerImpact}`, PAGE.m + 5, y + 15);
      doc.text(`• Finance Impact: ${cn.financeImpact}`, PAGE.m + 5, y + 24);
      doc.text(`• Marriage Impact: ${cn.marriageImpact}`, PAGE.m + 5, y + 33);
      doc.text(`• Recommended Action: ${cn.recommendedActions[0]}`, PAGE.m + 5, y + 42);
      doc.text(`• AI Summary: ${cn.aiSummary}`, PAGE.m + 5, y + 51);
    });
  });

  // Karmic Lessons Full Page (Page 12)
  doc.addPage();
  addHeaderFooter("KARMIC LESSON NUMBERS & MISSING VIBRATIONS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("10. KARMIC LESSON NUMBERS & MISSING VIBRATIONS", PAGE.m, y);
  y += 8;

  drawCard(y, 60, `Missing Karmic Digits: ${data.coreNumbers.karmicLessons.missingNumbers.join(", ") || "None (Fully Balanced)"}`, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    const mean = doc.splitTextToSize(data.coreNumbers.karmicLessons.meaning, PAGE.w - PAGE.m * 2 - 10);
    doc.text(mean, PAGE.m + 5, y + 16);

    const rem = doc.splitTextToSize(`Remedies: ${data.coreNumbers.karmicLessons.remedies}`, PAGE.w - PAGE.m * 2 - 10);
    doc.text(rem, PAGE.m + 5, y + 36);
  });

  // ==========================================
  // PAGES 13-14: 4 PINNACLE CYCLES
  // ==========================================
  doc.addPage();
  addHeaderFooter("4 PINNACLE CYCLES DEEP DIVE (PART 1)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 PINNACLE CYCLES DEEP DIVE (PHASES 1 & 2)", PAGE.m, y);
  y += 8;

  [data.pinnacles[0], data.pinnacles[1]].forEach((p) => {
    if (p) {
      drawCard(y, 45, `${p.cycleName} — Vibration ${p.number} (${p.ageRange})`, () => {
        doc.setFont(fontName, "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(BRAND.ink);
        doc.text(`Meaning: ${p.meaning}`, PAGE.m + 5, y + 15);
        doc.text(`Career: ${p.career}`, PAGE.m + 5, y + 23);
        doc.text(`Finance & Relationships: ${p.finance}`, PAGE.m + 5, y + 31);
      });
      y += 50;
    }
  });

  doc.addPage();
  addHeaderFooter("4 PINNACLE CYCLES DEEP DIVE (PART 2)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 PINNACLE CYCLES DEEP DIVE (PHASES 3 & 4)", PAGE.m, y);
  y += 8;

  [data.pinnacles[2], data.pinnacles[3]].forEach((p) => {
    if (p) {
      drawCard(y, 45, `${p.cycleName} — Vibration ${p.number} (${p.ageRange})`, () => {
        doc.setFont(fontName, "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(BRAND.ink);
        doc.text(`Meaning: ${p.meaning}`, PAGE.m + 5, y + 15);
        doc.text(`Career: ${p.career}`, PAGE.m + 5, y + 23);
        doc.text(`Finance & Relationships: ${p.finance}`, PAGE.m + 5, y + 31);
      });
      y += 50;
    }
  });

  // ==========================================
  // PAGES 15-16: 4 CHALLENGE CYCLES
  // ==========================================
  doc.addPage();
  addHeaderFooter("4 CHALLENGE CYCLES DEEP DIVE (PART 1)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 CHALLENGE CYCLES DEEP DIVE (CHALLENGES 1 & 2)", PAGE.m, y);
  y += 8;

  [data.challenges[0], data.challenges[1]].forEach((c) => {
    if (c) {
      drawCard(y, 45, `${c.cycleName} — Challenge ${c.number}`, () => {
        doc.setFont(fontName, "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(BRAND.ink);
        doc.text(`Why Occurs: ${c.whyOccurs}`, PAGE.m + 5, y + 15);
        doc.text(`What to Avoid: ${c.whatToAvoid}`, PAGE.m + 5, y + 23);
        doc.text(`Remedies: ${c.remedies}`, PAGE.m + 5, y + 31);
      });
      y += 50;
    }
  });

  doc.addPage();
  addHeaderFooter("4 CHALLENGE CYCLES DEEP DIVE (PART 2)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 CHALLENGE CYCLES DEEP DIVE (CHALLENGES 3 & 4)", PAGE.m, y);
  y += 8;

  [data.challenges[2], data.challenges[3]].forEach((c) => {
    if (c) {
      drawCard(y, 45, `${c.cycleName} — Challenge ${c.number}`, () => {
        doc.setFont(fontName, "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(BRAND.ink);
        doc.text(`Why Occurs: ${c.whyOccurs}`, PAGE.m + 5, y + 15);
        doc.text(`What to Avoid: ${c.whatToAvoid}`, PAGE.m + 5, y + 23);
        doc.text(`Remedies: ${c.remedies}`, PAGE.m + 5, y + 31);
      });
      y += 50;
    }
  });

  // ==========================================
  // PAGES 17-18: PERSONAL YEAR & TIME CYCLES
  // ==========================================
  doc.addPage();
  addHeaderFooter("PERSONAL YEAR & ANNUAL TIME CYCLES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("PERSONAL YEAR FORECAST", PAGE.m, y);
  y += 8;

  drawCard(y, 70, data.personalYear.theme, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`• Career: ${data.personalYear.career}`, PAGE.m + 5, y + 16);
    doc.text(`• Finance: ${data.personalYear.finance}`, PAGE.m + 5, y + 24);
    doc.text(`• Relationships: ${data.personalYear.marriage}`, PAGE.m + 5, y + 32);
    doc.text(`• Health & Stamina: ${data.personalYear.health}`, PAGE.m + 5, y + 40);
    doc.text(`• Opportunities: ${data.personalYear.opportunities}`, PAGE.m + 5, y + 48);
    doc.text(`• Action Plan: ${data.personalYear.actionPlan}`, PAGE.m + 5, y + 56);
  });

  // ==========================================
  // PAGES 19-24: 12-MONTH UNIQUE TIMELINE CARDS (2 MONTHS PER PAGE)
  // ==========================================
  data.monthlyTimeline.forEach((m, idx) => {
    if (idx % 2 === 0) {
      doc.addPage();
      addHeaderFooter(`12-MONTH TIMELINE (${m.monthName})`);
      y = 24;
    }

    doc.setFont(fontName, "bold");
    doc.setFontSize(13);
    doc.setTextColor(BRAND.maroon);
    doc.text(`MONTH ${m.monthNumber}: ${m.monthName.toUpperCase()} (VIBRATION ${m.number})`, PAGE.m, y);
    y += 6;

    drawCard(y, 55, `Dates: ${m.startDate} – ${m.endDate} | Opp Score: ${m.opportunityLevel}% | Risk Score: ${m.riskLevel}%`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`• Career: ${m.career}`, PAGE.m + 5, y + 15);
      doc.text(`• Finance: ${m.finance}`, PAGE.m + 5, y + 22);
      doc.text(`• Relationships: ${m.relationships}`, PAGE.m + 5, y + 29);
      doc.text(`• Travel & Biz: ${m.travel}`, PAGE.m + 5, y + 36);
      doc.text(`• Recommended Action: ${m.recommendedActions}`, PAGE.m + 5, y + 43);
    });

    y += 60;
  });

  // ==========================================
  // PAGES 25-28: 4 LIFE DOMAIN DEEP DIVES
  // ==========================================
  const domainKeys: Array<keyof typeof data.domains> = ["career", "finance", "marriage", "health"];
  domainKeys.forEach((key) => {
    const dom = data.domains[key];
    doc.addPage();
    addHeaderFooter(`DOMAIN DEEP DIVE: ${key.toUpperCase()}`);
    y = 24;

    doc.setFont(fontName, "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.maroon);
    doc.text(`LIFE DOMAIN DEEP DIVE: ${key.toUpperCase()}`, PAGE.m, y);
    y += 8;

    drawCard(y, 60, "Executive Overview & Insights", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const sum = doc.splitTextToSize(dom.summary, PAGE.w - PAGE.m * 2 - 10);
      doc.text(sum, PAGE.m + 5, y + 15);

      if ("suitableCareers" in dom) {
        doc.text(`Suitable Fields: ${(dom as any).suitableCareers.join(", ")}`, PAGE.m + 5, y + 30);
      }
      if ("wealthBuilding" in dom) {
        doc.text(`Wealth Building: ${(dom as any).wealthBuilding}`, PAGE.m + 5, y + 30);
      }
      if ("relationshipStyle" in dom) {
        doc.text(`Relationship Style: ${(dom as any).relationshipStyle}`, PAGE.m + 5, y + 30);
      }
      if ("stressPatterns" in dom) {
        doc.text(`Stress Patterns: ${(dom as any).stressPatterns}`, PAGE.m + 5, y + 30);
      }
    });
  });

  // ==========================================
  // PAGES 29-30: PRACTICAL ASSET NUMEROLOGY (9 ASSETS)
  // ==========================================
  doc.addPage();
  addHeaderFooter("PRACTICAL ASSET NUMEROLOGY (PART 1)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("PRACTICAL ASSET NUMEROLOGY (NAME, MOBILE, VEHICLE, HOUSE)", PAGE.m, y);
  y += 8;

  data.practicalAssets.slice(0, 5).forEach((pa) => {
    drawCard(y, 18, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${pa.assetType}: ${pa.vibration} (${pa.compatibility})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Suggestion: ${pa.suggestion}`, PAGE.m + 5, y + 11);
    });
    y += 20;
  });

  doc.addPage();
  addHeaderFooter("PRACTICAL ASSET NUMEROLOGY (PART 2)");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("PRACTICAL ASSET NUMEROLOGY (BIZ, EMAIL, BRAND, COMPANY, USERNAME)", PAGE.m, y);
  y += 8;

  data.practicalAssets.slice(5).forEach((pa) => {
    drawCard(y, 18, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${pa.assetType}: ${pa.vibration} (${pa.compatibility})`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Suggestion: ${pa.suggestion}`, PAGE.m + 5, y + 11);
    });
    y += 20;
  });

  // ==========================================
  // PAGE 31: LUCKY ELEMENTS & 10-POINT REMEDIES
  // ==========================================
  doc.addPage();
  addHeaderFooter("LUCKY ELEMENTS & 10-POINT REMEDIES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("LUCKY ELEMENTS & 10-POINT REMEDIES", PAGE.m, y);
  y += 8;

  drawCard(y, 75, "10-Point Personalized Numerology Remedies", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`1. Daily Mantra: ${data.remedies.mantras[0]}`, PAGE.m + 5, y + 15);
    doc.text(`2. Fasting Day: ${data.remedies.fasting}`, PAGE.m + 5, y + 23);
    doc.text(`3. Charity: ${data.remedies.charity}`, PAGE.m + 5, y + 31);
    doc.text(`4. Color Therapy: ${data.remedies.colours.join(", ")}`, PAGE.m + 5, y + 39);
    doc.text(`5. Gemstone: ${data.luckyElements.gemstones.join(", ")}`, PAGE.m + 5, y + 47);
    doc.text(`6. Lifestyle Alignment: ${data.remedies.lifestyle[0]}`, PAGE.m + 5, y + 55);
  });

  y += 82;

  drawCard(y, 30, "Professional Disclaimer", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    const disc = doc.splitTextToSize(data.summary.disclaimer, PAGE.w - PAGE.m * 2 - 10);
    doc.text(disc, PAGE.m + 5, y + 15);
  });

  return doc;
}

/** Client helper function to generate & trigger instant download of Commercial Numerology PDF */
export async function downloadNumerologyPdf(
  data: NumerologyReportResultV2,
  filename = "Enterprise_Numerology_Report_V2.pdf",
  opts: NumerologyPdfOptions = {},
): Promise<void> {
  const doc = await generateNumerologyPDF(data, opts);
  doc.save(filename);

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;

    if (userId) {
      await trackReportGenerated(userId, {
        title: `Enterprise Numerology Report (${data.name})`,
        kind: "numerology",
        language: opts.language || "en",
        data: {
          name: data.name,
          dob: data.dob,
          lifePath: data.coreNumbers.lifePath.number,
          destiny: data.coreNumbers.destiny.number,
          overallScore: data.overallScore,
        },
      });

      await trackPdfDownload(userId, {
        filename,
        language: opts.language || "en",
        file_type: "PDF",
      });
    }
  } catch (err) {
    console.error("Failed to track Commercial Numerology PDF download:", err);
  }
}
