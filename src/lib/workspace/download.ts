// ============================================================
// Workspace download helper — dedicated PDF engines for all report types.
// Each report kind uses its own dedicated PDF builder — NEVER the generic fallback.
// ============================================================

import { generatePdf } from "@/lib/pdf";
import { logDownload } from "./api";
import type { UserReport } from "./types";

// Career Analysis
import { computeCareerAnalysis } from "@/lib/career-analysis/career-engine";
import { buildCareerAnalysisPdfHtml } from "@/lib/career-analysis/pdf/career-pdf-builder";
import type { CareerAnalysisInput } from "@/lib/career-analysis/types";

// Health Analysis
import { computeHealthAnalysis } from "@/lib/health-analysis/health-engine";
import { buildHealthAnalysisPdfHtml } from "@/lib/health-analysis/pdf-builder";
import type { HealthAnalysisInput } from "@/lib/health-analysis/types";

// Marriage Analysis
import { computeMarriageAnalysis } from "@/lib/marriage-analysis/marriage-engine";
import { buildMarriageAnalysisPdfHtml } from "@/lib/marriage-analysis/pdf-builder";
import type { MarriageAnalysisInput } from "@/lib/marriage-analysis/types";

// ── Utilities ─────────────────────────────────────────────────────────────────

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

import { printHtmlReport } from "@/lib/pdf/print-html-report";

// ── Main Download Function ─────────────────────────────────────────────────────

export async function downloadReportPdf(
  report: UserReport,
  opts: { userId: string; userName: string },
): Promise<{ filename: string; pages: number }> {
  const kind = report.kind;
  const extra = (report.data ?? {}) as Record<string, any>;
  const filename = safeName(report.title, report.kind);

  // ── 0. Check for stored Vercel Blob URL ──────────────────────────────────
  const blobUrl = (report as any).storage_path || extra.storage_path || extra.meta?.blobUrl;
  if (blobUrl && typeof blobUrl === "string" && blobUrl.startsWith("http")) {
    window.open(blobUrl, "_blank");
    await logDownload({ user_id: opts.userId, filename: `${filename}.pdf`, language: report.language, report_id: report.id });
    return { filename, pages: extra.pages || 35 };
  }

  // ── 1. Career Analysis ────────────────────────────────────────────────────
  const isCareer = kind === "career-analysis" || kind === "career-report" ||
    extra.report === "career-analysis" || extra.report === "career-report";

  if (isCareer) {
    let result = extra.meta?.result || extra.result || null;
    if (!result) {
      const raw: Partial<CareerAnalysisInput> = extra.meta?.input || extra.input || {};
      result = computeCareerAnalysis({
        name:      raw.name      || report.title || "User",
        date:      raw.date      || "1995-08-15",
        time:      raw.time      || "10:30",
        latitude:  Number(raw.latitude)  || 28.6139,
        longitude: Number(raw.longitude) || 77.209,
        timezone:  raw.timezone  || "Asia/Kolkata",
        place:     raw.place     || "New Delhi, India",
        language:  report.language || "en",
      });
    }
    printHtmlReport(buildCareerAnalysisPdfHtml(result), filename);
    await logDownload({ user_id: opts.userId, filename: `${filename}.pdf`, language: report.language, report_id: report.id });
    return { filename, pages: 40 };
  }

  // ── 2. Health Analysis ────────────────────────────────────────────────────
  const isHealth = kind === "health-analysis" || kind === "health-report" ||
    extra.report === "health-analysis" || extra.report === "health-report";

  if (isHealth) {
    let result = extra.meta?.result || extra.result || null;
    if (!result) {
      const raw: Partial<HealthAnalysisInput> = extra.meta?.input || extra.input || {};
      result = computeHealthAnalysis({
        name:      raw.name      || report.title || "User",
        date:      raw.date      || "1990-01-01",
        time:      raw.time      || "08:00",
        latitude:  Number(raw.latitude)  || 28.6139,
        longitude: Number(raw.longitude) || 77.209,
        timezone:  String(raw.timezone  || "5.5"),
        place:     raw.place     || "New Delhi, India",
      });
    }
    printHtmlReport(buildHealthAnalysisPdfHtml(result), filename);
    await logDownload({ user_id: opts.userId, filename: `${filename}.pdf`, language: report.language, report_id: report.id });
    return { filename, pages: 35 };
  }

  // ── 3. Marriage Analysis ──────────────────────────────────────────────────
  const isMarriage = kind === "marriage-analysis" || kind === "marriage-report" ||
    extra.report === "marriage-analysis" || extra.report === "marriage-report";

  if (isMarriage) {
    let result = extra.meta?.result || extra.result || null;
    if (!result) {
      const raw: Partial<MarriageAnalysisInput> = extra.meta?.input || extra.input || {};
      result = computeMarriageAnalysis({
        name:      raw.name      || report.title || "User",
        date:      raw.date      || "1990-01-01",
        time:      raw.time      || "08:00",
        latitude:  Number(raw.latitude)  || 28.6139,
        longitude: Number(raw.longitude) || 77.209,
        timezone:  raw.timezone  || "5.5",
        place:     raw.place     || "New Delhi, India",
      });
    }
    printHtmlReport(buildMarriageAnalysisPdfHtml(result), filename);
    await logDownload({ user_id: opts.userId, filename: `${filename}.pdf`, language: report.language, report_id: report.id });
    return { filename, pages: 34 };
  }

  // ── 4. Universal PDF Engine (Kundli, Varshphal, Panchang, Numerology, etc.) ──
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
