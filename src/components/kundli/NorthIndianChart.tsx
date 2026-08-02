// ============================================================
// North Indian (Diamond) Kundli Chart
// ------------------------------------------------------------
// Fixed HOUSE positions, rotating signs.
// House 1 is the top-center diamond, houses proceed
// anti-clockwise (traditional North-Indian convention).
// ============================================================

import { memo } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import type { KundliChart } from "@/lib/kundli/types";
import {
  GRAHA_SHORT,
  RASHI_SHORT,
  planetsByHouse,
  signInHouse,
  withTheme,
  type ChartTheme,
} from "./chart-utils";

interface Props {
  chart: KundliChart;
  size?: number; // rendered pixel size; SVG itself is responsive
  title?: string;
  theme?: ChartTheme;
  className?: string;
}

// House centroid + label anchor coordinates in a 400x400 viewBox.
// Order: house index 1..12 → [x,y] centroid.
const HOUSE_CENTERS: Record<number, [number, number]> = {
  1: [200, 120],
  2: [110, 55],
  3: [55, 110],
  4: [120, 200],
  5: [55, 290],
  6: [110, 345],
  7: [200, 280],
  8: [290, 345],
  9: [345, 290],
  10: [280, 200],
  11: [345, 110],
  12: [290, 55],
};

// Sign label positions — offset toward the outer edge of the house.
const SIGN_LABEL_POS: Record<number, [number, number]> = {
  1: [200, 40],
  2: [90, 30],
  3: [30, 90],
  4: [40, 200],
  5: [30, 310],
  6: [90, 370],
  7: [200, 360],
  8: [310, 370],
  9: [370, 310],
  10: [360, 200],
  11: [370, 90],
  12: [310, 30],
};

export const NorthIndianChart = memo(function NorthIndianChart({
  chart,
  size = 400,
  title,
  theme,
  className,
}: Props) {
  const { t: translate } = useTranslation();
  const t = withTheme(theme);
  const grouped = planetsByHouse(chart.planets);

  return (
    <svg
      role="img"
      aria-label={title ?? translate("kundli.chart.aria_north")}
      viewBox="0 0 400 400"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background: t.background, color: t.foreground, maxWidth: "100%", height: "auto" }}
      shapeRendering="geometricPrecision"
    >
      {title ? <title>{title}</title> : null}

      {/* Outer square + diagonals + inner diamond */}
      <g fill="none" stroke={t.stroke} strokeWidth={t.strokeWidth} strokeLinejoin="miter">
        <rect x={2} y={2} width={396} height={396} />
        <line x1={2} y1={2} x2={398} y2={398} />
        <line x1={398} y1={2} x2={2} y2={398} />
        <polygon points="200,2 398,200 200,398 2,200" />
      </g>

      {/* House cells */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
        const rashiIdx = signInHouse(chart, house);
        const [cx, cy] = HOUSE_CENTERS[house];
        const [sx, sy] = SIGN_LABEL_POS[house];
        const planets = grouped[house] ?? [];
        const isLagna = house === 1;

        return (
          <g key={house}>
            {/* Sign short-label */}
            <text
              x={sx}
              y={sy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill={t.accent}
              style={{ pointerEvents: "none" }}
            >
              {RASHI_SHORT[rashiIdx]}
            </text>

            {/* House number badge */}
            <text
              x={cx}
              y={cy - 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              opacity={0.55}
              fill={t.foreground}
            >
              {house}
            </text>

            {/* Planets stacked in the house */}
            <PlanetStack
              planets={planets}
              cx={cx}
              cy={cy}
              lagnaMark={isLagna}
              theme={t}
              lagnaLabel={translate("kundli.chart.lagna")}
            />
          </g>
        );
      })}
    </svg>
  );
});

function PlanetStack({
  planets,
  cx,
  cy,
  lagnaMark,
  theme,
  lagnaLabel,
}: {
  planets: ReturnType<typeof planetsByHouse>[number];
  cx: number;
  cy: number;
  lagnaMark: boolean;
  theme: Required<ChartTheme>;
  lagnaLabel: string;
}) {
  const rows: string[][] = [];
  for (let i = 0; i < planets.length; i += 3) rows.push(planets.slice(i, i + 3).map(() => ""));
  const lineHeight = 12;

  return (
    <g>
      {lagnaMark && (
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={9}
          fontWeight={700}
          fill={theme.ascendantAccent}
        >
          {lagnaLabel}
        </text>
      )}
      {planets.map((p, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const total = Math.min(3, planets.length - row * 3);
        const spacing = 18;
        const x = cx + (col - (total - 1) / 2) * spacing;
        const y = cy + (lagnaMark ? 6 : -2) + row * lineHeight;
        return (
          <text
            key={p.graha}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontWeight={600}
            fill={p.retrograde ? theme.retrograde : theme.foreground}
          >
            {GRAHA_SHORT[p.graha]}
            {p.retrograde ? "\u1D3F" : ""}
          </text>
        );
      })}
    </g>
  );
}
