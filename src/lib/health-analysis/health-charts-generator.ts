import type { HealthScores, BodyConstitution, OrganDashboardCard, RiskDashboardCard, MonthlyWellnessForecastItem, HealthSVGCharts } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Health SVG Chart Generator — Standalone vector charts (no external deps)
// ─────────────────────────────────────────────────────────────────────────────

const EMERALD = "#059669";
const TEAL    = "#0d9488";
const AMBER   = "#d97706";
const ROSE    = "#e11d48";
const INDIGO  = "#4f46e5";
const SLATE   = "#64748b";
const LIGHT   = "#f0fdf4";

// ── Utility ───────────────────────────────────────────────────────────────────

function polarToXY(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function colorForScore(score: number): string {
  if (score >= 80) return EMERALD;
  if (score >= 60) return TEAL;
  if (score >= 45) return AMBER;
  return ROSE;
}

function colorForRisk(risk: number): string {
  if (risk <= 20) return EMERALD;
  if (risk <= 35) return TEAL;
  if (risk <= 55) return AMBER;
  return ROSE;
}

// ── 1. Health Wheel Radar ─────────────────────────────────────────────────────

export function generateHealthWheelRadar(scores: HealthScores): string {
  const labels = ["Overall Health","Mental Wellness","Physical Vitality","Energy","Immunity","Recovery","Lifestyle Balance","Sleep","Emotional Stability"];
  const values = [
    scores.overallHealth, scores.mentalWellness, scores.physicalVitality,
    scores.energy, scores.immunity, scores.recovery,
    scores.lifestyleBalance, scores.sleep, scores.emotionalStability,
  ];
  const n = labels.length;
  const cx = 200, cy = 200, maxR = 140, minR = 20;
  const angleStep = 360 / n;

  // Grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((factor) => {
    const r = minR + (maxR - minR) * factor;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>`;
  }).join("");

  // Axis lines
  const axes = labels.map((_, i) => {
    const angle = i * angleStep;
    const pt = polarToXY(cx, cy, maxR, angle);
    return `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(1)}" y2="${pt.y.toFixed(1)}" stroke="#cbd5e1" stroke-width="0.8"/>`;
  }).join("");

  // Data polygon
  const dataPoints = values.map((v, i) => {
    const ratio = v / 100;
    const r = minR + (maxR - minR) * ratio;
    const angle = i * angleStep;
    const pt = polarToXY(cx, cy, r, angle);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  // Labels
  const labelTexts = labels.map((label, i) => {
    const angle = i * angleStep;
    const pt = polarToXY(cx, cy, maxR + 22, angle);
    const anchor = pt.x > cx + 5 ? "start" : pt.x < cx - 5 ? "end" : "middle";
    return `<text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="${anchor}" fill="#334155" font-size="8.5" font-family="Inter,sans-serif" font-weight="600">${label.replace("&", "&amp;")}</text>`;
  }).join("");

  // Score dots with values
  const scoreDots = values.map((v, i) => {
    const ratio = v / 100;
    const r = minR + (maxR - minR) * ratio;
    const angle = i * angleStep;
    const pt = polarToXY(cx, cy, r, angle);
    return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4" fill="${colorForScore(v)}" stroke="#fff" stroke-width="1.5"/>
            <text x="${pt.x.toFixed(1)}" y="${(pt.y - 7).toFixed(1)}" text-anchor="middle" fill="${colorForScore(v)}" font-size="7.5" font-family="Inter,sans-serif" font-weight="700">${v}</text>`;
  }).join("");

  // Grid value labels
  const gridLabels = [25, 50, 75, 100].map((val) => {
    const ratio = val / 100;
    const r = minR + (maxR - minR) * ratio;
    const pt = polarToXY(cx, cy, r, 0);
    return `<text x="${(pt.x + 3).toFixed(1)}" y="${pt.y.toFixed(1)}" fill="${SLATE}" font-size="7" font-family="Inter,sans-serif">${val}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 410" width="400" height="410">
  <defs>
    <linearGradient id="hwGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${EMERALD}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="400" height="410" fill="${LIGHT}" rx="12"/>
  <text x="200" y="26" text-anchor="middle" fill="#064e3b" font-size="13" font-family="Inter,sans-serif" font-weight="700">Health Wheel — Wellness Radar Index</text>
  <g transform="translate(0, 30)">
    ${gridCircles}
    ${axes}
    <polygon points="${dataPoints}" fill="url(#hwGrad)" stroke="${EMERALD}" stroke-width="2" stroke-linejoin="round"/>
    ${gridLabels}
    ${scoreDots}
    ${labelTexts}
  </g>
  <text x="200" y="400" text-anchor="middle" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif">Scores out of 100 | Astrological Wellness Index</text>
</svg>`;
}

// ── 2. Risk Radar Chart ────────────────────────────────────────────────────────

export function generateRiskRadarChart(riskDashboard: RiskDashboardCard[]): string {
  const items = riskDashboard.slice(0, 10);
  const n = items.length;
  const cx = 200, cy = 200, maxR = 130, minR = 20;
  const angleStep = 360 / n;

  const gridCircles = [0.25, 0.5, 0.75, 1.0].map((f) => {
    const r = minR + (maxR - minR) * f;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fecaca" stroke-width="0.8"/>`;
  }).join("");

  const axes = items.map((_, i) => {
    const pt = polarToXY(cx, cy, maxR, i * angleStep);
    return `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(1)}" y2="${pt.y.toFixed(1)}" stroke="#fca5a5" stroke-width="0.8"/>`;
  }).join("");

  const dataPoints = items.map((item, i) => {
    const r = minR + (maxR - minR) * (item.riskPercent / 100);
    const pt = polarToXY(cx, cy, r, i * angleStep);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  const labels = items.map((item, i) => {
    const angle = i * angleStep;
    const pt = polarToXY(cx, cy, maxR + 22, angle);
    const anchor = pt.x > cx + 5 ? "start" : pt.x < cx - 5 ? "end" : "middle";
    const shortName = item.conditionName.replace("/ ", "/").split(" ")[0];
    return `<text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="${anchor}" fill="#7f1d1d" font-size="8" font-family="Inter,sans-serif" font-weight="600">${shortName}</text>`;
  }).join("");

  const dots = items.map((item, i) => {
    const r = minR + (maxR - minR) * (item.riskPercent / 100);
    const pt = polarToXY(cx, cy, r, i * angleStep);
    const col = colorForRisk(item.riskPercent);
    return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 430" width="400" height="430">
  <defs>
    <linearGradient id="rrGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ROSE}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="430" fill="#fff5f5" rx="12"/>
  <text x="200" y="24" text-anchor="middle" fill="#7f1d1d" font-size="13" font-family="Inter,sans-serif" font-weight="700">Risk Radar — Disease Risk Index</text>
  <g transform="translate(0,30)">
    ${gridCircles}
    ${axes}
    <polygon points="${dataPoints}" fill="url(#rrGrad)" stroke="${ROSE}" stroke-width="2" stroke-linejoin="round"/>
    ${dots}
    ${labels}
  </g>
  <text x="200" y="395" text-anchor="middle" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif">Risk Level: Lower area = Better health | Higher = Attention required</text>
  <g transform="translate(30, 408)">
    <circle cx="8" cy="6" r="5" fill="${EMERALD}"/><text x="16" y="10" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Low (&lt;20%)</text>
    <circle cx="80" cy="6" r="5" fill="${AMBER}"/><text x="88" y="10" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Moderate</text>
    <circle cx="158" cy="6" r="5" fill="${ROSE}"/><text x="166" y="10" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">High (&gt;55%)</text>
  </g>
</svg>`;
}

// ── 3. Dosha Triangle Chart ───────────────────────────────────────────────────

export function generateDoshaTriangle(constitution: BodyConstitution): string {
  const { vataPercentage: vata, pittaPercentage: pitta, kaphaPercentage: kapha, primaryDosha } = constitution;
  const w = 360, h = 300;
  const cx = w / 2;

  // Triangle vertices (equilateral)
  const v = { x: cx,       y: 30  };  // Vata (top)
  const p = { x: 60,       y: 255 };  // Pitta (bottom left)
  const k = { x: 300,      y: 255 };  // Kapha (bottom right)

  // Barycentric point based on percentages
  const bx = (vata * v.x + pitta * p.x + kapha * k.x) / 100;
  const by = (vata * v.y + pitta * p.y + kapha * k.y) / 100;

  // Fill areas
  const vataFill  = `${v.x},${v.y} ${(v.x + p.x) / 2},${(v.y + p.y) / 2} ${cx},${(v.y + p.y + k.y) / 3} ${(v.x + k.x) / 2},${(v.y + k.y) / 2}`;
  const pittaFill = `${p.x},${p.y} ${(v.x + p.x) / 2},${(v.y + p.y) / 2} ${cx},${(v.y + p.y + k.y) / 3} ${(p.x + k.x) / 2},${(p.y + k.y) / 2}`;
  const kaphaFill = `${k.x},${k.y} ${(v.x + k.x) / 2},${(v.y + k.y) / 2} ${cx},${(v.y + p.y + k.y) / 3} ${(p.x + k.x) / 2},${(p.y + k.y) / 2}`;

  // Pie bars for legend
  const barW = 80, barH = 12, barY = 275;
  const barColors = [INDIGO, ROSE, TEAL];
  const doshaVals = [vata, pitta, kapha];
  const doshaLabels = ["Vata","Pitta","Kapha"];
  const bars = doshaVals.map((val, i) => {
    const bx2 = 30 + i * 110;
    return `
      <rect x="${bx2}" y="${barY}" width="${barW}" height="${barH}" rx="4" fill="#e2e8f0"/>
      <rect x="${bx2}" y="${barY}" width="${barW * val / 100}" height="${barH}" rx="4" fill="${barColors[i]}"/>
      <text x="${bx2 + barW / 2}" y="${barY - 4}" text-anchor="middle" fill="${barColors[i]}" font-size="9" font-family="Inter,sans-serif" font-weight="700">${doshaLabels[i]} ${val}%</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320" width="360" height="320">
  <rect width="360" height="320" fill="#f8fafc" rx="12"/>
  <text x="180" y="22" text-anchor="middle" fill="#064e3b" font-size="13" font-family="Inter,sans-serif" font-weight="700">Dosha Balance — Tridosha Constitution Chart</text>

  <!-- Triangle zones -->
  <polygon points="${vataFill}"  fill="${INDIGO}" fill-opacity="0.12"/>
  <polygon points="${pittaFill}" fill="${ROSE}"   fill-opacity="0.12"/>
  <polygon points="${kaphaFill}" fill="${TEAL}"   fill-opacity="0.12"/>

  <!-- Outer triangle -->
  <polygon points="${v.x},${v.y} ${p.x},${p.y} ${k.x},${k.y}" fill="none" stroke="#475569" stroke-width="1.5"/>

  <!-- Vertex labels -->
  <text x="${v.x}" y="${v.y - 8}" text-anchor="middle" fill="${INDIGO}" font-size="11" font-family="Inter,sans-serif" font-weight="700">Vata ${vata}%</text>
  <text x="${p.x - 5}" y="${p.y + 16}" text-anchor="end"   fill="${ROSE}"   font-size="11" font-family="Inter,sans-serif" font-weight="700">Pitta ${pitta}%</text>
  <text x="${k.x + 5}" y="${k.y + 16}" text-anchor="start" fill="${TEAL}"   font-size="11" font-family="Inter,sans-serif" font-weight="700">Kapha ${kapha}%</text>

  <!-- Constitution point -->
  <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="9" fill="${EMERALD}" stroke="#fff" stroke-width="2.5"/>
  <text x="${bx.toFixed(1)}" y="${(by + 20).toFixed(1)}" text-anchor="middle" fill="#064e3b" font-size="9" font-family="Inter,sans-serif" font-weight="700">${primaryDosha}</text>

  <!-- Percentage bars -->
  ${bars}
</svg>`;
}

// ── 4. Organ Health Matrix Bar Chart ──────────────────────────────────────────

export function generateOrganHealthMatrix(organs: OrganDashboardCard[]): string {
  const w = 520, rowH = 26, paddingLeft = 130, barMaxW = 260;
  const h = 60 + organs.length * rowH;

  const bars = organs.map((organ, i) => {
    const y = 50 + i * rowH;
    const scoreBarW = (organ.healthScore / 100) * barMaxW;
    const riskBarW  = (organ.riskPercent / 100) * 80;
    const col = organ.colorIndicator === "green" ? EMERALD : organ.colorIndicator === "yellow" ? AMBER : organ.colorIndicator === "orange" ? "#ea580c" : ROSE;
    return `
      <text x="${paddingLeft - 8}" y="${y + 16}" text-anchor="end" fill="#1e293b" font-size="9.5" font-family="Inter,sans-serif" font-weight="600">${organ.organName}</text>
      <rect x="${paddingLeft}" y="${y + 4}" width="${barMaxW}" height="14" rx="4" fill="#e2e8f0"/>
      <rect x="${paddingLeft}" y="${y + 4}" width="${scoreBarW.toFixed(1)}" height="14" rx="4" fill="${col}"/>
      <text x="${paddingLeft + scoreBarW + 4}" y="${y + 15}" fill="${col}" font-size="9" font-family="Inter,sans-serif" font-weight="700">${organ.healthScore}</text>
      <rect x="${paddingLeft + barMaxW + 10}" y="${y + 6}" width="${riskBarW.toFixed(1)}" height="10" rx="3" fill="${organ.riskPercent > 50 ? ROSE : AMBER}" fill-opacity="0.7"/>
      <text x="${paddingLeft + barMaxW + 96}" y="${y + 15}" fill="${organ.riskPercent > 50 ? ROSE : AMBER}" font-size="9" font-family="Inter,sans-serif" font-weight="600">${organ.riskPercent}% risk</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#f8fafc" rx="12"/>
  <text x="${w / 2}" y="22" text-anchor="middle" fill="#064e3b" font-size="13" font-family="Inter,sans-serif" font-weight="700">Organ Health Dashboard — Strength &amp; Risk Matrix</text>

  <!-- Header -->
  <text x="${paddingLeft}" y="44" fill="${SLATE}" font-size="9" font-family="Inter,sans-serif" font-weight="600">HEALTH SCORE (0–100)</text>
  <text x="${paddingLeft + barMaxW + 10}" y="44" fill="${SLATE}" font-size="9" font-family="Inter,sans-serif" font-weight="600">RISK LEVEL</text>

  ${bars}

  <!-- Legend -->
  <circle cx="${paddingLeft}" cy="${h - 10}" r="5" fill="${EMERALD}"/>
  <text x="${paddingLeft + 9}" y="${h - 6}" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif">Excellent (80–100)</text>
  <circle cx="${paddingLeft + 110}" cy="${h - 10}" r="5" fill="${AMBER}"/>
  <text x="${paddingLeft + 119}" y="${h - 6}" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif">Moderate (45–79)</text>
  <circle cx="${paddingLeft + 220}" cy="${h - 10}" r="5" fill="${ROSE}"/>
  <text x="${paddingLeft + 229}" y="${h - 6}" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif">Needs Care (&lt;45)</text>
</svg>`;
}

// ── 5. Energy Timeline (12-month line graph) ──────────────────────────────────

export function generateEnergyTimeline(forecast: MonthlyWellnessForecastItem[]): string {
  const w = 560, h = 220, padL = 50, padR = 20, padT = 40, padB = 50;
  const graphW = w - padL - padR;
  const graphH = h - padT - padB;
  const n = forecast.length;

  // Energy, stress, recovery lines
  const xStep = graphW / (n - 1);
  const yScale = (val: number) => padT + graphH - (val / 100) * graphH;

  const energyPoints = forecast.map((m, i) => `${(padL + i * xStep).toFixed(1)},${yScale(m.energyScore).toFixed(1)}`).join(" ");
  const stressPoints = forecast.map((m, i) => `${(padL + i * xStep).toFixed(1)},${yScale(m.stressScore).toFixed(1)}`).join(" ");
  const recPoints    = forecast.map((m, i) => `${(padL + i * xStep).toFixed(1)},${yScale(m.recoveryScore).toFixed(1)}`).join(" ");

  const monthLabels = forecast.map((m, i) => {
    const x = padL + i * xStep;
    const shortMonth = m.monthName.split(" ")[0].substring(0, 3);
    return `<text x="${x.toFixed(1)}" y="${h - padB + 14}" text-anchor="middle" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">${shortMonth}</text>`;
  }).join("");

  const gridLines = [25, 50, 75, 100].map((val) => {
    const y = yScale(val);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="0.8"/>
            <text x="${padL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">${val}</text>`;
  }).join("");

  const energyDots = forecast.map((m, i) => {
    const x = padL + i * xStep;
    const y = yScale(m.energyScore);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${EMERALD}" stroke="#fff" stroke-width="1.5"/>`;
  }).join("");

  const stressDots = forecast.map((m, i) => {
    const x = padL + i * xStep;
    const y = yScale(m.stressScore);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${ROSE}" stroke="#fff" stroke-width="1.5"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#f8fafc" rx="12"/>
  <text x="${w / 2}" y="20" text-anchor="middle" fill="#064e3b" font-size="13" font-family="Inter,sans-serif" font-weight="700">12-Month Energy &amp; Wellness Timeline</text>
  ${gridLines}
  <!-- Energy line -->
  <polyline points="${energyPoints}" fill="none" stroke="${EMERALD}" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- Stress line -->
  <polyline points="${stressPoints}" fill="none" stroke="${ROSE}" stroke-width="2" stroke-linejoin="round" stroke-dasharray="5,3"/>
  <!-- Recovery line -->
  <polyline points="${recPoints}" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linejoin="round" stroke-dasharray="3,2"/>
  ${energyDots}
  ${stressDots}
  ${monthLabels}
  <!-- Legend -->
  <line x1="60" y1="${h - 14}" x2="80" y2="${h - 14}" stroke="${EMERALD}" stroke-width="2.2"/>
  <text x="84" y="${h - 10}" fill="${SLATE}" font-size="9" font-family="Inter,sans-serif">Energy Score</text>
  <line x1="170" y1="${h - 14}" x2="190" y2="${h - 14}" stroke="${ROSE}" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="194" y="${h - 10}" fill="${SLATE}" font-size="9" font-family="Inter,sans-serif">Stress Score</text>
  <line x1="280" y1="${h - 14}" x2="300" y2="${h - 14}" stroke="${TEAL}" stroke-width="1.8" stroke-dasharray="3,2"/>
  <text x="304" y="${h - 10}" fill="${SLATE}" font-size="9" font-family="Inter,sans-serif">Recovery Score</text>
</svg>`;
}

// ── 6. Monthly Wellness Heatmap ───────────────────────────────────────────────

export function generateMonthlyHeatmap(forecast: MonthlyWellnessForecastItem[]): string {
  const categories = ["Energy","Stress","Recovery","Wellness"];
  const rows = categories.length;
  const cols = forecast.length;
  const cellW = 38, cellH = 28, padL = 72, padT = 50;
  const w = padL + cols * cellW + 20;
  const h = padT + rows * cellH + 40;

  const getData = (m: MonthlyWellnessForecastItem, cat: string): number => {
    if (cat === "Energy")   return m.energyScore;
    if (cat === "Stress")   return 100 - m.stressScore; // invert (low stress = green)
    if (cat === "Recovery") return m.recoveryScore;
    return m.wellnessRating * 20; // 1–5 stars → 20–100
  };

  function heatColor(val: number): string {
    if (val >= 75) return "#bbf7d0";
    if (val >= 55) return "#fef08a";
    if (val >= 35) return "#fed7aa";
    return "#fecaca";
  }

  const cells = categories.flatMap((cat, row) =>
    forecast.map((m, col) => {
      const val = getData(m, cat);
      const x = padL + col * cellW;
      const y = padT + row * cellH;
      return `<rect x="${x}" y="${y}" width="${cellW - 2}" height="${cellH - 2}" rx="3" fill="${heatColor(val)}"/>
              <text x="${x + (cellW - 2) / 2}" y="${y + (cellH - 2) / 2 + 4}" text-anchor="middle" fill="#1e293b" font-size="8.5" font-family="Inter,sans-serif" font-weight="700">${val}</text>`;
    })
  ).join("");

  const rowLabels = categories.map((cat, row) => {
    const y = padT + row * cellH + cellH / 2 + 4;
    return `<text x="${padL - 6}" y="${y}" text-anchor="end" fill="#334155" font-size="9" font-family="Inter,sans-serif" font-weight="600">${cat}</text>`;
  }).join("");

  const colLabels = forecast.map((m, col) => {
    const x = padL + col * cellW + (cellW - 2) / 2;
    const shortMon = m.monthName.split(" ")[0].substring(0, 3);
    return `<text x="${x}" y="${padT - 8}" text-anchor="middle" fill="${SLATE}" font-size="8.5" font-family="Inter,sans-serif" font-weight="600">${shortMon}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#f8fafc" rx="12"/>
  <text x="${w / 2}" y="22" text-anchor="middle" fill="#064e3b" font-size="13" font-family="Inter,sans-serif" font-weight="700">Monthly Wellness Heatmap — 12-Month Health Grid</text>
  ${rowLabels}
  ${colLabels}
  ${cells}
  <!-- Legend -->
  <rect x="20" y="${h - 22}" width="16" height="12" rx="3" fill="#bbf7d0"/><text x="40" y="${h - 12}" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Good</text>
  <rect x="78" y="${h - 22}" width="16" height="12" rx="3" fill="#fef08a"/><text x="98" y="${h - 12}" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Moderate</text>
  <rect x="155" y="${h - 22}" width="16" height="12" rx="3" fill="#fed7aa"/><text x="175" y="${h - 12}" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Caution</text>
  <rect x="230" y="${h - 22}" width="16" height="12" rx="3" fill="#fecaca"/><text x="250" y="${h - 12}" fill="${SLATE}" font-size="8" font-family="Inter,sans-serif">Attention</text>
</svg>`;
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function generateHealthSVGCharts(
  scores: HealthScores,
  constitution: BodyConstitution,
  organDashboard: OrganDashboardCard[],
  riskDashboard: RiskDashboardCard[],
  forecast: MonthlyWellnessForecastItem[],
): HealthSVGCharts {
  return {
    healthWheelRadar: generateHealthWheelRadar(scores),
    riskRadarChart: generateRiskRadarChart(riskDashboard),
    doshaTriangle: generateDoshaTriangle(constitution),
    organHealthMatrix: generateOrganHealthMatrix(organDashboard),
    energyTimeline: generateEnergyTimeline(forecast),
    monthlyHeatmap: generateMonthlyHeatmap(forecast),
  };
}
