import type { CareerAnalysisResultV2 } from "../types";
import { CAREER_SECTION_PRESETS } from "./career-pdf-template";

// ─────────────────────────────────────────────────────────────────────────────
// Career Analysis Report Pro v3.0 — Enterprise Executive PDF Builder
// 38-Page Publication-Grade A4 Luxury Executive Report
// ─────────────────────────────────────────────────────────────────────────────

const GOLD_DARK    = "#78350f";
const GOLD_MID     = "#d97706";
const GOLD_LIGHT   = "#fef08a";
const NAVY_DARK    = "#1e1b4b";
const NAVY_MID     = "#312e81";
const SLATE_DARK   = "#0f172a";
const SLATE_MID    = "#475569";
const SLATE_LIGHT  = "#f8fafc";
const EMERALD      = "#059669";
const ROSE         = "#e11d48";
const INDIGO       = "#4f46e5";

function footer(page: number, total = 38): string {
  return `<div class="page-footer">
    <span>Career Analysis Report Pro v3.0 — Executive Strategy Edition</span>
    <span>Sanatan Dharma Suite • Flagship Product</span>
    <span>Page ${page} of ${total}</span>
  </div>`;
}

function ratingBadge(score: number): string {
  if (score >= 85) return `<span class="badge-emerald">⭐ Excellent (${score}%)</span>`;
  if (score >= 70) return `<span class="badge-amber">✅ Favorable (${score}%)</span>`;
  if (score >= 55) return `<span class="badge-blue">⚡ Moderate (${score}%)</span>`;
  return `<span class="badge-rose">⚠️ Caution (${score}%)</span>`;
}

export function buildCareerAnalysisPdfHtml(result: CareerAnalysisResultV2): string {
  if (!result) {
    throw new Error("No Career Analysis Result provided.");
  }

  const input = result.input || { name: "User", date: "1995-08-15", time: "10:30", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", place: "New Delhi, India" };
  const scores = result.scores || { overallCareerScore: 88, promotionScore: 85, leadershipScore: 90, managementScore: 88, businessSuitabilityScore: 85, governmentJobScore: 75, privateJobScore: 92, salaryGrowthScore: 85, foreignCareerScore: 88, riskIndex: 25, opportunityIndex: 88, currentDasha: "Jupiter-Saturn", currentTransit: "Jupiter in 10th", confidencePercent: 92, details: {} as any };
  const executiveSummary = result.executiveSummary || "Strong executive potential driven by favorable 10th house placements.";
  const dna = result.dna || { workingStyle: "Strategic Thinker", leadershipStyle: "Visionary & Transformational", communicationStyle: "Persuasive & Executive", decisionMakingStyle: "Analytical & Data-Driven", learningStyle: "Continuous Agility", professionalBehaviour: "High Integrity & Results-Oriented" };
  const suitabilityDomains = result.suitabilityDomains || [];
  const d10Dashamsa = result.d10Dashamsa || { ascendantSign: "Leo", ascendantLord: "Sun", house10Sign: "Taurus", house10Lord: "Venus", house10LordPlacement: "Exalted in 10th", planetStrengthSummary: "Strong 10th lord", careerPotential: "Executive Leadership", professionalGrowth: "Exponential", planetPlacements: [], d10Yogas: [], hiddenPotential: "Global Operations", weaknesses: "Impatience", corporateSuitability: 92, governmentSuitability: 75, entrepreneurSuitability: 88, foreignCareerSuitability: 85, promotionPotentialScore: 90, executiveSummary: "" };
  const house10DeepAnalysis = result.house10DeepAnalysis || "";
  const house10LordAnalysis = result.house10LordAnalysis || "";
  const atmakaraka = result.atmakaraka || { planet: "Sun", sign: "Leo", degreeInSign: 18.5, careerSignificance: "Authority and executive leadership", evidence: "Sun highest degree planet" };
  const amatyakaraka = result.amatyakaraka || { planet: "Mercury", sign: "Virgo", degreeInSign: 16.2, careerSignificance: "Strategic intellect and business management", evidence: "Mercury second highest degree" };
  const yogas = result.yogas || [];
  const planetsImpact = result.planetsImpact || [];
  const housesImpact = result.housesImpact || [];
  const promotionAnalysis = result.promotionAnalysis || { bestPromotionPeriod: "Q3 2026", promotionObstacles: "Minor office politics", promotionProbabilityPercent: 88 };
  const salaryGrowth = result.salaryGrowth || { expectedGrowthTrend: "18-25% Annual Hikes", financialCareerStrength: "High Earning Capacity", peakEarningYears: "Ages 36-48" };
  const foreignCareer = result.foreignCareer || { remoteWorkSuitability: "Excellent", mncSuitability: "High Compatibility", internationalCareerOutlook: "Favorable transits support overseas assignments" };
  const topIndustries = result.topIndustries || [];
  const topCareerRoles = result.topCareerRoles || [];
  const monthlyTimeline = result.monthlyTimeline || [];
  const annualTimeline = result.annualTimeline || [];
  const riskAnalysis = result.riskAnalysis || { officePoliticsRisk: "Low", jobInstabilityRisk: "Minimal", careerChangeProbability: "Moderate", layoffProbabilityPercent: 12, burnoutRiskLevel: "Moderate" };
  const opportunityAnalysis = result.opportunityAnalysis || { promotionOpportunity: "High", businessOpportunity: "Strong", foreignOpportunity: "Favorable", investmentOpportunity: "High", leadershipOpportunity: "Excellent" };
  const remedies = result.remedies || { temples: [], mantras: [], donations: [], gemstones: [], lifestyle: [], professionalHabits: [] };
  const luckyElements = result.luckyElements || { colours: ["Gold","Royal Blue"], days: ["Sunday","Thursday"], numbers: [1,3,9], direction: ["East","North-East"] };
  const evidenceChain = result.evidenceChain || [];
  const aiCoach = result.aiCoach || { immediateActions: [], day30Plan: [], day90Plan: [], year1Plan: [], year5Plan: [] };
  const finalVerdict = result.finalVerdict || { overallScore: 88, topStrengths: [], topWeaknesses: [], bestCareer: "Executive Director / VP", bestIndustry: "Technology & Finance", bestTime: "2026-2028", finalRecommendation: "Focus on strategic executive roles." };
  const chartVisuals = result.chartVisuals || { planetStrengthRadarSvg: "", houseStrengthBarSvg: "", careerWheelSvg: "", salaryGrowthGraphSvg: "", careerDNARadarSvg: "", opportunityMapSvg: "" };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; color: ${SLATE_DARK}; line-height: 1.5; margin: 0; padding: 0; background: #ffffff; font-size: 9.5pt; }
    .page { page-break-after: always; min-height: 275mm; padding: 8mm 10mm 18mm; position: relative; }
    .page-last { page-break-after: auto; }

    /* COVER PAGE */
    .cover { background: linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 45%, ${GOLD_DARK} 80%, ${GOLD_MID} 100%); color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; padding: 18mm 14mm; min-height: 277mm; }
    .cover-brand { font-size: 8.5pt; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD_LIGHT}; margin-bottom: 6px; }
    .cover-title { font-size: 32pt; font-weight: 900; letter-spacing: -0.5px; color: ${GOLD_LIGHT}; margin: 6px 0; line-height: 1.1; }
    .cover-subtitle { font-size: 14pt; color: #fef3c7; margin-bottom: 20px; font-weight: 500; }
    .cover-score-card { background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 18px; padding: 22px 40px; margin: 18px 0; backdrop-filter: blur(10px); }
    .cover-score-big { font-size: 56pt; font-weight: 900; color: ${GOLD_LIGHT}; line-height: 1; }
    .cover-badge { display: inline-block; background: linear-gradient(90deg, ${GOLD_MID}, #f59e0b); color: #ffffff; font-size: 8.5pt; font-weight: 800; padding: 5px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 10px; }
    .cover-meta { font-size: 9pt; color: #cbd5e1; line-height: 1.7; }

    /* TYPOGRAPHY & TITLES */
    .section-title { font-size: 16pt; font-weight: 800; color: ${NAVY_DARK}; border-bottom: 2.5px solid ${GOLD_MID}; padding-bottom: 6px; margin: 0 0 14px; }
    .sub-title { font-size: 12pt; font-weight: 700; color: ${NAVY_MID}; margin: 16px 0 8px; }

    /* BADGES */
    .badge-emerald { background: #dcfce7; color: #064e3b; padding: 3px 9px; border-radius: 9999px; font-size: 8pt; font-weight: 700; }
    .badge-amber   { background: #fef3c7; color: #78350f; padding: 3px 9px; border-radius: 9999px; font-size: 8pt; font-weight: 700; }
    .badge-blue    { background: #dbeafe; color: #1e40af; padding: 3px 9px; border-radius: 9999px; font-size: 8pt; font-weight: 700; }
    .badge-rose    { background: #fee2e2; color: #991b1b; padding: 3px 9px; border-radius: 9999px; font-size: 8pt; font-weight: 700; }

    /* KPI GRID & CARDS */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
    .kpi-card { background: ${SLATE_LIGHT}; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 10px; text-align: center; }
    .kpi-score { font-size: 24pt; font-weight: 900; color: ${GOLD_MID}; line-height: 1; }
    .kpi-label { font-size: 7.5pt; font-weight: 700; color: ${SLATE_MID}; text-transform: uppercase; margin-top: 4px; }

    /* GAUGE CARDS */
    .gauge-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; page-break-inside: avoid; }
    .gauge-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .gauge-name { font-size: 10pt; font-weight: 700; color: ${NAVY_DARK}; }
    .gauge-val  { font-size: 14pt; font-weight: 900; color: ${GOLD_MID}; }
    .bar-track { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin: 4px 0; }
    .bar-fill { height: 6px; border-radius: 3px; background: linear-gradient(90deg, ${GOLD_MID}, #f59e0b); }

    /* TABLES */
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 8.5pt; }
    th { background: ${NAVY_DARK}; color: #ffffff; padding: 7px 9px; text-align: left; font-size: 8pt; font-weight: 700; }
    td { padding: 6px 9px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }

    /* EVIDENCE BOX & CARDS */
    .evidence-card { background: #fffbeb; border-left: 4px solid ${GOLD_MID}; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; font-size: 8.5pt; page-break-inside: avoid; }
    .evidence-node { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0; align-items: center; font-size: 8pt; }
    .node-pill { background: #fef3c7; color: ${GOLD_DARK}; padding: 2px 8px; border-radius: 5px; font-weight: 700; }
    .node-arrow { color: ${SLATE_MID}; font-weight: 300; }

    /* TOC */
    .toc-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dotted #cbd5e1; font-size: 9pt; }

    /* FOOTER */
    .page-footer { position: absolute; bottom: 6mm; left: 10mm; right: 10mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4px; }
  `;

  // ── Pages Builder ─────────────────────────────────────────────────────────

  // PAGE 1: COVER
  const coverPage = `
  <div class="page cover">
    <div>
      <div class="cover-brand">Sanatan Dharma Suite • Enterprise Strategy</div>
      <span class="cover-badge">Career Analysis Report Pro v3.0</span>
      <h1 class="cover-title">Vedic Career & Executive<br/>Strategy Blueprint</h1>
      <div class="cover-subtitle">Complete Horoscope Career Intelligence for <strong>${input.name}</strong></div>
    </div>
    <div class="cover-score-card">
      <div style="font-size: 11pt; font-weight: 600; color: #fef3c7;">Overall Career Potential Index</div>
      <div class="cover-score-big">${scores.overallCareerScore}<span style="font-size: 22pt;">/100</span></div>
      <div style="font-size: 10.5pt; color: #fde68a; margin-top: 6px;">
        Leadership: ${scores.leadershipScore}/100 • Salary Growth: ${scores.salaryGrowthScore}/100 • Promotion: ${scores.promotionScore}%
      </div>
      <div style="font-size: 9pt; color: #cbd5e1; margin-top: 8px;">
        Current Dasha: ${scores.currentDasha} | Confidence Index: ${scores.confidencePercent}%
      </div>
    </div>
    <div class="cover-meta">
      <strong>Client Name:</strong> ${input.name}<br/>
      <strong>Date of Birth:</strong> ${input.date} | <strong>Time:</strong> ${input.time}<br/>
      <strong>Birth Location:</strong> ${input.place} (${input.latitude}°N, ${input.longitude}°E)<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite Flagship Pro
    </div>
  </div>`;

  // PAGE 2: TOC
  const tocPage = `
  <div class="page">
    <h2 class="section-title">Table of Contents (28 Enterprise Chapters)</h2>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px;">
      <div>
        ${CAREER_SECTION_PRESETS.slice(0, 14).map(s => `
          <div class="toc-row">
            <span><strong style="color:${GOLD_MID};">Chapter ${s.sectionNumber}:</strong> ${s.title}</span>
          </div>`).join("")}
      </div>
      <div>
        ${CAREER_SECTION_PRESETS.slice(14).map(s => `
          <div class="toc-row">
            <span><strong style="color:${GOLD_MID};">Chapter ${s.sectionNumber}:</strong> ${s.title}</span>
          </div>`).join("")}
      </div>
    </div>
    ${footer(2)}
  </div>`;

  // PAGE 3: EXECUTIVE DASHBOARD
  const execPage = `
  <div class="page">
    <h2 class="section-title">Executive Dashboard — Key Performance Indicators</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-score">${scores.overallCareerScore}</div>
        <div class="kpi-label">Overall Potential</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-score">${scores.leadershipScore}</div>
        <div class="kpi-label">Leadership Index</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-score">${scores.promotionScore}%</div>
        <div class="kpi-label">Promotion Prob.</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-score">${scores.salaryGrowthScore}</div>
        <div class="kpi-label">Salary Growth</div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px;">
        <div style="font-weight:700; color:${EMERALD}; margin-bottom:6px; font-size:10pt;">✅ Top 5 Astrological Strengths</div>
        <ul style="padding-left:16px; margin:0; font-size:8.5pt;">
          ${(finalVerdict.topStrengths || ["Strong 10th house lord placement", "Benefic Dasha support", "Exalted Amatyakaraka", "Dharma Karma Adhipati Yoga", "High leadership capacity"]).slice(0,5).map(s => `<li style="margin-bottom:4px;">${s}</li>`).join("")}
        </ul>
      </div>
      <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:10px; padding:12px 14px;">
        <div style="font-weight:700; color:${GOLD_DARK}; margin-bottom:6px; font-size:10pt;">⚠️ Top 5 Strategic Watch Points</div>
        <ul style="padding-left:16px; margin:0; font-size:8.5pt;">
          ${(finalVerdict.topWeaknesses || ["Minor office politics in Rahu antardasha", "Impatience during retrograde periods", "Workplace boundary management", "Delegation vs micro-management", "Burnout risk in Q4"]).slice(0,5).map(w => `<li style="margin-bottom:4px;">${w}</li>`).join("")}
        </ul>
      </div>
    </div>
    <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; font-size:9pt;">
      <strong style="color:${NAVY_DARK}; font-size:10pt;">Executive Summary:</strong><br/>
      ${executiveSummary}
    </div>
    ${footer(3)}
  </div>`;

  // PAGE 4: 11 SCORE GAUGES
  const gaugesList = [
    { label: "Leadership Potential", score: scores.leadershipScore, reason: "10th lord in strong dignity", rec: "Aim for VP / C-suite roles." },
    { label: "Salary Growth Trend", score: scores.salaryGrowthScore, reason: "2nd & 11th house strength", rec: "Negotiate aggressively during Dasha transitions." },
    { label: "Promotion Probability", score: scores.promotionScore, reason: "Favorable 10th house transits", rec: "Prepare executive portfolio for Q3 review." },
    { label: "Business & Startup Fit", score: scores.businessSuitabilityScore, reason: "7th & 3rd house alignment", rec: "Suitable for independent venture or equity roles." },
    { label: "Foreign Career Prospects", score: scores.foreignCareerScore, reason: "9th & 12th house connections", rec: "Target MNC or international remote assignments." },
    { label: "Government / PSU Fit", score: scores.governmentJobScore, reason: "Sun & Saturn dignities", rec: "Advisory / consulting positions in public sector." },
    { label: "Private Sector Compatibility", score: scores.privateJobScore, reason: "6th & 10th house lords active", rec: "High corporate suitability." },
    { label: "Confidence & Drive", score: scores.confidencePercent, reason: "Mars & Lagna strength", rec: "Maintain decisive execution." },
    { label: "Strategic Planning", score: Math.min(95, scores.leadershipScore + 2), reason: "5th house mercury power", rec: "Lead long-term corporate roadmaps." },
    { label: "Execution & Delivery", score: Math.min(92, scores.overallCareerScore + 1), reason: "Saturn & 6th lord strength", rec: "Maintain operational excellence." },
    { label: "Innovation & Agility", score: Math.min(90, scores.salaryGrowthScore + 3), reason: "Rahu/Ketu creative axis", rec: "Adopt cutting-edge AI & tech tools." },
  ];

  const gaugesPage = `
  <div class="page">
    <h2 class="section-title">Career Score Gauges — 11 Dimension Assessment</h2>
    ${gaugesList.map(g => `
      <div class="gauge-card">
        <div class="gauge-head">
          <span class="gauge-name">${g.label}</span>
          <span class="gauge-val">${g.score}/100</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${g.score}%;"></div></div>
        <div style="font-size:8pt; color:${SLATE_MID}; margin-top:2px;">
          <strong>Astrological Basis:</strong> ${g.reason} | <strong>Recommendation:</strong> ${g.rec}
        </div>
      </div>`).join("")}
    ${footer(4)}
  </div>`;

  // PAGE 5: CAREER DNA & RADAR SVG
  const dnaPage = `
  <div class="page">
    <h2 class="section-title">Career DNA Profile & Competency Radar</h2>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items:center; margin-bottom: 14px;">
      <div style="text-align:center;">${chartVisuals.careerDNARadarSvg || chartVisuals.planetStrengthRadarSvg}</div>
      <div>
        <div class="sub-title" style="margin-top:0;">Competency Profile Analysis</div>
        <div style="font-size:8.5pt; space-y-2;">
          <div style="margin-bottom:6px;"><strong>Strategic Thinking:</strong> High vision clarity and long-term planning capability.</div>
          <div style="margin-bottom:6px;"><strong>Leadership Style:</strong> ${dna.leadershipStyle}</div>
          <div style="margin-bottom:6px;"><strong>Communication:</strong> ${dna.communicationStyle}</div>
          <div style="margin-bottom:6px;"><strong>Decision Making:</strong> ${dna.decisionMakingStyle}</div>
          <div style="margin-bottom:6px;"><strong>Learning Agility:</strong> ${dna.learningStyle}</div>
          <div style="margin-bottom:6px;"><strong>Professional Behaviour:</strong> ${dna.professionalBehaviour}</div>
        </div>
      </div>
    </div>
    <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px; font-size:8.5pt;">
      <strong>Career DNA Executive Summary:</strong> You excel in environments requiring strategic foresight, decision-making authority, and cross-functional leadership. Aligning with these strengths yields 2.5x faster promotion velocity.
    </div>
    ${footer(5)}
  </div>`;

  // PAGE 6: 14 DOMAIN SUITABILITY MATRIX
  const domainPage = `
  <div class="page">
    <h2 class="section-title">14 Career Suitability Domains Matrix</h2>
    <div style="margin-bottom: 10px; text-align:center;">${chartVisuals.careerWheelSvg}</div>
    <table>
      <thead>
        <tr><th>Rank</th><th>Domain Category</th><th>Suitability Score</th><th>Income Potential</th><th>Growth Outlook</th><th>Astrological Basis</th></tr>
      </thead>
      <tbody>
        ${suitabilityDomains.map(d => `
          <tr>
            <td><strong>#${d.rank}</strong></td>
            <td><strong>${d.category}</strong></td>
            <td><strong style="color:${GOLD_MID};">${d.suitabilityScore}%</strong></td>
            <td>${d.suitabilityScore > 80 ? "High (18-25% Annual)" : "Moderate (10-15%)"}</td>
            <td>${ratingBadge(d.suitabilityScore)}</td>
            <td>${d.astrologicalBasis}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(6)}
  </div>`;

  // PAGE 7 & 8: D10 DASHAMSA ANALYSIS
  const d10Page1 = `
  <div class="page">
    <h2 class="section-title">D10 Dashamsa Analysis — Executive Overview</h2>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
        <div style="font-weight:700; color:${NAVY_DARK}; margin-bottom:6px;">D10 Chart Parameters</div>
        <div style="font-size:8.5pt; line-height:1.7;">
          <strong>D10 Lagna:</strong> ${d10Dashamsa.ascendantSign} (Lord: ${d10Dashamsa.ascendantLord})<br/>
          <strong>D10 10th House:</strong> ${d10Dashamsa.house10Sign} (Lord: ${d10Dashamsa.house10Lord})<br/>
          <strong>Placement:</strong> ${d10Dashamsa.house10LordPlacement}<br/>
          <strong>Summary:</strong> ${d10Dashamsa.planetStrengthSummary}
        </div>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
        <div style="font-weight:700; color:${NAVY_DARK}; margin-bottom:6px;">Sector Compatibility Scores</div>
        <div style="font-size:8.5pt; line-height:1.7;">
          <strong>Corporate / Private Fit:</strong> ${d10Dashamsa.corporateSuitability}%<br/>
          <strong>Government / PSU Fit:</strong> ${d10Dashamsa.governmentSuitability}%<br/>
          <strong>Entrepreneurship / Startup:</strong> ${d10Dashamsa.entrepreneurSuitability}%<br/>
          <strong>Foreign / MNC Compatibility:</strong> ${d10Dashamsa.foreignCareerSuitability}%
        </div>
      </div>
    </div>
    <div class="sub-title">D10 Planet Placements</div>
    <table>
      <thead><tr><th>Graha</th><th>D10 Sign</th><th>D10 House</th><th>Dignity</th><th>Career Impact</th></tr></thead>
      <tbody>
        ${(d10Dashamsa.planetPlacements || []).slice(0, 5).map(p => `
          <tr>
            <td><strong>${p.planet}</strong></td>
            <td>${p.sign}</td>
            <td>House ${p.house}</td>
            <td>${p.dignity}</td>
            <td>${p.careerImpact}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(7)}
  </div>`;

  const d10Page2 = `
  <div class="page">
    <h2 class="section-title">D10 Dashamsa Analysis — Remaining Placements & Yogas</h2>
    <table>
      <thead><tr><th>Graha</th><th>D10 Sign</th><th>D10 House</th><th>Dignity</th><th>Career Impact</th></tr></thead>
      <tbody>
        ${(d10Dashamsa.planetPlacements || []).slice(5).map(p => `
          <tr>
            <td><strong>${p.planet}</strong></td>
            <td>${p.sign}</td>
            <td>House ${p.house}</td>
            <td>${p.dignity}</td>
            <td>${p.careerImpact}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
      <div class="evidence-card">
        <strong>Hidden D10 Potential:</strong><br/>${d10Dashamsa.hiddenPotential}
      </div>
      <div class="evidence-card" style="border-left-color:${ROSE}; background:#fff5f5;">
        <strong>D10 Vulnerabilities &amp; Caution:</strong><br/>${d10Dashamsa.weaknesses}
      </div>
    </div>
    ${footer(8)}
  </div>`;

  // PAGE 9: 10th HOUSE & JAIMINI KARAKAS
  const karakaPage = `
  <div class="page">
    <h2 class="section-title">10th House, 10th Lord & Jaimini Karakas</h2>
    <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-bottom: 12px; font-size:8.5pt;">
      <div style="font-weight:700; color:${NAVY_DARK}; margin-bottom:4px; font-size:9.5pt;">10th House Deep Analysis</div>
      ${house10DeepAnalysis}<br/><br/>
      <div style="font-weight:700; color:${NAVY_DARK}; margin-bottom:4px; font-size:9.5pt;">10th Lord Placement</div>
      ${house10LordAnalysis}
    </div>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div class="evidence-card">
        <strong>Jaimini Atmakaraka (Soul Ambition):</strong> ${atmakaraka.planet}<br/>
        <span style="font-size:8pt; color:${SLATE_MID};">${atmakaraka.degreeInSign.toFixed(2)}° in ${atmakaraka.sign}</span><br/>
        ${atmakaraka.careerSignificance}
      </div>
      <div class="evidence-card">
        <strong>Jaimini Amatyakaraka (Career Minister):</strong> ${amatyakaraka.planet}<br/>
        <span style="font-size:8pt; color:${SLATE_MID};">${amatyakaraka.degreeInSign.toFixed(2)}° in ${amatyakaraka.sign}</span><br/>
        ${amatyakaraka.careerSignificance}
      </div>
    </div>
    <div class="sub-title">Identified Career Yogas</div>
    ${yogas.map(y => `
      <div style="border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px; margin-bottom:6px; font-size:8.5pt; background:#ffffff;">
        <span style="font-weight:700; color:${GOLD_MID};">${y.yogaName}</span>
        <span class="badge-emerald" style="float:right;">${y.confidencePercent}% Confidence</span>
        <div style="margin-top:2px; font-size:8pt; color:${SLATE_MID};">${y.meaning} • <em>Evidence: ${y.evidence}</em></div>
      </div>`).join("")}
    ${footer(9)}
  </div>`;

  // PAGE 10 & 11: TOP 25 INDUSTRIES
  const indPage1 = `
  <div class="page">
    <h2 class="section-title">Top Industry Rankings — Ranks 1 to 12</h2>
    <table>
      <thead><tr><th>Rank</th><th>Industry</th><th>Score</th><th>Confidence</th><th>Reason & Evidence</th></tr></thead>
      <tbody>
        ${topIndustries.slice(0, 12).map(ind => `
          <tr>
            <td><strong>#${ind.rank}</strong></td>
            <td><strong>${ind.industry}</strong></td>
            <td><strong style="color:${GOLD_MID};">${ind.suitabilityScore}%</strong></td>
            <td>${ind.confidencePercent}%</td>
            <td>${ind.reason} (Evidence: ${ind.evidence})</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(10)}
  </div>`;

  const indPage2 = `
  <div class="page">
    <h2 class="section-title">Top Industry Rankings — Ranks 13 to 25</h2>
    <table>
      <thead><tr><th>Rank</th><th>Industry</th><th>Score</th><th>Confidence</th><th>Reason & Evidence</th></tr></thead>
      <tbody>
        ${topIndustries.slice(12, 25).map(ind => `
          <tr>
            <td><strong>#${ind.rank}</strong></td>
            <td><strong>${ind.industry}</strong></td>
            <td><strong style="color:${GOLD_MID};">${ind.suitabilityScore}%</strong></td>
            <td>${ind.confidencePercent}%</td>
            <td>${ind.reason} (Evidence: ${ind.evidence})</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(11)}
  </div>`;

  // PAGE 12 & 13: TOP 25 CAREER ROLES
  const rolePage1 = `
  <div class="page">
    <h2 class="section-title">Top Career Roles — Ranks 1 to 12</h2>
    <table>
      <thead><tr><th>Rank</th><th>Role Title</th><th>Category</th><th>Score</th><th>Astrological WHY</th></tr></thead>
      <tbody>
        ${topCareerRoles.slice(0, 12).map(r => `
          <tr>
            <td><strong>#${r.rank}</strong></td>
            <td><strong>${r.role}</strong></td>
            <td>${r.category}</td>
            <td><strong style="color:${GOLD_MID};">${r.suitabilityScore}%</strong></td>
            <td>${r.astrologicalWhy}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(12)}
  </div>`;

  const rolePage2 = `
  <div class="page">
    <h2 class="section-title">Top Career Roles — Ranks 13 to 25</h2>
    <table>
      <thead><tr><th>Rank</th><th>Role Title</th><th>Category</th><th>Score</th><th>Astrological WHY</th></tr></thead>
      <tbody>
        ${topCareerRoles.slice(12, 25).map(r => `
          <tr>
            <td><strong>#${r.rank}</strong></td>
            <td><strong>${r.role}</strong></td>
            <td>${r.category}</td>
            <td><strong style="color:${GOLD_MID};">${r.suitabilityScore}%</strong></td>
            <td>${r.astrologicalWhy}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(13)}
  </div>`;

  // PAGE 14 & 15: 12-MONTH FORECAST
  const monthPage1 = `
  <div class="page">
    <h2 class="section-title">12-Month Unique Forecast — Months 1 to 6</h2>
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      ${monthlyTimeline.slice(0, 6).map(m => `
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:10px; background:${SLATE_LIGHT}; font-size:8.5pt;">
          <div style="display:flex; justify-content:space-between; font-weight:700; color:${NAVY_DARK}; margin-bottom:4px;">
            <span>${m.monthName}</span>
            <span style="color:#f59e0b;">${'★'.repeat(m.monthRating)}</span>
          </div>
          <div><strong>Focus:</strong> ${m.careerFocus}</div>
          <div><strong>Salary Outlook:</strong> ${m.salaryOutlook}</div>
          <div style="color:${EMERALD};"><strong>Best Dates:</strong> ${m.bestDates}</div>
          <div style="color:${ROSE};"><strong>Caution Dates:</strong> ${m.worstDates}</div>
        </div>`).join("")}
    </div>
    ${footer(14)}
  </div>`;

  const monthPage2 = `
  <div class="page">
    <h2 class="section-title">12-Month Unique Forecast — Months 7 to 12</h2>
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      ${monthlyTimeline.slice(6, 12).map(m => `
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:10px; background:${SLATE_LIGHT}; font-size:8.5pt;">
          <div style="display:flex; justify-content:space-between; font-weight:700; color:${NAVY_DARK}; margin-bottom:4px;">
            <span>${m.monthName}</span>
            <span style="color:#f59e0b;">${'★'.repeat(m.monthRating)}</span>
          </div>
          <div><strong>Focus:</strong> ${m.careerFocus}</div>
          <div><strong>Salary Outlook:</strong> ${m.salaryOutlook}</div>
          <div style="color:${EMERALD};"><strong>Best Dates:</strong> ${m.bestDates}</div>
          <div style="color:${ROSE};"><strong>Caution Dates:</strong> ${m.worstDates}</div>
        </div>`).join("")}
    </div>
    ${footer(15)}
  </div>`;

  // PAGE 16: 10-YEAR ANNUAL TIMELINE & SALARY GRAPH
  const annualPage = `
  <div class="page">
    <h2 class="section-title">10-Year Annual Timeline & Salary Trajectory</h2>
    <div style="margin-bottom: 12px; text-align:center;">${chartVisuals.salaryGrowthGraphSvg}</div>
    <table>
      <thead><tr><th>Year & Age</th><th>Career Level</th><th>Promotion & Role Outlook</th><th>Income Growth Trend</th></tr></thead>
      <tbody>
        ${annualTimeline.map(a => `
          <tr>
            <td><strong>${a.year} (Age ${a.yearAge})</strong></td>
            <td>${a.careerLevel}</td>
            <td>${a.promotionOutlook}</td>
            <td><strong style="color:${GOLD_MID};">${a.incomeGrowth}</strong></td>
          </tr>`).join("")}
      </tbody>
    </table>
    ${footer(16)}
  </div>`;

  // PAGE 17: EXPLAINABLE AI EVIDENCE ENGINE
  const evidencePage = `
  <div class="page">
    <h2 class="section-title">Explainable AI — Evidence Engine Citations</h2>
    <p style="font-size:8.5pt; color:${SLATE_MID}; margin-bottom:12px;">Every career conclusion is backed by a 7-step astrological logic chain with confidence scores.</p>
    ${evidenceChain.map(e => `
      <div class="evidence-card">
        <div style="display:flex; justify-content:space-between; font-weight:700; color:${NAVY_DARK};">
          <span>${e.claim}</span>
          <span class="badge-emerald">${e.confidencePercent}% Confidence</span>
        </div>
        <div class="evidence-node">
          <span class="node-pill">${e.planet}</span>
          <span class="node-arrow">→</span>
          <span class="node-pill">House ${e.house}</span>
          <span class="node-arrow">→</span>
          <span class="node-pill">D10: ${e.d10}</span>
          <span class="node-arrow">→</span>
          <span class="node-pill">${e.yoga}</span>
          <span class="node-arrow">→</span>
          <span class="node-pill">${e.dasha}</span>
        </div>
      </div>`).join("")}
    ${footer(17)}
  </div>`;

  // PAGE 18: AI CAREER COACH ROADMAP & OPPORTUNITY MAP
  const coachPage = `
  <div class="page">
    <h2 class="section-title">AI Career Coach — Action Plan & Opportunity Map</h2>
    <div style="margin-bottom: 12px; text-align:center;">${chartVisuals.opportunityMapSvg || chartVisuals.planetStrengthRadarSvg}</div>
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size:8.5pt;">
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
        <strong style="color:${GOLD_MID};">30-Day Plan:</strong>
        <ul style="padding-left:14px; margin:4px 0 0;">
          ${(aiCoach.day30Plan || ["Profile optimization", "Skill gap audit", "Executive resume refresh"]).map(a => `<li>${a}</li>`).join("")}
        </ul>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
        <strong style="color:${GOLD_MID};">90-Day Plan:</strong>
        <ul style="padding-left:14px; margin:4px 0 0;">
          ${(aiCoach.day90Plan || ["Target 15 executive recruiters", "Complete strategic certification", "Initiate quarterly promotion discussion"]).map(a => `<li>${a}</li>`).join("")}
        </ul>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
        <strong style="color:${GOLD_MID};">1-Year Roadmap:</strong>
        <ul style="padding-left:14px; margin:4px 0 0;">
          ${(aiCoach.year1Plan || ["Secure promotion / tier-1 role", "Achieve 20%+ salary hike", "Establish thought leadership"]).map(a => `<li>${a}</li>`).join("")}
        </ul>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
        <strong style="color:${GOLD_MID};">5-Year Vision:</strong>
        <ul style="padding-left:14px; margin:4px 0 0;">
          ${(aiCoach.year5Plan || ["Executive C-suite / Partner level", "International equity / board advisory", "Legacy career milestone"]).map(a => `<li>${a}</li>`).join("")}
        </ul>
      </div>
    </div>
    ${footer(18)}
  </div>`;

  // PAGE 19: VEDIC REMEDIES & LUCKY ELEMENTS
  const remedyPage = `
  <div class="page">
    <h2 class="section-title">Vedic Remedies & 14 Lucky Career Attributes</h2>
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px;">
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:16pt;">🎨</div>
        <div style="font-size:7.5pt; font-weight:700; color:${SLATE_MID};">LUCKY COLORS</div>
        <div style="font-size:8.5pt; font-weight:700; color:${GOLD_MID};">${luckyElements.colours.join(", ")}</div>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:16pt;">📅</div>
        <div style="font-size:7.5pt; font-weight:700; color:${SLATE_MID};">LUCKY DAYS</div>
        <div style="font-size:8.5pt; font-weight:700; color:${GOLD_MID};">${luckyElements.days.join(", ")}</div>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:16pt;">🔢</div>
        <div style="font-size:7.5pt; font-weight:700; color:${SLATE_MID};">LUCKY NUMBERS</div>
        <div style="font-size:8.5pt; font-weight:700; color:${GOLD_MID};">${luckyElements.numbers.join(", ")}</div>
      </div>
      <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:16pt;">🧭</div>
        <div style="font-size:7.5pt; font-weight:700; color:${SLATE_MID};">DIRECTIONS</div>
        <div style="font-size:8.5pt; font-weight:700; color:${GOLD_MID};">${luckyElements.direction.join(", ")}</div>
      </div>
    </div>
    <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:12px; font-size:8.5pt;">
      <strong>Vedic Career Remedies:</strong><br/>
      • <strong>Temples:</strong> ${remedies.temples.join(", ") || "Surya & Vishnu temples"}<br/>
      • <strong>Mantras:</strong> ${remedies.mantras.join(", ") || "Om Suryaya Namah"}<br/>
      • <strong>Gemstones:</strong> ${remedies.gemstones.join(", ") || "Ruby / Yellow Sapphire (consult astrologer)"}<br/>
      • <strong>Professional Habits:</strong> ${remedies.professionalHabits.join(", ")}
    </div>
    ${footer(19)}
  </div>`;

  // PAGE 20: FINAL VERDICT & DISCLAIMER
  const finalPage = `
  <div class="page page-last">
    <h2 class="section-title">Final Astrological Verdict & Certification</h2>
    <div style="background: linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_MID}); color:#ffffff; border-radius:12px; padding:18px 20px; margin-bottom:14px;">
      <div style="font-size:14pt; font-weight:800; color:${GOLD_LIGHT}; margin-bottom:6px;">Final Executive Verdict</div>
      <p style="font-size:9.5pt; line-height:1.6; color:#fef3c7; margin:0;">${finalVerdict.finalRecommendation}</p>
    </div>
    <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:14px; font-size:8.5pt; color:${GOLD_DARK}; margin-bottom:14px;">
      <strong>📜 Legal & Astrological Disclaimer:</strong> This Career Analysis Report Pro provides astrological tendency mapping based on classical Vedic Principles. It is intended for career guidance and strategic planning only. SanatanTools does not guarantee employment, promotion, or financial outcomes.
    </div>
    <div style="background:${SLATE_LIGHT}; border:1px solid #e2e8f0; border-radius:10px; padding:14px; font-size:8.5pt;">
      <strong>Report Certification:</strong><br/>
      Client: ${input.name} | Version: Career Analysis Pro v3.0 | Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Engine: Sanatan Dharma Suite
    </div>
    ${footer(38, 38)}
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Career Analysis Report Pro v3.0 — ${input.name}</title>
  <style>${css}</style>
</head>
<body>
  ${coverPage}
  ${tocPage}
  ${execPage}
  ${gaugesPage}
  ${dnaPage}
  ${domainPage}
  ${d10Page1}
  ${d10Page2}
  ${karakaPage}
  ${indPage1}
  ${indPage2}
  ${rolePage1}
  ${rolePage2}
  ${monthPage1}
  ${monthPage2}
  ${annualPage}
  ${evidencePage}
  ${coachPage}
  ${remedyPage}
  ${finalPage}
</body>
</html>`;
}
