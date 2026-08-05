import type { ChartVisuals, MarriageScores, EnterpriseNewChapters } from "./types";
import type { PlanetChartPosition } from "@/lib/kundli/types";

/**
 * Generates standalone SVG vector graphics for Marriage Analysis Report Pro v2.0.
 * Embedded directly into PDF pages & Web Dashboards.
 */
export function generateMarriageCharts(
  scores: MarriageScores,
  planets: PlanetChartPosition[],
  newChapters: EnterpriseNewChapters
): ChartVisuals {
  const marriageRadarSvg = createMarriageRadarSvg(scores);
  const housePowerBarSvg = createHousePowerBarSvg(planets);
  const compatibilityWheelSvg = createCompatibilityWheelSvg(newChapters);
  const fiveYearRoadmapSvg = createFiveYearRoadmapSvg(newChapters);

  return {
    marriageRadarSvg,
    housePowerBarSvg,
    compatibilityWheelSvg,
    fiveYearRoadmapSvg,
  };
}

function createMarriageRadarSvg(scores: MarriageScores): string {
  const width = 360;
  const height = 250;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const radius = 75;

  const metrics = [
    { label: "Overall", val: scores.overallScore },
    { label: "Marriage", val: scores.marriageScore },
    { label: "Spouse Fit", val: scores.spouseCompatibilityScore },
    { label: "Harmonization", val: Math.max(20, 100 - scores.manglikDoshaScore) },
    { label: "Timing", val: scores.timingScore },
    { label: "Remedial", val: scores.remedyScore },
  ];

  const total = metrics.length;
  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((lvl) => `<circle cx="${cx}" cy="${cy}" r="${radius * lvl}" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`).join("");

  const points: { x: number; y: number }[] = [];
  const axisLines = metrics.map((m, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const xEnd = cx + radius * Math.cos(angle);
    const yEnd = cy + radius * Math.sin(angle);

    const norm = m.val / 100;
    const px = cx + radius * norm * Math.cos(angle);
    const py = cy + radius * norm * Math.sin(angle);
    points.push({ x: px, y: py });

    const lx = cx + (radius + 18) * Math.cos(angle);
    const ly = cy + (radius + 12) * Math.sin(angle);

    return `
      <line x1="${cx}" y1="${cy}" x2="${xEnd}" y2="${yEnd}" stroke="#cbd5e1" stroke-width="1"/>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#334155">${m.label}</text>
    `;
  }).join("");

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Marriage Harmony Radar Index</text>
      ${gridCircles}
      ${axisLines}
      <polygon points="${polygonPoints}" fill="rgba(217, 119, 6, 0.22)" stroke="#d97706" stroke-width="2.5"/>
      ${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#d97706"/>`).join("")}
    </svg>
  `;
}

function createHousePowerBarSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 210;

  const getP = (g: string) => planets.find((p) => p.graha === g);
  const venusP = getP("Venus");
  const jupP = getP("Jupiter");
  const sunP = getP("Sun");

  const items = [
    { name: "7th House (Marriage)", val: 92, col: "#d97706" },
    { name: "Venus (Romance & Love)", val: venusP?.house === 7 || venusP?.house === 2 || venusP?.house === 11 ? 95 : 86, col: "#4f46e5" },
    { name: "Jupiter (Wisdom & Grace)", val: jupP?.house === 7 || jupP?.house === 9 ? 94 : 88, col: "#059669" },
    { name: "Navamsa D9 Dignity", val: 88, col: "#b45309" },
    { name: "Upapada Lagna Strength", val: 90, col: "#2563eb" },
  ];

  const barH = 16;
  const gap = 12;
  const startY = 35;

  const bars = items.map((h, i) => {
    const y = startY + i * (barH + gap);
    const barW = (h.val / 100) * 170;
    return `
      <text x="10" y="${y + 12}" font-size="9.5" font-weight="700" fill="#334155">${h.name}</text>
      <rect x="145" y="${y}" width="170" height="${barH}" rx="4" fill="#f1f5f9"/>
      <rect x="145" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${h.col}"/>
      <text x="${150 + barW}" y="${y + 12}" font-size="9.5" font-weight="800" fill="#1e293b">${h.val}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="20" font-size="12" font-weight="800" fill="#1e1b4b">7th House & Benefic Power Index</text>
      ${bars}
    </svg>
  `;
}

function createCompatibilityWheelSvg(newChapters: EnterpriseNewChapters): string {
  const width = 360;
  const height = 210;

  const items = [
    { name: "Trust Index", val: newChapters.trustIndexScore, col: "#059669" },
    { name: "Financial Fit", val: newChapters.financialCompatibilityScore, col: "#d97706" },
    { name: "Family Synergy", val: newChapters.familyCompatibilityScore, col: "#4f46e5" },
    { name: "In-Law Alignment", val: newChapters.inLawCompatibilityScore, col: "#2563eb" },
    { name: "Intimacy Bond", val: newChapters.intimacyCompatibilityScore, col: "#9333ea" },
  ];

  const bars = items.map((d, i) => {
    const y = 35 + i * 32;
    const barW = (d.val / 100) * 170;
    return `
      <text x="10" y="${y + 14}" font-size="10" font-weight="700" fill="#334155">${d.name}</text>
      <rect x="145" y="${y}" width="170" height="18" rx="4" fill="#f1f5f9"/>
      <rect x="145" y="${y}" width="${barW}" height="18" rx="4" fill="${d.col}"/>
      <text x="${150 + barW}" y="${y + 14}" font-size="10" font-weight="800" fill="#0f172a">${d.val}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="20" font-size="12" font-weight="800" fill="#1e1b4b">5 Dimensions of Spousal Compatibility</text>
      ${bars}
    </svg>
  `;
}

function createFiveYearRoadmapSvg(newChapters: EnterpriseNewChapters): string {
  const width = 360;
  const height = 190;
  const roadmap = newChapters.fiveYearMarriageRoadmap || [];

  const points = roadmap.map((item, i) => ({
    x: 35 + i * 70,
    y: 140 - (i % 2 === 0 ? 25 : 45),
    label: `Yr ${item.year}`,
  }));

  const pathStr = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">5-Year Marital Harmony Trajectory</text>
      <line x1="35" y1="150" x2="320" y2="150" stroke="#cbd5e1" stroke-width="1"/>
      <path d="${pathStr} L 315 150 L 35 150 Z" fill="rgba(217, 119, 6, 0.15)"/>
      <path d="${pathStr}" fill="none" stroke="#d97706" stroke-width="3"/>
      ${points.map((p) => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#d97706"/>
        <text x="${p.x}" y="166" text-anchor="middle" font-size="9" font-weight="700" fill="#64748b">${p.label}</text>
      `).join("")}
    </svg>
  `;
}
