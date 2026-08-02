// ============================================================
// Workspace download helper — reuses the Universal PDF Engine.
// No layout logic here: the engine resolves the admin-managed
// template for the report kind.
// ============================================================

import { generatePdf } from "@/lib/pdf";
import { logDownload } from "./api";
import type { UserReport } from "./types";

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
