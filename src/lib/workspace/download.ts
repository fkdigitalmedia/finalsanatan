// ============================================================
// Workspace download helper — reuses Dedicated PDF Engines & Universal Engine.
// ============================================================

import { generatePdf } from "@/lib/pdf";
import { logDownload } from "./api";
import type { UserReport } from "./types";
import { computeCareerAnalysis } from "@/lib/career-analysis/career-engine";
import { buildCareerAnalysisPdfHtml } from "@/lib/career-analysis/pdf/career-pdf-builder";
import type { CareerAnalysisInput, CareerAnalysisResultV2 } from "@/lib/career-analysis/types";

export function buildPdfData(
  report: Pick<UserReport, "title" | "kind" | "content_md" | "data" | "language">,
  userName: string,
) {
  const extra = (report.data ?? {}) as Record<string, unknown>;
  return {
    ...extra,
    user: userName,
    title: report.title,
    summary: (extra.summary as string) ?? report.title,
    analysis: report.content_md ?? "",
    language: report.language,
  };
}

export function safeName(title: string, kind: string): string {
  const base = `${kind}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base.slice(0, 60) || "report";
}

export async function downloadReportPdf(
  report: UserReport,
  opts: { userId: string; userName: string },
): Promise<{ filename: string; pages: number }> {
  const filename = safeName(report.title, report.kind);
  const extra = (report.data ?? {}) as Record<string, any>;
  const isCareerReport = report.kind === "career-analysis" || report.kind === "career-report" || extra.report === "career-analysis" || extra.report === "career-report";

  if (isCareerReport) {
    let careerResult: CareerAnalysisResultV2 | null = extra.meta?.result || extra.result || null;

    if (!careerResult) {
      const rawInput: Partial<CareerAnalysisInput> = extra.meta?.input || extra.input || {};
      const birthInput: CareerAnalysisInput = {
        name: rawInput.name || report.title || "User",
        date: rawInput.date || "1995-08-15",
        time: rawInput.time || "10:30",
        latitude: Number(rawInput.latitude) || 28.6139,
        longitude: Number(rawInput.longitude) || 77.209,
        timezone: rawInput.timezone || "Asia/Kolkata",
        place: rawInput.place || "New Delhi, India",
        language: report.language || "en",
      };
      careerResult = computeCareerAnalysis(birthInput);
    }

    const htmlContent = buildCareerAnalysisPdfHtml(careerResult!);
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

    await logDownload({
      user_id: opts.userId,
      filename: `${filename}.pdf`,
      language: report.language,
      report_id: report.id,
    });

    return { filename, pages: 40 };
  }

  // Fallback to Universal PDF Engine for other generic reports
  const result = await generatePdf({
    report: report.kind,
    language: report.language,
    filename,
    data: buildPdfData(report, opts.userName),
  });

  const url = URL.createObjectURL(result.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${result.filename || filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  await logDownload({
    user_id: opts.userId,
    filename: `${filename}.pdf`,
    language: report.language,
    report_id: report.id,
  });

  return { filename, pages: result.pages };
}
