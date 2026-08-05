import type { ChartVisuals, CareerSuitabilityDomain, TopIndustryRanking } from "./types";
import type { PlanetChartPosition } from "@/lib/kundli/types";

/**
 * Generates standalone SVG vector graphics for Career Analysis Report Pro v4.0 Enterprise Edition.
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
  const promotionMeterSvg = createPromotionMeterSvg(88);
  const planetStrengthWheelSvg = createPlanetStrengthWheelSvg(planets);
  const careerRoadmapSvg = createCareerRoadmapSvg();
  const riskHeatmapSvg = createRiskHeatmapSvg();
  const decisionMatrixSvg = createDecisionMatrixSvg();
  const swotMatrixSvg = createSwotMatrixSvg();

  return {
    planetStrengthRadarSvg,
    houseStrengthBarSvg,
    careerWheelSvg,
    salaryGrowthGraphSvg,
    careerDNARadarSvg,
    opportunityMapSvg,
    promotionMeterSvg,
    planetStrengthWheelSvg,
    careerRoadmapSvg,
    riskHeatmapSvg,
    decisionMatrixSvg,
    swotMatrixSvg,
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
  const height = 280;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const maxR = 90, minR = 15;

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
      <rect x="-60" y="-16" width="120" height="32" rx="16" fill="${c.col}"/>
      <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="700">${c.name} ${c.score}%</text>
    </g>
  `).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Career Opportunity Map — Strategic Growth Vectors</text>
      ${lines}
      <circle cx="260" cy="110" r="28" fill="#1e1b4b" stroke="#d97706" stroke-width="3"/>
      <text x="260" y="106" text-anchor="middle" fill="#fef08a" font-size="8.5" font-weight="800">CAREER</text>
      <text x="260" y="118" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="700">CORE</text>
      ${nodes}
    </svg>
  `;
}

function createPromotionMeterSvg(score = 88): string {
  const width = 340;
  const height = 180;
  const cx = width / 2;
  const cy = 135;
  const r = 85;

  const angle = Math.PI - (score / 100) * Math.PI;
  const needleX = cx + (r - 15) * Math.cos(angle);
  const needleY = cy - (r - 15) * Math.sin(angle);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Promotion Probability Gauge</text>
      <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="#e2e8f0" stroke-width="18" stroke-linecap="round"/>
      <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="url(#promGrad)" stroke-width="18" stroke-linecap="round" stroke-dasharray="267" stroke-dashoffset="${267 - (267 * score) / 100}"/>
      <defs>
        <linearGradient id="promGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <line x1="${cx}" y1="${cy}" x2="${needleX.toFixed(1)}" y2="${needleY.toFixed(1)}" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#d97706"/>
      <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="24" font-weight="900" fill="#1e1b4b">${score}%</text>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="9" font-weight="700" fill="#059669">High Promotion Velocity</text>
    </svg>
  `;
}

function createPlanetStrengthWheelSvg(planets: PlanetChartPosition[]): string {
  const width = 360;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const outerR = 75, innerR = 30;

  const defaultGrahas = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const colors = ["#ea580c","#3b82f6","#ef4444","#10b981","#d97706","#ec4899","#64748b","#8b5cf6","#475569"];

  const slices = defaultGrahas.map((g, i) => {
    const a1 = (i * 40 - 90) * Math.PI / 180;
    const a2 = ((i + 1) * 40 - 90) * Math.PI / 180;

    const x1 = cx + outerR * Math.cos(a1);
    const y1 = cy + outerR * Math.sin(a1);
    const x2 = cx + outerR * Math.cos(a2);
    const y2 = cy + outerR * Math.sin(a2);

    const ix1 = cx + innerR * Math.cos(a1);
    const iy1 = cy + innerR * Math.sin(a1);
    const ix2 = cx + innerR * Math.cos(a2);
    const iy2 = cy + innerR * Math.sin(a2);

    const midA = (a1 + a2) / 2;
    const tx = cx + (outerR + 14) * Math.cos(midA);
    const ty = cy + (outerR + 10) * Math.sin(midA);

    return `
      <path d="M ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${outerR} ${outerR} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${innerR} ${innerR} 0 0 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z" fill="${colors[i]}" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
      <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#334155">${g.slice(0,2)}</text>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">9 Graha Planetary Strength Wheel</text>
      ${slices}
      <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#1e1b4b"/>
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="9" font-weight="800" fill="#fef08a">GRAHAS</text>
    </svg>
  `;
}

function createCareerRoadmapSvg(): string {
  const width = 520;
  const height = 160;

  const steps = [
    { label: "Current Level", detail: "Mid Management", col: "#475569", x: 50 },
    { label: "Next Promotion", detail: "Senior Director", col: "#d97706", x: 155 },
    { label: "Leadership", detail: "VP Operations", col: "#2563eb", x: 260 },
    { label: "Senior Exec", detail: "Senior VP / EVP", col: "#4f46e5", x: 365 },
    { label: "Peak Career", detail: "C-Suite / Founder", col: "#059669", x: 470 },
  ];

  const lines = steps.slice(0, 4).map((s, i) => `
    <line x1="${s.x + 25}" y1="80" x2="${steps[i+1].x - 25}" y2="80" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>
  `).join("");

  const nodes = steps.map((s) => `
    <g transform="translate(${s.x}, 80)">
      <circle cx="0" cy="0" r="22" fill="${s.col}" stroke="#fff" stroke-width="2"/>
      <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">★</text>
      <text x="0" y="-30" text-anchor="middle" font-size="9" font-weight="800" fill="#1e293b">${s.label}</text>
      <text x="0" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="#64748b">${s.detail}</text>
    </g>
  `).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Career Progression Roadmap &amp; Milestones</text>
      ${lines}
      ${nodes}
    </svg>
  `;
}

function createRiskHeatmapSvg(): string {
  const width = 520;
  const height = 180;

  const items = [
    { name: "Office Politics Risk", score: 25, col: "#dcfce7", textColor: "#166534", label: "Low Risk" },
    { name: "Job Stability Index", score: 92, col: "#dcfce7", textColor: "#166534", label: "Very High" },
    { name: "Layoff Risk", score: 12, col: "#dcfce7", textColor: "#166534", label: "Minimal" },
    { name: "Market Competition", score: 55, col: "#fef3c7", textColor: "#92400e", label: "Moderate" },
    { name: "Leadership Growth", score: 90, col: "#dcfce7", textColor: "#166534", label: "High Growth" },
    { name: "Business Venture Fit", score: 85, col: "#dcfce7", textColor: "#166534", label: "Favorable" },
    { name: "MNC Opportunity", score: 88, col: "#dcfce7", textColor: "#166534", label: "Strong" },
    { name: "Government Sector Fit", score: 72, col: "#fef3c7", textColor: "#92400e", label: "Moderate" },
  ];

  const cells = items.map((it, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = 12 + col * 125;
    const y = 40 + row * 65;

    return `
      <g transform="translate(${x}, ${y})">
        <rect width="118" height="58" rx="8" fill="${it.col}" stroke="#e2e8f0"/>
        <text x="59" y="20" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1e293b">${it.name}</text>
        <text x="59" y="38" text-anchor="middle" font-size="12" font-weight="900" fill="${it.textColor}">${it.label}</text>
        <text x="59" y="50" text-anchor="middle" font-size="7.5" font-weight="600" fill="#64748b">Score: ${it.score}%</text>
      </g>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="12" y="22" font-size="12" font-weight="800" fill="#1e1b4b">Career Risk &amp; Stability Heatmap</text>
      ${cells}
    </svg>
  `;
}

function createDecisionMatrixSvg(): string {
  const width = 520;
  const height = 180;

  const sectors = [
    { name: "Corporate MNC", score: 92, status: "Best Fit", col: "#059669" },
    { name: "Startup / Equity", score: 85, status: "High Potential", col: "#d97706" },
    { name: "Government PSU", score: 75, status: "Moderate Fit", col: "#4f46e5" },
    { name: "Own Business", score: 88, status: "Favorable", col: "#059669" },
    { name: "Foreign Career", score: 88, status: "Strong Fit", col: "#2563eb" },
    { name: "Academics/Research", score: 80, status: "Good Fit", col: "#4f46e5" },
    { name: "Legal / Regulatory", score: 78, status: "Good Fit", col: "#4f46e5" },
    { name: "Healthcare / Tech", score: 84, status: "High Fit", col: "#059669" },
  ];

  const rows = sectors.map((s, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 12 + col * 250;
    const y = 38 + row * 34;

    return `
      <g transform="translate(${x}, ${y})">
        <rect width="240" height="28" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="10" y="18" font-size="9" font-weight="700" fill="#1e293b">${s.name}</text>
        <rect x="130" y="6" width="60" height="16" rx="8" fill="#f1f5f9"/>
        <rect x="130" y="6" width="${(s.score / 100) * 60}" height="16" rx="8" fill="${s.col}"/>
        <text x="230" y="18" text-anchor="end" font-size="9" font-weight="800" fill="${s.col}">${s.score}%</text>
      </g>
    `;
  }).join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="12" y="22" font-size="12" font-weight="800" fill="#1e1b4b">Executive Career Decision Matrix (8 Sectors)</text>
      ${rows}
    </svg>
  `;
}

function createSwotMatrixSvg(): string {
  const width = 520;
  const height = 180;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#1e1b4b">Executive Career SWOT Analysis Matrix</text>

      <!-- Quadrant 1: Strengths -->
      <rect x="12" y="35" width="240" height="62" rx="8" fill="#dcfce7" stroke="#86efac"/>
      <text x="22" y="52" font-size="9.5" font-weight="800" fill="#166534">💪 STRENGTHS (Internal)</text>
      <text x="22" y="68" font-size="8" font-weight="600" fill="#14532d">• Strong 10th Lord &amp; Lagna Dignity</text>
      <text x="22" y="82" font-size="8" font-weight="600" fill="#14532d">• High Executive &amp; Decision Power</text>

      <!-- Quadrant 2: Weaknesses -->
      <rect x="268" y="35" width="240" height="62" rx="8" fill="#fff5f5" stroke="#fca5a5"/>
      <text x="278" y="52" font-size="9.5" font-weight="800" fill="#991b1b">⚠️ WEAKNESSES (Internal)</text>
      <text x="278" y="68" font-size="8" font-weight="600" fill="#7f1d1d">• Impatience during retrograde periods</text>
      <text x="278" y="82" font-size="8" font-weight="600" fill="#7f1d1d">• Delegation vs micro-management</text>

      <!-- Quadrant 3: Opportunities -->
      <rect x="12" y="105" width="240" height="62" rx="8" fill="#fef3c7" stroke="#fde047"/>
      <text x="22" y="122" font-size="9.5" font-weight="800" fill="#854d0e">🚀 OPPORTUNITIES (External)</text>
      <text x="22" y="138" font-size="8" font-weight="600" fill="#713f12">• Q3 Promotion Window &amp; Hike</text>
      <text x="22" y="152" font-size="8" font-weight="600" fill="#713f12">• MNC &amp; Overseas Assignments</text>

      <!-- Quadrant 4: Threats -->
      <rect x="268" y="105" width="240" height="62" rx="8" fill="#f3e8ff" stroke="#d8b4fe"/>
      <text x="278" y="122" font-size="9.5" font-weight="800" fill="#6b21a8">🛡️ THREATS / CAUTIONS (External)</text>
      <text x="278" y="138" font-size="8" font-weight="600" fill="#581c87">• Office Politics in Rahu Antardasha</text>
      <text x="278" y="152" font-size="8" font-weight="600" fill="#581c87">• Workplace Boundary Management</text>
    </svg>
  `;
}
