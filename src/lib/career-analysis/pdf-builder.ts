import type { CareerAnalysisResult } from "./types";

/**
 * Builds printable HTML / PDF payload for Career Analysis Report Pro (40-Page Commercial Flagship Specification).
 */
export function buildCareerAnalysisPdfHtml(result: CareerAnalysisResult): string {
  const { input, scores, house1, house2, house6, house10, house11, d10Dashamsa, topCareerRoles, topIndustries, careerYogas, monthlyForecast, annualTimeline, aiCareerCoach, remedies, luckyElements, aiConsultantVerdict, evidenceChain } = result;

  const primaryColor = "#B45309"; // Amber / Bronze
  const secondaryColor = "#1D4ED8"; // Royal Blue

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Career Analysis Report Pro - ${input.name}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1e293b;
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
      background: linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 20mm 15mm;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #fef3c7;
      margin-bottom: 4px;
    }
    .cover-subtitle {
      font-size: 16pt;
      font-weight: 500;
      color: #fffbeb;
    }
    .cover-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 20px;
      margin: 30px 0;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 10pt;
      font-weight: 600;
      text-transform: uppercase;
      background-color: ${primaryColor};
      color: #ffffff;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      color: #78350f;
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .score-card {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
    }
    .score-val {
      font-size: 24pt;
      font-weight: 800;
      color: ${primaryColor};
    }
    .score-label {
      font-size: 9pt;
      font-weight: 600;
      color: #92400e;
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
      font-size: 10pt;
      text-align: left;
    }
    th {
      background-color: #fef3c7;
      color: #78350f;
      font-weight: 600;
    }
    .evidence-box {
      background-color: #fffbeb;
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

  <!-- PAGE 1: COVER PAGE -->
  <div class="page cover-page">
    <div>
      <span class="badge">Flagship Commercial Edition</span>
      <h1 class="cover-title">Career Analysis Report Pro</h1>
      <div class="cover-subtitle">Complete Astrological Career Intelligence Profile for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Overall Career Potential Score</div>
      <div style="font-size: 48pt; font-weight: 900; color: #fef3c7;">${scores.overallCareerScore}<span style="font-size: 20pt;">/100</span></div>
      <div style="font-size: 11pt; color: #fffbeb;">Top Career Fit: ${topCareerRoles[0].role} (${topCareerRoles[0].suitabilityScore}% Match)</div>
    </div>
    <div style="font-size: 10pt; color: #cbd5e1;">
      <strong>Birth Details:</strong> Date: ${input.date} | Time: ${input.time} | Lat: ${input.latitude}° | Long: ${input.longitude}°<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite
    </div>
  </div>

  <!-- PAGE 2: TABLE OF CONTENTS -->
  <div class="page">
    <h2 class="section-title">Table of Contents</h2>
    <table>
      <thead><tr><th>Section #</th><th>Chapter Title</th><th>Focus Area</th></tr></thead>
      <tbody>
        <tr><td>01</td><td>Executive Career Summary</td><td>Overall Astrological Career Profile</td></tr>
        <tr><td>02</td><td>Career Dashboard</td><td>11 Precision Score Gauges</td></tr>
        <tr><td>03</td><td>Overall Career Score</td><td>Executive Authority & Drive</td></tr>
        <tr><td>04</td><td>Government vs Private Job</td><td>Civil Services vs Corporate Sector</td></tr>
        <tr><td>05</td><td>Business vs Job Feasibility</td><td>Entrepreneurship vs Employment</td></tr>
        <tr><td>06</td><td>D10 Dashamsa Analysis</td><td>10th Divisional Chart Career Status</td></tr>
        <tr><td>07</td><td>Atmakaraka & Amatyakaraka</td><td>Soul Desire & Career Minister Planets</td></tr>
        <tr><td>08</td><td>10th House & 10th Lord Analysis</td><td>Karma Bhava & Professional Rank</td></tr>
        <tr><td>09</td><td>6th, 2nd & 11th House Analysis</td><td>Service, Salary & Wealth Gains</td></tr>
        <tr><td>10</td><td>Top 30 Career Role Rankings</td><td>Ranked Job Roles & Suitability</td></tr>
        <tr><td>11</td><td>Top 17 Industry Suitabilities</td><td>Best Performing Business Sectors</td></tr>
        <tr><td>12</td><td>Career Yogas & Raj Yogas</td><td>Amala, Gajakesari & Dhana Yogas</td></tr>
        <tr><td>13</td><td>Promotion & Salary Growth</td><td>Increments & Elevation Timing</td></tr>
        <tr><td>14</td><td>AI Career Coach 4-Tier Plan</td><td>30d, 90d, 1y, 5y Strategic Execution</td></tr>
        <tr><td>15</td><td>12-Month Career Forecast</td><td>12-Month Detailed Timeline</td></tr>
        <tr><td>16</td><td>5-Year Annual Career Timeline</td><td>Macro Professional Growth Cycles</td></tr>
        <tr><td>17</td><td>Career Remedies & Vastu</td><td>Mantras, Pujas & Workspace Alignment</td></tr>
        <tr><td>18</td><td>Evidence Engine & Verdict</td><td>Astrological Citations & Final Verdict</td></tr>
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 2 of 40</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE SUMMARY & DASHBOARD -->
  <div class="page">
    <h2 class="section-title">Executive Summary & Career Scorecard</h2>
    <p>${aiConsultantVerdict.executiveSummary}</p>
    
    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.overallCareerScore}</div><div class="score-label">Overall Career</div></div>
      <div class="score-card"><div class="score-val">${scores.leadershipScore}</div><div class="score-label">Leadership Potential</div></div>
      <div class="score-card"><div class="score-val">${scores.salaryGrowthScore}</div><div class="score-label">Salary Growth</div></div>
      <div class="score-card"><div class="score-val">${scores.promotionScore}</div><div class="score-label">Promotion Potential</div></div>
      <div class="score-card"><div class="score-val">${scores.privateJobScore}</div><div class="score-label">Private Corporate Job</div></div>
      <div class="score-card"><div class="score-val">${scores.governmentJobScore}</div><div class="score-label">Government Job</div></div>
      <div class="score-card"><div class="score-val">${scores.businessSuitabilityScore}</div><div class="score-label">Business & Trade</div></div>
      <div class="score-card"><div class="score-val">${scores.entrepreneurshipScore}</div><div class="score-label">Entrepreneurship</div></div>
      <div class="score-card"><div class="score-val">${scores.foreignCareerScore}</div><div class="score-label">Foreign Career</div></div>
    </div>

    <h3>Top 5 Career Role Matches</h3>
    <table>
      <tr><th>Rank</th><th>Career Role</th><th>Category</th><th>Match Score</th><th>Key Skills</th></tr>
      ${topCareerRoles.slice(0, 5).map((r, i) => `
        <tr>
          <td>#${i + 1}</td>
          <td><strong>${r.role}</strong></td>
          <td>${r.category}</td>
          <td><strong>${r.suitabilityScore}%</strong></td>
          <td>${r.keySkillsRequired.join(', ')}</td>
        </tr>
      `).join('')}
    </table>

    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 3 of 40</span></div>
  </div>

  <!-- PAGE 4: D10 DASHAMSA & AMATYAKARAKA -->
  <div class="page">
    <h2 class="section-title">D10 Dashamsa & Jaimini Amatyakaraka Analysis</h2>
    
    <div class="evidence-box">
      <strong>D10 Dashamsa Ascendant:</strong> ${d10Dashamsa.ascendantSign}<br/>
      <strong>D10 10th House Lord:</strong> ${d10Dashamsa.house10Lord} in ${d10Dashamsa.house10Sign}<br/>
      <strong>Jaimini Atmakaraka (Soul Planet):</strong> ${d10Dashamsa.atmakaraka}<br/>
      <strong>Jaimini Amatyakaraka (Career Planet):</strong> ${d10Dashamsa.amatyakaraka}<br/>
      <p style="margin-top:8px;">${d10Dashamsa.summary}</p>
    </div>

    <h3>Career Yogas & Raj Yogas Formed</h3>
    ${careerYogas.map(y => `
      <div style="background:#fffbeb; border-left:4px solid #b45309; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
        <strong>[${y.type.toUpperCase()}] ${y.name} (Strength: ${y.strength}%)</strong><br/>
        ${y.description}<br/>
        <em>Evidence:</em> ${y.evidence}
      </div>
    `).join('')}

    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 4 of 40</span></div>
  </div>

  <!-- PAGE 5: 12-MONTH CAREER FORECAST -->
  <div class="page">
    <h2 class="section-title">12-Month Detailed Career Forecast</h2>
    <table>
      <thead><tr><th>Month</th><th>Focus Area</th><th>Rating</th><th>Salary & Promotion Outlook</th></tr></thead>
      <tbody>
        ${monthlyForecast.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${m.focusArea}</td>
            <td>${'★'.repeat(m.careerRating)}</td>
            <td>${m.promotionOutlook} | ${m.salaryOutlook}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 5 of 40</span></div>
  </div>

  <!-- PAGE 6: AI CAREER COACH STRATEGY -->
  <div class="page">
    <h2 class="section-title">AI Career Coach — 4-Tier Execution Plan</h2>
    
    <h3>30-Day Immediate Action Plan</h3>
    <ul>${aiCareerCoach.day30Plan.map(p => `<li>${p}</li>`).join('')}</ul>

    <h3>90-Day Skill & Promotion Push</h3>
    <ul>${aiCareerCoach.day90Plan.map(p => `<li>${p}</li>`).join('')}</ul>

    <h3>1-Year High Growth Roadmap</h3>
    <ul>${aiCareerCoach.year1Plan.map(p => `<li>${p}</li>`).join('')}</ul>

    <h3>5-Year Executive Strategy</h3>
    <ul>${aiCareerCoach.year5Strategy.map(p => `<li>${p}</li>`).join('')}</ul>

    <h3>Recommended Certifications</h3>
    <p>${aiCareerCoach.recommendedCertifications.join(' | ')}</p>

    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 6 of 40</span></div>
  </div>

  <!-- PAGE 7: EVIDENCE ENGINE & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">Planetary Evidence Chain & Final Verdict</h2>
    
    <h3>Evidence Chain</h3>
    ${evidenceChain.map(e => `
      <div class="evidence-box">
        <strong>Claim:</strong> ${e.claim} (Confidence: ${e.confidencePercent}%)<br/>
        <strong>Astrological Basis:</strong> ${e.astrologicalBasis}<br/>
        <strong>Actionable Advice:</strong> ${e.actionableAdvice}
      </div>
    `).join('')}

    <h3>Final Astrological Verdict</h3>
    <p style="font-size: 11pt; line-height: 1.7; background:#fffbeb; border:1px solid #fef3c7; padding:16px; border-radius:8px;">
      ${aiConsultantVerdict.finalVerdict}
    </p>

    <div class="footer-note"><span>Career Analysis Report Pro</span><span>Page 40 of 40 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
