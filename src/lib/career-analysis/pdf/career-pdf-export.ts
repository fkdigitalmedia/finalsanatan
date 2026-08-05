import type { CareerAnalysisResultV2 } from "../types";
import { renderCareerPdf } from "./career-pdf-renderer";
import { buildCareerAnalysisPdfHtml } from "./career-pdf-builder";
import { printHtmlReport } from "@/lib/pdf/print-html-report";

/**
 * Dedicated PDF Generator for Career Analysis Report Pro v3.0 / Enterprise Release.
 * NEVER uses default-templates.ts or GENERIC_SECTIONS.
 */
export async function generateCareerPdf(result: CareerAnalysisResultV2) {
  return renderCareerPdf(result);
}

/**
 * Initiates bulletproof browser print/download for the 38-page Career PDF.
 */
export function downloadCareerPdf(
  result: CareerAnalysisResultV2,
  filename = `Career_Analysis_Report_Pro_${result.input?.name?.replace(/\s+/g, '_') || "User"}.pdf`
) {
  const htmlContent = buildCareerAnalysisPdfHtml(result);
  printHtmlReport(htmlContent, filename);
}
