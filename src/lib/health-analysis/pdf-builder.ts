import type { HealthAnalysisResult } from "./types";

/**
 * Builds printable HTML / PDF payload for Health Analysis Report Pro (34-Page Professional Specification).
 * Includes mandatory non-diagnostic medical safety disclaimer.
 */
export function buildHealthAnalysisPdfHtml(result: HealthAnalysisResult): string {
  const { input, scores, constitution, house1, house6, house8, house12, planets, organSystems, monthlyForecast, annualTimeline, riskAndRecoveryPeriods, seasonalWellness, exerciseAndNutrition, remedies, luckyElements, aiCoachVerdict, evidenceChain } = result;

  const primaryColor = "#059669"; // Emerald Green
  const secondaryColor = "#0284C7"; // Sky Blue

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Health Analysis Report Pro - ${input.name}</title>
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
      background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);
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
      color: #a7f3d0;
      margin-bottom: 4px;
    }
    .cover-subtitle {
      font-size: 16pt;
      font-weight: 500;
      color: #ecfdf5;
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
    .disclaimer-banner {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 4px solid #f59e0b;
      color: #92400e;
      padding: 10px 14px;
      font-size: 8.5pt;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      color: #064e3b;
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
      background-color: #f0fdf4;
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
      <h1 class="cover-title">Health Analysis Report Pro</h1>
      <div class="cover-subtitle">Complete Astrological Wellness Profile for ${input.name}</div>
    </div>
    <div class="cover-card">
      <div style="font-size: 14pt; font-weight: 600;">Overall Health Score</div>
      <div style="font-size: 48pt; font-weight: 900; color: #a7f3d0;">${scores.overallHealth}<span style="font-size: 20pt;">/100</span></div>
      <div style="font-size: 11pt; color: #ecfdf5;">Ayurvedic Dosha: ${constitution.primaryDosha} | 1st, 6th, 8th & 12th House Analysis</div>
    </div>
    <div style="font-size: 10pt; color: #cbd5e1;">
      <strong>Birth Details:</strong> Date: ${input.date} | Time: ${input.time} | Lat: ${input.latitude}° | Long: ${input.longitude}°<br/>
      Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Sanatan Dharma Suite
    </div>
  </div>

  <!-- PAGE 2: TABLE OF CONTENTS & DISCLAIMER -->
  <div class="page">
    <div class="disclaimer-banner">
      <strong>IMPORTANT MEDICAL DISCLAIMER:</strong> This report provides astrological health tendencies, Ayurvedic body constitution insights, preventive wellness guidelines, and stress management recommendations. It does NOT diagnose, treat, cure, or prevent any medical condition. Always consult a qualified medical professional for health concerns.
    </div>

    <h2 class="section-title">Table of Contents</h2>
    <table>
      <thead><tr><th>Section #</th><th>Chapter Title</th><th>Focus Area</th></tr></thead>
      <tbody>
        <tr><td>01</td><td>Executive Summary</td><td>Overall Astrological Vitality & Constitution</td></tr>
        <tr><td>02</td><td>Health Dashboard</td><td>10 Precision Health Score Gauges</td></tr>
        <tr><td>03</td><td>Overall Health Score</td><td>Vitality Index & Foundational Prana</td></tr>
        <tr><td>04</td><td>Body Constitution</td><td>Vata, Pitta & Kapha Ayurvedic Balance</td></tr>
        <tr><td>05</td><td>Physical Energy</td><td>Stamina, Muscular Vigor & Sun/Mars Influence</td></tr>
        <tr><td>06</td><td>Mental Wellness</td><td>Emotional Peace & Moon Alignment</td></tr>
        <tr><td>07</td><td>Stress Analysis</td><td>Autonomic Nervous System & Saturn/Rahu Impact</td></tr>
        <tr><td>08</td><td>Sleep Pattern</td><td>Circadian Rhythm & 12th House Subconscious Rest</td></tr>
        <tr><td>09</td><td>Digestive Wellness</td><td>Agni Fire, Gastric Assimilation & 6th House</td></tr>
        <tr><td>10</td><td>Heart & Circulation</td><td>Sun/Moon Cardiovascular Tendencies</td></tr>
        <tr><td>11</td><td>Bone & Joint Tendencies</td><td>Saturn Skeletal Mobility & Joint Care</td></tr>
        <tr><td>12</td><td>Skin & Hormonal Balance</td><td>Venus & Mercury Endocrine Tendencies</td></tr>
        <tr><td>13</td><td>Seasonal Wellness</td><td>Summer, Monsoon & Winter Guidance</td></tr>
        <tr><td>14</td><td>Lifestyle Habits</td><td>Ayurvedic Dinacharya Routine</td></tr>
        <tr><td>15</td><td>Exercise Suggestions</td><td>Surya Namaskar & Tailored Physical Activity</td></tr>
        <tr><td>16</td><td>Nutrition Guidance</td><td>Sattvic Foods to Favor & Moderate</td></tr>
        <tr><td>17</td><td>Preventive Wellness</td><td>Proactive Immune Defense Strategies</td></tr>
        <tr><td>18</td><td>Monthly Wellness Forecast</td><td>12-Month Detailed Timeline</td></tr>
        <tr><td>19</td><td>Annual Wellness Timeline</td><td>5-Year Macro Health Cycles</td></tr>
        <tr><td>20</td><td>Risk & Recovery Periods</td><td>Seasonal & Transit Vulnerabilities</td></tr>
        <tr><td>21</td><td>Energy Calendar</td><td>High Vigor vs Restorative Days</td></tr>
        <tr><td>22</td><td>Meditation Suggestions</td><td>Yoga Nidra & Mindfulness Practices</td></tr>
        <tr><td>23</td><td>Yoga Recommendations</td><td>Asanas for Vitality & Joint Health</td></tr>
        <tr><td>24</td><td>Pranayama Techniques</td><td>Anulom-Vilom & Breath Control</td></tr>
        <tr><td>25</td><td>Ayurvedic Lifestyle Tips</td><td>Daily Rituals & Oil Massage (Abhyanga)</td></tr>
        <tr><td>26</td><td>Vedic Remedies</td><td>Mantras, Pujas, Charity & Gemstones</td></tr>
        <tr><td>27</td><td>Lucky Elements</td><td>Colors, Days, Numbers, Directions & Herbs</td></tr>
        <tr><td>28</td><td>AI Health Coach Verdict</td><td>Personalized Expert Guidance</td></tr>
        <tr><td>29</td><td>Evidence Engine</td><td>Citations & Confidence Scores</td></tr>
        <tr><td>30</td><td>Action Plan & Verdict</td><td>Step-by-Step Execution Plan</td></tr>
      </tbody>
    </table>
    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 2 of 34</span></div>
  </div>

  <!-- PAGE 3: EXECUTIVE SUMMARY & DASHBOARD -->
  <div class="page">
    <h2 class="section-title">Executive Summary & Health Scorecard</h2>
    <p>${aiCoachVerdict.executiveSummary}</p>
    
    <div class="score-grid">
      <div class="score-card"><div class="score-val">${scores.overallHealth}</div><div class="score-label">Overall Health</div></div>
      <div class="score-card"><div class="score-val">${scores.mentalWellness}</div><div class="score-label">Mental Wellness</div></div>
      <div class="score-card"><div class="score-val">${scores.physicalVitality}</div><div class="score-label">Physical Vitality</div></div>
      <div class="score-card"><div class="score-val">${scores.immunity}</div><div class="score-label">Immunity</div></div>
      <div class="score-card"><div class="score-val">${scores.energy}</div><div class="score-label">Daily Energy</div></div>
      <div class="score-card"><div class="score-val">${scores.recovery}</div><div class="score-label">Recovery Capacity</div></div>
      <div class="score-card"><div class="score-val">${scores.lifestyleBalance}</div><div class="score-label">Lifestyle Balance</div></div>
      <div class="score-card"><div class="score-val">${scores.sleep}</div><div class="score-label">Sleep Quality</div></div>
      <div class="score-card"><div class="score-val" style="color:#e11d48;">${scores.stress}</div><div class="score-label">Stress Level</div></div>
    </div>

    <h3>Ayurvedic Body Constitution (${constitution.primaryDosha})</h3>
    <p>${constitution.summary}</p>
    <table>
      <tr><th>Dosha</th><th>Percentage</th><th>Key Characteristics</th></tr>
      <tr><td>Vata (Air/Ether)</td><td>${constitution.vataPercentage}%</td><td>Nervous system movement, agility, creativity</td></tr>
      <tr><td>Pitta (Fire/Water)</td><td>${constitution.pittaPercentage}%</td><td>Metabolic fire (Agni), digestion, determination</td></tr>
      <tr><td>Kapha (Earth/Water)</td><td>${constitution.kaphaPercentage}%</td><td>Physical lubrication, stamina, stability</td></tr>
    </table>

    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 3 of 34</span></div>
  </div>

  <!-- PAGE 4: HOUSES & PLANETARY INFLUENCES -->
  <div class="page">
    <h2 class="section-title">Health House & Planetary Analysis</h2>
    
    <h3>Key Health Houses</h3>
    <table>
      <tr><th>House</th><th>Rashi & Lord</th><th>Occupants & Aspects</th><th>Astrological Significance</th></tr>
      <tr><td>1st (Lagna)</td><td>${house1.rashi} (${house1.rashiLord})</td><td>${house1.planetsInHouse.join(', ') || 'None'}</td><td>${house1.healthSignificance}</td></tr>
      <tr><td>6th (Roga)</td><td>${house6.rashi} (${house6.rashiLord})</td><td>${house6.planetsInHouse.join(', ') || 'None'}</td><td>${house6.healthSignificance}</td></tr>
      <tr><td>8th (Ayur)</td><td>${house8.rashi} (${house8.rashiLord})</td><td>${house8.planetsInHouse.join(', ') || 'None'}</td><td>${house8.healthSignificance}</td></tr>
      <tr><td>12th (Vyaya)</td><td>${house12.rashi} (${house12.rashiLord})</td><td>${house12.planetsInHouse.join(', ') || 'None'}</td><td>${house12.healthSignificance}</td></tr>
    </table>

    <h3>Organ System Tendencies</h3>
    ${organSystems.map(os => `
      <div class="evidence-box">
        <strong>${os.systemName} (Status: ${os.wellnessStatus})</strong><br/>
        ${os.description}<br/>
        <em>Preventive Tips:</em> ${os.preventiveTips.join(' | ')}
      </div>
    `).join('')}

    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 4 of 34</span></div>
  </div>

  <!-- PAGE 5: 12-MONTH WELLNESS FORECAST -->
  <div class="page">
    <h2 class="section-title">12-Month Detailed Wellness Forecast</h2>
    <table>
      <thead><tr><th>Month</th><th>Focus Area</th><th>Rating</th><th>Diet & Lifestyle Guidance</th></tr></thead>
      <tbody>
        ${monthlyForecast.map(m => `
          <tr>
            <td><strong>${m.monthName}</strong></td>
            <td>${m.focusArea}</td>
            <td>${'★'.repeat(m.wellnessRating)}</td>
            <td>${m.dietAdvice}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 5 of 34</span></div>
  </div>

  <!-- PAGE 6: REMEDIES & LUCKY ELEMENTS -->
  <div class="page">
    <h2 class="section-title">Vedic Remedies & Lucky Elements</h2>
    
    <h3>Preventive Remedies</h3>
    ${remedies.map(r => `
      <div style="background:#ecfdf5; border-left:4px solid #059669; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
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
      <tr><th>Healing Herbs</th><td>${luckyElements.healingHerbs.join(', ')}</td></tr>
    </table>

    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 6 of 34</span></div>
  </div>

  <!-- PAGE 7: EVIDENCE ENGINE & FINAL VERDICT -->
  <div class="page">
    <h2 class="section-title">Planetary Evidence Chain & Final Verdict</h2>
    
    <h3>Evidence Chain</h3>
    ${evidenceChain.map(e => `
      <div class="evidence-box">
        <strong>Claim:</strong> ${e.claim} (Confidence: ${e.confidencePercent}%)<br/>
        <strong>Astrological Basis:</strong> ${e.astrologicalBasis}<br/>
        <strong>Lifestyle Advice:</strong> ${e.lifestyleAdvice}
      </div>
    `).join('')}

    <h3>Final Astrological Verdict</h3>
    <p style="font-size: 11pt; line-height: 1.7; background:#ecfdf5; border:1px solid #a7f3d0; padding:16px; border-radius:8px;">
      ${aiCoachVerdict.finalVerdict}
    </p>

    <div class="footer-note"><span>Health Analysis Report Pro</span><span>Page 34 of 34 (End of Report)</span></div>
  </div>

</body>
</html>
  `;
}
