import type { ChartVisuals, CareerSuitabilityDomain, TopIndustryRanking } from "./types";
import type { PlanetChartPosition } from "@/lib/kundli/types";

/**
 * Generates standalone SVG vector graphics for Career Analysis Report Pro v3.0 / Enterprise Release.
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
  const careerDNARadarSvg = createCareerDNARadarSvg();
  const opportunityMapSvg = createOpportunityMapSvg();

  return {
    planetStrengthRadarSvg,
    houseStrengthBarSvg,
    careerWheelSvg,
    salaryGrowthGraphSvg,
    careerDNARadarSvg,
    opportunityMapSvg,
  };
}

function createPlanetStrengthRadarSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const radius = 75;

  const validPlanets = (planets || []).filter((p) => p.graha !== "Rahu" && p.graha !== "Ketu").slice(0, 7);
  const total = validPlanets.length || 7;

  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((level) => {
    const r = radius * level;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
  }).join("");

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

  const polygonPoints = points.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Graha Planetary Strength Radar</text>
      ${gridCircles}
      ${axisLines}
      <polygon points="${polygonPoints}" fill="rgba(217, 119, 6, 0.25)" stroke="#d97706" stroke-width="2.5"/>
      ${points.map((pt) => `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.5" fill="#d97706" />`).join("")}
    </svg>
  `;
}

function createHouseStrengthBarSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 240;
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
  const startY = 40;

  const bars = houses.map((h, i) => {
    const y = startY + i * (barHeight + gap);
    const barW = (h.val / 100) * 180;
    return `
      <text x="12" y="${y + 13}" font-size="10" font-weight="700" fill="#334155">${h.name}</text>
      <rect x="120" y="${y}" width="180" height="${barHeight}" rx="4" fill="#e2e8f0"/>
      <rect x="120" y="${y}" width="${barW.toFixed(1)}" height="${barHeight}" rx="4" fill="${h.col}"/>
      <text x="${125 + barW}" y="${y + 13}" font-size="10" font-weight="800" fill="#1e293b">${h.val}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="12" y="22" font-size="12" font-weight="800" fill="#1e1b4b">Career House Power Index</text>
      ${bars}
    </svg>
  `;
}

function createCareerWheelSvg(domains: CareerSuitabilityDomain[]): string {
  const width = 520;
  const height = 220;
  const topDomains = (domains || []).slice(0, 6);

  const colors = ["#d97706", "#4f46e5", "#059669", "#2563eb", "#9333ea", "#0d9488"];
  const bars = topDomains.map((d, i) => {
    const y = 40 + i * 28;
    const barW = (d.suitabilityScore / 100) * 320;
    return `
      <text x="12" y="${y + 14}" font-size="10" font-weight="700" fill="#334155">#${d.rank} ${d.category}</text>
      <rect x="150" y="${y}" width="320" height="18" rx="4" fill="#e2e8f0"/>
      <rect x="150" y="${y}" width="${barW.toFixed(1)}" height="18" rx="4" fill="${colors[i % colors.length]}"/>
      <text x="${155 + barW}" y="${y + 14}" font-size="10" font-weight="800" fill="#0f172a">${d.suitabilityScore}%</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="12" y="22" font-size="12" font-weight="800" fill="#1e1b4b">Career Domain Alignment Matrix</text>
      ${bars}
    </svg>
  `;
}

function createSalaryGrowthGraphSvg(): string {
  const width = 520;
  const height = 200;
  const points = [
    { x: 40, y: 150, label: "Yr 1" },
    { x: 140, y: 125, label: "Yr 3" },
    { x: 240, y: 90, label: "Yr 5" },
    { x: 340, y: 60, label: "Yr 7" },
    { x: 460, y: 35, label: "Yr 10" },
  ];

  const pathStr = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">10-Year Salary Growth &amp; Earning Trajectory</text>
      <line x1="40" y1="160" x2="480" y2="160" stroke="#cbd5e1" stroke-width="1"/>
      <path d="${pathStr} L 460 160 L 40 160 Z" fill="rgba(217, 119, 6, 0.15)"/>
      <path d="${pathStr}" fill="none" stroke="#d97706" stroke-width="3"/>
      ${points.map((p) => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#d97706" stroke="#fff" stroke-width="2"/>
        <text x="${p.x}" y="178" text-anchor="middle" font-size="9.5" font-weight="700" fill="#64748b">${p.label}</text>
      `).join("")}
    </svg>
  `;
}

function createCareerDNARadarSvg(): string {
  const width = 380;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const maxR = 95, minR = 15;

  const axes = [
    { label: "Strategic Thinking", score: 90 },
    { label: "Leadership", score: 88 },
    { label: "Communication", score: 86 },
    { label: "Decision Making", score: 85 },
    { label: "Learning Agility", score: 82 },
    { label: "Execution", score: 90 },
    { label: "Innovation", score: 84 },
    { label: "People Skills", score: 88 },
  ];
  const n = axes.length;
  const angleStep = 360 / n;

  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((f) => {
    const r = minR + (maxR - minR) * f;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="3 3"/>`;
  }).join("");

  const axisLines = axes.map((a, i) => {
    const rad = ((i * angleStep - 90) * Math.PI) / 180;
    const xEnd = cx + maxR * Math.cos(rad);
    const yEnd = cy + maxR * Math.sin(rad);

    const lx = cx + (maxR + 18) * Math.cos(rad);
    const ly = cy + (maxR + 14) * Math.sin(rad);
    const anchor = lx > cx + 5 ? "start" : lx < cx - 5 ? "end" : "middle";

    return `
      <line x1="${cx}" y1="${cy}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="#cbd5e1" stroke-width="0.8"/>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" font-size="8.5" font-weight="700" fill="#1e293b">${a.label}</text>
    `;
  }).join("");

  const points = axes.map((a, i) => {
    const r = minR + (maxR - minR) * (a.score / 100);
    const rad = ((i * angleStep - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
  }).join(" ");

  const dots = axes.map((a, i) => {
    const r = minR + (maxR - minR) * (a.score / 100);
    const rad = ((i * angleStep - 90) * Math.PI) / 180;
    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="#4f46e5" stroke="#fff" stroke-width="1.5"/>`;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Career DNA Profile — 8-Axis Competency Radar</text>
      ${gridCircles}
      ${axisLines}
      <polygon points="${points}" fill="rgba(79, 70, 229, 0.2)" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round"/>
      ${dots}
    </svg>
  `;
}

function createOpportunityMapSvg(): string {
  const width = 520;
  const height = 220;

  const categories = [
    { name: "Leadership", score: 90, x: 260, y: 40, col: "#d97706" },
    { name: "Business & Startup", score: 85, x: 100, y: 80, col: "#059669" },
    { name: "Corporate & MNC", score: 88, x: 420, y: 80, col: "#2563eb" },
    { name: "International Career", score: 88, x: 80, y: 160, col: "#0d9488" },
    { name: "Government / PSU", score: 75, x: 440, y: 160, col: "#7c3aed" },
    { name: "Consulting & Advisory", score: 87, x: 260, y: 190, col: "#ea580c" },
  ];

  const lines = categories.map((c) => `
    <line x1="260" y1="110" x2="${c.x}" y2="${c.y}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 3"/>
  `).join("");

  const nodes = categories.map((c) => `
    <g transform="translate(${c.x}, ${c.y})">
      <rect x="-60" y="-16" width="120" height="32" rx="16" fill="${c.col}" shadow="true"/>
      <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="700">${c.name} ${c.score}%</text>
    </g>
  `).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Career Opportunity Map — Strategic Growth Vectors</text>
      ${lines}
      <!-- Center Hub -->
      <circle cx="260" cy="110" r="28" fill="#1e1b4b" stroke="#d97706" stroke-width="3"/>
      <text x="260" y="106" text-anchor="middle" fill="#fef08a" font-size="8.5" font-weight="800">CAREER</text>
      <text x="260" y="118" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="700">CORE</text>
      ${nodes}
    </svg>
  `;
}
