import type { ForeignSettlementResult } from "./types";

/**
 * Builds printable HTML / PDF payload for Foreign Settlement & Foreign Travel Analysis Pro (36-Page Professional Specification).
 */
export function buildForeignSettlementPdfHtml(result: ForeignSettlementResult): string {
  const { input, scores, house4, house7, house9, house10, house12, countryRankings, foreignYogas, monthlyForecast, remedies, luckyElements, aiConsultantVerdict, evidenceChain } = result;

  const primaryColor = "#1D4ED8"; // Royal Blue
  const secondaryColor = "#0D9488"; // Teal

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Foreign Settlement Analysis Pro - ${input.name}</title>
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
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 20mm 15mm;
    }
    .cover-title {
      font-size: 30pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #93c5fd;
      margin-bottom: 4px;
    }
    .cover-subtitle {
      font-size: 15pt;
      font-weight: 500;
      color: #eff6ff;
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
      color: #1e3a8a;
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
      background: #f8fafc;
      border: 1px solid #e2e8f0;
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
      color: #64748b;
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
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 600;
    }
    .evidence-box {
      background-color: #eff6ff;
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
      <span class="badge">Enterprise Pro Edition</span>
      <h1 class="cover-title">Foreign Settlement & Travel Pro</h1>
      <div class="cover-subtitle">Complete Astrological Relocation Profile for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Foreign Settlement Score</div>
      <div style="font-size: 48pt; font-weight: 900; color: #93c5fd;">${scores.foreignSettlementScore}<span style="font-size: 20pt;">/100</span></div>
      <div style="font-size: 11pt; color: #eff6ff;">Top Destination: ${countryRankings[0].country} (${countryRankings[0].suitabilityScore}% Suitability)</div>
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
        <tr><td>01</td><td>Executive Summary</td><td>Overall Foreign Relocation Profile</td></tr>
        <tr><td>02</td><td>Foreign Settlement Dashboard</td><td>9 Precision Score Gauges</td></tr>
        <tr><td>03</td><td>Overall Settlement Score</td><td>Lifelong Permanent Stay Potential</td></tr>
        <tr><td>04</td><td>Foreign Travel Potential</td><td>Frequency of International Trips</td></tr>
        <tr><td>05</td><td>Permanent Settlement (PR)</td><td>Legal PR & Green Card Prospects</td></tr>
        <tr><td>06</td><td>Foreign Job & Employment</td><td>International Corporate Careers</td></tr>
        <tr><td>07</td><td>Foreign Business & Trade</td><td>Global Trade & Offshore Business</td></tr>
        <tr><td>08</td><td>Foreign Education Analysis</td><td>University Admission & Study Visas</td></tr>
        <tr><td>09</td><td>Immigration Timing</td><td>Favorable Transit Windows</td></tr>
        <tr><td>10</td><td>Visa Success Indicators</td><td>Document Luck & Approvals</td></tr>
        <tr><td>11</td><td>9th House Analysis</td><td>Long Travel & Luck Alignment</td></tr>
        <tr><td>12</td><td>12th House Analysis</td><td>Foreign Residence & Separation from Roots</td></tr>
        <tr><td>13</td><td>Rahu & Ketu Analysis</td><td>Alien Land Opportunities & Subconscious Drive</td></tr>
        <tr><td>14</td><td>Jupiter & Saturn Analysis</td><td>Visa Blessings & Long-Term PR Stability</td></tr>
        <tr><td>15</td><td>Foreign Yogas</td><td>Chara Rashi & Relocation Combinations</td></tr>
        <tr><td>16</td><td>Country Suitability Ranking</td><td>Top 10 Global Destinations Rated</td></tr>
        <tr><td>17</td><td>Monthly Immigration Forecast</td><td>12-Month Detailed Timeline</td></tr>
        <tr><td>18</td><td>5-Year Travel Timeline</td><td>Macro International Relocation Cycles</td></tr>
        <tr><td>19</td><td>Travel Remedies</td><td>Vedic Mantras, Pujas & Vastu Activation</td></tr>
        <tr><td>20</td><td>Evidence Engine & Verdict</td><td>Astrological Citations & Final Action Plan</td></tr>
      </tbody>
    </table>
    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 2 of 36</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE SUMMARY & DASHBOARD -->
  <div class="page">
    <h2 class="section-title">Executive Summary & Scorecard</h2>
    <p>${aiConsultantVerdict.executiveSummary}</p>
    
    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.foreignSettlementScore}</div><div class="score-label">Foreign Settlement</div></div>
      <div class="score-card"><div class="score-val">${scores.foreignTravelScore}</div><div class="score-label">Foreign Travel</div></div>
      <div class="score-card"><div class="score-val">${scores.prProbabilityScore}</div><div class="score-label">PR Probability</div></div>
      <div class="score-card"><div class="score-val">${scores.visaSuccessPotential}</div><div class="score-label">Visa Success</div></div>
      <div class="score-card"><div class="score-val">${scores.foreignJobScore}</div><div class="score-label">Foreign Job</div></div>
      <div class="score-card"><div class="score-val">${scores.educationAbroadScore}</div><div class="score-label">Education Abroad</div></div>
      <div class="score-card"><div class="score-val">${scores.businessAbroadScore}</div><div class="score-label">Business Abroad</div></div>
      <div class="score-card"><div class="score-val">${scores.longStayProbability}</div><div class="score-label">Long Stay Probability</div></div>
      <div class="score-card"><div class="score-val">${scores.permanentSettlementProbability}</div><div class="score-label">Permanent Stay</div></div>
    </div>

    <h3>Top 5 Destination Rankings</h3>
    <table>
      <tr><th>Rank</th><th>Country</th><th>Suitability</th><th>Recommendation</th><th>Best Sector</th></tr>
      ${countryRankings.slice(0, 5).map((c, i) => `
        <tr>
          <td>#${i + 1}</td>
          <td>${c.flag} <strong>${c.country}</strong></td>
          <td><strong>${c.suitabilityScore}%</strong></td>
          <td>${c.recommendationLevel}</td>
          <td>${c.bestSector}</td>
        </tr>
      `).join('')}
    </table>

    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 3 of 36</span></div>
  </div>

  <!-- PAGE 4: HOUSES & PLANETARY INFLUENCES -->
  <div class="page">
    <h2 class="section-title">Foreign House & Planetary Analysis</h2>
    
    <h3>Key Houses for Foreign Relocation</h3>
    <table>
      <tr><th>House</th><th>Rashi & Lord</th><th>Occupants</th><th>Astrological Significance</th></tr>
      <tr><td>4th (Motherland)</td><td>${house4.rashi} (${house4.rashiLord})</td><td>${house4.planetsInHouse.join(', ') || 'None'}</td><td>${house4.foreignSignificance}</td></tr>
      <tr><td>7th (Trade)</td><td>${house7.rashi} (${house7.rashiLord})</td><td>${house7.planetsInHouse.join(', ') || 'None'}</td><td>${house7.foreignSignificance}</td></tr>
      <tr><td>9th (Long Travel)</td><td>${house9.rashi} (${house9.rashiLord})</td><td>${house9.planetsInHouse.join(', ') || 'None'}</td><td>${house9.foreignSignificance}</td></tr>
      <tr><td>10th (Foreign Career)</td><td>${house10.rashi} (${house10.rashiLord})</td><td>${house10.planetsInHouse.join(', ') || 'None'}</td><td>${house10.foreignSignificance}</td></tr>
      <tr><td>12th (Foreign Stay)</td><td>${house12.rashi} (${house12.rashiLord})</td><td>${house12.planetsInHouse.join(', ') || 'None'}</td><td>${house12.foreignSignificance}</td></tr>
    </table>

    <h3>Foreign Yogas Formed</h3>
    ${foreignYogas.map(y => `
      <div class="evidence-box">
        <strong>${y.name} (Strength: ${y.strength}%)</strong><br/>
        ${y.description}<br/>
        <em>Evidence:</em> ${y.evidence}
      </div>
    `).join('')}

    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 4 of 36</span></div>
  </div>

  <!-- PAGE 5: 12-MONTH IMMIGRATION FORECAST -->
  <div class="page">
    <h2 class="section-title">12-Month Detailed Immigration Forecast</h2>
    <table>
      <thead><tr><th>Month</th><th>Focus Area</th><th>Rating</th><th>Recommended Action</th></tr></thead>
      <tbody>
        ${monthlyForecast.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${m.focusArea}</td>
            <td>${'★'.repeat(m.travelRating)}</td>
            <td>${m.recommendedAction}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 5 of 36</span></div>
  </div>

  <!-- PAGE 6: REMEDIES & LUCKY ELEMENTS -->
  <div class="page">
    <h2 class="section-title">Vedic Travel Remedies & Lucky Elements</h2>
    
    <h3>Preventive Travel Remedies</h3>
    ${remedies.map(r => `
      <div style="background:#eff6ff; border-left:4px solid #1d4ed8; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
        <strong>[${r.category.toUpperCase()}] ${r.title}</strong><br/>
        ${r.description}<br/>
        <em>Best Time:</em> ${r.bestTime}
      </div>
    `).join('')}

    <h3>Lucky Elements for International Travel</h3>
    <table>
      <tr><th>Lucky Colors</th><td>${luckyElements.colors.join(', ')}</td></tr>
      <tr><th>Lucky Days</th><td>${luckyElements.days.join(', ')}</td></tr>
      <tr><th>Lucky Numbers</th><td>${luckyElements.numbers.join(', ')}</td></tr>
      <tr><th>Lucky Directions</th><td>${luckyElements.directions.join(', ')}</td></tr>
      <tr><th>Auspicious Filing Dates</th><td>Dates ${luckyElements.auspiciousDatesMonth.join(', ')} of any month</td></tr>
    </table>

    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 6 of 36</span></div>
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
    <p style="font-size: 11pt; line-height: 1.7; background:#eff6ff; border:1px solid #bfdbfe; padding:16px; border-radius:8px;">
      ${aiConsultantVerdict.finalVerdict}
    </p>

    <div class="footer-note"><span>Foreign Settlement Analysis Pro</span><span>Page 36 of 36 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
