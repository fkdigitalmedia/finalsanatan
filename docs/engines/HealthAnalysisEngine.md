# Health Analysis Engine Architecture & Specification

## Overview
The **Health Analysis Engine** (`src/lib/health-analysis/`) is an enterprise-grade astrological processing module in the Sanatan Dharma Suite. It generates the **Health Analysis Report Pro**, an independent 30–40 page professional PDF report detailing astrological health tendencies, 1st/6th/8th/12th house alignments, Ayurvedic Tridosha body constitution (Vata/Pitta/Kapha), organ system tendencies, 12-month unique wellness forecasts, evidence chains, and preventive remedies.

> [!IMPORTANT]
> **Medical Safety First**: This engine strictly adheres to non-diagnostic guidelines. It never diagnoses medical diseases or claims medical certainty. All outputs are presented as astrological health tendencies, Ayurvedic constitution insights, preventive wellness guidelines, stress management, and lifestyle recommendations.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/health-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 10 precision health scores, body constitution, organ tendencies, remedies, evidence items, and output payload. |
| **`src/lib/health-analysis/health-engine.ts`** | Primary engine orchestrator. Computes 10 scores, 1st/6th/8th/12th houses, Sun/Moon/Mars/Saturn/Mercury/Jupiter/Venus/Rahu/Ketu, D6 Shashtamsha, 12-month forecast, evidence chains, and preventive remedies. |
| **`src/lib/health-analysis/pdf-builder.ts`** | Professional 34-section printable HTML/PDF generator with page breaks, header/footer page numbers, scorecards, non-diagnostic banner, and evidence cards. |
| **`src/routes/tools.health-analysis.tsx`** | Public interactive tool route (`/tools/health-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/health-analysis/HealthAnalysisDashboard.tsx`** | Web dashboard component with tabs for 10 Scores, Body & Houses, Lifestyle & Diet, 12-Month Forecast, Remedies & Luck, Evidence & Verdict. |
| **`src/components/admin/HealthAnalysisAdmin.tsx`** | Staff admin panel for controlling product status, retail price (₹249–₹499), discount rate, included subscription plans, and AI system prompts. |

---

## Technical Specifications & Data Contracts

### Primary Input Schema (`HealthAnalysisInput`)
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

### Calculated Precision Scores (`HealthScores`)
- **`overallHealth`**: Overall vitality & Prana index (0–100).
- **`mentalWellness`**: Mind & emotional peace (0–100).
- **`physicalVitality`**: Stamina & muscular vigor (0–100).
- **`stress`**: Autonomic nervous system stress load (0–100, higher = more stress).
- **`energy`**: Daily vitality & drive (0–100).
- **`immunity`**: Immune system resilience (0–100).
- **`recovery`**: Recuperation capacity (0–100).
- **`lifestyleBalance`**: Circadian routine alignment (0–100).
- **`sleep`**: Rest & subconscious sleep quality (0–100).
- **`emotionalStability`**: Psychological balance (0–100).

---

## Astrological & Ayurvedic Methodology

1. **Key Health Houses**:
   - **1st House (Lagna)**: Physical body, vitality, overall stamina, immunity foundation, and Prana.
   - **6th House (Roga Bhava)**: Digestive fire (Agni), daily routine resilience, immune defense, and acute wellness challenges.
   - **8th House (Ayur Bhava)**: Longevity, sudden energy shifts, joint mobility, and deep healing capacity.
   - **12th House (Vyaya Bhava)**: Sleep patterns, subconscious rest, hospitalizations/confinement, and metabolic elimination.

2. **Ayurvedic Body Constitution (Tridosha)**:
   - Evaluates Sun, Moon, and Lagna sign element distribution (Air/Ether = Vata, Fire = Pitta, Earth/Water = Kapha).

3. **12-Month Unique Wellness Forecast**:
   - Generates 12 distinct monthly forecast items covering focus area, rating (1-5 stars), diet advice, meditation guidance, and exercise tips with zero repeated text across months.

4. **Evidence Engine**:
   - Every major conclusion includes an explicit evidence item detailing claim, astrological basis, confidence percentage (e.g. 95%), and lifestyle advice.

---

## PDF Generation Pipeline (34 Sections)

The PDF generator (`pdf-builder.ts`) compiles 34 distinct structural sections:
1. Cover Page
2. Table of Contents & Non-Diagnostic Medical Disclaimer
3. Executive Summary & Health Dashboard
4. Overall Health Score
5. Body Constitution (Vata / Pitta / Kapha)
6. Physical Energy
7. Mental Wellness
8. Stress Analysis
9. Sleep Pattern
10. Digestive Wellness (Agni / 6th house)
11. Heart & Circulation Tendencies
12. Bone & Joint Tendencies
13. Skin & Hormonal Tendencies
14. Seasonal Wellness
15. Lifestyle Habits
16. Exercise Suggestions
17. Nutrition Guidance
18. Preventive Wellness
19. Monthly Wellness Forecast
20. Annual Wellness Timeline
21. Risk Periods
22. Recovery Periods
23. Energy Calendar
24. Meditation Suggestions
25. Yoga Recommendations
26. Pranayama
27. Ayurvedic Lifestyle Tips
28. Remedies
29. Lucky Elements
30. AI Health Coach
31. Evidence Engine
32. Action Plan
33. Final Verdict
34. Medical Disclaimer Footer

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/health-analysis`
- **Dashboard Report Category**: `"health-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'health-analysis'`)
