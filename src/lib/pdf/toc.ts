// ============================================================
// Universal PDF Report Engine — Table of Contents
// ------------------------------------------------------------
// The TOC page is reserved during the first pass and filled in
// afterwards, once real page numbers are known.
// ============================================================

import { applyStyle, drawHeading, drawTextAt, rect } from "./components";
import { lineHeightMm } from "./fonts";
import type { RenderContext, TocEntry } from "./types";

/** Register an entry while rendering. */
export function addTocEntry(ctx: RenderContext, title: string, page: number, level = 1): void {
  if (!title) return;
  ctx.toc.push({ title, page, level });
}

/** Reserve the current page for the TOC; content resumes on a new page. */
export function reserveTocPage(ctx: RenderContext): number {
  const page = ctx.doc.getNumberOfPages();
  ctx.tocPage = page;
  ctx.doc.addPage();
  ctx.cursorY = ctx.contentTop;
  return page;
}

/** Fill the reserved page with the collected entries. */
export function renderToc(ctx: RenderContext, title = "Table of Contents"): void {
  if (ctx.tocPage === null) return;
  const entries = ctx.toc.filter((e) => e.title);
  ctx.doc.setPage(ctx.tocPage);
  ctx.cursorY = ctx.contentTop;

  drawHeading(ctx, title, 1);

  const size = ctx.theme.typography.baseSize;
  const lh = lineHeightMm(size, 1.7);
  const left = ctx.margins.left;
  const right = ctx.page.width - ctx.margins.right;

  for (const entry of entries) {
    if (ctx.cursorY + lh > ctx.contentBottom) break;
    const indent = left + (entry.level - 1) * 5;
    const y = ctx.cursorY + lh * 0.7;

    applyStyle(ctx, {
      size: entry.level === 1 ? size : size - 1,
      color: entry.level === 1 ? ctx.theme.colors.ink : ctx.theme.colors.muted,
      style: entry.level === 1 ? "bold" : "normal",
    });
    ctx.doc.text(entry.title, indent, y);

    const titleWidth = ctx.doc.getTextWidth(entry.title);
    const pageLabel = String(entry.page);
    const pageWidth = ctx.doc.getTextWidth(pageLabel);
    const dotStart = indent + titleWidth + 2;
    const dotEnd = right - pageWidth - 2;
    if (dotEnd > dotStart) {
      ctx.doc.setDrawColor(ctx.theme.colors.divider);
      ctx.doc.setLineWidth(0.15);
      ctx.doc.line(dotStart, y - 0.8, dotEnd, y - 0.8);
    }
    drawTextAt(ctx, pageLabel, right, y, {
      size,
      color: ctx.theme.colors.secondary,
      align: "right",
      style: "bold",
    });
    ctx.cursorY += lh;
  }

  if (!entries.length) {
    ctx.doc.setFillColor(ctx.theme.colors.surface);
    rect(ctx.doc, ctx.margins.left, ctx.cursorY, right - left, 14, "F", 2);
    drawTextAt(ctx, "No sections indexed.", ctx.margins.left + 4, ctx.cursorY + 9, {
      size,
      color: ctx.theme.colors.muted,
    });
  }
}

export function tocSummary(entries: TocEntry[]): { count: number; lastPage: number } {
  return {
    count: entries.length,
    lastPage: entries.reduce((max, e) => Math.max(max, e.page), 0),
  };
}
