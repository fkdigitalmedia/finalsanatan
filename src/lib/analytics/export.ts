/**
 * Export helpers — CSV / JSON / Excel (SpreadsheetML) / PDF (HTML print doc).
 * Pure string builders, so they run on the server and in the browser.
 */

import { MAX_EXPORT_ROWS } from "./constants";
import type { ExportRequest } from "./types";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function toCsv(columns: string[], rows: Record<string, unknown>[]): string {
  const capped = rows.slice(0, MAX_EXPORT_ROWS);
  const head = columns.map(escapeCsv).join(",");
  const body = capped.map((r) => columns.map((c) => escapeCsv(r[c])).join(",")).join("\n");
  return `${head}\n${body}`;
}

export function toJson(columns: string[], rows: Record<string, unknown>[]): string {
  const capped = rows
    .slice(0, MAX_EXPORT_ROWS)
    .map((r) => Object.fromEntries(columns.map((c) => [c, r[c] ?? null])));
  return JSON.stringify(
    { generatedAt: new Date().toISOString(), count: capped.length, rows: capped },
    null,
    2,
  );
}

/** SpreadsheetML 2003 — opens natively in Excel, LibreOffice and Numbers. */
export function toExcelXml(
  title: string,
  columns: string[],
  rows: Record<string, unknown>[],
): string {
  const capped = rows.slice(0, MAX_EXPORT_ROWS);
  const cell = (v: unknown) => {
    const isNum = typeof v === "number" && Number.isFinite(v);
    return `<Cell><Data ss:Type="${isNum ? "Number" : "String"}">${escapeXml(isNum ? v : (v ?? ""))}</Data></Cell>`;
  };
  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${escapeXml(title.slice(0, 30) || "Report")}">
  <Table>
   <Row>${columns.map((c) => `<Cell><Data ss:Type="String">${escapeXml(c)}</Data></Cell>`).join("")}</Row>
   ${capped.map((r) => `<Row>${columns.map((c) => cell(r[c])).join("")}</Row>`).join("\n   ")}
  </Table>
 </Worksheet>
</Workbook>`;
}

/** Print-ready HTML document; the browser's "Save as PDF" produces the file. */
export function toPrintableHtml(
  title: string,
  columns: string[],
  rows: Record<string, unknown>[],
): string {
  const capped = rows.slice(0, 5000);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeXml(title)}</title>
<style>
 body{font-family:Georgia,serif;margin:32px;color:#2b1d0e}
 h1{font-size:22px;margin:0 0 4px}
 .meta{color:#7a6a55;font-size:12px;margin-bottom:18px}
 table{border-collapse:collapse;width:100%;font-size:12px;font-family:system-ui,sans-serif}
 th{background:#f6efe2;text-align:left;padding:8px;border-bottom:2px solid #d8c7a8}
 td{padding:7px 8px;border-bottom:1px solid #eee3d0}
 tr:nth-child(even) td{background:#fdfaf4}
 @media print{@page{margin:14mm}}
</style></head><body>
<h1>${escapeXml(title)}</h1>
<div class="meta">SanatanTools · generated ${new Date().toUTCString()} · ${capped.length} rows</div>
<table><thead><tr>${columns.map((c) => `<th>${escapeXml(c)}</th>`).join("")}</tr></thead>
<tbody>${capped
    .map((r) => `<tr>${columns.map((c) => `<td>${escapeXml(r[c] as string)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>
<script>window.onload=function(){setTimeout(function(){window.print()},350)}</script>
</body></html>`;
}

export interface RenderedExport {
  filename: string;
  contentType: string;
  content: string;
}

export function renderExport(req: ExportRequest): RenderedExport {
  const base = req.filename.replace(/[^a-z0-9._-]/gi, "-");
  switch (req.format) {
    case "json":
      return {
        filename: `${base}.json`,
        contentType: "application/json",
        content: toJson(req.columns, req.rows),
      };
    case "xlsx":
      return {
        filename: `${base}.xls`,
        contentType: "application/vnd.ms-excel",
        content: toExcelXml(req.title ?? base, req.columns, req.rows),
      };
    case "pdf":
      return {
        filename: `${base}.html`,
        contentType: "text/html",
        content: toPrintableHtml(req.title ?? base, req.columns, req.rows),
      };
    case "csv":
    default:
      return {
        filename: `${base}.csv`,
        contentType: "text/csv",
        content: toCsv(req.columns, req.rows),
      };
  }
}

/** Browser-side helper: trigger a download from a rendered export. */
export function downloadExport(rendered: RenderedExport): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([rendered.content], { type: `${rendered.contentType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = rendered.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
