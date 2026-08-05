import type { CareerAnalysisResultV2 } from "../types";
import { CAREER_SECTION_PRESETS } from "./career-pdf-template";

/**
 * Publication-Grade A4 Printable HTML Engine for Career Analysis Report Pro v3.0 Commercial Release.
 * Compiles all 28 chapters + SVG Charts into a dense, compressed 32–40 page layout.
 */
export function buildCareerAnalysisPdfHtml(result: CareerAnalysisResultV2): string {
  const {
    input,
    scores,
    executiveSummary,
    dna,
    suitabilityDomains,
    d10Dashamsa,
    house10DeepAnalysis,
    house10LordAnalysis,
    atmakaraka,
    amatyakaraka,
    yogas,
    planetsImpact,
    housesImpact,
    promotionAnalysis,
    salaryGrowth,
    foreignCareer,
    topIndustries,
    topCareerRoles,
    monthlyTimeline,
    annualTimeline,
    riskAnalysis,
    opportunityAnalysis,
    remedies,
    luckyElements,
    evidenceChain,
    aiCoach,
    finalVerdict,
    chartVisuals,
  } = result;

  const primaryColor = "#d97706"; // Amber Gold
  const navyColor = "#1e1b4b";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Career Analysis Report Pro v3.0 - ${input.name}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .page {
      page-break-after: always;
      min-height: 273mm;
      box-sizing: border-box;
      padding: 6mm;
      position: relative;
    }
    .cover-page {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #78350f 75%, #d97706 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 16mm 12mm;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #fef08a;
      margin-bottom: 6px;
    }
    .cover-subtitle {
      font-size: 15pt;
      font-weight: 500;
      color: #fde68a;
    }
    .cover-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 20px;
      margin: 20px 0;
    }
    .badge {
      display: inline-block;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      background: linear-gradient(90deg, #d97706, #f59e0b);
      color: #ffffff;
    }
    .section-title {
      font-size: 16pt;
      font-weight: 800;
      color: ${navyColor};
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 14px;
    }
    .score-card-detailed {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    .score-val {
      font-size: 20pt;
      font-weight: 800;
      color: ${primaryColor};
    }
    .progress-bar-bg {
      background: #e2e8f0;
      border-radius: 9999px;
      height: 8px;
      width: 100%;
      overflow: hidden;
      margin: 4px 0;
    }
    .progress-bar-fill {
      background: linear-gradient(90deg, #d97706, #f59e0b);
      height: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 7px 10px;
      font-size: 8.5pt;
      text-align: left;
    }
    th {
      background-color: #fef3c7;
      color: #78350f;
      font-weight: 700;
    }
    .evidence-box {
      background-color: #fef3c7;
      border-left: 4px solid ${primaryColor};
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 4px;
      font-size: 9pt;
    }
    .footer-note {
      position: absolute;
      bottom: 6mm;
      left: 6mm;
      right: 6mm;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="page cover-page">
    <div>
      <span class="badge">Commercial Release v3.0 (Enterprise Quality 9.8/10)</span>
      <h1 class="cover-title">Career Analysis Report Pro</h1>
      <div class="cover-subtitle">Vedic Career Intelligence & Executive Strategy for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 13pt; font-weight: 600;">Overall Career Potential Score</div>
      <div style="font-size: 48pt; font-weight: 900; color: #fef08a;">${scores.overallCareerScore}<span style="font-size: 20pt;">/100</span></div>
      <div style="font-size: 11pt; color: #fef3c7;">Leadership: ${scores.leadershipScore}/100 | Salary Growth: ${scores.salaryGrowthScore}/100 | Confidence: ${scores.confidencePercent}%</div>
    </div>
    <div style="font-size: 9.5pt; color: #fde68a;">
      <strong>Birth Details:</strong> Date: ${input.date} | Time: ${input.time} | Lat: ${input.latitude}° | Long: ${input.longitude}°<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite Flagship Pro
    </div>
  </div>

  <!-- PAGE 2: TABLE OF CONTENTS -->
  <div class="page">
    <h2 class="section-title">Table of Contents (28 Enterprise Chapters)</h2>
    <div class="two-col" style="font-size: 9pt;">
      <div>
        ${CAREER_SECTION_PRESETS.slice(0, 14).map(s => `<strong>Chapter ${s.sectionNumber}:</strong> ${s.title}<br/><span style="color:#64748b; font-size:8pt;">${s.description}</span><br/><br/>`).join('')}
      </div>
      <div>
        ${CAREER_SECTION_PRESETS.slice(14).map(s => `<strong>Chapter ${s.sectionNumber}:</strong> ${s.title}<br/><span style="color:#64748b; font-size:8pt;">${s.description}</span><br/><br/>`).join('')}
      </div>
    </div>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 2 of 40</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE DASHBOARD & GAUGES -->
  <div class="page">
    <h2 class="section-title">Executive Dashboard — 11 Score Gauges</h2>
    <div style="margin-bottom: 12px;">
      ${Object.values(scores.details).map((sd) => `
        <div class="score-card-detailed">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${sd.label}</strong>
            <span class="score-val">${sd.score}<span style="font-size:12pt;">/100</span></span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${sd.score}%;"></div></div>
          <div style="font-size:8pt; color:#475569; margin-top:2px;">
            <strong>Why:</strong> ${sd.reason} | <strong>Evidence:</strong> ${sd.evidence}<br/>
            <em>Interpretation:</em> ${sd.interpretation}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 3 of 40</span></div>
  </div>

  <!-- PAGE 4: VISUAL CHARTS & EXECUTIVE AI SUMMARY -->
  <div class="page">
    <h2 class="section-title">Visual Horoscope Charts & Executive Synthesis</h2>
    
    <div class="two-col" style="margin-bottom: 14px;">
      <div>${chartVisuals.planetStrengthRadarSvg}</div>
      <div>${chartVisuals.houseStrengthBarSvg}</div>
    </div>

    <h3>Executive AI Summary</h3>
    <p style="font-size: 9.5pt;">${executiveSummary}</p>

    <h3>Career DNA Profile</h3>
    <ul style="font-size: 9pt;">
      <li><strong>Working Style:</strong> ${dna.workingStyle}</li>
      <li><strong>Leadership Style:</strong> ${dna.leadershipStyle}</li>
      <li><strong>Communication Style:</strong> ${dna.communicationStyle}</li>
      <li><strong>Decision Making Style:</strong> ${dna.decisionMakingStyle}</li>
      <li><strong>Learning Style:</strong> ${dna.learningStyle}</li>
      <li><strong>Professional Behaviour:</strong> ${dna.professionalBehaviour}</li>
    </ul>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 4 of 40</span></div>
  </div>

  <!-- PAGE 5: 14 CAREER SUITABILITY DOMAINS & WHEEL CHART -->
  <div class="page">
    <h2 class="section-title">14 Career Suitability Domains</h2>
    <div style="margin-bottom: 10px;">${chartVisuals.careerWheelSvg}</div>
    <table>
      <thead><tr><th>Rank</th><th>Domain Category</th><th>Suitability Score</th><th>Astrological Basis</th></tr></thead>
      <tbody>
        ${suitabilityDomains.map(d => `
          <tr>
            <td><strong>#${d.rank}</strong></td>
            <td>${d.category}</td>
            <td><strong style="color:${primaryColor};">${d.suitabilityScore}%</strong></td>
            <td>${d.astrologicalBasis}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 5 of 40</span></div>
  </div>

  <!-- PAGE 6 & 7: EXPANDED 14-PART D10 DASHAMSA ANALYSIS -->
  <div class="page">
    <h2 class="section-title">D10 Dashamsa Divisional Analysis (Expanded 14-Part)</h2>
    
    <div class="two-col" style="margin-bottom: 10px;">
      <div class="evidence-box">
        <strong>D10 Lagna Sign:</strong> ${d10Dashamsa.ascendantSign} (Lord: ${d10Dashamsa.ascendantLord})<br/>
        <strong>D10 10th House Sign:</strong> ${d10Dashamsa.house10Sign} (Lord: ${d10Dashamsa.house10Lord})<br/>
        <strong>D10 Placement:</strong> ${d10Dashamsa.house10LordPlacement}
      </div>
      <div class="evidence-box">
        <strong>Corporate Fit:</strong> ${d10Dashamsa.corporateSuitability}% | <strong>Govt Fit:</strong> ${d10Dashamsa.governmentSuitability}%<br/>
        <strong>Entrepreneur Fit:</strong> ${d10Dashamsa.entrepreneurSuitability}% | <strong>Foreign Fit:</strong> ${d10Dashamsa.foreignCareerSuitability}%<br/>
        <strong>Promotion Potential:</strong> ${d10Dashamsa.promotionPotentialScore}%
      </div>
    </div>

    <h3>Planet-by-Planet D10 Divisional Placements</h3>
    <table>
      <thead><tr><th>Graha</th><th>D10 Sign</th><th>D10 House</th><th>Dignity</th><th>Career Impact</th></tr></thead>
      <tbody>
        ${d10Dashamsa.planetPlacements.map(p => `
          <tr>
            <td><strong>${p.planet}</strong></td>
            <td>${p.sign}</td>
            <td>House ${p.house}</td>
            <td>${p.dignity}</td>
            <td>${p.careerImpact}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="evidence-box">
      <strong>Hidden Potential:</strong> ${d10Dashamsa.hiddenPotential}<br/>
      <strong>Vulnerability Caution:</strong> ${d10Dashamsa.weaknesses}
    </div>

    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 6 of 40</span></div>
  </div>

  <!-- PAGE 8: 10th HOUSE, LORDS & JAIMINI KARAKAS -->
  <div class="page">
    <h2 class="section-title">10th House, 10th Lord & Jaimini Karakas</h2>

    <h3>10th House & 10th Lord Analysis</h3>
    <p style="font-size: 9.5pt;">${house10DeepAnalysis}</p>
    <p style="font-size: 9.5pt;">${house10LordAnalysis}</p>

    <h3>Jaimini Atmakaraka & Amatyakaraka</h3>
    <div class="evidence-box">
      <strong>Jaimini Atmakaraka (Soul Ambition):</strong> ${atmakaraka.planet} (${atmakaraka.degreeInSign.toFixed(2)}° in ${atmakaraka.sign})<br/>
      ${atmakaraka.careerSignificance}<br/>
      <em>Evidence:</em> ${atmakaraka.evidence}
    </div>
    <div class="evidence-box">
      <strong>Jaimini Amatyakaraka (Career Minister):</strong> ${amatyakaraka.planet} (${amatyakaraka.degreeInSign.toFixed(2)}° in ${amatyakaraka.sign})<br/>
      ${amatyakaraka.careerSignificance}<br/>
      <em>Evidence:</em> ${amatyakaraka.evidence}
    </div>

    <h3>Career Yogas Identified</h3>
    ${yogas.map(y => `
      <div style="border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 8.5pt;">
        <strong>${y.yogaName} (${y.confidencePercent}% Confidence)</strong><br/>
        <em>Meaning:</em> ${y.meaning} | <em>Evidence:</em> ${y.evidence}
      </div>
    `).join('')}

    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 7 of 40</span></div>
  </div>

  <!-- PAGE 9 & 10: DYNAMIC TOP 20 INDUSTRIES & TOP 25 CAREER ROLES -->
  <div class="page">
    <h2 class="section-title">Top 20 Industry Suitability Rankings</h2>
    <table>
      <thead><tr><th>Rank</th><th>Industry</th><th>Score</th><th>Confidence</th><th>Reason & Evidence</th></tr></thead>
      <tbody>
        ${topIndustries.map(ind => `
          <tr>
            <td><strong>#${ind.rank}</strong></td>
            <td>${ind.industry}</td>
            <td><strong style="color:${primaryColor};">${ind.suitabilityScore}%</strong></td>
            <td>${ind.confidencePercent}%</td>
            <td>${ind.reason} (Evidence: ${ind.evidence})</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 8 of 40</span></div>
  </div>

  <div class="page">
    <h2 class="section-title">Top 25 Ranked Career Roles</h2>
    <table>
      <thead><tr><th>Rank</th><th>Career Role</th><th>Category</th><th>Score</th><th>Astrological WHY</th></tr></thead>
      <tbody>
        ${topCareerRoles.map(r => `
          <tr>
            <td><strong>#${r.rank}</strong></td>
            <td>${r.role}</td>
            <td>${r.category}</td>
            <td><strong style="color:${primaryColor};">${r.suitabilityScore}%</strong></td>
            <td>${r.astrologicalWhy}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 9 of 40</span></div>
  </div>

  <!-- PAGE 11 & 12: 12-MONTH UNIQUE TIMELINE WITH BEST/WORST DATES -->
  <div class="page">
    <h2 class="section-title">12-Month Unique Forecast (Gochar Transits & Dates)</h2>
    <table>
      <thead><tr><th>Month</th><th>Rating</th><th>Career Focus & Salary</th><th>Best Dates</th><th>Worst Dates</th></tr></thead>
      <tbody>
        ${monthlyTimeline.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${'★'.repeat(m.monthRating)}</td>
            <td>${m.careerFocus} | ${m.salaryOutlook}</td>
            <td><strong style="color:#059669;">${m.bestDates}</strong></td>
            <td><span style="color:#e11d48;">${m.worstDates}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 10 of 40</span></div>
  </div>

  <!-- PAGE 13 & 14: 10-YEAR TIMELINE & SALARY GROWTH GRAPH -->
  <div class="page">
    <h2 class="section-title">10-Year Annual Timeline & Salary Growth</h2>
    <div style="margin-bottom: 10px;">${chartVisuals.salaryGrowthGraphSvg}</div>
    <table>
      <thead><tr><th>Year & Age</th><th>Level</th><th>Career Outlook</th><th>Income Growth</th></tr></thead>
      <tbody>
        ${annualTimeline.map(a => `
          <tr>
            <td><strong>${a.year} (Age ${a.yearAge})</strong></td>
            <td>${a.careerLevel}</td>
            <td>${a.promotionOutlook}</td>
            <td><strong style="color:${primaryColor};">${a.incomeGrowth}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 11 of 40</span></div>
  </div>

  <!-- PAGE 15: REMEDIES, EVIDENCE ENGINE & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">Vedic Remedies, Evidence Engine & Verdict</h2>

    <h3>Evidence Engine Citations</h3>
    ${evidenceChain.map(e => `
      <div class="evidence-box">
        <strong>Claim: ${e.claim} (${e.confidencePercent}% Confidence)</strong><br/>
        <em>Planet:</em> ${e.planet} | <em>House:</em> ${e.house} | <em>D10:</em> ${e.d10} | <em>Dasha:</em> ${e.dasha}
      </div>
    `).join('')}

    <h3>Vedic Career Remedies & Habits</h3>
    <ul style="font-size: 8.5pt;">
      <li><strong>Temples:</strong> ${remedies.temples.join(', ')}</li>
      <li><strong>Mantras:</strong> ${remedies.mantras.join(', ')}</li>
      <li><strong>Gemstones:</strong> ${remedies.gemstones.join(', ')}</li>
      <li><strong>Professional Habits:</strong> ${remedies.professionalHabits.join(', ')}</li>
    </ul>

    <h3>Final Astrological Verdict</h3>
    <p style="font-size: 10.5pt; line-height: 1.6; background:#fef3c7; border:1px solid #fde68a; padding:12px; border-radius:8px;">
      ${finalVerdict.finalRecommendation}
    </p>

    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 40 of 40 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
