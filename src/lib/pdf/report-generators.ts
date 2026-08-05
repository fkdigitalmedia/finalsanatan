/**
 * Dedicated PDF Report Generator Suite
 * ------------------------------------------------------------
 * Establishes dedicated generator functions for all 10 core astrology reports.
 * No report reuses another report's PDF template or generator logic.
 */

import type { KundliResult } from "@/lib/kundli/types";
import type { VarshphalResult } from "@/lib/kundli/varshphal";
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
  result.doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "matching", title: "Kundli Matching Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Numerology Report */
export async function generateNumerologyPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "numerology-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadNumerologyPdf(data: Record<string, unknown>, filename = "Numerology_Report.pdf") {
  const result = await generateNumerologyPDF(data);
  result.doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "numerology", title: "Numerology Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

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
  result.doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "muhurat", title: "Muhurat Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}

/** Dedicated PDF Generator for Career Analysis Report */
export async function generateCareerPDF(data: Record<string, unknown>, opts: { language?: string } = {}) {
  return engine.generate({
    report: "career-report",
    data,
    language: opts.language || "en",
  });
}

export async function downloadCareerPdf(data: Record<string, unknown>, filename = "Career_Analysis_Report.pdf") {
  const result = await generateCareerPDF(data);
  result.doc.save(filename);
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
  result.doc.save(filename);
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
  result.doc.save(filename);
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
  result.doc.save(filename);
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
  result.doc.save(filename);
  const userId = await getUserIdSafely();
  if (userId) {
    await trackReportGenerated(userId, { kind: "foreign-settlement", title: "Foreign Settlement Report", data }).catch(console.error);
    await trackPdfDownload(userId, { filename, file_type: "PDF" }).catch(console.error);
  }
}
