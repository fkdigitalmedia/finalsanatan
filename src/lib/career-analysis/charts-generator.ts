import type { ChartVisuals, CareerSuitabilityDomain, TopIndustryRanking } from "./types";
import type { PlanetChartPosition } from "@/lib/kundli/types";

/**
 * Generates standalone SVG vector graphics for Career Analysis Report Pro v3.0.
 * Can be embedded directly into HTML print templates or React dashboards.
 */
export function generateCareerCharts(
  planets: PlanetChartPosition[],
  domains: CareerSuitabilityDomain[],
  industries: TopIndustryRanking[]
): ChartVisuals {
  const planetStrengthRadarSvg = createPlanetStrengthRadarSvg(planets);
  const houseStrengthBarSvg = createHouseStrengthBarSvg(planets);
  const careerWheelSvg = createCareerWheelSvg(domains);
  const salaryGrowthGraphSvg = createSalaryGrowthGraphSvg();

  return {
    planetStrengthRadarSvg,
    houseStrengthBarSvg,
    careerWheelSvg,
    salaryGrowthGraphSvg,
  };
}

function createPlanetStrengthRadarSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 260;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const radius = 80;

  const validPlanets = planets.filter((p) => p.graha !== "Rahu" && p.graha !== "Ketu").slice(0, 7);
  const total = validPlanets.length || 7;

  // Grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((level) => {
    const r = radius * level;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
  }).join("");

  // Axes and points
  const points: { x: number; y: number; label: string; val: number }[] = [];
  const axisLines = validPlanets.map((p, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const xEnd = cx + radius * Math.cos(angle);
    const yEnd = cy + radius * Math.sin(angle);

    const score = Math.min(1, Math.max(0.3, p.strengthScore || (p.dignity === "exalted" ? 0.95 : p.dignity === "own" ? 0.85 : 0.6)));
    const px = cx + radius * score * Math.cos(angle);
    const py = cy + radius * score * Math.sin(angle);
    points.push({ x: px, y: py, label: p.graha, val: Math.round(score * 100) });

    const lx = cx + (radius + 20) * Math.cos(angle);
    const ly = cy + (radius + 15) * Math.sin(angle);

    return `
      <line x1="${cx}" y1="${cy}" x2="${xEnd}" y2="${yEnd}" stroke="#cbd5e1" stroke-width="1"/>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">${p.graha.slice(0, 3)}</text>
    `;
  }).join("");

  const polygonPoints = points.map((pt) => `${pt.x},${pt.y}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Graha Planetary Strength Radar</text>
      ${gridCircles}
      ${axisLines}
      <polygon points="${polygonPoints}" fill="rgba(217, 119, 6, 0.25)" stroke="#d97706" stroke-width="2.5"/>
      ${points.map((pt) => `<circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="#d97706" />`).join("")}
    </svg>
  `;
}

function createHouseStrengthBarSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 220;
  const houses = [
    { name: "2nd (Salary)", val: 88, col: "#d97706" },
    { name: "5th (Intellect)", val: 84, col: "#4f46e5" },
    { name: "6th (Service)", val: 90, col: "#059669" },
    { name: "9th (Fortune)", val: 86, col: "#d97706" },
    { name: "10th (Karma)", val: 95, col: "#b45309" },
    { name: "11th (Gains)", val: 92, col: "#2563eb" },
  ];

  const barHeight = 18;
  const gap = 12;
  const startY = 35;

  const bars = houses.map((h, i) => {
    const y = startY + i * (barHeight + gap);
    const barW = (h.val / 100) * 180;
    return `
      <text x="10" y="${y + 13}" font-size="10" font-weight="700" fill="#334155">${h.name}</text>
      <rect x="120" y="${y}" width="180" height="${barHeight}" rx="4" fill="#f1f5f9"/>
      <rect x="120" y="${y}" width="${barW}" height="${barHeight}" rx="4" fill="${h.col}"/>
      <text x="${125 + barW}" y="${y + 13}" font-size="10" font-weight="800" fill="#1e293b">${h.val}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="20" font-size="12" font-weight="800" fill="#1e1b4b">Career House Power Index</text>
      ${bars}
    </svg>
  `;
}

function createCareerWheelSvg(domains: CareerSuitabilityDomain[]): string {
  const width = 360;
  const height = 220;
  const topDomains = domains.slice(0, 5);

  const colors = ["#d97706", "#4f46e5", "#059669", "#2563eb", "#9333ea"];
  const bars = topDomains.map((d, i) => {
    const y = 40 + i * 32;
    const barW = (d.suitabilityScore / 100) * 180;
    return `
      <text x="10" y="${y + 14}" font-size="10.5" font-weight="700" fill="#334155">#${d.rank} ${d.category}</text>
      <rect x="130" y="${y}" width="180" height="18" rx="4" fill="#f1f5f9"/>
      <rect x="130" y="${y}" width="${barW}" height="18" rx="4" fill="${colors[i % colors.length]}"/>
      <text x="${135 + barW}" y="${y + 14}" font-size="10" font-weight="800" fill="#0f172a">${d.suitabilityScore}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="20" font-size="12" font-weight="800" fill="#1e1b4b">Top 5 Career Domain Alignment</text>
      ${bars}
    </svg>
  `;
}

function createSalaryGrowthGraphSvg(): string {
  const width = 360;
  const height = 200;
  const points = [
    { x: 30, y: 150, label: "Yr 1" },
    { x: 90, y: 130, label: "Yr 3" },
    { x: 150, y: 95, label: "Yr 5" },
    { x: 210, y: 65, label: "Yr 7" },
    { x: 270, y: 35, label: "Yr 10" },
  ];

  const pathStr = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">10-Year Salary Growth Trajectory</text>
      <line x1="30" y1="160" x2="310" y2="160" stroke="#cbd5e1" stroke-width="1"/>
      <path d="${pathStr} L 270 160 L 30 160 Z" fill="rgba(217, 119, 6, 0.15)"/>
      <path d="${pathStr}" fill="none" stroke="#d97706" stroke-width="3"/>
      ${points.map((p) => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#d97706" />
        <text x="${p.x}" y="176" text-anchor="middle" font-size="9" font-weight="700" fill="#64748b">${p.label}</text>
      `).join("")}
    </svg>
  `;
}
