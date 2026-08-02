// ============================================================
// East Indian (Bengali) Kundli Chart
// ------------------------------------------------------------
// 3x3 outer grid; the 4 corner cells are split diagonally
// producing 12 fixed sign positions.  Center 1x1 cell holds
// chart metadata.  Signs are FIXED, houses rotate.
//
// Fixed sign layout (canonical Bengali):
//
//   [Meena / Mesha] [Vrishabha] [Mithuna / Karka]
//   [Kumbha]        [ center ]  [Simha]
//   [Makara/Dhanu ] [Vrishchika][Tula / Kanya]
//
// Corner splits: upper triangle first (reading order), lower triangle second.
// ============================================================

import { memo } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import type { KundliChart } from "@/lib/kundli/types";
import {
  GRAHA_SHORT,
  RASHI_SHORT,
  planetsByHouse,
  houseOfSign,
  withTheme,
  type ChartTheme,
} from "./chart-utils";

interface Props {
  chart: KundliChart;
  size?: number;
  title?: string;
  centerLabel?: string;
  centerSubLabel?: string;
  theme?: ChartTheme;
  className?: string;
}

type CellKind =
  | { kind: "full"; col: number; row: number }
  | { kind: "cornerTop"; col: number; row: number }
  | { kind: "cornerBottom"; col: number; row: number };

// rashi index → position spec
const SIGN_POS: Record<number, CellKind> = {
  11: { kind: "cornerTop", col: 0, row: 0 }, // Meena — top-left upper triangle
  0: { kind: "cornerBottom", col: 0, row: 0 }, // Mesha — top-left lower triangle
  1: { kind: "full", col: 1, row: 0 }, // Vrishabha — top middle
  2: { kind: "cornerTop", col: 2, row: 0 }, // Mithuna — top-right upper
  3: { kind: "cornerBottom", col: 2, row: 0 }, // Karka — top-right lower
  4: { kind: "full", col: 2, row: 1 }, // Simha — right middle
  5: { kind: "cornerTop", col: 2, row: 2 }, // Kanya — bottom-right upper
  6: { kind: "cornerBottom", col: 2, row: 2 }, // Tula — bottom-right lower
  7: { kind: "full", col: 1, row: 2 }, // Vrishchika — bottom middle
  8: { kind: "cornerTop", col: 0, row: 2 }, // Dhanu — bottom-left upper
  9: { kind: "cornerBottom", col: 0, row: 2 }, // Makara — bottom-left lower
  10: { kind: "full", col: 0, row: 1 }, // Kumbha — left middle
};

interface Anchor {
  labelX: number;
  labelY: number;
  centerX: number;
  centerY: number;
  houseX: number;
  houseY: number;
}

/** Compute label + planet-stack anchor for a given rashi cell. */
function anchor(spec: CellKind, cellSize: number): Anchor {
  const x0 = spec.col * cellSize;
  const y0 = spec.row * cellSize;
  if (spec.kind === "full") {
    return {
      labelX: x0 + 6,
      labelY: y0 + 12,
      centerX: x0 + cellSize / 2,
      centerY: y0 + cellSize / 2,
      houseX: x0 + cellSize - 6,
      houseY: y0 + 12,
    };
  }
  if (spec.kind === "cornerTop") {
    // upper triangle centroid
    return {
      labelX: x0 + 6,
      labelY: y0 + 12,
      centerX: x0 + cellSize * 0.62,
      centerY: y0 + cellSize * 0.32,
      houseX: x0 + cellSize - 6,
      houseY: y0 + 12,
    };
  }
  // cornerBottom
  return {
    labelX: x0 + 6,
    labelY: y0 + cellSize - 6,
    centerX: x0 + cellSize * 0.38,
    centerY: y0 + cellSize * 0.68,
    houseX: x0 + cellSize - 6,
    houseY: y0 + cellSize - 6,
  };
}

export const EastIndianChart = memo(function EastIndianChart({
  chart,
  size = 400,
  title,
  centerLabel,
  centerSubLabel,
  theme,
  className,
}: Props) {
  const { t: translate } = useTranslation();
  const t = withTheme(theme);
  const grouped = planetsByHouse(chart.planets);
  const cell = 400 / 3;

  return (
    <svg
      role="img"
      aria-label={title ?? translate("kundli.chart.aria_east")}
      viewBox="0 0 400 400"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background: t.background, color: t.foreground, maxWidth: "100%", height: "auto" }}
      shapeRendering="geometricPrecision"
    >
      {title ? <title>{title}</title> : null}

      {/* Frame + 3x3 grid + corner diagonals */}
      <g fill="none" stroke={t.stroke} strokeWidth={t.strokeWidth}>
        <rect x={2} y={2} width={396} height={396} />
        <line x1={cell} y1={2} x2={cell} y2={398} />
        <line x1={2 * cell} y1={2} x2={2 * cell} y2={398} />
        <line x1={2} y1={cell} x2={398} y2={cell} />
        <line x1={2} y1={2 * cell} x2={398} y2={2 * cell} />
        {/* Corner diagonals — top-left, top-right, bottom-left, bottom-right */}
        <line x1={0} y1={0} x2={cell} y2={cell} />
        <line x1={2 * cell} y1={0} x2={3 * cell} y2={cell} />
        <line x1={0} y1={2 * cell} x2={cell} y2={3 * cell} />
        <line x1={2 * cell} y1={2 * cell} x2={3 * cell} y2={3 * cell} />
      </g>

      {/* Center metadata */}
      <g>
        <text
          x={200}
          y={195}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
          fontWeight={700}
          fill={t.accent}
        >
          {centerLabel ?? translate("kundli.chart.rashi")}
        </text>
        {centerSubLabel && (
          <text
            x={200}
            y={215}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            opacity={0.75}
            fill={t.foreground}
          >
            {centerSubLabel}
          </text>
        )}
      </g>

      {/* 12 sign positions */}
      {Array.from({ length: 12 }, (_, rashiIdx) => {
        const spec = SIGN_POS[rashiIdx];
        const a = anchor(spec, cell);
        const house = houseOfSign(chart, rashiIdx);
        const isLagna = house === 1;
        const planets = grouped[house] ?? [];

        return (
          <g key={rashiIdx}>
            <text x={a.labelX} y={a.labelY} fontSize={9} fontWeight={600} fill={t.accent}>
              {RASHI_SHORT[rashiIdx]}
            </text>
            <text
              x={a.houseX}
              y={a.houseY}
              textAnchor="end"
              fontSize={8}
              opacity={0.55}
              fill={t.foreground}
            >
              H{house}
            </text>

            {isLagna && (
              <circle cx={a.centerX} cy={a.centerY - 14} r={4} fill={t.ascendantAccent} />
            )}

            {planets.map((p, idx) => {
              const cols = 2;
              const col2 = idx % cols;
              const row2 = Math.floor(idx / cols);
              const total = Math.min(cols, planets.length - row2 * cols);
              return (
                <text
                  key={p.graha}
                  x={a.centerX + (col2 - (total - 1) / 2) * 22}
                  y={a.centerY + row2 * 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill={p.retrograde ? t.retrograde : t.foreground}
                >
                  {GRAHA_SHORT[p.graha]}
                  {p.retrograde ? "\u1D3F" : ""}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
});
