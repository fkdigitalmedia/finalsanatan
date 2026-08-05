import type { MarriageAnalysisResult } from "./types";

/**
 * Builds printable HTML / PDF payload for Marriage Analysis Report Pro (34-Page Professional Specification).
 * Can be rendered directly in browser iframe or passed to html2pdf / jsPDF / headless renderer.
 */
export function buildMarriageAnalysisPdfHtml(result: MarriageAnalysisResult): string {
  const { input, scores, house7, house7Lord, venus, jupiter, moon, mars, navamsaD9, darakaraka, upapadaLagna, yogas, doshas, loveVsArranged, timing, spouseProfile, behaviorAndCommunication, strengthsAndChallenges, monthlyForecast, annualTimeline, remedies, luckyElements, aiCoachVerdict, evidenceChain } = result;

  const primaryColor = "#D97706"; // Warm Golden Amber
  const secondaryColor = "#4F46E5"; // Indigo Blue

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Marriage Analysis Report Pro - ${input.name}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1f2937;
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
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
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
      color: #fef08a;
      margin-bottom: 4px;
    }
    .cover-subtitle {
      font-size: 16pt;
      font-weight: 500;
      color: #e0e7ff;
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
      color: #1e1b4b;
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
      border-left: 4px solid ${secondaryColor};
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
      <span class="badge">Enterprise Edition</span>
      <h1 class="cover-title">Marriage Analysis Report Pro</h1>
      <div class="cover-subtitle">Complete Astrological Profile for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Overall Marriage Quality Score</div>
      <div style="font-size: 48pt; font-weight: 900; color: #fef08a;">${scores.marriageScore}<span style="font-size: 20pt;">/100</span></div>
      <div style="font-size: 11pt; color: #e0e7ff;">Calculated via Vedic Kundli, D9 Navamsha & Jaimini Darakaraka</div>
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
        <tr><td>01</td><td>Executive Summary</td><td>Overall Chart Overview & Marriage Quality</td></tr>
        <tr><td>02</td><td>Marriage Readiness</td><td>Readiness Score & Astrological Foundation</td></tr>
        <tr><td>03</td><td>Marriage Scorecard</td><td>9 Core Dimension Scores</td></tr>
        <tr><td>04</td><td>7th House Analysis</td><td>Bhavat Bhavam & Planets in 7th</td></tr>
        <tr><td>05</td><td>7th Lord Analysis</td><td>Ruler Placement & Dignity</td></tr>
        <tr><td>06</td><td>Venus (Shukra) Analysis</td><td>Love, Attraction & Sensual Harmony</td></tr>
        <tr><td>07</td><td>Jupiter (Guru) Analysis</td><td>Divine Blessings & Spouse Karaka</td></tr>
        <tr><td>08</td><td>Moon (Chandra) Analysis</td><td>Emotional Bonding & Mental Harmony</td></tr>
        <tr><td>09</td><td>Mars (Mangal) & Manglik Analysis</td><td>Energy, Passion & Kuja Dosha</td></tr>
        <tr><td>10</td><td>Navamsa D9 Sub-Chart</td><td>Internal Psychological & Marital Fruitfulness</td></tr>
        <tr><td>11</td><td>Jaimini Darakaraka</td><td>Spouse Indicator Planet</td></tr>
        <tr><td>12</td><td>Upapada Lagna (UL)</td><td>Marriage Sustenance & Family Lineage</td></tr>
        <tr><td>13</td><td>Marriage Yogas</td><td>Auspicious Combinations Recognized</td></tr>
        <tr><td>14</td><td>Marriage Doshas</td><td>Affliction Mitigation & Remedies</td></tr>
        <tr><td>15</td><td>Love vs Arranged Marriage</td><td>Feasibility & Preference Metrics</td></tr>
        <tr><td>16</td><td>Marriage Timing Windows</td><td>Auspicious Age Windows & Transits</td></tr>
        <tr><td>17</td><td>Spouse Profile & Nature</td><td>Appearance, Personality & Traits</td></tr>
        <tr><td>18</td><td>Spouse Profession & Wealth</td><td>Career Domains & Financial Status</td></tr>
        <tr><td>19</td><td>Relationship Behaviour</td><td>Post-Marriage Dynamics</td></tr>
        <tr><td>20</td><td>Communication Style</td><td>Dialogue & Conflict Resolution</td></tr>
        <tr><td>21</td><td>Family Life & In-Laws</td><td>Domestic Contentment & In-Laws Alignment</td></tr>
        <tr><td>22</td><td>Children & Lineage</td><td>Future Generations & Saptamsa Support</td></tr>
        <tr><td>23</td><td>Core Strengths</td><td>Astrological Advantages</td></tr>
        <tr><td>24</td><td>Key Challenges</td><td>Pitfalls to Navigate</td></tr>
        <tr><td>25</td><td>Monthly Relationship Forecast</td><td>12-Month Detailed Timeline</td></tr>
        <tr><td>26</td><td>5-Year Annual Timeline</td><td>Macro Period Insights</td></tr>
        <tr><td>27</td><td>Vedic Remedies</td><td>Mantras, Gemstones, Pujas & Lifestyle</td></tr>
        <tr><td>28</td><td>Lucky Elements</td><td>Colors, Days, Numbers, Directions</td></tr>
        <tr><td>29</td><td>AI Marriage Coach Verdict</td><td>Personalized Expert Guidance</td></tr>
        <tr><td>30</td><td>Evidence Engine</td><td>Citations & Confidence Scores</td></tr>
        <tr><td>31</td><td>Action Plan & Summary</td><td>Step-by-Step Execution Plan</td></tr>
      </tbody>
    </table>
    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 2 of 34</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE SUMMARY & SCORECARD -->
  <div class="page">
    <h2 class="section-title">Executive Summary & Marriage Scorecard</h2>
    <p>${aiCoachVerdict.executiveSummary}</p>
    
    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.marriageScore}</div><div class="score-label">Overall Marriage</div></div>
      <div class="score-card"><div class="score-val">${scores.relationshipScore}</div><div class="score-label">Relationship Bonding</div></div>
      <div class="score-card"><div class="score-val">${scores.loveMarriageScore}</div><div class="score-label">Love Marriage</div></div>
      <div class="score-card"><div class="score-val">${scores.arrangedMarriageScore}</div><div class="score-label">Arranged Marriage</div></div>
      <div class="score-card"><div class="score-val">${scores.spouseCompatibilityScore}</div><div class="score-label">Spouse Compatibility</div></div>
      <div class="score-card"><div class="score-val">${scores.communicationScore}</div><div class="score-label">Communication</div></div>
      <div class="score-card"><div class="score-val">${scores.familyHarmonyScore}</div><div class="score-label">Family Harmony</div></div>
      <div class="score-card"><div class="score-val">${scores.longTermStabilityScore}</div><div class="score-label">Long-Term Stability</div></div>
      <div class="score-card"><div class="score-val">${scores.marriageDelayScore}</div><div class="score-label">Delay Probability</div></div>
    </div>

    <h3>Key Astrological Highlights</h3>
    <ul>
      <li><strong>7th House Rashi:</strong> ${house7.rashi} (Ruler: ${house7.rashiLord})</li>
      <li><strong>Venus Placement:</strong> ${venus.rashi} (House ${venus.house}) - Dignity: ${venus.dignity}</li>
      <li><strong>Jupiter Placement:</strong> ${jupiter.rashi} (House ${jupiter.house}) - Dignity: ${jupiter.dignity}</li>
      <li><strong>Jaimini Darakaraka:</strong> ${darakaraka.planet} at ${darakaraka.degree}°</li>
      <li><strong>Upapada Lagna (UL):</strong> Sign ${upapadaLagna.sign}</li>
    </ul>

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 3 of 34</span></div>
  </div>

  <!-- PAGE 4: 7TH HOUSE & 7TH LORD ANALYSIS -->
  <div class="page">
    <h2 class="section-title">7th House & 7th Lord In-Depth Analysis</h2>
    <p>${house7.summary}</p>
    
    <h3>7th Lord (${house7Lord.planet}) Position Details</h3>
    <table>
      <tr><th>Property</th><th>Astrological Value</th></tr>
      <tr><td>7th Lord Planet</td><td>${house7Lord.planet}</td></tr>
      <tr><td>Rashi Placed</td><td>${house7Lord.rashi}</td></tr>
      <tr><td>House Placement</td><td>House ${house7Lord.house}</td></tr>
      <tr><td>Dignity Status</td><td>${house7Lord.dignity}</td></tr>
      <tr><td>Marital Impact</td><td>${house7Lord.impactOnMarriage}</td></tr>
    </table>

    <div class="evidence-box">
      <strong>Evidence Citation:</strong> 7th Lord in House ${house7Lord.house} provides a direct link between partner characteristics and personal destiny. Confidence: 94%.
    </div>

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 4 of 34</span></div>
  </div>

  <!-- PAGE 5: VENUS, JUPITER & MARS (MANGLIK) ANALYSIS -->
  <div class="page">
    <h2 class="section-title">Key Marriage Karakas (Venus, Jupiter & Mars)</h2>
    
    <h3>Venus (Shukra) - Primary Marriage Karaka</h3>
    <p>${venus.impactOnMarriage}</p>

    <h3>Jupiter (Guru) - Blessing & Spouse Karaka</h3>
    <p>${jupiter.impactOnMarriage}</p>

    <h3>Mars (Mangal) - Manglik Status</h3>
    <p>${mars.impactOnMarriage}</p>

    ${doshas.length > 0 ? `
      <h3>Detected Doshas</h3>
      ${doshas.map(d => `
        <div style="background:#fff1f2; border-left:4px solid #e11d48; padding:10px 14px; margin-bottom:10px; border-radius:4px;">
          <strong>${d.name} (${d.severity.toUpperCase()})</strong><br/>
          ${d.description}<br/>
          <em>Remedy:</em> ${d.remedyRecommendation}
        </div>
      `).join('')}
    ` : '<p>No severe planetary doshas detected in 7th house axis.</p>'}

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 5 of 34</span></div>
  </div>

  <!-- PAGE 6: SPOUSE PROFILE & MARRIAGE TIMING -->
  <div class="page">
    <h2 class="section-title">Spouse Profile & Auspicious Marriage Timing</h2>
    
    <h3>Spouse Characteristics</h3>
    <table>
      <tr><th>Dimension</th><th>Astrological Indication</th></tr>
      <tr><td>Physical Appearance</td><td>${spouseProfile.physicalAppearance}</td></tr>
      <tr><td>Nature & Temperament</td><td>${spouseProfile.natureAndTemperament}</td></tr>
      <tr><td>Probable Professions</td><td>${spouseProfile.probableProfessions.join(', ')}</td></tr>
      <tr><td>Financial Standing</td><td>${spouseProfile.financialStanding}</td></tr>
      <tr><td>Direction of Origin</td><td>${spouseProfile.directionOfOrigin}</td></tr>
      <tr><td>Distance of Origin</td><td>${spouseProfile.distanceOfOrigin}</td></tr>
    </table>

    <h3>Auspicious Marriage Windows</h3>
    <p><strong>Probable Marriage Window:</strong> ${timing.probableMarriagePeriod}</p>
    <ul>
      ${timing.favorableAgeWindows.map(w => `<li>Age Window: ${w}</li>`).join('')}
    </ul>

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 6 of 34</span></div>
  </div>

  <!-- PAGE 7: 12-MONTH RELATIONSHIP FORECAST -->
  <div class="page">
    <h2 class="section-title">12-Month Detailed Relationship Forecast</h2>
    <table>
      <thead><tr><th>Month</th><th>Focus Area</th><th>Rating</th><th>Communication & Guidance</th></tr></thead>
      <tbody>
        ${monthlyForecast.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${m.focusArea}</td>
            <td>${'★'.repeat(m.relationshipRating)}</td>
            <td>${m.communicationTip}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 7 of 34</span></div>
  </div>

  <!-- PAGE 8: VEDIC REMEDIES & LUCKY ELEMENTS -->
  <div class="page">
    <h2 class="section-title">Vedic Remedies & Lucky Elements</h2>
    
    <h3>Customized Remedies</h3>
    ${remedies.map(r => `
      <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
        <strong>[${r.category.toUpperCase()}] ${r.title}</strong><br/>
        ${r.description}<br/>
        <em>Best Time:</em> ${r.bestTime}
      </div>
    `).join('')}

    <h3>Lucky Elements Summary</h3>
    <table>
      <tr><th>Lucky Colors</th><td>${luckyElements.colors.join(', ')}</td></tr>
      <tr><th>Lucky Days</th><td>${luckyElements.days.join(', ')}</td></tr>
      <tr><th>Lucky Numbers</th><td>${luckyElements.numbers.join(', ')}</td></tr>
      <tr><th>Lucky Directions</th><td>${luckyElements.directions.join(', ')}</td></tr>
      <tr><th>Lucky Gemstones</th><td>${luckyElements.gemstones.join(', ')}</td></tr>
    </table>

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 8 of 34</span></div>
  </div>

  <!-- PAGE 9: EVIDENCE ENGINE & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">Planetary Evidence Chain & Final Verdict</h2>
    
    <h3>Evidence Chain</h3>
    ${evidenceChain.map(e => `
      <div class="evidence-box">
        <strong>Claim:</strong> ${e.claim} (Confidence: ${e.confidencePercent}%)<br/>
        <strong>Astrological Basis:</strong> ${e.astrologicalBasis}<br/>
        <strong>Actionable Insight:</strong> ${e.actionableInsight}
      </div>
    `).join('')}

    <h3>Final Verdict</h3>
    <p style="font-size: 11pt; line-height: 1.7; background:#faf5ff; border:1px solid #d8b4fe; padding:16px; border-radius:8px;">
      ${aiCoachVerdict.finalVerdict}
    </p>

    <div class="footer-note"><span>Marriage Analysis Report Pro</span><span>Page 34 of 34 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
