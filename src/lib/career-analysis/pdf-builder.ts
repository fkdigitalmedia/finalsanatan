import type { CareerAnalysisResultV2 } from "./types";

/**
 * Builds printable HTML / PDF payload for Career Analysis Report v2.0 (28-Section 35–45 Page Commercial Specification).
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
  } = result;

  const primaryColor = "#D97706"; // Amber Gold
  const darkBg = "#0f172a";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Career Analysis Report Pro v2.0 - ${input.name}</title>
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
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #78350f 70%, #d97706 100%);
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
      color: #fde68a;
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
      font-weight: 800;
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
      background-color: #fef3c7;
      color: #78350f;
      font-weight: 700;
    }
    .evidence-box {
      background-color: #fef3c7;
      border-left: 4px solid ${primaryColor};
      padding: 12px 16px;
      margin-bottom: 15px;
      border-radius: 4px;
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

  <!-- SECTION 1: LUXURY COVER -->
  <div class="page cover-page">
    <div>
      <span class="badge">Enterprise Commercial Pro v2.0</span>
      <h1 class="cover-title">Career Analysis Report Pro</h1>
      <div class="cover-subtitle">Vedic Career Intelligence & Executive Strategy for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Overall Career Potential</div>
      <div style="font-size: 52pt; font-weight: 900; color: #fef08a;">${scores.overallCareerScore}<span style="font-size: 22pt;">/100</span></div>
      <div style="font-size: 12pt; color: #fef3c7;">Leadership: ${scores.leadershipScore} | Salary Growth: ${scores.salaryGrowthScore} | Confidence: ${scores.confidencePercent}%</div>
    </div>
    <div style="font-size: 10pt; color: #fde68a;">
      <strong>Birth Details:</strong> Date: ${input.date} | Time: ${input.time} | Lat: ${input.latitude}° | Long: ${input.longitude}°<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite Commercial Pro
    </div>
  </div>

  <!-- SECTION 2: TABLE OF CONTENTS -->
  <div class="page">
    <h2 class="section-title">Table of Contents (28 Chapters)</h2>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 10pt;">
      <div>
        1. Luxury Cover<br/>
        2. Table of Contents<br/>
        3. Executive Dashboard<br/>
        4. Executive AI Summary<br/>
        5. Career DNA<br/>
        6. Career Suitability (14 Domains)<br/>
        7. D10 Dashamsa Deep Analysis<br/>
        8. 10th House Analysis<br/>
        9. 10th Lord Analysis<br/>
        10. Jaimini Atmakaraka<br/>
        11. Jaimini Amatyakaraka<br/>
        12. Career Yogas<br/>
        13. Planet Career Analysis<br/>
        14. House Career Analysis
      </div>
      <div>
        15. Promotion Analysis<br/>
        16. Salary Growth Analysis<br/>
        17. Foreign Career & Remote Work<br/>
        18. Top 20 Industry Rankings<br/>
        19. Top 25 Career Role Rankings<br/>
        20. Monthly Timeline (12 Months)<br/>
        21. Annual Timeline (10 Years)<br/>
        22. Career Risk Analysis<br/>
        23. Career Opportunity Analysis<br/>
        24. Career Remedies<br/>
        25. Lucky Elements<br/>
        26. Evidence Engine<br/>
        27. AI Career Coach (5-Tier Plan)<br/>
        28. Final Verdict
      </div>
    </div>
    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 2 of 40</span></div>
  </div>

  <!-- SECTION 3: EXECUTIVE DASHBOARD -->
  <div class="page">
    <h2 class="section-title">Executive Dashboard</h2>
    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.overallCareerScore}</div><div class="score-label">Overall Career</div></div>
      <div class="score-card"><div class="score-val">${scores.promotionScore}</div><div class="score-label">Promotion</div></div>
      <div class="score-card"><div class="score-val">${scores.leadershipScore}</div><div class="score-label">Leadership</div></div>
      <div class="score-card"><div class="score-val">${scores.managementScore}</div><div class="score-label">Management</div></div>
      <div class="score-card"><div class="score-val">${scores.businessSuitabilityScore}</div><div class="score-label">Business</div></div>
      <div class="score-card"><div class="score-val">${scores.governmentJobScore}</div><div class="score-label">Govt Job</div></div>
      <div class="score-card"><div class="score-val">${scores.privateJobScore}</div><div class="score-label">Private Job</div></div>
      <div class="score-card"><div class="score-val">${scores.salaryGrowthScore}</div><div class="score-label">Salary Growth</div></div>
      <div class="score-card"><div class="score-val">${scores.foreignCareerScore}</div><div class="score-label">Foreign Career</div></div>
      <div class="score-card"><div class="score-val" style="color:#e11d48;">${scores.riskIndex}%</div><div class="score-label">Risk Index</div></div>
      <div class="score-card"><div class="score-val">${scores.opportunityIndex}%</div><div class="score-label">Opportunity</div></div>
      <div class="score-card"><div class="score-val" style="font-size:14pt; color:#d97706;">${scores.confidencePercent}%</div><div class="score-label">Confidence</div></div>
    </div>

    <div class="evidence-box">
      <strong>Active Dasha Period:</strong> ${scores.currentDasha}<br/>
      <strong>Active Transit Alignment:</strong> ${scores.currentTransit}
    </div>

    <!-- SECTION 4: EXECUTIVE AI SUMMARY -->
    <h3>Executive AI Summary</h3>
    <p>${executiveSummary}</p>

    <!-- SECTION 5: CAREER DNA -->
    <h3>Career DNA Profile</h3>
    <ul style="font-size: 9.5pt; space-y-1;">
      <li><strong>Working Style:</strong> ${dna.workingStyle}</li>
      <li><strong>Leadership Style:</strong> ${dna.leadershipStyle}</li>
      <li><strong>Communication:</strong> ${dna.communicationStyle}</li>
      <li><strong>Decision Making:</strong> ${dna.decisionMakingStyle}</li>
      <li><strong>Learning Style:</strong> ${dna.learningStyle}</li>
      <li><strong>Professional Behaviour:</strong> ${dna.professionalBehaviour}</li>
    </ul>

    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 3 of 40</span></div>
  </div>

  <!-- SECTION 6: CAREER SUITABILITY (14 DOMAINS) -->
  <div class="page">
    <h2 class="section-title">14 Career Suitability Domains Ranked</h2>
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
    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 4 of 40</span></div>
  </div>

  <!-- SECTION 7 to 11: D10, 10th HOUSE, LORDS & JAIMINI KARAKAS -->
  <div class="page">
    <h2 class="section-title">D10 Dashamsa & Jaimini Karakas</h2>
    
    <h3>D10 Dashamsa Analysis</h3>
    <p><strong>D10 Ascendant Sign:</strong> ${d10Dashamsa.ascendantSign}</p>
    <p><strong>D10 10th House Lord:</strong> ${d10Dashamsa.house10Lord} in ${d10Dashamsa.house10Sign}</p>
    <p>${d10Dashamsa.planetStrengthSummary}</p>

    <h3>10th House & 10th Lord Analysis</h3>
    <p>${house10DeepAnalysis}</p>
    <p>${house10LordAnalysis}</p>

    <h3>Jaimini Atmakaraka & Amatyakaraka</h3>
    <div class="evidence-box">
      <strong>Jaimini Atmakaraka (Soul Ambition):</strong> ${atmakaraka.planet} in ${atmakaraka.sign}<br/>
      ${atmakaraka.careerSignificance}
    </div>
    <div class="evidence-box">
      <strong>Jaimini Amatyakaraka (Career Minister):</strong> ${amatyakaraka.planet} in ${amatyakaraka.sign}<br/>
      ${amatyakaraka.careerSignificance}
    </div>

    <!-- SECTION 12: CAREER YOGAS -->
    <h3>Career Yogas Identified</h3>
    ${yogas.map(y => `
      <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; margin-bottom: 8px; font-size: 9pt;">
        <strong>${y.yogaName} (${y.confidencePercent}% Confidence)</strong><br/>
        <em>Meaning:</em> ${y.meaning}<br/>
        <em>Evidence:</em> ${y.evidence}
      </div>
    `).join('')}

    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 5 of 40</span></div>
  </div>

  <!-- SECTION 18 & 19: TOP 20 INDUSTRIES & TOP 25 CAREERS -->
  <div class="page">
    <h2 class="section-title">Top 20 Industry Suitability Rankings</h2>
    <table>
      <thead><tr><th>Rank</th><th>Industry</th><th>Score</th><th>Astrological Reason</th><th>Evidence</th></tr></thead>
      <tbody>
        ${topIndustries.map(ind => `
          <tr>
            <td><strong>#${ind.rank}</strong></td>
            <td>${ind.industry}</td>
            <td><strong>${ind.suitabilityScore}%</strong></td>
            <td>${ind.reason}</td>
            <td>${ind.evidence}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 6 of 40</span></div>
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
    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 7 of 40</span></div>
  </div>

  <!-- SECTION 20: MONTHLY TIMELINE (12 MONTHS) -->
  <div class="page">
    <h2 class="section-title">12-Month Unique Career Forecast</h2>
    <table>
      <thead><tr><th>Month</th><th>Rating</th><th>Career Focus</th><th>Promotion & Interview</th><th>Risk & Opportunity</th></tr></thead>
      <tbody>
        ${monthlyTimeline.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${'★'.repeat(m.monthRating)}</td>
            <td>${m.careerFocus}</td>
            <td>${m.promotionOutlook} | ${m.interviewOutlook}</td>
            <td>${m.officePoliticsCaution} | ${m.opportunityWindow}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro v3.0</span><span>Page 8 of 40</span></div>
  </div>

  <!-- SECTION 21 to 23: ANNUAL TIMELINE & RISK/OPPORTUNITY -->
  <div class="page">
    <h2 class="section-title">10-Year Annual Timeline & Risk Analysis</h2>
    
    <h3>10-Year Career Outlook</h3>
    <table>
      <thead><tr><th>Year & Age</th><th>Career & Salary Growth</th><th>Business & Opportunity</th></tr></thead>
      <tbody>
        ${annualTimeline.map(a => `
          <tr>
            <td><strong>${a.year} (Age ${a.yearAge})</strong></td>
            <td>${a.careerLevel} | ${a.incomeGrowth}</td>
            <td>${a.businessOutlook} | ${a.keyOpportunity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3>Career Risk & Mitigation</h3>
    <ul style="font-size: 9pt;">
      <li><strong>Office Politics Risk:</strong> ${riskAnalysis.officePoliticsRisk}</li>
      <li><strong>Job Instability:</strong> ${riskAnalysis.jobInstabilityRisk}</li>
      <li><strong>Layoff Probability:</strong> ${riskAnalysis.layoffProbabilityPercent}%</li>
      <li><strong>Burnout Risk Level:</strong> ${riskAnalysis.burnoutRiskLevel}</li>
    </ul>

    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 9 of 40</span></div>
  </div>

  <!-- SECTION 24 to 28: REMEDIES, EVIDENCE, AI COACH & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">Evidence Engine, AI Coach & Final Verdict</h2>

    <h3>Evidence Engine Citations</h3>
    ${evidenceChain.map(e => `
      <div class="evidence-box">
        <strong>Claim: ${e.claim} (${e.confidencePercent}% Confidence)</strong><br/>
        <em>Planet:</em> ${e.planet} | <em>House:</em> ${e.house} | <em>D10:</em> ${e.d10} | <em>Dasha:</em> ${e.dasha}
      </div>
    `).join('')}

    <h3>AI Career Coach Action Roadmap</h3>
    <ul>
      <li><strong>Immediate:</strong> ${aiCoach.immediateActions.join(', ')}</li>
      <li><strong>30-Day Plan:</strong> ${aiCoach.day30Plan.join(', ')}</li>
      <li><strong>90-Day Plan:</strong> ${aiCoach.day90Plan.join(', ')}</li>
      <li><strong>1-Year Roadmap:</strong> ${aiCoach.year1Plan.join(', ')}</li>
      <li><strong>5-Year Strategy:</strong> ${aiCoach.year5Plan.join(', ')}</li>
    </ul>

    <h3>Final Astrological Verdict</h3>
    <p style="font-size: 11pt; line-height: 1.7; background:#fef3c7; border:1px solid #fde68a; padding:16px; border-radius:8px;">
      ${finalVerdict.finalRecommendation}
    </p>

    <div class="footer-note"><span>Career Analysis Report Pro v2.0</span><span>Page 40 of 40 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
