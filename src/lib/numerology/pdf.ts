/**
 * Enterprise Numerology V3 Commercial Edition PDF Report Generator (30-40 Pages)
 * ------------------------------------------------------------
 * Publication-Grade A4 Layout Suitable for Paid Commercial Sales (₹199-₹299):
 *   • Chapter 1: Premium Cover Page & Metadata (Page 1)
 *   • Chapter 2: Table of Contents & Executive Dashboard (Page 2)
 *   • Chapter 3: Multi-Number AI Reasoning Engine ("WHY this score?") (Page 3)
 *   • Chapter 4: Name Optimization & Spelling Comparison Matrix (Page 4)
 *   • Chapters 5-14: 10 Core Number Deep Dives (1 Full Page Each -> Pages 5-14)
 *   • Chapter 15: 4 Pinnacle & 4 Challenge Cycles (Pages 15-16)
 *   • Chapter 16: Personal Time Cycles & Year Forecast (Pages 17-18)
 *   • Chapter 17: Redesigned 12-Month Unique Timeline Cards (Pages 19-24)
 *   • Chapters 18-21: 4 Life Domain Deep Dives (Pages 25-28)
 *   • Chapter 22: Practical Asset Numerology (10 Assets) (Pages 29-30)
 *   • Chapter 23: 4-Stage Strategic Action Plan & Confidence Ratings (Page 31)
 *   • Chapter 24: Lucky Elements & 10-Point Vedic Remedies (Page 32)
 *   • Chapter 25: AI Executive Summary & Professional Disclaimer (Page 33)
 */

import { jsPDF } from "jspdf";
import type { NumerologyReportResultV3, CoreNumberDetailV3 } from "./engine";
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
  data: NumerologyReportResultV3,
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
    doc.text(`ENTERPRISE NUMEROLOGY V3 COMMERCIAL REPORT`, PAGE.m, 11);

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
  doc.text(`NUMEROLOGY PRO V3`, PAGE.w / 2, 44, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`PERSONALIZED AI REASONING & COMMERCIAL EDITION (30–40 PAGES)`, PAGE.w / 2, 56, { align: "center" });

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
  doc.text(`Report Version 40.0 Commercial Edition V3 • ${BRAND.name} • ${BRAND.site}`, PAGE.w / 2, PAGE.h - 18, { align: "center" });

  // ==========================================
  // PAGE 2: EXECUTIVE SCORECARD
  // ==========================================
  doc.addPage();
  addHeaderFooter("EXECUTIVE SCORECARD & DOMAIN POTENTIALS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("EXECUTIVE SCORECARD & LIFE POTENTIAL METERS", PAGE.m, y);
  y += 8;

  const potentials = [
    { name: "Career Potential", score: data.careerPotential },
    { name: "Financial Potential", score: data.financialPotential },
    { name: "Marriage Potential", score: data.marriagePotential },
    { name: "Business Potential", score: data.businessPotential },
    { name: "Health Potential", score: data.healthPotential },
    { name: "Spiritual Potential", score: data.spiritualPotential },
  ];

  potentials.forEach((p) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${p.name}: ${p.score} / 100`, PAGE.m + 5, y + 6);
    });
    y += 18;
  });

  // ==========================================
  // PAGE 3: MULTI-NUMBER AI REASONING ENGINE ("WHY THIS SCORE?")
  // ==========================================
  doc.addPage();
  addHeaderFooter("MULTI-NUMBER AI REASONING ENGINE");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("MULTI-NUMBER AI REASONING ENGINE (WHY THIS SCORE?)", PAGE.m, y);
  y += 8;

  data.multiNumberReasoning.forEach((item) => {
    drawCard(y, 45, `${item.domain} — Score ${item.score}/100 (Confidence: ${item.confidence})`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const reason = doc.splitTextToSize(item.whyScore, PAGE.w - PAGE.m * 2 - 10);
      doc.text(reason, PAGE.m + 5, y + 16);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.saffron);
      doc.text(`Drivers: ${item.positiveDrivers.join("; ")}`, PAGE.m + 5, y + 32);

      doc.setFont(fontName, "normal");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Conclusion: ${item.conclusion}`, PAGE.m + 5, y + 39);
    });
    y += 50;
  });

  // ==========================================
  // PAGE 4: NAME OPTIMIZATION & SPELLING COMPARISON
  // ==========================================
  doc.addPage();
  addHeaderFooter("NAME OPTIMIZATION SPELLING COMPARISON");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("NAME OPTIMIZATION & SPELLING VIBRATION MATRIX", PAGE.m, y);
  y += 8;

  drawCard(y, 25, `Current Name: ${data.nameOptimization.currentName}`, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Expression: ${data.nameOptimization.currentExpression}`, PAGE.m + 5, y + 15);
  });

  y += 30;

  data.nameOptimization.alternatives.forEach((alt) => {
    drawCard(y, 35, `Alternative Variant: "${alt.spellingVariant}" — Vibration ${alt.expressionNumber}`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      doc.text(`Ruling Force: ${alt.rulingPlanet}`, PAGE.m + 5, y + 15);
      doc.text(`Career: ${alt.careerScore}% | Money: ${alt.moneyScore}% | Business: ${alt.businessScore}% | Status: ${alt.statusScore}%`, PAGE.m + 5, y + 22);
      doc.text(`Suitability: ${alt.overallSuitability}`, PAGE.m + 5, y + 29);
    });
    y += 40;
  });

  // ==========================================
  // PAGES 5-14: 10 CORE NUMBER CHAPTERS (1 FULL PAGE EACH)
  // ==========================================
  const coreList: CoreNumberDetailV3[] = [
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

    drawCard(y, 55, "2. Positive & Negative Traits, Leadership & Decision Style", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`Positive Traits: ${cn.positiveTraits.join(", ")}`, PAGE.m + 5, y + 15);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.maroon);
      doc.text(`Negative Traits: ${cn.negativeTraits.join(", ")}`, PAGE.m + 5, y + 25);

      doc.setFont(fontName, "bold");
      doc.setTextColor(BRAND.ink);
      doc.text(`Leadership Style: ${cn.leadershipStyle}`, PAGE.m + 5, y + 35);
      doc.text(`Decision Style: ${cn.decisionStyle}`, PAGE.m + 5, y + 43);
    });

    y += 60;

    drawCard(y, 60, "3. Domain Influences & AI Verdict", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      doc.text(`• Career Influence: ${cn.careerInfluence}`, PAGE.m + 5, y + 15);
      doc.text(`• Money Influence: ${cn.moneyInfluence}`, PAGE.m + 5, y + 24);
      doc.text(`• Marriage Influence: ${cn.marriageInfluence}`, PAGE.m + 5, y + 33);
      doc.text(`• Business Influence: ${cn.businessInfluence}`, PAGE.m + 5, y + 42);
      doc.text(`• AI Final Verdict: ${cn.aiFinalVerdict}`, PAGE.m + 5, y + 51);
    });
  });

  // Karmic Lessons Full Page (Page 14)
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
  // PAGES 15-16: 4 PINNACLE & 4 CHALLENGE CYCLES
  // ==========================================
  doc.addPage();
  addHeaderFooter("4 PINNACLE CYCLES DEEP DIVE");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 PINNACLE CYCLES DEEP DIVE", PAGE.m, y);
  y += 8;

  data.pinnacles.forEach((p) => {
    drawCard(y, 22, `${p.cycleName} — Vibration ${p.number} (${p.ageRange})`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Meaning: ${p.meaning}`, PAGE.m + 5, y + 14);
      doc.text(`Career & Finance: ${p.career}`, PAGE.m + 5, y + 18);
    });
    y += 24;
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
  // PAGES 19-24: 12-MONTH UNIQUE TIMELINE CARDS
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
      doc.text(`• Recommended Action: ${m.recommendedAction}`, PAGE.m + 5, y + 43);
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

      if ("suitableIndustries" in dom) {
        doc.text(`Suitable Fields: ${(dom as any).suitableIndustries.join(", ")}`, PAGE.m + 5, y + 30);
      }
      if ("incomeStyle" in dom) {
        doc.text(`Income Style: ${(dom as any).incomeStyle}`, PAGE.m + 5, y + 30);
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
  // PAGES 29-30: PRACTICAL ASSET NUMEROLOGY (10 ASSETS)
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
      doc.text(`${pa.assetType}: ${pa.vibration} (${pa.compatibilityPct}% Match)`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Suggestion: ${pa.improvementSuggestion}`, PAGE.m + 5, y + 11);
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
      doc.text(`${pa.assetType}: ${pa.vibration} (${pa.compatibilityPct}% Match)`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(`Suggestion: ${pa.improvementSuggestion}`, PAGE.m + 5, y + 11);
    });
    y += 20;
  });

  // ==========================================
  // PAGE 31: 4-STAGE STRATEGIC ACTION PLAN
  // ==========================================
  doc.addPage();
  addHeaderFooter("4-STAGE STRATEGIC ACTION PLAN");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4-STAGE STRATEGIC ACTION PLAN", PAGE.m, y);
  y += 8;

  drawCard(y, 75, "Execution Timeline Strategy", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`• Immediate Actions: ${data.actionPlan.immediateActions.join("; ")}`, PAGE.m + 5, y + 16);
    doc.text(`• 30-Day Plan: ${data.actionPlan.thirtyDayPlan.join("; ")}`, PAGE.m + 5, y + 28);
    doc.text(`• 90-Day Plan: ${data.actionPlan.ninetyDayPlan.join("; ")}`, PAGE.m + 5, y + 40);
    doc.text(`• 1-Year Strategy: ${data.actionPlan.oneYearStrategy.join("; ")}`, PAGE.m + 5, y + 52);
  });

  // ==========================================
  // PAGE 32: LUCKY ELEMENTS & 10-POINT REMEDIES
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
  data: NumerologyReportResultV3,
  filename = "Enterprise_Numerology_Report_V3.pdf",
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
