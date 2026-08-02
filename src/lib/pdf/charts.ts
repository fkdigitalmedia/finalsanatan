// ============================================================
// Universal PDF Report Engine — Chart rendering
// ------------------------------------------------------------
// Delegates North / South / East Indian kundli charts to the
// proven vector renderers in src/lib/kundli/pdf-charts.ts, and
// adds engine-owned wheel charts (planet wheel / house wheel).
// All charts are drawn with vector primitives — no rasterising.
// ============================================================

import { drawEastIndian, drawNorthIndian, drawSouthIndian } from "@/lib/kundli/pdf-charts";
import type { KundliChart } from "@/lib/kundli/types";
import { drawTextAt, ensureSpace, rect } from "./components";
import { tint } from "./helpers";
import type { RenderContext } from "./types";

export type ChartStyle = "north" | "south" | "east" | "wheel" | "planet-wheel" | "house-wheel";

const RASHI_SHORT = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const GRAHA_SHORT: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

export interface ChartRenderOptions {
  style: ChartStyle;
  size?: number; // mm
  caption?: string;
  subCaption?: string;
  align?: "left" | "center" | "right";
}

/** Draw any supported chart at the cursor. Returns the height consumed. */
export function renderChart(
  ctx: RenderContext,
  chart: KundliChart | undefined,
  opts: ChartRenderOptions,
): number {
  if (!chart || !Array.isArray(chart.planets)) return 0;
  const size = opts.size ?? Math.min(120, ctx.page.width - ctx.margins.left - ctx.margins.right);
  const captionH = (opts.caption ? 6 : 0) + (opts.subCaption ? 5 : 0);
  ensureSpace(ctx, size + captionH + 6);

  const available = ctx.page.width - ctx.margins.left - ctx.margins.right;
  const x =
    opts.align === "center"
      ? ctx.margins.left + (available - size) / 2
      : opts.align === "right"
        ? ctx.margins.left + available - size
        : ctx.margins.left;
  const y = ctx.cursorY;

  const theme = {
    stroke: ctx.theme.colors.primary,
    ink: ctx.theme.colors.ink,
    accent: ctx.theme.colors.accent,
    retro: ctx.theme.colors.danger,
    muted: ctx.theme.colors.muted,
    lagna: ctx.theme.colors.secondary,
  };
  const drawOpts = {
    fontFamily: ctx.fonts.body,
    theme,
    caption: opts.caption,
    subCaption: opts.subCaption,
  };

  switch (opts.style) {
    case "south":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      drawSouthIndian(ctx.doc as any, chart, x, y, size, drawOpts);
      break;
    case "east":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      drawEastIndian(ctx.doc as any, chart, x, y, size, drawOpts);
      break;
    case "wheel":
    case "planet-wheel":
      drawWheel(ctx, chart, x, y, size, "planet", opts);
      break;
    case "house-wheel":
      drawWheel(ctx, chart, x, y, size, "house", opts);
      break;
    case "north":
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      drawNorthIndian(ctx.doc as any, chart, x, y, size, drawOpts);
      break;
  }

  ctx.cursorY = y + size + captionH + 6;
  return size + captionH + 6;
}

/**
 * Circular wheel chart. `mode: "planet"` labels each sector with the
 * planets in it; `mode: "house"` labels sectors with house numbers.
 */
export function drawWheel(
  ctx: RenderContext,
  chart: KundliChart,
  x: number,
  y: number,
  size: number,
  mode: "planet" | "house",
  opts: ChartRenderOptions,
): void {
  const { doc } = ctx;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const rOuter = size / 2;
  const rInner = rOuter * 0.62;

  doc.setDrawColor(ctx.theme.colors.primary);
  doc.setLineWidth(0.5);
  if (doc.circle) {
    doc.circle(cx, cy, rOuter, "S");
    doc.circle(cx, cy, rInner, "S");
    doc.circle(cx, cy, rOuter * 0.22, "S");
  } else {
    rect(doc, x, y, size, size, "S");
  }

  const ascIndex = chart.ascendant?.rashiIndex ?? 0;
  const byHouse: Record<number, string[]> = {};
  for (const p of chart.planets) {
    const h = p.house ?? 1;
    (byHouse[h] ??= []).push(`${GRAHA_SHORT[p.graha] ?? p.graha}${p.retrograde ? "ᴿ" : ""}`);
  }

  doc.setDrawColor(tint(ctx.theme.colors.primary, 0.55));
  doc.setLineWidth(0.25);
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i - Math.PI / 2;
    doc.line(
      cx + Math.cos(a) * rOuter * 0.22,
      cy + Math.sin(a) * rOuter * 0.22,
      cx + Math.cos(a) * rOuter,
      cy + Math.sin(a) * rOuter,
    );
  }

  for (let h = 1; h <= 12; h++) {
    const a = (Math.PI / 6) * (h - 1) + Math.PI / 12 - Math.PI / 2;
    const signIdx = (ascIndex + h - 1) % 12;
    const outerR = (rOuter + rInner) / 2;
    const innerR = rInner * 0.68;

    drawTextAt(
      ctx,
      mode === "house" ? `H${h}` : RASHI_SHORT[signIdx],
      cx + Math.cos(a) * outerR,
      cy + Math.sin(a) * outerR + 1,
      {
        size: ctx.theme.typography.baseSize - 2.5,
        color: ctx.theme.colors.muted,
        align: "center",
      },
    );

    const label = mode === "house" ? RASHI_SHORT[signIdx] : (byHouse[h] ?? []).join(" ");
    if (label) {
      const lines = label.split(" ").reduce<string[]>((acc, tok, i) => {
        const row = Math.floor(i / 2);
        acc[row] = acc[row] ? `${acc[row]} ${tok}` : tok;
        return acc;
      }, []);
      lines.forEach((line, i) => {
        drawTextAt(ctx, line, cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR + 1 + i * 3.4, {
          size: ctx.theme.typography.baseSize - 2,
          color: ctx.theme.colors.ink,
          align: "center",
          style: "bold",
        });
      });
    }
  }

  drawTextAt(ctx, mode === "house" ? "Houses" : "Grahas", cx, cy + 1, {
    size: ctx.theme.typography.baseSize - 2.5,
    color: ctx.theme.colors.secondary,
    align: "center",
    style: "bold",
  });

  if (opts.caption) {
    drawTextAt(ctx, opts.caption, cx, y + size + 5, {
      size: ctx.theme.typography.baseSize,
      color: ctx.theme.colors.primary,
      align: "center",
      style: "bold",
      font: ctx.fonts.heading,
    });
  }
  if (opts.subCaption) {
    drawTextAt(ctx, opts.subCaption, cx, y + size + 10, {
      size: ctx.theme.typography.baseSize - 2,
      color: ctx.theme.colors.muted,
      align: "center",
    });
  }
}

export const SUPPORTED_CHART_STYLES: ChartStyle[] = [
  "north",
  "south",
  "east",
  "wheel",
  "planet-wheel",
  "house-wheel",
];
