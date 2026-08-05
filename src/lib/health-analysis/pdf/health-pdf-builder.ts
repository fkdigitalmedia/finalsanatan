import type { HealthAnalysisResult } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Health Analysis Report Pro v2.0 — Enterprise PDF Builder
// 35-Page Emerald Luxury A4 Publication-Grade PDF
// ─────────────────────────────────────────────────────────────────────────────

const EMERALD_DARK  = "#064e3b";
const EMERALD_MID   = "#059669";
const EMERALD_LIGHT = "#a7f3d0";
const TEAL          = "#0d9488";
const AMBER         = "#d97706";
const ROSE          = "#e11d48";
const SLATE         = "#64748b";
const SLATE_DARK    = "#1e293b";
const WHITE         = "#ffffff";
const SURFACE       = "#f0fdf4";

function clampColor(risk: number): string {
  if (risk <= 20) return "#059669";
  if (risk <= 35) return "#d97706";
  if (risk <= 55) return "#ea580c";
  return "#e11d48";
}

function severityColor(sev: string): string {
  if (sev === "Low") return "#059669";
  if (sev === "Moderate") return "#d97706";
  if (sev === "High") return "#e11d48";
  return "#7f1d1d";
}

function trendIcon(trend: string): string {
  if (trend === "Improving") return "↑";
  if (trend === "Stable")    return "→";
  return "↓";
}

function footer(page: number, total = 35): string {
  return `<div class="page-footer">
    <span>Health Analysis Report Pro v2.0 — ${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
    <span style="font-size:8pt;color:#94a3b8;">⚕ Astrological wellness guidance only — Not medical diagnosis</span>
    <span>Page ${page} of ${total}</span>
  </div>`;
}

function disclaimer(): string {
  return `<div class="disclaimer-strip">⚕ MEDICAL DISCLAIMER: This report provides astrological health tendencies and Ayurvedic wellness guidelines only. It does NOT diagnose, treat, or prescribe. Always consult a qualified medical professional for health concerns.</div>`;
}

export function buildHealthAnalysisPdfHtml(result: HealthAnalysisResult): string {
  const {
    input, scores, constitution, house1, house6, house8, house12,
    planets, organDashboard, riskDashboard, ayurvedicChapter, aiHealthCoach,
    wellnessTimeline, svgCharts, monthlyForecast, annualTimeline,
    exerciseAndNutrition, remedies, luckyElements, evidenceChain, finalVerdict,
    aiCoachVerdict, riskAndRecoveryPeriods, seasonalWellness, d6Shashtamsha,
  } = result;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @page { size: A4; margin: 12mm 14mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; color: ${SLATE_DARK}; line-height:1.6; margin:0; padding:0; background:#fff; font-size:10pt; }
    .page { page-break-after:always; min-height:267mm; padding:8mm 10mm 20mm; position:relative; }
    .page-last { page-break-after:auto; }

    /* COVER */
    .cover { background:linear-gradient(135deg,${EMERALD_DARK} 0%,#047857 50%,${TEAL} 100%); color:#fff; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; padding:18mm 15mm; min-height:277mm; }
    .cover-brand { font-size:8pt; letter-spacing:3px; text-transform:uppercase; color:${EMERALD_LIGHT}; margin-bottom:6px; }
    .cover-title { font-size:30pt; font-weight:900; letter-spacing:-0.5px; color:${EMERALD_LIGHT}; margin:4px 0; line-height:1.1; }
    .cover-tagline { font-size:13pt; color:#ecfdf5; margin-bottom:20px; }
    .cover-score-box { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); border-radius:16px; padding:22px 40px; margin:20px 0; backdrop-filter:blur(8px); }
    .cover-score-big { font-size:56pt; font-weight:900; color:${EMERALD_LIGHT}; line-height:1; }
    .cover-score-label { font-size:11pt; color:#d1fae5; margin-top:4px; }
    .cover-badge { display:inline-block; background:${EMERALD_MID}; color:#fff; font-size:8.5pt; font-weight:700; padding:5px 14px; border-radius:9999px; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
    .cover-meta { font-size:9pt; color:#cbd5e1; }

    /* SECTION TITLE */
    .section-title { font-size:17pt; font-weight:800; color:${EMERALD_DARK}; border-bottom:2.5px solid ${EMERALD_MID}; padding-bottom:7px; margin:0 0 16px; }
    .sub-title { font-size:13pt; font-weight:700; color:${TEAL}; margin:18px 0 10px; }

    /* SCORE GRID */
    .score-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-bottom:16px; }
    .score-card { background:${SURFACE}; border:1px solid #a7f3d0; border-radius:10px; padding:12px 8px; text-align:center; }
    .score-val { font-size:22pt; font-weight:900; color:${EMERALD_MID}; line-height:1; }
    .score-val-stress { font-size:22pt; font-weight:900; color:${ROSE}; line-height:1; }
    .score-label { font-size:7.5pt; font-weight:600; color:${SLATE}; text-transform:uppercase; margin-top:3px; letter-spacing:0.3px; }
    .score-bar { height:5px; background:#dcfce7; border-radius:3px; margin-top:7px; overflow:hidden; }
    .score-fill { height:5px; border-radius:3px; }

    /* ORGAN DASHBOARD */
    .organ-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:16px; }
    .organ-card { border-radius:10px; padding:12px 14px; border:1px solid #e2e8f0; }
    .organ-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .organ-name { font-size:11pt; font-weight:700; }
    .organ-badge { font-size:7.5pt; font-weight:700; padding:3px 9px; border-radius:9999px; color:#fff; }
    .organ-row { display:flex; justify-content:space-between; font-size:8.5pt; margin:3px 0; }
    .organ-bar-track { height:7px; background:#e2e8f0; border-radius:4px; margin:6px 0; overflow:hidden; }
    .organ-bar-fill { height:7px; border-radius:4px; }

    /* RISK DASHBOARD */
    .risk-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
    .risk-card { border-radius:10px; padding:12px 14px; border-left:4px solid; }
    .risk-head { display:flex; justify-content:space-between; align-items:center; }
    .risk-name { font-size:10.5pt; font-weight:700; }
    .risk-pct { font-size:14pt; font-weight:900; }
    .risk-row { display:flex; gap:8px; font-size:8.5pt; margin-top:5px; flex-wrap:wrap; }
    .risk-pill { background:#f1f5f9; border-radius:6px; padding:2px 8px; font-size:8pt; font-weight:600; }

    /* MONTHLY FORECAST */
    .forecast-card { border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; page-break-inside:avoid; margin-bottom:14px; }
    .forecast-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
    .forecast-title { font-size:11pt; font-weight:800; color:${EMERALD_DARK}; }
    .forecast-focus { font-size:8.5pt; color:${TEAL}; font-weight:600; }
    .forecast-stars { color:#f59e0b; font-size:11pt; }
    .forecast-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; font-size:8.5pt; }
    .forecast-item { padding:4px 0; border-bottom:1px solid #f1f5f9; }
    .forecast-label { font-weight:700; color:${SLATE}; font-size:7.5pt; text-transform:uppercase; }
    .forecast-ai { background:#f0fdf4; border-left:3px solid ${EMERALD_MID}; padding:8px 10px; font-size:8.5pt; font-style:italic; color:#064e3b; border-radius:4px; margin-top:8px; }

    /* AYURVEDA */
    .ayur-card { background:${SURFACE}; border:1px solid #a7f3d0; border-radius:10px; padding:14px; margin-bottom:12px; }
    .schedule-table { width:100%; border-collapse:collapse; font-size:8.5pt; }
    .schedule-table th { background:#064e3b; color:#fff; padding:7px 10px; text-align:left; }
    .schedule-table td { padding:6px 10px; border-bottom:1px solid #e2e8f0; }
    .schedule-table tr:nth-child(even) td { background:#f0fdf4; }

    /* EVIDENCE */
    .evidence-card { background:#f0fdf4; border-left:4px solid ${EMERALD_MID}; border-radius:4px; padding:11px 14px; margin-bottom:12px; page-break-inside:avoid; }
    .evidence-chain { display:flex; gap:6px; flex-wrap:wrap; margin:6px 0; align-items:center; font-size:8pt; }
    .chain-node { background:#dcfce7; border-radius:6px; padding:3px 9px; font-weight:600; color:#064e3b; }
    .chain-arrow { color:${SLATE}; font-size:10pt; font-weight:300; }

    /* REMEDY CARD */
    .remedy-card { border:1px solid #e2e8f0; border-radius:10px; padding:13px 14px; margin-bottom:12px; page-break-inside:avoid; }
    .remedy-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .remedy-category { background:${EMERALD_MID}; color:#fff; font-size:7.5pt; font-weight:700; padding:3px 10px; border-radius:9999px; text-transform:uppercase; }
    .remedy-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; font-size:8.5pt; }
    .remedy-row { padding:3px 0; border-bottom:1px solid #f1f5f9; }
    .remedy-label { font-size:7.5pt; font-weight:700; color:${SLATE}; text-transform:uppercase; }

    /* LUCKY ELEMENTS */
    .lucky-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .lucky-card { background:${SURFACE}; border:1px solid #a7f3d0; border-radius:10px; padding:12px 10px; text-align:center; }
    .lucky-icon { font-size:20pt; margin-bottom:4px; }
    .lucky-label { font-size:7.5pt; font-weight:700; color:${SLATE}; text-transform:uppercase; margin-bottom:4px; }
    .lucky-value { font-size:9pt; font-weight:600; color:${EMERALD_DARK}; }

    /* VERDICT */
    .verdict-box { background:linear-gradient(135deg,${EMERALD_DARK},${TEAL}); color:#fff; border-radius:14px; padding:18px 20px; margin-bottom:14px; }
    .verdict-score { font-size:36pt; font-weight:900; color:${EMERALD_LIGHT}; line-height:1; }
    .verdict-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:12px; }
    .verdict-section { background:rgba(255,255,255,0.1); border-radius:10px; padding:12px; }
    .verdict-section-title { font-size:8.5pt; font-weight:700; text-transform:uppercase; color:${EMERALD_LIGHT}; margin-bottom:6px; letter-spacing:0.5px; }

    /* TABLES */
    table { width:100%; border-collapse:collapse; margin-bottom:14px; font-size:9pt; }
    th { background:${EMERALD_DARK}; color:#fff; padding:8px 10px; text-align:left; font-size:8.5pt; }
    td { padding:7px 10px; border-bottom:1px solid #e2e8f0; }
    tr:nth-child(even) td { background:#f8fafc; }

    /* TOC */
    .toc-row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px dotted #cbd5e1; font-size:9.5pt; }
    .toc-row:nth-child(odd) { background:#f8fafc; padding-left:6px; }

    /* FOOTER */
    .page-footer { position:absolute; bottom:8mm; left:10mm; right:10mm; display:flex; justify-content:space-between; font-size:7.5pt; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:5px; }
    .disclaimer-strip { background:#fffbeb; border:1px solid #fef3c7; border-left:4px solid #f59e0b; color:#92400e; padding:7px 12px; font-size:8pt; border-radius:5px; margin-bottom:14px; }
  `;

  const allGrahas = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] as const;

  // ─────────────────────────────────────────────────────────────────────────
  // Page Builder Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const coverPage = `
  <div class="page cover">
    <div>
      <div class="cover-brand">Sanatan Dharma Suite • Enterprise Pro Edition</div>
      <span class="cover-badge">Health Analysis Report Pro v2.0</span>
      <h1 class="cover-title">Vedic Health<br/>Intelligence Report</h1>
      <div class="cover-tagline">Complete Astrological Wellness Profile for <strong>${input.name}</strong></div>
    </div>
    <div class="cover-score-box">
      <div style="font-size:11pt;font-weight:600;color:#d1fae5;">Overall Health Score</div>
      <div class="cover-score-big">${scores.overallHealth}<span style="font-size:20pt;">/100</span></div>
      <div class="cover-score-label">
        ${scores.overallHealth > 85 ? "⭐ Excellent Vitality" : scores.overallHealth > 70 ? "✅ Good Health Foundation" : "⚡ Preventive Attention Required"}
      </div>
      <div style="margin-top:12px;font-size:9.5pt;color:#a7f3d0;">
        ${constitution.primaryDosha} Constitution • ${constitution.vataPercentage}% Vata | ${constitution.pittaPercentage}% Pitta | ${constitution.kaphaPercentage}% Kapha
      </div>
    </div>
    <div class="cover-meta">
      <strong>Name:</strong> ${input.name}<br/>
      <strong>Date:</strong> ${input.date} | <strong>Time:</strong> ${input.time}<br/>
      <strong>Coordinates:</strong> ${input.latitude}°N / ${input.longitude}°E<br/>
      Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite
    </div>
  </div>`;

  // TOC page
  const tocPage = `
  <div class="page">
    ${disclaimer()}
    <h2 class="section-title">Table of Contents</h2>
    ${[
      ["01","Executive Summary & Health Scorecard","Overall Vitality & Dosha Constitution"],
      ["02","Health Wheel Radar Chart","9-Axis Wellness Visualization"],
      ["03","Body Constitution & Dosha Analysis","Prakriti, Vikriti & Balance Triangle"],
      ["04","13-Organ Health Dashboard","Color-Coded Organ Status & Risk%"],
      ["05–06","Individual Organ Chapters","Heart, Liver, Kidney, Digestive, Lungs, Brain"],
      ["07–08","Individual Organ Chapters","Hormones, Skin, Eyes, Bones, Immunity, Sleep, Stress"],
      ["09","Disease Risk Dashboard","10 Conditions — Severity, Trend & Action Items"],
      ["10","Risk Radar Chart","Visual Risk Index Visualization"],
      ["11","Health House Analysis","1st, 6th, 8th & 12th House Deep Analysis"],
      ["12","Planet Health Roles","9 Planets & Their Organ Governance"],
      ["13","D6 Shashtamsha Analysis","Divisional Chart Health Insights"],
      ["14","Ayurvedic Chapter — Prakriti & Dinacharya","Morning Routine, Meals, Detox"],
      ["15","Seasonal Ayurveda","Summer, Monsoon & Winter Wellness Protocols"],
      ["16–21","12-Month Unique Wellness Forecast","Transit + Dasha-Driven Monthly Insights"],
      ["22","Annual Wellness Timeline (5-Year)","Major Health Cycles & Opportunities"],
      ["23","90-Day Recovery Plan","Week-by-Week Healing Protocol"],
      ["24","Wellness Roadmap Milestones","1-Year & 5-Year Health Trajectory"],
      ["25–26","6 Structured Remedy Cards","Pranayama, Yoga, Mantra, Lifestyle, Gemstone, Herbs"],
      ["27","AI Health Coach","Today, This Week, Priorities & Warnings"],
      ["28","Energy & Wellness Heatmap","12-Month Visual Analytics"],
      ["29","Explainable AI Evidence Chain","9-Step Astrological Logic Trace"],
      ["30","Exercise & Nutrition Matrix","Personalized Movement & Diet Protocol"],
      ["31","Expanded Lucky Elements","14 Fields — Colors, Gems, Mantras, Mudras"],
      ["32","Final Verdict & Action Plan","Overall Rating, Risks, Strengths & 7-Step Plan"],
      ["33","Medical Disclaimer & Certification",""],
    ].map(([num, title, focus]) => `
      <div class="toc-row">
        <span><strong style="color:${EMERALD_MID};">§${num}</strong> &nbsp;${title}</span>
        <span style="color:${SLATE};font-size:8.5pt;">${focus}</span>
      </div>`).join("")}
    ${footer(2)}
  </div>`;

  // Executive Summary
  const execPage = `
  <div class="page">
    <h2 class="section-title">Executive Summary & Health Scorecard</h2>
    ${disclaimer()}
    <p style="font-size:10pt;color:${SLATE_DARK};margin-bottom:14px;">${aiCoachVerdict.executiveSummary}</p>
    <div class="score-grid">
      ${[
        {label:"Overall Health", val:scores.overallHealth, isStress:false},
        {label:"Mental Wellness", val:scores.mentalWellness, isStress:false},
        {label:"Physical Vitality", val:scores.physicalVitality, isStress:false},
        {label:"Daily Energy", val:scores.energy, isStress:false},
        {label:"Immunity", val:scores.immunity, isStress:false},
        {label:"Recovery Capacity", val:scores.recovery, isStress:false},
        {label:"Lifestyle Balance", val:scores.lifestyleBalance, isStress:false},
        {label:"Sleep Quality", val:scores.sleep, isStress:false},
        {label:"Emotional Stability", val:scores.emotionalStability, isStress:false},
        {label:"Stress Level", val:scores.stress, isStress:true},
      ].map(s => `
        <div class="score-card">
          <div class="${s.isStress ? "score-val-stress" : "score-val"}">${s.val}</div>
          <div class="score-label">${s.label}</div>
          <div class="score-bar"><div class="score-fill" style="width:${s.val}%;background:${s.isStress ? ROSE : EMERALD_MID};"></div></div>
        </div>`).join("")}
    </div>
    <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:10px;padding:12px 14px;">
      <div style="font-size:10pt;font-weight:700;color:${EMERALD_DARK};margin-bottom:6px;">Wellness Readiness: ${aiCoachVerdict.wellnessReadiness}</div>
      <div style="font-size:9pt;color:${SLATE_DARK};">${finalVerdict.planetarySummary}</div>
    </div>
    ${footer(3)}
  </div>`;

  // Health Wheel Chart page
  const chartPage1 = `
  <div class="page">
    <h2 class="section-title">Health Wheel — Radar Analysis</h2>
    <div style="text-align:center;margin:8px 0 14px;">${svgCharts.healthWheelRadar}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px;">
      ${[
        {label:"Top Strength", val:`${finalVerdict.topStrengths[0] || "See strengths section"}`, col:EMERALD_MID},
        {label:"Key Watchpoint", val:`${finalVerdict.topWeaknesses[0] || "See weaknesses"}`, col:AMBER},
        {label:"Recovery Potential", val:finalVerdict.recoveryPotential, col:TEAL},
      ].map(item => `
        <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:8px;padding:10px 12px;">
          <div style="font-size:7.5pt;font-weight:700;color:${SLATE};text-transform:uppercase;margin-bottom:4px;">${item.label}</div>
          <div style="font-size:8.5pt;color:${item.col};font-weight:600;">${item.val}</div>
        </div>`).join("")}
    </div>
    ${footer(4)}
  </div>`;

  // Dosha + Constitution
  const doshaPage = `
  <div class="page">
    <h2 class="section-title">Body Constitution & Dosha Balance</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;">
      <div>
        <div class="sub-title">Prakriti (Constitutional Nature)</div>
        <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:10px;padding:14px;">
          <div style="font-size:15pt;font-weight:900;color:${EMERALD_DARK};margin-bottom:6px;">${constitution.primaryDosha}</div>
          <div style="font-size:9pt;color:${SLATE_DARK};">${ayurvedicChapter.prakriti}</div>
        </div>
        <div class="sub-title" style="margin-top:12px;">Vikriti (Current Imbalance)</div>
        <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:10px;padding:14px;font-size:9pt;color:#92400e;">${ayurvedicChapter.vikriti}</div>
        <div style="margin-top:12px;">
          ${[
            {label:"Vata", pct:constitution.vataPercentage, col:"#4f46e5"},
            {label:"Pitta", pct:constitution.pittaPercentage, col:ROSE},
            {label:"Kapha", pct:constitution.kaphaPercentage, col:TEAL},
          ].map(d => `
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-size:9pt;font-weight:700;"><span style="color:${d.col};">${d.label}</span><span>${d.pct}%</span></div>
              <div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;"><div style="width:${d.pct}%;height:8px;background:${d.col};border-radius:4px;"></div></div>
            </div>`).join("")}
        </div>
      </div>
      <div style="text-align:center;">${svgCharts.doshaTriangle}</div>
    </div>
    <div class="sub-title">Constitutional Recommendations</div>
    <ul style="font-size:9.5pt;color:${SLATE_DARK};padding-left:18px;margin:0;">
      ${constitution.recommendations.map(r => `<li style="margin-bottom:5px;">${r}</li>`).join("")}
    </ul>
    ${footer(5)}
  </div>`;

  // Organ Dashboard overview
  const organDashPage = `
  <div class="page">
    <h2 class="section-title">13-Organ Health Dashboard</h2>
    ${disclaimer()}
    <div class="organ-grid">
      ${organDashboard.map(o => {
        const col = o.colorIndicator === "green" ? EMERALD_MID : o.colorIndicator === "yellow" ? AMBER : o.colorIndicator === "orange" ? "#ea580c" : ROSE;
        return `
        <div class="organ-card" style="border-color:${col}20;background:${o.colorIndicator === "green" ? "#f0fdf4" : o.colorIndicator === "yellow" ? "#fffbeb" : o.colorIndicator === "orange" ? "#fff7ed" : "#fff5f5"};">
          <div class="organ-head">
            <span class="organ-name" style="color:${SLATE_DARK};">${o.organName}</span>
            <span class="organ-badge" style="background:${col};">${o.currentStrength}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:8pt;margin-bottom:7px;">
            <span>🪐 Planet: <strong>${o.planet}</strong></span>
            <span>🏠 House: <strong>${o.house}</strong></span>
            <span>📈 Trend: <strong>${o.futureTrend}</strong></span>
            <span>♻️ Recovery: <strong>${o.recoveryPotential}</strong></span>
          </div>
          <div class="organ-bar-track"><div class="organ-bar-fill" style="width:${o.healthScore}%;background:${col};"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:8.5pt;font-weight:700;">
            <span style="color:${col};">Score: ${o.healthScore}/100</span>
            <span style="color:${clampColor(o.riskPercent)};">Risk: ${o.riskPercent}%</span>
          </div>
        </div>`;
      }).join("")}
    </div>
    ${footer(6)}
  </div>`;

  // Organ chapters (Heart + Liver + Kidney + Digestive on one page)
  function organChapterBlock(organs: typeof organDashboard): string {
    return organs.map(o => {
      const col = o.colorIndicator === "green" ? EMERALD_MID : o.colorIndicator === "yellow" ? AMBER : o.colorIndicator === "orange" ? "#ea580c" : ROSE;
      return `
      <div style="border:1px solid ${col}30;border-radius:12px;padding:13px 14px;margin-bottom:12px;page-break-inside:avoid;background:${o.colorIndicator === "green" ? "#f0fdf4" : "#fff"};">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:13pt;font-weight:800;color:${EMERALD_DARK};">🫀 ${o.organName}</div>
          <div style="background:${col};color:#fff;font-size:8.5pt;font-weight:700;padding:4px 12px;border-radius:9999px;">Score ${o.healthScore}/100 | Risk ${o.riskPercent}%</div>
        </div>
        <p style="font-size:9pt;color:${SLATE_DARK};margin:0 0 8px;">${o.preventiveAdvice}</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:8.5pt;margin-bottom:8px;">
          <div><strong>Planet:</strong> ${o.planet}</div>
          <div><strong>House:</strong> ${o.house}</div>
          <div><strong>Dasha Impact:</strong> ${o.dashaImpact.split(".")[0]}.</div>
          <div><strong>Transit:</strong> ${o.transitImpact.split(".")[0]}.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:8.5pt;">
          <div><strong style="color:${EMERALD_MID};">🌿 Herbs:</strong><br/>${o.ayurvedicHerbs.slice(0,3).join(", ")}</div>
          <div><strong style="color:${EMERALD_MID};">✅ Best Foods:</strong><br/>${o.bestFoods.slice(0,3).join(", ")}</div>
          <div><strong style="color:${ROSE};">❌ Worst Foods:</strong><br/>${o.worstFoods.slice(0,3).join(", ")}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:8.5pt;margin-top:6px;">
          <div><strong>🧘 Yoga:</strong> ${o.yoga.join(", ")}</div>
          <div><strong>🌬 Pranayama:</strong> ${o.pranayama.join(", ")}</div>
        </div>
        <div style="font-size:7.5pt;color:#92400e;background:#fffbeb;border-radius:6px;padding:5px 10px;margin-top:7px;">⚕ ${o.medicalDisclaimer}</div>
      </div>`;
    }).join("");
  }

  const organPage1 = `<div class="page"><h2 class="section-title">Organ Deep Analysis — Heart, Liver, Kidney</h2>${organChapterBlock(organDashboard.slice(0,3))}${footer(7)}</div>`;
  const organPage2 = `<div class="page"><h2 class="section-title">Organ Deep Analysis — Digestive, Lungs, Brain</h2>${organChapterBlock(organDashboard.slice(3,6))}${footer(8)}</div>`;
  const organPage3 = `<div class="page"><h2 class="section-title">Organ Analysis — Hormones, Skin, Eyes, Bones</h2>${organChapterBlock(organDashboard.slice(6,10))}${footer(9)}</div>`;
  const organPage4 = `<div class="page"><h2 class="section-title">Organ Analysis — Immunity, Sleep & Stress</h2>${organChapterBlock(organDashboard.slice(10,13))}${footer(10)}</div>`;

  // Risk Dashboard
  const riskPage = `
  <div class="page">
    <h2 class="section-title">Disease Risk Dashboard — 10 Condition Risk Index</h2>
    ${disclaimer()}
    <div class="risk-grid">
      ${riskDashboard.map(r => {
        const col = severityColor(r.currentSeverity);
        return `
        <div class="risk-card" style="border-left-color:${col};background:${r.currentSeverity === "High" ? "#fff5f5" : r.currentSeverity === "Moderate" ? "#fffbeb" : "#f0fdf4"};">
          <div class="risk-head">
            <span class="risk-name" style="color:${SLATE_DARK};">${r.conditionName}</span>
            <span class="risk-pct" style="color:${col};">${r.riskPercent}%</span>
          </div>
          <div class="risk-row">
            <span class="risk-pill" style="color:${col};">${r.currentSeverity}</span>
            <span class="risk-pill">Trend: ${trendIcon(r.futureTrend)} ${r.futureTrend}</span>
            <span class="risk-pill">Priority: ${r.priority}</span>
          </div>
          <div style="font-size:8.5pt;color:${SLATE_DARK};margin-top:6px;">${r.preventiveSummary}</div>
          <div style="font-size:8pt;color:${SLATE};margin-top:4px;">• ${r.actionItems.slice(0,2).join(" • ")}</div>
        </div>`;
      }).join("")}
    </div>
    ${footer(11)}
  </div>`;

  // Risk Radar Chart page
  const riskChartPage = `
  <div class="page">
    <h2 class="section-title">Risk Radar — Visual Risk Index</h2>
    <div style="text-align:center;">${svgCharts.riskRadarChart}</div>
    <div style="margin-top:10px;font-size:9pt;color:${SLATE_DARK};">
      <strong>Critical Risks Identified:</strong> ${finalVerdict.criticalRisks.join(", ")}
    </div>
    ${footer(12)}
  </div>`;

  // Houses + Planets
  const housesPlanetsPage = `
  <div class="page">
    <h2 class="section-title">Health House & Planetary Analysis</h2>
    <div class="sub-title">Key Health Houses</div>
    <table>
      <tr><th>House</th><th>Rashi & Lord</th><th>Occupants</th><th>Key Health Significance</th></tr>
      ${[{h:house1,n:"1st (Lagna)"},{h:house6,n:"6th (Roga)"},{h:house8,n:"8th (Ayur)"},{h:house12,n:"12th (Vyaya)"}].map(({h,n}) => `
        <tr><td><strong>${n}</strong></td><td>${h.rashi} (${h.rashiLord})</td><td>${h.planetsInHouse.join(", ") || "None"}</td><td>${h.healthSignificance}</td></tr>`).join("")}
    </table>
    <div class="sub-title">9 Planets — Health Role Analysis</div>
    <table style="font-size:8.5pt;">
      <tr><th>Planet</th><th>House</th><th>Rashi</th><th>Dignity</th><th>Governed Organs</th><th>Score</th></tr>
      ${allGrahas.map(g => {
        const p = planets[g];
        return `<tr>
          <td><strong>${g}</strong></td>
          <td>${p.house}</td>
          <td>${p.rashi}</td>
          <td style="color:${p.dignity === "exalted" ? EMERALD_MID : p.dignity === "debilitated" ? ROSE : SLATE};">${p.dignity}</td>
          <td>${p.governedOrgans.slice(0,3).join(", ")}</td>
          <td><strong style="color:${p.score > 80 ? EMERALD_MID : p.score < 50 ? ROSE : AMBER};">${p.score}</strong></td>
        </tr>`;
      }).join("")}
    </table>
    <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:8px;padding:12px;">
      <strong>D6 Shashtamsha Summary:</strong> ${d6Shashtamsha.summary}
    </div>
    ${footer(13)}
  </div>`;

  // Ayurvedic Chapter
  const ayurPage1 = `
  <div class="page">
    <h2 class="section-title">Complete Ayurvedic Chapter</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
      <div class="ayur-card">
        <div class="sub-title" style="margin-top:0;">Prakriti (Constitutional Nature)</div>
        <p style="font-size:9.5pt;">${ayurvedicChapter.prakriti}</p>
      </div>
      <div class="ayur-card" style="background:#fffbeb;border-color:#fef3c7;">
        <div class="sub-title" style="margin-top:0;color:#92400e;">Vikriti (Current Imbalance)</div>
        <p style="font-size:9.5pt;color:#92400e;">${ayurvedicChapter.vikriti}</p>
      </div>
    </div>
    <div class="sub-title">Morning Routine (Dinacharya)</div>
    <ul style="font-size:9pt;padding-left:18px;margin:0 0 10px;">
      ${ayurvedicChapter.morningRoutine.map(r => `<li style="margin-bottom:4px;">${r}</li>`).join("")}
    </ul>
    <div class="sub-title">Night Routine</div>
    <ul style="font-size:9pt;padding-left:18px;margin:0 0 10px;">
      ${ayurvedicChapter.nightRoutine.map(r => `<li style="margin-bottom:4px;">${r}</li>`).join("")}
    </ul>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:9pt;">
      <div class="ayur-card"><strong>Ideal Wake Time:</strong><br/>${ayurvedicChapter.idealWakeTime}</div>
      <div class="ayur-card"><strong>Ideal Sleep Time:</strong><br/>${ayurvedicChapter.idealSleepTime}</div>
      <div class="ayur-card"><strong>Breakfast:</strong><br/>${ayurvedicChapter.breakfast}</div>
      <div class="ayur-card"><strong>Lunch (Main Meal):</strong><br/>${ayurvedicChapter.lunch}</div>
    </div>
    ${footer(14)}
  </div>`;

  const ayurPage2 = `
  <div class="page">
    <h2 class="section-title">Ayurvedic Daily Schedule & Seasonal Protocol</h2>
    <div class="sub-title">Daily Schedule</div>
    <table class="schedule-table">
      <tr><th>Time</th><th>Activity</th></tr>
      ${ayurvedicChapter.dailySchedule.map(s => `<tr><td><strong>${s.time}</strong></td><td>${s.activity}</td></tr>`).join("")}
    </table>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px;">
      ${[
        {title:"☀️ Summer Protocol", content:ayurvedicChapter.seasonalAdvice.summer},
        {title:"🌧️ Monsoon Protocol", content:ayurvedicChapter.seasonalAdvice.monsoon},
        {title:"❄️ Winter Protocol", content:ayurvedicChapter.seasonalAdvice.winter},
      ].map(s => `
        <div class="ayur-card">
          <div style="font-size:10pt;font-weight:700;color:${EMERALD_DARK};margin-bottom:6px;">${s.title}</div>
          <div style="font-size:8.5pt;">${s.content}</div>
        </div>`).join("")}
    </div>
    <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div class="ayur-card"><strong>Massage Oil:</strong> ${ayurvedicChapter.massageOil}</div>
      <div class="ayur-card"><strong>Detox Protocol:</strong> ${ayurvedicChapter.detox}</div>
    </div>
    ${footer(15)}
  </div>`;

  // 12-Month Unique Forecast (2 months per page = 6 pages)
  const forecastPages = [];
  for (let p = 0; p < 6; p++) {
    const pair = monthlyForecast.slice(p * 2, p * 2 + 2);
    forecastPages.push(`
    <div class="page">
      <h2 class="section-title">Monthly Wellness Forecast — ${pair[0].monthName} & ${pair[1]?.monthName || ""}</h2>
      ${pair.map(m => `
        <div class="forecast-card">
          <div class="forecast-head">
            <div>
              <div class="forecast-title">${m.monthName} — Month ${monthlyForecast.indexOf(m) + 1}</div>
              <div class="forecast-focus">${m.focusArea}</div>
              <div style="font-size:8pt;color:${SLATE};margin-top:2px;">${m.season} Season | ${m.transitPlanet} Transit | House ${m.houseActivated} Activated</div>
            </div>
            <div style="text-align:right;">
              <div class="forecast-stars">${"★".repeat(m.wellnessRating)}${"☆".repeat(5 - m.wellnessRating)}</div>
              <div style="font-size:8pt;color:${SLATE};">Wellness Rating</div>
              <div style="display:flex;gap:6px;margin-top:4px;justify-content:flex-end;">
                <span style="background:#dcfce7;color:#064e3b;padding:2px 8px;border-radius:6px;font-size:8pt;font-weight:700;">⚡ ${m.energyScore}</span>
                <span style="background:#fee2e2;color:#7f1d1d;padding:2px 8px;border-radius:6px;font-size:8pt;font-weight:700;">😤 ${m.stressScore}</span>
                <span style="background:#dbeafe;color:#1e3a8a;padding:2px 8px;border-radius:6px;font-size:8pt;font-weight:700;">♻️ ${m.recoveryScore}</span>
              </div>
            </div>
          </div>
          <div class="forecast-grid">
            <div class="forecast-item"><span class="forecast-label">Energy Level</span><br/>${m.energyLevel}</div>
            <div class="forecast-item"><span class="forecast-label">Stress Level</span><br/>${m.stressLevel}</div>
            <div class="forecast-item"><span class="forecast-label">Sleep Quality</span><br/>${m.sleepQuality}</div>
            <div class="forecast-item"><span class="forecast-label">Lucky Day</span><br/>⭐ ${m.luckyDay}</div>
            <div class="forecast-item"><span class="forecast-label">Exercise</span><br/>${m.exerciseTip}</div>
            <div class="forecast-item"><span class="forecast-label">Meditation</span><br/>${m.meditationGuidance.split("(")[0]}</div>
          </div>
          <div style="font-size:8.5pt;margin-top:8px;"><strong>🍽️ Diet:</strong> ${m.dietAdvice}</div>
          <div style="font-size:8.5pt;margin-top:4px;"><strong>⚠️ Risk Window:</strong> ${m.riskWindow}</div>
          <div style="font-size:8.5pt;margin-top:4px;"><strong>✅ Opportunity:</strong> ${m.opportunityWindow}</div>
          <div style="font-size:8.5pt;margin-top:4px;"><strong>🔭 Astro Driver:</strong> ${m.keyAstrologicalDriver}</div>
          <div class="forecast-ai">${m.aiCommentary.substring(0, 200)}...</div>
        </div>`).join("")}
      ${footer(16 + p)}
    </div>`);
  }

  // Annual Timeline
  const annualPage = `
  <div class="page">
    <h2 class="section-title">Annual Wellness Timeline — 5-Year Health Cycles</h2>
    ${annualTimeline.map((y, i) => `
      <div style="border-left:4px solid ${[EMERALD_MID, TEAL, AMBER, INDIGO, ROSE][i]};padding:10px 14px;margin-bottom:12px;background:${i % 2 === 0 ? SURFACE : "#fff"};border-radius:0 8px 8px 0;">
        <div style="font-size:11pt;font-weight:800;color:${SLATE_DARK};">${y.year} — ${y.phaseTitle}</div>
        <div style="font-size:8.5pt;color:${SLATE};margin:3px 0;">${y.planetaryTransits}</div>
        <p style="font-size:9pt;margin:4px 0;">${y.keyTheme}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:8.5pt;">
          <div><strong style="color:${EMERALD_MID};">✅ Opportunities:</strong><br/>${y.wellnessOpportunities}</div>
          <div><strong style="color:${AMBER};">⚠️ Precautions:</strong><br/>${y.preventivePrecautions}</div>
        </div>
      </div>`).join("")}
    ${footer(22)}
  </div>`;

  const INDIGO = "#4f46e5";

  // 90-Day + 1-Year Roadmap
  const timelinePage = `
  <div class="page">
    <h2 class="section-title">90-Day Recovery Plan</h2>
    <table style="font-size:8.5pt;">
      <tr><th>Period</th><th>Focus</th><th>Action</th><th>Expected Outcome</th><th>Planetary Support</th></tr>
      ${wellnessTimeline.ninetyDayRecoveryPlan.map(m => `
        <tr>
          <td><strong>${m.period}</strong></td>
          <td style="color:${TEAL};font-weight:600;">${m.focus}</td>
          <td>${m.action}</td>
          <td style="color:${EMERALD_MID};">${m.expectedOutcome}</td>
          <td style="color:${SLATE};">${m.planetarySupport}</td>
        </tr>`).join("")}
    </table>
    <div class="sub-title">1-Year Health Roadmap</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
      ${wellnessTimeline.oneYearRoadmap.map((m, i) => `
        <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:8px;padding:10px 12px;">
          <div style="font-size:9pt;font-weight:700;color:${EMERALD_DARK};">${m.period}</div>
          <div style="font-size:8.5pt;color:${TEAL};font-weight:600;">${m.focus}</div>
          <div style="font-size:8.5pt;margin-top:4px;">${m.action}</div>
          <div style="font-size:8.5pt;color:${EMERALD_MID};font-weight:600;margin-top:4px;">→ ${m.expectedOutcome}</div>
        </div>`).join("")}
    </div>
    ${footer(23)}
  </div>`;

  // Remedy Cards
  const remedyPages = [];
  for (let p = 0; p < Math.ceil(remedies.length / 2); p++) {
    const pair = remedies.slice(p * 2, p * 2 + 2);
    remedyPages.push(`
    <div class="page">
      <h2 class="section-title">Structured Remedy Cards</h2>
      ${pair.map(r => `
        <div class="remedy-card">
          <div class="remedy-head">
            <div style="font-size:12pt;font-weight:800;color:${EMERALD_DARK};">${r.title}</div>
            <span class="remedy-category">${r.category}</span>
          </div>
          <p style="font-size:9pt;color:${SLATE_DARK};margin:0 0 8px;">${r.description}</p>
          <div class="remedy-grid">
            <div class="remedy-row"><span class="remedy-label">Related Planet</span><br/>${r.relatedPlanet}</div>
            <div class="remedy-row"><span class="remedy-label">Purpose</span><br/>${r.purpose}</div>
            <div class="remedy-row"><span class="remedy-label">Frequency</span><br/>${r.frequency}</div>
            <div class="remedy-row"><span class="remedy-label">Best Day & Time</span><br/>${r.bestDay} | ${r.bestTime}</div>
            <div class="remedy-row"><span class="remedy-label">Difficulty</span><br/>${r.difficulty}</div>
            <div class="remedy-row"><span class="remedy-label">Estimated Cost</span><br/>${r.estimatedCost}</div>
          </div>
          <div style="margin-top:8px;font-size:8.5pt;"><strong>Instructions:</strong> ${r.instructions}</div>
          <div style="margin-top:6px;font-size:8.5pt;color:${EMERALD_DARK};background:${SURFACE};padding:7px 10px;border-radius:6px;"><strong>Expected Result:</strong> ${r.expectedResult}</div>
          <div style="margin-top:5px;font-size:8.5pt;color:${SLATE};"><strong>Alternative:</strong> ${r.alternativeRemedy}</div>
          <div style="margin-top:5px;font-size:8pt;color:#1e40af;"><strong>🔬 Science Tip:</strong> ${r.scientificWellnessTip}</div>
          <div style="font-size:7.5pt;color:#92400e;background:#fffbeb;padding:5px 10px;border-radius:5px;margin-top:6px;">⚕ ${r.medicalDisclaimer}</div>
        </div>`).join("")}
      ${footer(25 + p)}
    </div>`);
  }

  // AI Health Coach
  const aiCoachPage = `
  <div class="page">
    <h2 class="section-title">AI Health Coach — Personalized Guidance</h2>
    <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:10px;padding:14px;margin-bottom:12px;">
      <div class="sub-title" style="margin:0 0 6px;">Today's Focus</div>
      <p style="font-size:9.5pt;">${aiHealthCoach.todaysFocus}</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div>
        <div class="sub-title">Top 5 Priorities</div>
        <ol style="font-size:9pt;padding-left:18px;margin:0;">
          ${aiHealthCoach.top5Priorities.map(p => `<li style="margin-bottom:5px;">${p}</li>`).join("")}
        </ol>
      </div>
      <div>
        <div class="sub-title">Top Mistakes to Avoid</div>
        <ul style="font-size:9pt;padding-left:18px;margin:0;">
          ${aiHealthCoach.topMistakes.map(m => `<li style="margin-bottom:5px;color:#7f1d1d;">${m}</li>`).join("")}
        </ul>
      </div>
    </div>
    <div class="sub-title">Emergency Warnings</div>
    ${aiHealthCoach.emergencyWarnings.map(w => `
      <div style="background:#fff5f5;border-left:4px solid ${ROSE};padding:8px 12px;margin-bottom:7px;border-radius:4px;font-size:9pt;color:#7f1d1d;">${w}</div>`).join("")}
    <div class="sub-title">Recovery Goals</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
      ${aiHealthCoach.recoveryGoals.map(g => `
        <div style="background:${SURFACE};border-radius:8px;padding:9px 12px;font-size:9pt;border:1px solid #a7f3d0;">✅ ${g}</div>`).join("")}
    </div>
    <div style="background:linear-gradient(135deg,${EMERALD_DARK},${TEAL});color:#fff;border-radius:10px;padding:14px;margin-top:12px;">
      <div style="font-size:9.5pt;font-style:italic;">"${aiHealthCoach.motivationalGuidance}"</div>
    </div>
    ${footer(28)}
  </div>`;

  // Energy + Heatmap charts
  const chartsPage2 = `
  <div class="page">
    <h2 class="section-title">Energy Timeline & Monthly Wellness Heatmap</h2>
    <div style="margin-bottom:14px;">${svgCharts.energyTimeline}</div>
    <div>${svgCharts.monthlyHeatmap}</div>
    ${footer(29)}
  </div>`;

  // Evidence Chain
  const evidencePage = `
  <div class="page">
    <h2 class="section-title">Explainable AI — Evidence Chain</h2>
    <p style="font-size:9pt;color:${SLATE};margin-bottom:12px;">Every health conclusion is traceable through a 9-step astrological logic chain with confidence percentage.</p>
    ${evidenceChain.map(e => `
      <div class="evidence-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="font-size:10.5pt;font-weight:800;color:${EMERALD_DARK};">${e.claim}</div>
          <div style="background:${EMERALD_MID};color:#fff;font-size:8.5pt;font-weight:700;padding:3px 10px;border-radius:9999px;">${e.confidencePercent}% Confidence</div>
        </div>
        <div class="evidence-chain">
          <span class="chain-node">${e.planet}</span>
          <span class="chain-arrow">→</span>
          <span class="chain-node">House ${e.house}</span>
          <span class="chain-arrow">→</span>
          <span class="chain-node">Lord: ${e.lord}</span>
          <span class="chain-arrow">→</span>
          <span class="chain-node">${e.yoga}</span>
          <span class="chain-arrow">→</span>
          <span class="chain-node">${e.dasha}</span>
          <span class="chain-arrow">→</span>
          <span class="chain-node">${e.transit.substring(0,25)}</span>
        </div>
        <div style="font-size:8.5pt;margin:4px 0;"><strong>Logic:</strong> ${e.astrologicalLogic}</div>
        <div style="font-size:8.5pt;color:${EMERALD_MID};"><strong>Conclusion:</strong> ${e.conclusion}</div>
        <div style="font-size:8.5pt;color:${SLATE_DARK};margin-top:4px;"><strong>Lifestyle Advice:</strong> ${e.lifestyleAdvice}</div>
      </div>`).join("")}
    ${footer(30)}
  </div>`;

  // Exercise + Nutrition
  const exercisePage = `
  <div class="page">
    <h2 class="section-title">Exercise & Nutrition Matrix</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;">
      <div>
        <div class="sub-title">Recommended Exercises</div>
        <ul style="font-size:9.5pt;padding-left:18px;">
          ${exerciseAndNutrition.recommendedExercises.map(e => `<li style="margin-bottom:5px;">${e}</li>`).join("")}
        </ul>
        <div class="sub-title">Nutrition Guidance</div>
        <ul style="font-size:9.5pt;padding-left:18px;">
          ${exerciseAndNutrition.nutritionGuidance.map(n => `<li style="margin-bottom:5px;">${n}</li>`).join("")}
        </ul>
      </div>
      <div>
        <div class="sub-title">Foods to Favor ✅</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          ${exerciseAndNutrition.foodsToFavor.map(f => `<span style="background:#dcfce7;color:#064e3b;padding:4px 10px;border-radius:6px;font-size:9pt;font-weight:600;">${f}</span>`).join("")}
        </div>
        <div class="sub-title">Foods to Moderate ⚠️</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${exerciseAndNutrition.foodsToModerate.map(f => `<span style="background:#fee2e2;color:#7f1d1d;padding:4px 10px;border-radius:6px;font-size:9pt;font-weight:600;">${f}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="sub-title">Seasonal Wellness Tips</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
      ${[
        {icon:"☀️",title:"Summer",tips:seasonalWellness.summerTips},
        {icon:"🌧️",title:"Monsoon",tips:seasonalWellness.monsoonTips},
        {icon:"❄️",title:"Winter",tips:seasonalWellness.winterTips},
      ].map(s => `
        <div class="ayur-card">
          <div style="font-size:10pt;font-weight:700;margin-bottom:6px;">${s.icon} ${s.title}</div>
          <ul style="font-size:8.5pt;padding-left:14px;margin:0;">
            ${s.tips.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>
    ${footer(31)}
  </div>`;

  // Lucky Elements
  const luckyPage = `
  <div class="page">
    <h2 class="section-title">Expanded Lucky Elements — 14 Healing Attributes</h2>
    <div class="lucky-grid">
      ${[
        {icon:"🎨", label:"Lucky Colors", val: luckyElements.colors.join(", ")},
        {icon:"🔢", label:"Lucky Numbers", val: luckyElements.numbers.join(", ")},
        {icon:"📅", label:"Lucky Days", val: luckyElements.days.join(", ")},
        {icon:"🧭", label:"Directions", val: luckyElements.directions.join(", ")},
        {icon:"💎", label:"Gemstone", val: luckyElements.gemstone},
        {icon:"⚗️", label:"Healing Metal", val: luckyElements.metal},
        {icon:"🌿", label:"Healing Herbs", val: luckyElements.healingHerbs.join(", ")},
        {icon:"🛕", label:"Temple", val: luckyElements.temple},
        {icon:"🤲", label:"Donation", val: luckyElements.donation},
        {icon:"🍃", label:"Fasting", val: luckyElements.fast},
        {icon:"📿", label:"Mantra", val: luckyElements.mantra.substring(0, 60) + "..."},
        {icon:"🔯", label:"Yantra", val: luckyElements.yantra},
        {icon:"🧘", label:"Meditation", val: luckyElements.meditation},
        {icon:"🤌", label:"Mudra", val: luckyElements.mudra},
        {icon:"🎵", label:"Healing Frequency", val: luckyElements.healingFrequency},
        {icon:"⏰", label:"Healing Time", val: luckyElements.healingTime},
      ].slice(0, 12).map(l => `
        <div class="lucky-card">
          <div class="lucky-icon">${l.icon}</div>
          <div class="lucky-label">${l.label}</div>
          <div class="lucky-value">${l.val}</div>
        </div>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px;">
      <div class="ayur-card"><strong>Healing Frequency:</strong> ${luckyElements.healingFrequency}</div>
      <div class="ayur-card"><strong>Best Healing Time:</strong> ${luckyElements.healingTime}</div>
    </div>
    ${footer(32)}
  </div>`;

  // Final Verdict
  const verdictPage = `
  <div class="page">
    <h2 class="section-title">Final Verdict & Action Plan</h2>
    <div class="verdict-box">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div class="verdict-score">${scores.overallHealth}/100</div>
          <div style="font-size:13pt;font-weight:700;color:${EMERALD_LIGHT};">Overall Health Rating: ${finalVerdict.overallHealthRating}</div>
          <div style="font-size:9.5pt;color:#d1fae5;margin-top:4px;">Confidence: ${finalVerdict.confidencePercent}% | ${new Date().getFullYear()}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:9pt;color:${EMERALD_LIGHT};">Wellness Readiness</div>
          <div style="font-size:14pt;font-weight:800;color:#a7f3d0;">${aiCoachVerdict.wellnessReadiness}</div>
        </div>
      </div>
      <div class="verdict-grid">
        <div class="verdict-section">
          <div class="verdict-section-title">Top Strengths</div>
          ${finalVerdict.topStrengths.map(s => `<div style="font-size:8.5pt;margin-bottom:4px;">✅ ${s}</div>`).join("")}
        </div>
        <div class="verdict-section">
          <div class="verdict-section-title">Critical Risks</div>
          ${finalVerdict.criticalRisks.map(r => `<div style="font-size:8.5pt;margin-bottom:4px;color:#fca5a5;">⚠️ ${r}</div>`).join("")}
        </div>
      </div>
    </div>
    <div class="sub-title">7-Step Action Plan</div>
    <ol style="font-size:9.5pt;padding-left:18px;">
      ${finalVerdict.actionPlan.map(a => `<li style="margin-bottom:6px;">${a}</li>`).join("")}
    </ol>
    <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:10px;padding:14px;font-size:9.5pt;">
      <strong>Final AI Verdict:</strong><br/>${finalVerdict.finalAIVerdict}
    </div>
    ${footer(33)}
  </div>`;

  // Disclaimer page
  const disclaimerPage = `
  <div class="page page-last">
    <h2 class="section-title">Medical Disclaimer & Certification</h2>
    <div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:12px;padding:20px 24px;margin-bottom:16px;">
      <h3 style="color:#92400e;margin:0 0 10px;">⚕ Important Medical Safety Disclaimer</h3>
      <p style="font-size:10pt;color:#78350f;line-height:1.8;">This Health Analysis Report Pro provides <strong>astrological health tendency mapping</strong>, Ayurvedic body constitution insights, preventive wellness guidelines, seasonal protocols, and stress management recommendations based on Vedic astrology and traditional Ayurvedic principles.</p>
      <ul style="font-size:9.5pt;color:#78350f;margin:10px 0;padding-left:20px;">
        <li style="margin-bottom:6px;">This report does <strong>NOT</strong> diagnose, treat, cure, or prevent any medical condition.</li>
        <li style="margin-bottom:6px;">This report does <strong>NOT</strong> replace advice, diagnosis, or treatment from a qualified medical professional.</li>
        <li style="margin-bottom:6px;">Astrological health analysis provides tendency indicators only — individual health outcomes vary.</li>
        <li style="margin-bottom:6px;">Ayurvedic recommendations are traditional wellness guidelines — consult an Ayurvedic practitioner for personalized prescriptions.</li>
        <li style="margin-bottom:6px;">Always consult a licensed medical doctor for any health concerns, symptoms, or before starting any new health regimen.</li>
        <li style="margin-bottom:6px;">Gemstone, mantra, and Yantra recommendations are spiritual practices — not medical treatments.</li>
      </ul>
      <p style="font-size:9pt;color:#92400e;font-style:italic;">If you are experiencing a medical emergency, please call emergency services immediately. This report cannot and should not be used in medical emergencies.</p>
    </div>
    <div style="background:${SURFACE};border:1px solid #a7f3d0;border-radius:10px;padding:16px;">
      <h3 style="color:${EMERALD_DARK};margin:0 0 8px;">📜 Report Certification</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:9.5pt;">
        <div><strong>Client Name:</strong> ${input.name}</div>
        <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN', {dateStyle:'full'})}</div>
        <div><strong>Report Version:</strong> Health Analysis Pro v2.0</div>
        <div><strong>Engine:</strong> Sanatan Dharma Suite</div>
        <div><strong>Calculation Base:</strong> Vedic Astrology (Lahiri Ayanamsa)</div>
        <div><strong>Ayurveda Reference:</strong> Classical Ayurvedic texts</div>
      </div>
    </div>
    ${footer(35, 35)}
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Health Analysis Report Pro v2.0 — ${input.name}</title>
  <style>${css}</style>
</head>
<body>
  ${coverPage}
  ${tocPage}
  ${execPage}
  ${chartPage1}
  ${doshaPage}
  ${organDashPage}
  ${organPage1}
  ${organPage2}
  ${organPage3}
  ${organPage4}
  ${riskPage}
  ${riskChartPage}
  ${housesPlanetsPage}
  ${ayurPage1}
  ${ayurPage2}
  ${forecastPages.join("")}
  ${annualPage}
  ${timelinePage}
  ${remedyPages.join("")}
  ${aiCoachPage}
  ${chartsPage2}
  ${evidencePage}
  ${exercisePage}
  ${luckyPage}
  ${verdictPage}
  ${disclaimerPage}
</body>
</html>`;
}
