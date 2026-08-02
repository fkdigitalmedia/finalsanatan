// ============================================================
// Kundli PDF — Native jsPDF Chart Renderers (vector, print-ready)
// ------------------------------------------------------------
// Draws North / South / East Indian kundli charts directly with
// jsPDF vector primitives so the output is:
//   • Sharp at every zoom level (no raster blur)
//   • Uses the SAME embedded Noto font as the rest of the PDF
//     — so Devanagari / Bengali / Tamil labels never turn into
//     tofu boxes
//   • Never blank (bypasses the browser SVG→<img>→canvas path
//     that was silently dropping glyphs)
// ============================================================
import type { jsPDF } from "jspdf";
import type { KundliChart, PlanetChartPosition, GrahaName } from "./types";

const RASHI_SHORT = [
  "Ar",
  "Ta",
  "Ge",
  "Cn",
  "Le",
  "Vi",
  "Li",
  "Sc",
  "Sg",
  "Cp",
  "Aq",
  "Pi",
] as const;

const GRAHA_SHORT: Record<GrahaName, string> = {
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

export interface ChartTheme {
  stroke: string;
  ink: string;
  accent: string;
  retro: string;
  muted: string;
  lagna: string;
}

const DEFAULT_THEME: ChartTheme = {
  stroke: "#5B1A1A",
  ink: "#1A1108",
  accent: "#B8862E",
  retro: "#B93A2E",
  muted: "#8a7860",
  lagna: "#C8571C",
};

export interface DrawOpts {
  fontFamily: string;
  theme?: Partial<ChartTheme>;
  /** Optional caption drawn below the chart. */
  caption?: string;
  /** Optional subtitle drawn below caption. */
  subCaption?: string;
}

// ---------- helpers ----------
function planetsByHouse(planets: PlanetChartPosition[]) {
  const out: Record<number, PlanetChartPosition[]> = {};
  for (let h = 1; h <= 12; h++) out[h] = [];
  for (const p of planets) out[p.house]?.push(p);
  return out;
}
function houseOfSign(chart: KundliChart, rashi: number): number {
  return ((rashi - chart.ascendant.rashiIndex + 12) % 12) + 1;
}
function signInHouse(chart: KundliChart, house: number): number {
  return (chart.ascendant.rashiIndex + (house - 1)) % 12;
}
function setFontSafe(doc: jsPDF, family: string, style: "normal" | "bold") {
  try {
    doc.setFont(family, style);
  } catch {
    doc.setFont(family, "normal");
  }
}
function drawCaption(
  doc: jsPDF,
  x: number,
  y: number,
  s: number,
  opts: DrawOpts,
  theme: ChartTheme,
) {
  if (opts.caption) {
    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(Math.max(7, s * 0.045));
    doc.setTextColor(theme.stroke);
    doc.text(opts.caption, x + s / 2, y + s + Math.max(4, s * 0.05), { align: "center" });
  }
  if (opts.subCaption) {
    setFontSafe(doc, opts.fontFamily, "normal");
    doc.setFontSize(Math.max(6, s * 0.035));
    doc.setTextColor(theme.muted);
    doc.text(opts.subCaption, x + s / 2, y + s + Math.max(8, s * 0.09), { align: "center" });
  }
}

// ============================================================
// NORTH INDIAN — Diamond chart (fixed houses, rotating signs)
// ============================================================
export function drawNorthIndian(
  doc: jsPDF,
  chart: KundliChart,
  x: number,
  y: number,
  s: number,
  opts: DrawOpts,
) {
  const t = { ...DEFAULT_THEME, ...(opts.theme ?? {}) };
  const grouped = planetsByHouse(chart.planets);
  const px = (u: number) => x + u * s;
  const py = (u: number) => y + u * s;

  doc.setDrawColor(t.stroke);
  doc.setLineWidth(0.35);
  doc.rect(x, y, s, s);
  doc.line(x, y, x + s, y + s);
  doc.line(x + s, y, x, y + s);
  doc.line(px(0.5), py(0), px(1), py(0.5));
  doc.line(px(1), py(0.5), px(0.5), py(1));
  doc.line(px(0.5), py(1), px(0), py(0.5));
  doc.line(px(0), py(0.5), px(0.5), py(0));

  const H: Record<number, [number, number]> = {
    1: [0.5, 0.3],
    2: [0.275, 0.14],
    3: [0.14, 0.275],
    4: [0.3, 0.5],
    5: [0.14, 0.725],
    6: [0.275, 0.86],
    7: [0.5, 0.7],
    8: [0.725, 0.86],
    9: [0.86, 0.725],
    10: [0.7, 0.5],
    11: [0.86, 0.275],
    12: [0.725, 0.14],
  };

  const fs = Math.max(4.5, s * 0.055);
  const gfs = Math.max(5, s * 0.062);

  for (let h = 1; h <= 12; h++) {
    const [ux, uy] = H[h];
    const cx = px(ux),
      cy = py(uy);
    const rashi = signInHouse(chart, h);
    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(fs);
    doc.setTextColor(t.accent);
    doc.text(RASHI_SHORT[rashi], cx, cy - s * 0.065, { align: "center" });
    setFontSafe(doc, opts.fontFamily, "normal");
    doc.setFontSize(fs * 0.8);
    doc.setTextColor(t.muted);
    doc.text(String(h), cx + s * 0.055, cy - s * 0.065, { align: "left" });

    if (h === 1) {
      setFontSafe(doc, opts.fontFamily, "bold");
      doc.setFontSize(fs * 0.85);
      doc.setTextColor(t.lagna);
      doc.text("Asc", cx, cy - s * 0.015, { align: "center" });
    }

    const planets = grouped[h] ?? [];
    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(gfs);
    const perRow = planets.length <= 2 ? planets.length : 2;
    planets.forEach((p, i) => {
      const col = i % perRow,
        row = Math.floor(i / perRow);
      const total = Math.min(perRow, planets.length - row * perRow);
      const spacing = s * 0.09;
      const xp = cx + (col - (total - 1) / 2) * spacing;
      const yp = cy + s * 0.04 + row * (gfs * 0.5);
      doc.setTextColor(p.retrograde ? t.retro : t.ink);
      doc.text(GRAHA_SHORT[p.graha] + (p.retrograde ? "®" : ""), xp, yp, { align: "center" });
    });
  }
  drawCaption(doc, x, y, s, opts, t);
}

// ============================================================
// SOUTH INDIAN — Fixed signs on a 4x4 grid, houses rotate
// ============================================================
export function drawSouthIndian(
  doc: jsPDF,
  chart: KundliChart,
  x: number,
  y: number,
  s: number,
  opts: DrawOpts,
) {
  const t = { ...DEFAULT_THEME, ...(opts.theme ?? {}) };
  const grouped = planetsByHouse(chart.planets);
  const cell = s / 4;

  doc.setDrawColor(t.stroke);
  doc.setLineWidth(0.35);
  doc.rect(x, y, s, s);
  doc.rect(x + cell, y + cell, 2 * cell, 2 * cell);
  for (let i = 1; i < 4; i++) {
    doc.line(x + i * cell, y, x + i * cell, y + cell);
    doc.line(x + i * cell, y + 3 * cell, x + i * cell, y + s);
    doc.line(x, y + i * cell, x + cell, y + i * cell);
    doc.line(x + 3 * cell, y + i * cell, x + s, y + i * cell);
  }

  const SIGN_CELL: Record<number, [number, number]> = {
    11: [0, 0],
    0: [1, 0],
    1: [2, 0],
    2: [3, 0],
    3: [3, 1],
    4: [3, 2],
    5: [3, 3],
    6: [2, 3],
    7: [1, 3],
    8: [0, 3],
    9: [0, 2],
    10: [0, 1],
  };

  // Center metadata
  setFontSafe(doc, opts.fontFamily, "bold");
  doc.setFontSize(Math.max(8, cell * 0.28));
  doc.setTextColor(t.stroke);
  doc.text(chart.ascendant.rashi, x + s / 2, y + s / 2 - cell * 0.1, { align: "center" });
  setFontSafe(doc, opts.fontFamily, "normal");
  doc.setFontSize(Math.max(6, cell * 0.18));
  doc.setTextColor(t.muted);
  doc.text(
    `Lagna ${chart.ascendant.degreesInRashi.toFixed(1)}°`,
    x + s / 2,
    y + s / 2 + cell * 0.15,
    { align: "center" },
  );

  const fs = Math.max(4.5, cell * 0.22);
  const gfs = Math.max(5, cell * 0.24);
  for (let r = 0; r < 12; r++) {
    const [col, row] = SIGN_CELL[r];
    const cx0 = x + col * cell,
      cy0 = y + row * cell;
    const house = houseOfSign(chart, r);

    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(fs);
    doc.setTextColor(t.accent);
    doc.text(RASHI_SHORT[r], cx0 + 1.6, cy0 + fs * 0.95);

    setFontSafe(doc, opts.fontFamily, "normal");
    doc.setFontSize(fs * 0.85);
    doc.setTextColor(t.muted);
    doc.text("H" + house, cx0 + cell - 1.6, cy0 + fs * 0.95, { align: "right" });

    if (house === 1) {
      doc.setFillColor(t.lagna);
      doc.triangle(cx0 + 1, cy0 + 1, cx0 + 4.5, cy0 + 1, cx0 + 1, cy0 + 4.5, "F");
    }

    const planets = grouped[house] ?? [];
    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(gfs);
    planets.forEach((p, i) => {
      const pcol = i % 2,
        prow = Math.floor(i / 2);
      const xp = cx0 + cell / 2 + (pcol - 0.5) * cell * 0.42;
      const yp = cy0 + cell * 0.55 + prow * (gfs * 0.55);
      doc.setTextColor(p.retrograde ? t.retro : t.ink);
      doc.text(GRAHA_SHORT[p.graha] + (p.retrograde ? "®" : ""), xp, yp, { align: "center" });
    });
  }
  drawCaption(doc, x, y, s, opts, t);
}

// ============================================================
// EAST INDIAN (Bengali) — 3x3 grid with corner diagonals
// ============================================================
export function drawEastIndian(
  doc: jsPDF,
  chart: KundliChart,
  x: number,
  y: number,
  s: number,
  opts: DrawOpts,
) {
  const t = { ...DEFAULT_THEME, ...(opts.theme ?? {}) };
  const grouped = planetsByHouse(chart.planets);
  const cell = s / 3;

  doc.setDrawColor(t.stroke);
  doc.setLineWidth(0.35);
  doc.rect(x, y, s, s);
  doc.line(x + cell, y, x + cell, y + s);
  doc.line(x + 2 * cell, y, x + 2 * cell, y + s);
  doc.line(x, y + cell, x + s, y + cell);
  doc.line(x, y + 2 * cell, x + s, y + 2 * cell);
  doc.line(x, y, x + cell, y + cell);
  doc.line(x + 2 * cell, y, x + 3 * cell, y + cell);
  doc.line(x, y + 2 * cell, x + cell, y + 3 * cell);
  doc.line(x + 2 * cell, y + 2 * cell, x + 3 * cell, y + 3 * cell);

  // Center label
  setFontSafe(doc, opts.fontFamily, "bold");
  doc.setFontSize(Math.max(7, cell * 0.22));
  doc.setTextColor(t.stroke);
  doc.text(chart.ascendant.rashi, x + s / 2, y + s / 2, { align: "center" });

  type Spec = { kind: "full" | "top" | "bot"; col: number; row: number };
  const SIGN_POS: Record<number, Spec> = {
    11: { kind: "top", col: 0, row: 0 },
    0: { kind: "bot", col: 0, row: 0 },
    1: { kind: "full", col: 1, row: 0 },
    2: { kind: "top", col: 2, row: 0 },
    3: { kind: "bot", col: 2, row: 0 },
    4: { kind: "full", col: 2, row: 1 },
    5: { kind: "top", col: 2, row: 2 },
    6: { kind: "bot", col: 2, row: 2 },
    7: { kind: "full", col: 1, row: 2 },
    8: { kind: "top", col: 0, row: 2 },
    9: { kind: "bot", col: 0, row: 2 },
    10: { kind: "full", col: 0, row: 1 },
  };

  const fs = Math.max(4.5, cell * 0.14);
  const gfs = Math.max(5, cell * 0.16);
  for (let r = 0; r < 12; r++) {
    const spec = SIGN_POS[r];
    const cx0 = x + spec.col * cell;
    const cy0 = y + spec.row * cell;
    let ax = 0,
      ay = 0,
      lx = 0,
      ly = 0;
    if (spec.kind === "full") {
      ax = cx0 + cell / 2;
      ay = cy0 + cell * 0.55;
      lx = cx0 + 2;
      ly = cy0 + fs * 0.95;
    } else if (spec.kind === "top") {
      ax = cx0 + cell * 0.62;
      ay = cy0 + cell * 0.35;
      lx = cx0 + 2;
      ly = cy0 + fs * 0.95;
    } else {
      ax = cx0 + cell * 0.38;
      ay = cy0 + cell * 0.72;
      lx = cx0 + 2;
      ly = cy0 + cell - 2;
    }
    const house = houseOfSign(chart, r);

    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(fs);
    doc.setTextColor(t.accent);
    doc.text(RASHI_SHORT[r], lx, ly);

    if (house === 1) {
      doc.setFillColor(t.lagna);
      doc.circle(ax, ay - gfs * 0.55, 0.9, "F");
    }

    const planets = grouped[house] ?? [];
    setFontSafe(doc, opts.fontFamily, "bold");
    doc.setFontSize(gfs);
    planets.forEach((p, i) => {
      const col2 = i % 2,
        row2 = Math.floor(i / 2);
      const total = Math.min(2, planets.length - row2 * 2);
      const xp = ax + (col2 - (total - 1) / 2) * cell * 0.24;
      const yp = ay + row2 * (gfs * 0.55);
      doc.setTextColor(p.retrograde ? t.retro : t.ink);
      doc.text(GRAHA_SHORT[p.graha] + (p.retrograde ? "®" : ""), xp, yp, { align: "center" });
    });
  }
  drawCaption(doc, x, y, s, opts, t);
}
