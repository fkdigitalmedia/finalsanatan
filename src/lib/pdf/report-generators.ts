/**
 * Dedicated PDF Report Generator Suite
 * ------------------------------------------------------------
 * Establishes dedicated generator functions for all 10 core astrology reports.
 * No report reuses another report's PDF template or generator logic.
 */

import type { KundliResult } from "@/lib/kundli/types";
import type { VarshphalResultV2 } from "@/lib/kundli/varshphal";
import { downloadKundliPdf, generateKundliPdf as generateJanamKundliPDF } from "@/lib/kundli/pdf";
import { downloadVarshphalPdf, generateVarshphalPDF } from "@/lib/kundli/varshphal-pdf";
import { PDFEngine } from "@/lib/pdf/engine";
import { trackPdfDownload, trackReportGenerated } from "@/lib/workspace/tracker";
import { supabase } from "@/integrations/supabase/client";

// Re-export Janam Kundli and Varshphal dedicated generators
export { generateJanamKundliPDF, downloadKundliPdf };
export { generateVarshphalPDF, downloadVarshphalPdf };

// Helper engine instance
const engine = new PDFEngine();

async function getUserIdSafely() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  } catch {
    return undefined;
  }
}

function triggerBrowserDownload(result: { dataUrl?: string; blob?: Blob }, filename: string) {
  if (typeof window === "undefined") return;
  const href = result.dataUrl || (result.blob ? URL.createObjectURL(result.blob) : "");
  if (!href) throw new Error("No PDF content generated to download.");
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (result.blob && href.startsWith("blob:")) {
    setTimeout(() => URL.revokeObjectURL(href), 5000);
  }
}

/** Dedicated PDF Generator for Kundli Matching (Gun Milan Pro) */
export async function generateMatchingPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  const boy = (data.boy as any) || {};
  const girl = (data.girl as any) || {};
  const kootas = Array.isArray(data.kootas) ? (data.kootas as any[]) : [];
  const doshas = (data.doshas as any) || {};

  const brideName = girl.name || (data.bride as string) || "Partner 2";
  const groomName = boy.name || (data.groom as string) || "Partner 1";
  const totalScore = typeof data.totalScore === "number" ? data.totalScore : 0;
  const verdictLabel =
    (data.verdictLabel as string) ||
    (totalScore >= 18 ? "Auspicious Match" : "Requires Astrological Consultation");

  // Format Koota Table rows for PDF template
  const kootaTable = kootas.map((k) => ({
    Koota: k.name || "",
    "Points Obtained": `${k.score ?? 0}`,
    "Maximum Points": `${k.max ?? 0}`,
    Analysis: k.note || k.description || "",
  }));

  // Scorecards
  const scores = [
    {
      label: "Guna Score",
      value: `${totalScore} / 36`,
      trend: totalScore >= 18 ? "positive" : "negative",
    },
    { label: "Overall Verdict", value: verdictLabel },
    {
      label: "Mangal Dosha",
      value:
        (doshas.manglik?.boy || doshas.manglik?.girl) && !doshas.manglik?.cancelled
          ? "Present"
          : "Clear",
    },
    {
      label: "Nadi Dosha",
      value: doshas.nadi ? "Present" : "Clear",
    },
    {
      label: "Bhakoot Dosha",
      value: doshas.bhakoot ? "Present" : "Clear",
    },
  ];

  const categories = kootas.map((k) => ({
    label: `${k.name} Compatibility`,
    value: Math.round(((k.score ?? 0) / (k.max || 1)) * 100),
  }));

  const payload: Record<string, unknown> = {
    ...data,
    user: `${groomName} & ${brideName}`,
    groom: groomName,
    bride: brideName,
    gunaScore: `${totalScore} / 36`,
    reportDate: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    scores,
    kootaTable: kootaTable.length > 0 ? kootaTable : undefined,
    categories: categories.length > 0 ? categories : undefined,
    summary:
      (data.summary as string) ||
      `Vedic Ashtakoot compatibility between ${groomName} and ${brideName} yields a total of ${totalScore} out of 36 gunas with a verdict of "${verdictLabel}".`,
    analysis:
      (data.analysis as string) ||
      `### Comprehensive Compatibility Analysis\n\n- **Emotional & Mental Alignment**: ${groomName} (${boy.moonRashi || "Moon Rashi"} - ${boy.nakshatra || "Nakshatra"}) and ${brideName} (${girl.moonRashi || "Moon Rashi"} - ${girl.nakshatra || "Nakshatra"}).\n- **Mangal Dosha**: ${doshas.manglik?.note || "No adverse Manglik dosha obstruction."}\n- **Nadi Dosha**: ${doshas.nadi ? "Same Nadi present — Vedic consultation suggested." : "No Nadi dosha — excellent compatibility for health and progeny."}\n- **Bhakoot Dosha**: ${doshas.bhakoot ? "Bhakoot disagreement detected." : "Bhakoot placement is harmoniously positioned."}`,
    recommendations: [
      "Perform Lord Shiva and Goddess Parvati puja together for marital longevity and peace.",
      "Chant the Maha Mrityunjaya mantra if minor health or Nadi concerns exist.",
      "Exchange traditional Vedic blessings and seek elders' guidance prior to auspicious milestones.",
    ],
  };

  return engine.generate({
    report: "kundli-matching",
    data: payload,
    language: opts.language || "en",
  });
}

export async function downloadMatchingPdf(
  data: Record<string, unknown>,
  filename = "Kundli_Matching_Report.pdf",
) {
  const result = await generateMatchingPDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, {
      kind: "matching",
      title: "Kundli Matching Report",
      data,
    }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

import { downloadNumerologyPdf, generateNumerologyPDF } from "@/lib/numerology/pdf";

export { generateNumerologyPDF, downloadNumerologyPdf };

/** Dedicated PDF Generator for Muhurat Report */
export async function generateMuhuratPDF(
  data: Record<string, unknown>,
  opts: { language?: string } = {},
) {
  return engine.generate({
    report: "muhurat-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadMuhuratPdf(
  data: Record<string, unknown>,
  filename = "Muhurat_Report.pdf",
) {
  const result = await generateMuhuratPDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "muhurat", title: "Muhurat Report", data }).catch(
      console.error,
    );
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

import { computeCareerAnalysis } from "@/lib/career-analysis/career-engine";
import { buildCareerAnalysisPdfHtml } from "@/lib/career-analysis/pdf/career-pdf-builder";
import type { CareerAnalysisInput, CareerAnalysisResultV2 } from "@/lib/career-analysis/types";

/** Dedicated PDF Generator for Career Analysis Report */
export async function generateCareerPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  let result: CareerAnalysisResultV2 | null = (data.result as CareerAnalysisResultV2) || null;
  if (!result) {
    const rawInput = (data.input as Partial<CareerAnalysisInput>) || {};
    const birthInput: CareerAnalysisInput = {
      name: rawInput.name || (data.name as string) || "User",
      date: rawInput.date || (data.date as string) || "1995-08-15",
      time: rawInput.time || (data.time as string) || "10:30",
      latitude: Number(rawInput.latitude || data.latitude) || 28.6139,
      longitude: Number(rawInput.longitude || data.longitude) || 77.209,
      timezone: rawInput.timezone || (data.timezone as string) || "Asia/Kolkata",
      place: rawInput.place || (data.place as string) || "New Delhi, India",
      language: opts.language || "en",
    };
    result = computeCareerAnalysis(birthInput);
  }
  const html = buildCareerAnalysisPdfHtml(result);
  return { html, pages: 40 };
}

export async function downloadCareerPdf(data: Record<string, unknown>, filename = "Career_Analysis_Report_Pro.pdf") {
  const result = await generateCareerPDF(data);
  if (typeof window !== "undefined") {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(result.html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "career-report", title: "Career Analysis Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Marriage Analysis Report */
export async function generateMarriagePDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "marriage-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadMarriagePdf(data: Record<string, unknown>, filename = "Marriage_Analysis_Report.pdf") {
  const result = await generateMarriagePDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "marriage-report", title: "Marriage Analysis Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Business Analysis Report */
export async function generateBusinessPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "business-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadBusinessPdf(data: Record<string, unknown>, filename = "Business_Analysis_Report.pdf") {
  const result = await generateBusinessPDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "business-report", title: "Business Analysis Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Health Analysis Report */
export async function generateHealthPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "health-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadHealthPdf(data: Record<string, unknown>, filename = "Health_Analysis_Report.pdf") {
  const result = await generateHealthPDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "health-report", title: "Health Analysis Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Foreign Settlement Report */
export async function generateForeignPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "foreign-settlement",
    data,
    language: opts.language || "en",
  });
}

export async function downloadForeignPdf(data: Record<string, unknown>, filename = "Foreign_Settlement_Report.pdf") {
  const result = await generateForeignPDF(data);
  triggerBrowserDownload(result, filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "foreign-settlement", title: "Foreign Settlement Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}
