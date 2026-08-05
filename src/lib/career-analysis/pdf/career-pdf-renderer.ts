import type { CareerAnalysisResultV2 } from "../types";
import { buildCareerAnalysisPdfHtml } from "./career-pdf-builder";

export interface CareerPdfRenderOptions {
  filename?: string;
}

/**
 * Dedicated PDF Renderer for Career Analysis Report Pro v2.0.
 * Renders full 28-section document directly from CareerAnalysisResultV2.
 */
export async function renderCareerPdf(
  result: CareerAnalysisResultV2,
  options: CareerPdfRenderOptions = {}
): Promise<{ html: string; filename: string }> {
  const html = buildCareerAnalysisPdfHtml(result);
  const safeName = result.input.name.toLowerCase().replace(/\s+/g, "-");
  const filename = options.filename || `career-analysis-pro-${safeName}.pdf`;

  return { html, filename };
}
