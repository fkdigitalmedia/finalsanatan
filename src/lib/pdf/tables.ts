// ============================================================
// Universal PDF Report Engine — Tables
// ------------------------------------------------------------
// A single generic table renderer with auto column widths,
// zebra rows, repeating headers across pages and cell wrapping.
// Every domain table (planets, houses, strength, dasha…) is
// produced by mapping data into this shape from a template.
// ============================================================

import { lineHeightMm } from "./fonts";
import { clamp, tint } from "./helpers";
import { applyStyle, contentWidth, drawTextAt, ensureSpace, newPage, rect } from "./components";
import { MAX_TABLE_ROWS } from "./constants";
import type { RenderContext } from "./types";

export interface TableColumn {
  key: string;
  label: string;
  /** relative weight, defaults to 1 */
  width?: number;
  align?: "left" | "center" | "right";
}

export type TableRow = Record<string, unknown>;

export interface TableOptions {
  columns: TableColumn[];
  rows: TableRow[];
  zebra?: boolean;
  headerFill?: string;
  headerColor?: string;
  fontSize?: number;
  compact?: boolean;
  caption?: string;
}

export function columnWidths(ctx: RenderContext, columns: TableColumn[]): number[] {
  const total = contentWidth(ctx);
  const weights = columns.map((c) => (typeof c.width === "number" && c.width > 0 ? c.width : 1));
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((w) => (w / sum) * total);
}

function cellLines(ctx: RenderContext, text: string, width: number, size: number): string[] {
  applyStyle(ctx, { size });
  try {
    return ctx.doc.splitTextToSize(String(text ?? ""), Math.max(4, width - 3));
  } catch {
    return [String(text ?? "")];
  }
}

export function drawTable(ctx: RenderContext, opts: TableOptions): void {
  const columns = (opts.columns ?? []).filter(Boolean);
  if (!columns.length) return;
  const rows = (opts.rows ?? []).slice(0, MAX_TABLE_ROWS);
  const size = opts.fontSize ?? ctx.theme.typography.baseSize - 1;
  const lh = lineHeightMm(size, 1.25);
  const padY = opts.compact ? 1.2 : 2;
  const widths = columnWidths(ctx, columns);
  const headerFill = opts.headerFill ?? ctx.theme.colors.primary;
  const headerColor = opts.headerColor ?? "#FFFFFF";

  const drawHeaderRow = () => {
    const h = lh + padY * 2;
    ensureSpace(ctx, h + lh);
    ctx.doc.setFillColor(headerFill);
    rect(ctx.doc, ctx.margins.left, ctx.cursorY, contentWidth(ctx), h, "F", 0);
    let x = ctx.margins.left;
    columns.forEach((col, i) => {
      const align = col.align ?? "left";
      const tx =
        align === "right" ? x + widths[i] - 2 : align === "center" ? x + widths[i] / 2 : x + 2;
      drawTextAt(ctx, col.label, tx, ctx.cursorY + padY + lh * 0.75, {
        size,
        color: headerColor,
        style: "bold",
        align,
        font: ctx.fonts.heading,
      });
      x += widths[i];
    });
    ctx.cursorY += h;
  };

  if (opts.caption) {
    drawTextAt(ctx, opts.caption, ctx.margins.left, ctx.cursorY + 3.5, {
      size: size + 0.5,
      color: ctx.theme.colors.secondary,
      style: "bold",
    });
    ctx.cursorY += 6;
  }

  drawHeaderRow();

  rows.forEach((row, index) => {
    const cells = columns.map((col, i) =>
      cellLines(ctx, formatCell(row[col.key]), widths[i], size),
    );
    const lines = Math.max(1, ...cells.map((c) => c.length));
    const h = lines * lh + padY * 2;

    if (ctx.cursorY + h > ctx.contentBottom) {
      newPage(ctx);
      drawHeaderRow();
    }

    if (opts.zebra !== false && index % 2 === 1) {
      ctx.doc.setFillColor(tint(ctx.theme.colors.primary, 0.95));
      rect(ctx.doc, ctx.margins.left, ctx.cursorY, contentWidth(ctx), h, "F", 0);
    }

    let x = ctx.margins.left;
    columns.forEach((col, i) => {
      const align = col.align ?? "left";
      const tx =
        align === "right" ? x + widths[i] - 2 : align === "center" ? x + widths[i] / 2 : x + 2;
      cells[i].forEach((line, li) => {
        drawTextAt(ctx, line, tx, ctx.cursorY + padY + lh * (li + 0.75), {
          size,
          color: ctx.theme.colors.ink,
          align,
        });
      });
      x += widths[i];
    });

    ctx.doc.setDrawColor(ctx.theme.colors.divider);
    ctx.doc.setLineWidth(0.15);
    ctx.doc.line(
      ctx.margins.left,
      ctx.cursorY + h,
      ctx.page.width - ctx.margins.right,
      ctx.cursorY + h,
    );
    ctx.cursorY += h;
  });

  ctx.cursorY += 4;
}

export function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(formatCell).join(", ");
  if (typeof value === "object") return "";
  return String(value);
}

// ---------- domain mappers (data-driven, not layout) ----------

export interface PlanetRowLike {
  graha?: string;
  rashi?: string;
  degreesInRashi?: number;
  house?: number;
  nakshatra?: string;
  pada?: number;
  retrograde?: boolean;
  dignity?: string;
  strengthScore?: number;
  [key: string]: unknown;
}

export function planetTable(planets: PlanetRowLike[]): TableOptions {
  return {
    columns: [
      { key: "graha", label: "Planet", width: 1.2 },
      { key: "rashi", label: "Sign", width: 1.2 },
      { key: "deg", label: "Degree", width: 1, align: "right" },
      { key: "house", label: "House", width: 0.8, align: "center" },
      { key: "nakshatra", label: "Nakshatra", width: 1.6 },
      { key: "pada", label: "Pada", width: 0.7, align: "center" },
      { key: "dignity", label: "Dignity", width: 1.2 },
      { key: "motion", label: "Motion", width: 1 },
    ],
    rows: (planets ?? []).map((p) => ({
      graha: p.graha,
      rashi: p.rashi,
      deg: typeof p.degreesInRashi === "number" ? `${p.degreesInRashi.toFixed(2)}°` : "—",
      house: p.house,
      nakshatra: p.nakshatra,
      pada: p.pada,
      dignity: p.dignity,
      motion: p.retrograde ? "Retrograde" : "Direct",
    })),
  };
}

export function houseTable(
  houses: { house?: number; rashi?: string; startDegree?: number }[],
): TableOptions {
  return {
    columns: [
      { key: "house", label: "House", width: 0.8, align: "center" },
      { key: "rashi", label: "Sign", width: 1.5 },
      { key: "start", label: "Cusp", width: 1, align: "right" },
    ],
    rows: (houses ?? []).map((h) => ({
      house: h.house,
      rashi: h.rashi,
      start: typeof h.startDegree === "number" ? `${h.startDegree.toFixed(2)}°` : "—",
    })),
  };
}

export function strengthTable(
  entries: {
    graha?: string;
    total?: number;
    rupas?: number;
    rank?: number;
    [k: string]: unknown;
  }[],
): TableOptions {
  return {
    columns: [
      { key: "graha", label: "Planet", width: 1.2 },
      { key: "total", label: "Strength", width: 1, align: "right" },
      { key: "rupas", label: "Rupas", width: 1, align: "right" },
      { key: "rank", label: "Rank", width: 0.7, align: "center" },
    ],
    rows: (entries ?? []).map((e) => ({
      graha: e.graha,
      total: typeof e.total === "number" ? e.total.toFixed(1) : "—",
      rupas: typeof e.rupas === "number" ? e.rupas.toFixed(2) : "—",
      rank: e.rank,
    })),
  };
}

/** Normalise "rows of objects" into columns when a template omits them. */
export function inferColumns(rows: TableRow[], limit = 8): TableColumn[] {
  const keys: string[] = [];
  for (const row of rows.slice(0, 20)) {
    for (const key of Object.keys(row ?? {})) {
      if (!keys.includes(key)) keys.push(key);
    }
  }
  return keys.slice(0, clamp(limit, 1, 12)).map((key) => ({
    key,
    label: key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}
