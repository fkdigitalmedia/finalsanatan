# Marriage Analysis Engine Architecture & Specification

## Overview
The **Marriage Analysis Engine** (`src/lib/marriage-analysis/`) is an enterprise-grade astrological processing module in the Sanatan Dharma Suite. It generates the **Marriage Analysis Report Pro**, an independent 30–40 page professional PDF report detailing marital quality, 7th house alignments, D9 Navamsha, Jaimini Darakaraka, Upapada Lagna (UL), Love vs. Arranged marriage feasibility, 12-month unique relationship forecasts, evidence chains, and Vedic remedies.

> [!NOTE]
> This engine reuses astronomical positions, house matrices, and divisional charts from `src/lib/kundli/engine.ts` without modifying the core Janam Kundli or Kundli Matching modules.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/marriage-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 9 precision scores, spouse profile, remedies, evidence items, and output payload. |
| **`src/lib/marriage-analysis/marriage-engine.ts`** | Primary engine orchestrator. Computes 9 scores, 7th House & Lord analysis, Venus, Jupiter, Moon, Mars, Darakaraka, Upapada Lagna, 12-month unique forecast, evidence chains, and remedies. |
| **`src/lib/marriage-analysis/pdf-builder.ts`** | Professional 34-section printable HTML/PDF generator with page breaks, header/footer page numbers, scorecards, and evidence cards. |
| **`src/routes/tools.marriage-analysis.tsx`** | Public interactive tool route (`/tools/marriage-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/marriage-analysis/MarriageAnalysisDashboard.tsx`** | Web dashboard component with tabs for Scorecard, 7th House/Planets, Spouse Profile, 12-Month Forecast, Remedies & Luck, Evidence & Verdict. |
| **`src/components/admin/MarriageAnalysisAdmin.tsx`** | Staff admin panel for controlling product status, retail price (₹249–₹499), discount rate, included subscription plans, and AI system prompts. |

---

## Technical Specifications & Data Contracts

### Primary Input Schema (`MarriageAnalysisInput` / `BirthInput`)
```typescript
export interface BirthInput {
  name: string;
  gender: 'male' | 'female';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  latitude: number;
  longitude: number;
  timezone: string; // e.g. "Asia/Kolkata"
  placeName?: string;
}
```

### Calculated Precision Scores (`MarriageScores`)
- **`marriageScore`**: Overall marriage quality index (0–100).
- **`relationshipScore`**: Emotional & romantic bonding (0–100).
- **`loveMarriageScore`**: Feasibility of love marriage (0–100).
- **`arrangedMarriageScore`**: Feasibility of arranged marriage (0–100).
- **`marriageDelayScore`**: Risk/probability of delay in marriage (0–100).
- **`spouseCompatibilityScore`**: Partner alignment index (0–100).
- **`communicationScore`**: Dialogue & intellectual harmony (0–100).
- **`familyHarmonyScore`**: In-laws and family acceptance (0–100).
- **`longTermStabilityScore`**: Marital longevity & endurance (0–100).

---

## Astrological Analysis Methodology

1. **7th House & 7th Lord**:
   - Evaluates sign placed in 7th house, ruling planet, occupants, and aspects (from Lagna, 3rd/10th Saturn, 4th/8th Mars, 5th/9th Jupiter).
   - Evaluates 7th Lord house placement, dignity (Exalted, Own, Friendly, Neutral, Enemy, Debilitated), combustion, and retrograde status.

2. **Jaimini Darakaraka**:
   - Identifies non-node planet with the lowest degree in its sign ($0^\circ - 30^\circ$).
   - Derives primary spouse physical traits, career tendencies, and temperamental nature.

3. **Upapada Lagna (UL)**:
   - Calculates the Upapada Lagna sign and the 2nd house from UL (marriage sustenance).

4. **12-Month Unique Relationship Forecast**:
   - Generates 12 distinct monthly forecast items covering focus area, rating (1-5 stars), communication guidance, travel probability, and finance advice with zero repeated text across months.

5. **Evidence Engine**:
   - Every major conclusion includes an explicit evidence item detailing the claim, astrological basis (planet, house, rashi, yoga, dosha), confidence percentage (e.g. 94%), and actionable insight.

---

## PDF Generation Pipeline (34 Sections)

The PDF generator (`pdf-builder.ts`) compiles 34 distinct structural sections:
1. Cover Page
2. Table of Contents
3. Executive Summary
4. Marriage Readiness
5. Marriage Scorecard
6. 7th House Analysis
7. 7th Lord Analysis
8. Venus (Shukra) Analysis
9. Jupiter (Guru) Analysis
10. Moon (Chandra) Analysis
11. Mars (Mangal) & Manglik Analysis
12. Navamsa D9 Sub-Chart
13. Jaimini Darakaraka
14. Upapada Lagna (UL)
15. Marriage Yogas
16. Marriage Doshas
17. Love vs. Arranged Marriage
18. Marriage Timing Windows
19. Spouse Profile & Nature
20. Spouse Profession & Wealth
21. Relationship Behaviour
22. Communication Style
23. Family Life & In-Laws
24. Children & Lineage
25. Core Strengths
26. Key Challenges
27. 12-Month Relationship Forecast
28. 5-Year Annual Timeline
29. Vedic Remedies
30. Lucky Elements
31. AI Marriage Coach Verdict
32. Evidence Engine
33. Action Plan
34. Final Verdict

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/marriage-analysis`
- **Dashboard Report Category**: `"marriage-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'marriage-analysis'`)
