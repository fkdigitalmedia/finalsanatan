import type { CareerAnalysisResultV2 } from "../types";
import { renderCareerPdf } from "./career-pdf-renderer";

/**
 * Dedicated PDF Generator for Career Analysis Report Pro v2.0.
 * NEVER uses default-templates.ts or GENERIC_SECTIONS.
 */
export async function generateCareerPdf(result: CareerAnalysisResultV2) {
  return renderCareerPdf(result);
}

/**
 * Initiates direct browser window print/download for the 40-page Career PDF.
 */
export function downloadCareerPdf(result: CareerAnalysisResultV2, filename = `Career_Analysis_Report_Pro_${result.input.name.replace(/\s+/g, '_')}.pdf`) {
  const htmlContent = result ? renderCareerPdfSync(result) : "";
  if (typeof window !== "undefined") {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
}

function renderCareerPdfSync(result: CareerAnalysisResultV2): string {
  const { buildCareerAnalysisPdfHtml } = require("./career-pdf-builder");
  return buildCareerAnalysisPdfHtml(result);
}
