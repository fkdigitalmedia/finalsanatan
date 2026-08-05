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

/** Dedicated PDF Generator for Kundli Matching (Gun Milan Pro) */
export async function generateMatchingPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "kundli-matching",
    data,
    language: opts.language || "en",
  });
}

export async function downloadMatchingPdf(data: Record<string, unknown>, filename = "Kundli_Matching_Report.pdf") {
  const result = await generateMatchingPDF(data);
  (result as any).doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "matching", title: "Kundli Matching Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

import { downloadNumerologyPdf, generateNumerologyPDF } from "@/lib/numerology/pdf";

export { generateNumerologyPDF, downloadNumerologyPdf };

/** Dedicated PDF Generator for Muhurat Report */
export async function generateMuhuratPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "muhurat-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadMuhuratPdf(data: Record<string, unknown>, filename = "Muhurat_Report.pdf") {
  const result = await generateMuhuratPDF(data);
  (result as any).doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "muhurat", title: "Muhurat Report", data }).catch(console.error);
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
  if (typeof window !== "undefined" && result.dataUrl) {
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = filename;
    link.click();
  }
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
  if (typeof window !== "undefined" && result.dataUrl) {
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = filename;
    link.click();
  }
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
  if (typeof window !== "undefined" && result.dataUrl) {
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = filename;
    link.click();
  }
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
  if (typeof window !== "undefined" && result.dataUrl) {
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = filename;
    link.click();
  }
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "foreign-settlement", title: "Foreign Settlement Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}
