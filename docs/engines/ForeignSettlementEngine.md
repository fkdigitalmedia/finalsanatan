# Foreign Settlement & Travel Engine Architecture & Specification

## Overview
The **Foreign Settlement Engine** (`src/lib/foreign-settlement/`) is an enterprise-grade astrological processing module in the Sanatan Dharma Suite. It generates the **Foreign Settlement & Foreign Travel Analysis Report Pro**, an independent 30–40 page professional PDF report detailing foreign travel potential, PR probability, 4th/7th/9th/10th/12th house alignments, top 10 global country suitability rankings, 12-month unique immigration forecasts, evidence chains, and Vedic travel remedies.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/foreign-settlement/types.ts`** | Complete TypeScript interface contracts for inputs, 9 precision foreign scores, country suitability items, remedies, evidence items, and output payload. |
| **`src/lib/foreign-settlement/foreign-engine.ts`** | Primary engine orchestrator. Computes 9 scores, 4th/7th/9th/10th/12th houses, Rahu/Ketu/Moon/Jupiter/Saturn/Mercury, country ranking engine, 12-month forecast, evidence chains, and travel remedies. |
| **`src/lib/foreign-settlement/pdf-builder.ts`** | Professional 36-section printable HTML/PDF generator with page breaks, header/footer page numbers, scorecards, country tables, and evidence cards. |
| **`src/routes/tools.foreign-settlement-analysis.tsx`** | Public interactive tool route (`/tools/foreign-settlement-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/foreign-settlement/ForeignSettlementDashboard.tsx`** | Web dashboard component with tabs for 9 Scores, Country Rankings, Houses & Planets, 12-Month Forecast, Remedies & Luck, Evidence & Verdict. |
| **`src/components/admin/ForeignSettlementAdmin.tsx`** | Staff admin panel for controlling product status, retail price (₹299–₹499), discount rate, included subscription plans, and AI system prompts. |

---

## Technical Specifications & Data Contracts

### Primary Input Schema (`ForeignSettlementInput`)
```typescript
export interface BirthInput {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  latitude: number;
  longitude: number;
  timezone: string; // e.g. "Asia/Kolkata"
  place?: string;
  language?: string;
}
```

### Calculated Precision Scores (`ForeignScores`)
- **`foreignSettlementScore`**: Permanent overseas settlement potential (0–100).
- **`foreignTravelScore`**: Frequency of international short and long trips (0–100).
- **`educationAbroadScore`**: Higher education & university study potential abroad (0–100).
- **`foreignJobScore`**: Foreign employment & multinational corporate opportunities (0–100).
- **`businessAbroadScore`**: Foreign trade & offshore business potential (0–100).
- **`prProbabilityScore`**: Permanent Residence (PR) / Green Card approval probability (0–100).
- **`visaSuccessPotential`**: Visa document approval probability (0–100).
- **`longStayProbability`**: Multi-year residence probability (0–100).
- **`permanentSettlementProbability`**: Lifelong overseas residence probability (0–100).

---

## Astrological Methodology & Country Ranking Engine

1. **Key Foreign Relocation Houses**:
   - **4th House (Motherland & Roots)**: Domestic residence vs separation from birthplace.
   - **7th House (Foreign Trade & Deals)**: International trade, foreign business partnerships, public relations abroad.
   - **9th House (Long Travel & Fortune)**: Long-distance travel, higher education abroad, foreign luck, visa approvals.
   - **10th House (Foreign Career & Postings)**: International employment, foreign corporate assignments, professional reputation abroad.
   - **12th House (Foreign Residence & Land)**: Permanent stay in foreign lands, expenditure abroad, detachment from native roots.

2. **Top 10 Country Suitability Ranking**:
   - Evaluates astrological compatibility with point-based immigration systems for top destinations:
     1. Canada 🇨🇦
     2. Australia 🇦🇺
     3. United States (USA) 🇺🇸
     4. United Kingdom (UK) 🇬🇧
     5. Germany / EU 🇩🇪
     6. Dubai (UAE) 🇦🇪
     7. Singapore 🇸🇬
     8. Japan 🇯🇵
     9. New Zealand 🇳🇿
     10. Europe (Nordics / Netherlands) 🇪🇺

3. **12-Month Unique Immigration Forecast**:
   - Generates 12 distinct monthly forecast items covering focus area, travel rating (1-5 stars), visa outlook, job outlook, education outlook, and recommended action with zero repeated text across months.

4. **Evidence Engine**:
   - Every major conclusion includes an explicit evidence item detailing claim, astrological basis, confidence percentage (e.g. 95%), and actionable advice.

---

## PDF Generation Pipeline (36 Sections)

The PDF generator (`pdf-builder.ts`) compiles 36 distinct structural sections:
1. Premium Cover Page
2. Table of Contents
3. Executive Summary & Dashboard
4. Foreign Settlement Dashboard
5. Overall Settlement Score
6. Foreign Travel Potential
7. Permanent Settlement Potential
8. Foreign Job Analysis
9. Foreign Business Analysis
10. Foreign Education Analysis
11. Immigration Timing
12. Visa Success Indicators
13. 9th House Analysis
14. 12th House Analysis
15. Rahu Analysis
16. Ketu Analysis
17. Jupiter Analysis
18. Saturn Analysis
19. Moon Analysis
20. Foreign Yogas
21. Challenges & Delays
22. Country Suitability Overview
23. Best Continents
24. Best Countries Ranking Table
25. Annual Timeline (5 Years)
26. Monthly Timeline (12 Months unique)
27. Best Travel Periods
28. Risk Periods
29. Foreign Income Potential
30. Long-Term Settlement Outlook
31. Remedies
32. Lucky Directions
33. AI Foreign Consultant
34. Evidence Engine
35. Action Plan
36. Final Verdict

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/foreign-settlement-analysis`
- **Dashboard Report Category**: `"foreign-settlement-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'foreign-settlement-analysis'`)
