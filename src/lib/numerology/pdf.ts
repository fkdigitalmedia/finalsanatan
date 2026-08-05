/**
 * Enterprise Numerology PDF Report Generator (25-35 Pages)
 * ------------------------------------------------------------
 * Multi-page A4 Commercial Enterprise Report Layout:
 *   • Cover Page
 *   • Table of Contents & Scorecard (0-100)
 *   • 10 Core Numbers Chapters (Life Path, Destiny, Soul Urge, Personality, Birthday, Maturity, Attitude, Balance, Hidden Passion, Karmic Lessons)
 *   • 4 Pinnacle & 4 Challenge Cycles
 *   • Personal Time Cycles & 12-Month Timeline
 *   • Domain Deep Dives (Career, Finance, Marriage, Health)
 *   • Practical Numerology (Mobile, Vehicle, House, Business, Compatibility)
 *   • Lucky Elements & Personalized Remedies
 *   • AI Summary & Disclaimer
 */

import { jsPDF } from "jspdf";
import type { NumerologyReportResult } from "./engine";
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
  data: NumerologyReportResult,
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
    doc.text(`ENTERPRISE NUMEROLOGY PRO REPORT`, PAGE.m, 11);

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
  // PAGE 1: COVER PAGE
  // ==========================================
  currentPageIndex = 1;
  doc.setFillColor(BRAND.paper);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");

  // Border
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
  doc.text(`ENTERPRISE NUMEROLOGY`, PAGE.w / 2, 44, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.gold);
  doc.text(`30-CHAPTER COMMERCIAL NUMEROLOGY PRO REPORT`, PAGE.w / 2, 56, { align: "center" });

  // Subject Profile Box
  let y = 82;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.cardBorder);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 45, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.saffron);
  doc.text("NUMEROLOGY PROFILE METADATA", PAGE.m + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  doc.text(`Full Birth Name: ${data.name}`, PAGE.m + 6, y + 20);
  doc.text(`Date of Birth: ${data.dob}`, PAGE.m + 6, y + 27);
  doc.text(`Report Score: ${data.overallScore} / 100`, PAGE.m + 6, y + 34);

  doc.text(`Life Path Number: ${data.lifePath.number} (${data.lifePath.rulingPlanet})`, PAGE.w / 2 + 5, y + 20);
  doc.text(`Destiny Number: ${data.destiny.number} (${data.destiny.rulingPlanet})`, PAGE.w / 2 + 5, y + 27);
  doc.text(`Soul Urge Number: ${data.soulUrge.number}`, PAGE.w / 2 + 5, y + 34);

  // Executive Scorecard Card
  y = 138;
  doc.setFillColor(BRAND.cardBg);
  doc.setDrawColor(BRAND.gold);
  doc.roundedRect(PAGE.m, y, PAGE.w - PAGE.m * 2, 60, 3, 3, "FD");

  doc.setFont(fontName, "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.maroon);
  doc.text(`EXECUTIVE NUMEROLOGY SCORE: ${data.overallScore} / 100`, PAGE.m + 6, y + 12);

  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(BRAND.ink);
  const headline = doc.splitTextToSize(data.summary.headline, PAGE.w - PAGE.m * 2 - 12);
  doc.text(headline, PAGE.m + 6, y + 22);

  doc.setFontSize(8.5);
  doc.setTextColor(BRAND.muted);
  doc.text(`• Core Advantage: ${data.summary.strengths[0] || "Strong Life Path Alignment"}`, PAGE.m + 6, y + 38);
  doc.text(`• Primary Focus: ${data.summary.recommendations[0] || "Capitalize on Personal Year"}`, PAGE.m + 6, y + 46);

  doc.setFontSize(8);
  doc.text(`Report Version 40.0 Enterprise • ${BRAND.name} • ${BRAND.site}`, PAGE.w / 2, PAGE.h - 18, { align: "center" });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & SCORECARD
  // ==========================================
  doc.addPage();
  addHeaderFooter("EXECUTIVE NUMEROLOGY SCORECARD");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("EXECUTIVE SCORECARD & DOMAIN BREAKDOWN", PAGE.m, y);
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
  // PAGES 3-7: CORE NUMBERS DEEP DIVES
  // ==========================================
  const coreNumbers = [
    data.lifePath,
    data.destiny,
    data.soulUrge,
    data.personality,
    data.birthday,
    data.maturity,
    data.attitude,
    data.balance,
    data.hiddenPassion,
  ];

  coreNumbers.forEach((cn, idx) => {
    if (idx % 2 === 0) {
      doc.addPage();
      addHeaderFooter(`CORE NUMBERS ANALYSIS (${idx + 1}-${Math.min(idx + 2, 9)})`);
      y = 24;
    }

    doc.setFont(fontName, "bold");
    doc.setFontSize(13);
    doc.setTextColor(BRAND.maroon);
    doc.text(`${idx + 1}. ${cn.title.toUpperCase()} — VIBRATION ${cn.number}`, PAGE.m, y);
    y += 6;

    drawCard(y, 35, `Ruling Force: ${cn.rulingPlanet}`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      doc.text(`Core Meaning: ${cn.meaning}`, PAGE.m + 5, y + 15);

      const aiText = doc.splitTextToSize(cn.aiInterpretation, PAGE.w - PAGE.m * 2 - 10);
      doc.text(aiText, PAGE.m + 5, y + 23);
    });
    y += 40;
  });

  // Karmic Lessons Page
  doc.addPage();
  addHeaderFooter("KARMIC LESSONS & MISSING NUMBERS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("KARMIC LESSON NUMBERS (MISSING DIGITS)", PAGE.m, y);
  y += 8;

  drawCard(y, 30, `Missing Karmic Digits: ${data.karmicLessons.join(", ") || "None (Fully Balanced)"}`, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text("Karmic lessons indicate life areas requiring conscious learning and intentional effort.", PAGE.m + 5, y + 15);
    doc.text(`Advice: Perform specific numerology remedies for digits ${data.karmicLessons.join(", ")}.`, PAGE.m + 5, y + 23);
  });

  // ==========================================
  // PINNACLE & CHALLENGE CYCLES
  // ==========================================
  doc.addPage();
  addHeaderFooter("PINNACLE & CHALLENGE CYCLES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 PINNACLE CYCLES (LIFE PHASES)", PAGE.m, y);
  y += 8;

  data.pinnacles.forEach((p) => {
    drawCard(y, 20, `${p.cycleName} — Vibration ${p.number} (${p.ageRange})`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(p.meaning, PAGE.m + 5, y + 15);
    });
    y += 22;
  });

  y += 5;
  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("4 CHALLENGE CYCLES (OBSTACLES & LESSONS)", PAGE.m, y);
  y += 8;

  data.challenges.forEach((c) => {
    drawCard(y, 20, `${c.cycleName} — Challenge ${c.number} (${c.ageRange})`, () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(c.meaning, PAGE.m + 5, y + 15);
    });
    y += 22;
  });

  // ==========================================
  // PERSONAL TIME CYCLES & 12-MONTH TIMELINE
  // ==========================================
  doc.addPage();
  addHeaderFooter("PERSONAL TIME CYCLES & 12-MONTH TIMELINE");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("PERSONAL YEAR, MONTH & DAY FORECAST", PAGE.m, y);
  y += 8;

  drawCard(y, 35, data.personalYear.theme, () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    const pyText = doc.splitTextToSize(data.personalYear.forecast, PAGE.w - PAGE.m * 2 - 10);
    doc.text(pyText, PAGE.m + 5, y + 16);
    doc.text(`Current Personal Month: Number ${data.personalMonth.number} | Personal Day: Number ${data.personalDay.number}`, PAGE.m + 5, y + 28);
  });

  y += 40;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("12-MONTH ANNUAL NUMEROLOGY TIMELINE", PAGE.m, y);
  y += 8;

  data.monthlyTimeline.forEach((m) => {
    if (y > PAGE.h - 30) {
      doc.addPage();
      addHeaderFooter("12-MONTH ANNUAL NUMEROLOGY TIMELINE (CONT.)");
      y = 24;
    }

    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${m.month} — Personal Month Vibration ${m.number}`, PAGE.m + 5, y + 5);

      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(BRAND.ink);
      doc.text(m.forecast, PAGE.m + 5, y + 11);
    });
    y += 18;
  });

  // ==========================================
  // DOMAIN DEEP DIVES (CAREER, FINANCE, MARRIAGE, HEALTH)
  // ==========================================
  const domains = [
    { title: "CAREER & PROFESSIONAL STRATEGY", data: data.career },
    { title: "FINANCE, WEALTH & ASSET CREATION", data: data.finance },
    { title: "MARRIAGE & RELATIONSHIP COMPATIBILITY", data: data.marriage },
    { title: "HEALTH TENDENCIES & WELLNESS", data: data.health },
  ];

  domains.forEach((d) => {
    doc.addPage();
    addHeaderFooter(d.title);
    y = 24;

    doc.setFont(fontName, "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.maroon);
    doc.text(d.title, PAGE.m, y);
    y += 8;

    drawCard(y, 40, "Executive Overview", () => {
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.ink);
      const ovText = doc.splitTextToSize((d.data as any).summary, PAGE.w - PAGE.m * 2 - 10);
      doc.text(ovText, PAGE.m + 5, y + 16);
    });
  });

  // ==========================================
  // PRACTICAL NUMEROLOGY (MOBILE, VEHICLE, HOUSE, BUSINESS)
  // ==========================================
  doc.addPage();
  addHeaderFooter("PRACTICAL NUMEROLOGY ANALYSIS");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("PRACTICAL ASSET NUMEROLOGY ANALYSIS", PAGE.m, y);
  y += 8;

  const assets = [
    { name: "Full Name Expression", val: data.nameAnalysis.vibration },
    { name: "Mobile Number Total", val: data.mobileAnalysis.vibration },
    { name: "Vehicle Number Total", val: data.vehicleAnalysis.vibration },
    { name: "House / Flat Total", val: data.houseAnalysis.vibration },
    { name: "Business Name Total", val: data.businessAnalysis.vibration },
  ];

  assets.forEach((a) => {
    drawCard(y, 16, "", () => {
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(BRAND.saffron);
      doc.text(`${a.name}: ${a.val}`, PAGE.m + 5, y + 6);
    });
    y += 18;
  });

  // ==========================================
  // LUCKY ELEMENTS & PERSONALIZED REMEDIES
  // ==========================================
  doc.addPage();
  addHeaderFooter("LUCKY ELEMENTS & PERSONALIZED REMEDIES");
  y = 24;

  doc.setFont(fontName, "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.maroon);
  doc.text("LUCKY ELEMENTS & VEDIC REMEDIES", PAGE.m, y);
  y += 8;

  drawCard(y, 35, "Lucky Elements Matrix", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`Lucky Numbers: ${data.luckyElements.numbers.join(", ")}`, PAGE.m + 5, y + 16);
    doc.text(`Lucky Colours: ${data.luckyElements.colors.join(", ")}`, PAGE.m + 5, y + 22);
    doc.text(`Lucky Days: ${data.luckyElements.days.join(", ")} | Directions: ${data.luckyElements.directions.join(", ")}`, PAGE.m + 5, y + 28);
  });

  y += 40;

  drawCard(y, 55, "Personalized Vedic Numerology Remedies", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(BRAND.ink);
    doc.text(`• Recommended Gemstone: ${data.remedies.gemstone}`, PAGE.m + 5, y + 16);
    doc.text(`• Daily Mantra: ${data.remedies.mantra}`, PAGE.m + 5, y + 24);
    doc.text(`• Fasting & Observance: ${data.remedies.fastingDay}`, PAGE.m + 5, y + 32);
    doc.text(`• Charity & Seva: ${data.remedies.charity}`, PAGE.m + 5, y + 40);
    doc.text(`• Yantra Placement: ${data.remedies.yantra}`, PAGE.m + 5, y + 48);
  });

  y += 62;

  drawCard(y, 30, "Professional Disclaimer", () => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.muted);
    const discText = doc.splitTextToSize(data.summary.disclaimer, PAGE.w - PAGE.m * 2 - 10);
    doc.text(discText, PAGE.m + 5, y + 15);
  });

  return doc;
}

/** Client helper function to generate & trigger instant download of Enterprise Numerology PDF */
export async function downloadNumerologyPdf(
  data: NumerologyReportResult,
  filename = "Enterprise_Numerology_Report.pdf",
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
          lifePath: data.lifePath.number,
          destiny: data.destiny.number,
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
    console.error("Failed to track Numerology PDF download:", err);
  }
}
