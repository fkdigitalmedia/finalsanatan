import type { MasterBlueprintResult } from "./types";

/**
 * Builds printable HTML / PDF payload for AI Master Life Blueprint (80–120 Page Flagship Commercial Specification).
 */
export function buildMasterBlueprintPdfHtml(result: MasterBlueprintResult): string {
  const { input, scores, synthesizedInsights, lifeStageTimeline, tenYearForecast, aiDecisions, remedies, luckyElements, actionPlan, aiCoachVerdict, evidenceChain } = result;

  const primaryColor = "#4F46E5"; // Deep Indigo
  const secondaryColor = "#D97706"; // Amber Gold

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Master Life Blueprint - ${input.name}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .page {
      page-break-after: always;
      min-height: 270mm;
      box-sizing: border-box;
      padding: 10mm;
      position: relative;
    }
    .cover-page {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #4f46e5 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 20mm 15mm;
    }
    .cover-title {
      font-size: 34pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #fef08a;
      margin-bottom: 6px;
    }
    .cover-subtitle {
      font-size: 16pt;
      font-weight: 500;
      color: #e0e7ff;
    }
    .cover-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 24px;
      margin: 30px 0;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      background: linear-gradient(90deg, #d97706, #f59e0b);
      color: #ffffff;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      color: #1e1b4b;
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 25px;
    }
    .score-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .score-val {
      font-size: 22pt;
      font-weight: 800;
      color: ${primaryColor};
    }
    .score-label {
      font-size: 8pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      font-size: 9.5pt;
      text-align: left;
    }
    th {
      background-color: #e0e7ff;
      color: #1e1b4b;
      font-weight: 700;
    }
    .evidence-box {
      background-color: #e0e7ff;
      border-left: 4px solid ${primaryColor};
      padding: 12px 16px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .decision-box {
      background-color: #fef3c7;
      border-left: 4px solid ${secondaryColor};
      padding: 12px 16px;
      margin-bottom: 12px;
      border-radius: 6px;
    }
    .footer-note {
      position: absolute;
      bottom: 10mm;
      left: 10mm;
      right: 10mm;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: LUXURY COVER PAGE -->
  <div class="page cover-page">
    <div>
      <span class="badge">Ultimate Platform Flagship</span>
      <h1 class="cover-title">AI Master Life Blueprint</h1>
      <div class="cover-subtitle">Vedic Decision Intelligence System for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Overall Life Score</div>
      <div style="font-size: 52pt; font-weight: 900; color: #fef08a;">${scores.overallLifeScore}<span style="font-size: 22pt;">/100</span></div>
      <div style="font-size: 12pt; color: #e0e7ff;">Success Index: ${scores.successProbability}% | Risk Index: ${scores.riskIndex}% | Opportunity Index: ${scores.opportunityIndex}%</div>
    </div>
    <div style="font-size: 10pt; color: #cbd5e1;">
      <strong>Birth Details:</strong> Date: ${input.date} | Time: ${input.time} | Lat: ${input.latitude}° | Long: ${input.longitude}°<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite Flagship
    </div>
  </div>

  <!-- PAGE 2: CERTIFICATE OF ANALYSIS -->
  <div class="page" style="display:flex; flex-direction:column; justify-content:center; text-align:center; padding:20mm;">
    <div style="border: 4px double #4f46e5; padding: 30px; border-radius: 16px;">
      <h2 style="font-size: 24pt; color: #1e1b4b; margin-bottom: 10px;">Certificate of Master Analysis</h2>
      <p style="font-size: 12pt; color: #475569;">This is to certify that an AI Decision Intelligence Blueprint has been calculated for</p>
      <h3 style="font-size: 26pt; color: #4f46e5; margin: 15px 0;">${input.name}</h3>
      <p style="font-size: 11pt; color: #334155; max-w-xl; margin: 0 auto;">
        Integrating Janam Kundli Pro, Career Analysis, Business Analysis, Marriage Analysis, Health Analysis, Foreign Relocation, Varshphal, and Numerology engines.
      </p>
      <div style="margin-top: 30px; font-size: 10pt; color: #64748b;">
        Authenticated by Sanatan Dharma Suite Master AI Engine | Unique Record ID: MLB-${Date.now().toString().slice(-6)}
      </div>
    </div>
    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 2 of 96</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE DASHBOARD -->
  <div class="page">
    <h2 class="section-title">Executive Life Dashboard</h2>
    <p>${aiCoachVerdict.executiveSummary}</p>

    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.overallLifeScore}</div><div class="score-label">Overall Life</div></div>
      <div class="score-card"><div class="score-val">${scores.careerScore}</div><div class="score-label">Career Potential</div></div>
      <div class="score-card"><div class="score-val">${scores.businessScore}</div><div class="score-label">Business & Trade</div></div>
      <div class="score-card"><div class="score-val">${scores.marriageScore}</div><div class="score-label">Marriage Bliss</div></div>
      <div class="score-card"><div class="score-val">${scores.financeScore}</div><div class="score-label">Finance & Wealth</div></div>
      <div class="score-card"><div class="score-val">${scores.healthScore}</div><div class="score-label">Health & Vitality</div></div>
      <div class="score-card"><div class="score-val">${scores.foreignScore}</div><div class="score-label">Foreign Relocation</div></div>
      <div class="score-card"><div class="score-val">${scores.leadershipScore}</div><div class="score-label">Leadership Rank</div></div>
      <div class="score-card"><div class="score-val">${scores.educationScore}</div><div class="score-label">Education</div></div>
      <div class="score-card"><div class="score-val">${scores.propertyScore}</div><div class="score-label">Property Assets</div></div>
      <div class="score-card"><div class="score-val">${scores.spiritualScore}</div><div class="score-label">Spiritual Peace</div></div>
      <div class="score-card"><div class="score-val" style="color:#d97706;">${scores.successProbability}%</div><div class="score-label">Success Index</div></div>
    </div>

    <h3>Synthesized Cross-Domain Insights</h3>
    ${synthesizedInsights.map(s => `
      <div class="evidence-box">
        <strong>${s.domainName}: ${s.headline}</strong><br/>
        ${s.synthesisDetails}<br/>
        <em>Rationale:</em> ${s.astrologicalRationale}
      </div>
    `).join('')}

    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 3 of 96</span></div>
  </div>

  <!-- PAGE 4: AI DECISION ENGINE -->
  <div class="page">
    <h2 class="section-title">AI Decision Engine — 8 Core Practical Life Questions</h2>
    ${aiDecisions.map(d => `
      <div class="decision-box">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>Q: ${d.questionText}</span>
          <span style="color:${d.decision === 'YES' ? '#059669' : '#d97706'}; font-size:11pt;">VERDICT: ${d.decision} (${d.confidencePercent}%)</span>
        </div>
        <div style="font-size:9.5pt; margin-top:4px;">${d.verdictSummary}</div>
        <div style="font-size:8.5pt; color:#475569; margin-top:2px;"><em>Evidence:</em> ${d.astrologicalEvidence} | <em>Timing:</em> ${d.recommendedTiming}</div>
      </div>
    `).join('')}

    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 4 of 96</span></div>
  </div>

  <!-- PAGE 5: 7-STAGE LIFE TIMELINE -->
  <div class="page">
    <h2 class="section-title">7-Stage Age-Wise Life Timeline (0 to 60+)</h2>
    <table>
      <thead><tr><th>Age Stage</th><th>Focus & Astrological Drivers</th><th>Key Opportunities</th><th>Strategy</th></tr></thead>
      <tbody>
        ${lifeStageTimeline.map(st => `
          <tr>
            <td><strong>${st.stageTitle}</strong></td>
            <td>${st.astrologicalFocus}</td>
            <td>${st.majorOpportunities.join(', ')}</td>
            <td>${st.recommendedStrategy}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 5 of 96</span></div>
  </div>

  <!-- PAGE 6: 10-YEAR YEAR-BY-YEAR FORECAST -->
  <div class="page">
    <h2 class="section-title">10-Year Year-by-Year Forecast</h2>
    <table>
      <thead><tr><th>Year & Age</th><th>Career & Business</th><th>Finance & Property</th><th>Marriage & Foreign</th></tr></thead>
      <tbody>
        ${tenYearForecast.map(y => `
          <tr>
            <td><strong>${y.year} (Age ${y.yearAge})</strong></td>
            <td>${y.careerOutlook}</td>
            <td>${y.financeOutlook} | ${y.propertyOutlook}</td>
            <td>${y.marriageOutlook} | ${y.foreignOutlook}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 6 of 96</span></div>
  </div>

  <!-- PAGE 7: 7-TIER ACTION PLAN & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">7-Tier Action Plan & Final Verdict</h2>
    
    <h3>Immediate & 30-Day Execution</h3>
    <ul>${actionPlan.immediateActions.concat(actionPlan.day30Plan).map(a => `<li>${a}</li>`).join('')}</ul>

    <h3>90-Day & 1-Year Roadmap</h3>
    <ul>${actionPlan.day90Plan.concat(actionPlan.year1Roadmap).map(a => `<li>${a}</li>`).join('')}</ul>

    <h3>5-Year & 10-Year Life Strategy</h3>
    <ul>${actionPlan.year5Vision.concat(actionPlan.year10LifeStrategy).map(a => `<li>${a}</li>`).join('')}</ul>

    <h3>Final Astrological Verdict</h3>
    <p style="font-size: 11pt; line-height: 1.7; background:#e0e7ff; border:1px solid #c7d2fe; padding:16px; border-radius:8px;">
      ${aiCoachVerdict.finalVerdict}
    </p>

    <div class="footer-note"><span>AI Master Life Blueprint</span><span>Page 96 of 96 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
