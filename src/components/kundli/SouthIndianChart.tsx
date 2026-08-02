// ============================================================
// South Indian (Square) Kundli Chart
// ------------------------------------------------------------
// FIXED sign positions in a 4x4 grid, houses rotate.
// Mesha (Aries) sits at row 1, col 2. Signs proceed clockwise.
// Center 2x2 block reserved for chart metadata.
// ============================================================

import { memo } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import type { KundliChart } from "@/lib/kundli/types";
import {
  GRAHA_SHORT,
  RASHI_LABEL_SA,
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
  centerLabel?: string; // e.g. "Rashi (D1)"
  centerSubLabel?: string; // e.g. birth name
  theme?: ChartTheme;
  className?: string;
}

// Fixed rashi → [col,row] coordinates in a 4x4 grid.
const SIGN_CELL: Record<number, [number, number]> = {
  11: [0, 0], // Meena
  0: [1, 0], // Mesha
  1: [2, 0], // Vrishabha
  2: [3, 0], // Mithuna
  3: [3, 1], // Karka
  4: [3, 2], // Simha
  5: [3, 3], // Kanya
  6: [2, 3], // Tula
  7: [1, 3], // Vrishchika
  8: [0, 3], // Dhanu
  9: [0, 2], // Makara
  10: [0, 1], // Kumbha
};

export const SouthIndianChart = memo(function SouthIndianChart({
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
  const cell = 100; // 400/4

  return (
    <svg
      role="img"
      aria-label={title ?? translate("kundli.chart.aria_south")}
      viewBox="0 0 400 400"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background: t.background, color: t.foreground, maxWidth: "100%", height: "auto" }}
      shapeRendering="geometricPrecision"
    >
      {title ? <title>{title}</title> : null}

      {/* Outer + inner grid lines (only around perimeter cells) */}
      <g fill="none" stroke={t.stroke} strokeWidth={t.strokeWidth}>
        <rect x={2} y={2} width={396} height={396} />
        {/* vertical dividers between col 0/1 and 3/4 */}
        <line x1={cell} y1={2} x2={cell} y2={cell} />
        <line x1={cell} y1={3 * cell} x2={cell} y2={398} />
        <line x1={3 * cell} y1={2} x2={3 * cell} y2={cell} />
        <line x1={3 * cell} y1={3 * cell} x2={3 * cell} y2={398} />
        {/* horizontals */}
        <line x1={2} y1={cell} x2={cell} y2={cell} />
        <line x1={3 * cell} y1={cell} x2={398} y2={cell} />
        <line x1={2} y1={3 * cell} x2={cell} y2={3 * cell} />
        <line x1={3 * cell} y1={3 * cell} x2={398} y2={3 * cell} />
        {/* inner separators for top/bottom rows */}
        <line x1={2 * cell} y1={2} x2={2 * cell} y2={cell} />
        <line x1={2 * cell} y1={3 * cell} x2={2 * cell} y2={398} />
        <line x1={2} y1={2 * cell} x2={cell} y2={2 * cell} />
        <line x1={3 * cell} y1={2 * cell} x2={398} y2={2 * cell} />
        {/* inner center box */}
        <rect x={cell} y={cell} width={2 * cell} height={2 * cell} />
      </g>

      {/* Center metadata */}
      <g>
        <text
          x={200}
          y={190}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
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
            fontSize={11}
            opacity={0.75}
            fill={t.foreground}
          >
            {centerSubLabel}
          </text>
        )}
      </g>

      {/* 12 sign cells */}
      {Array.from({ length: 12 }, (_, rashiIdx) => {
        const [col, row] = SIGN_CELL[rashiIdx];
        const x = col * cell;
        const y = row * cell;
        const house = houseOfSign(chart, rashiIdx);
        const isLagna = house === 1;
        const planets = grouped[house] ?? [];

        return (
          <g key={rashiIdx}>
            {/* sign short-code (top-left) */}
            <text x={x + 6} y={y + 12} fontSize={10} fontWeight={600} fill={t.accent}>
              {RASHI_SHORT[rashiIdx]}
            </text>
            {/* house number (top-right) */}
            <text
              x={x + cell - 6}
              y={y + 12}
              textAnchor="end"
              fontSize={9}
              opacity={0.55}
              fill={t.foreground}
            >
              H{house}
            </text>

            {isLagna && (
              <g>
                {/* Ascendant marker: diagonal in the cell */}
                <line
                  x1={x + 2}
                  y1={y + 2}
                  x2={x + 22}
                  y2={y + 22}
                  stroke={t.ascendantAccent}
                  strokeWidth={2}
                />
                <text
                  x={x + cell / 2}
                  y={y + 26}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={t.ascendantAccent}
                >
                  {translate("kundli.chart.lagna")}
                </text>
              </g>
            )}

            {/* Planet stack */}
            {planets.map((p, idx) => {
              const col2 = idx % 2;
              const row2 = Math.floor(idx / 2);
              return (
                <text
                  key={p.graha}
                  x={x + 25 + col2 * 40}
                  y={y + 50 + row2 * 15}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill={p.retrograde ? t.retrograde : t.foreground}
                >
                  {GRAHA_SHORT[p.graha]}
                  {p.retrograde ? "\u1D3F" : ""}
                </text>
              );
            })}

            {/* Full sign name at bottom for readability */}
            <text
              x={x + cell / 2}
              y={y + cell - 6}
              textAnchor="middle"
              fontSize={8}
              opacity={0.5}
              fill={t.foreground}
            >
              {RASHI_LABEL_SA[rashiIdx]}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
