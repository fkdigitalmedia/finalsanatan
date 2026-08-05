# Career Analysis Engine v3.0 Enterprise Architecture & Redesign Specification

## Overview
The **Career Analysis Engine v3.0** (`src/lib/career-analysis/`) is SanatanTools' flagship commercial executive career intelligence module (target price ₹999 / $19.99). It generates the **Career Analysis Report Pro v3.0**, an enterprise 38-page publication-grade PDF report and interactive Web Dashboard.

### Core Features & Chapters
1. **Executive Dashboard**: Overall Potential (91/100), Leadership Index, Promotion Probability, Salary Growth, Business Potential, Global Potential, Top 5 Strengths & Watch Points.
2. **11 Career Score Gauges**: Leadership, Salary Growth, Confidence, Decision Making, Management, Innovation, Strategy, Execution, Learning, Work Ethic, Business Potential.
3. **Career DNA Profile**: 8-axis Competency Radar SVG chart + 6-attribute working/leadership breakdown.
4. **14 Domain Wise Suitability Matrix**: Rank, Domain, Score %, Income Potential, Growth Outlook, Astrological Basis.
5. **14-Part D10 Dashamsa Analysis**: Corporate/Govt/Entrepreneur/Foreign suitabilities + 9 D10 planet placements cards.
6. **10th House, 10th Lord & Jaimini Karakas**: Atmakaraka & Amatyakaraka degrees, signs & evidence.
7. **Top 25 Industry Suitability Rankings**: Industry, Score %, Confidence %, Reason & Evidence.
8. **Top 25 Career Role Rankings**: Role, Category, Score %, Astrological WHY.
9. **12-Month Unique Forecast**: 12 monthly cards with Focus, Salary, Best Dates & Caution Dates.
10. **10-Year Annual Timeline**: 10-Year Salary Growth Graph SVG + 10-Year Career Roadmap table.
11. **Explainable AI Evidence Engine**: 7-step flowchart node cards (Claim | Planet → House → Lord → D10 → Yoga → Dasha → Transit → Confidence).
12. **AI Career Coach Roadmap**: 30-Day, 90-Day, 1-Year, 5-Year Vision action plan.
13. **Career Opportunity Map**: Visual Map SVG + 6-vector growth matrix.
14. **Vedic Remedies & 14 Lucky Attributes**: Colors, Days, Numbers, Direction, Gemstones, Mantras, Temples.
15. **Final Astrological Verdict**: Overall score, executive recommendation, certification page.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/career-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 11 score gauges, 14-part D10 Dashamsa, 25 roles, 20 industries, 12-month forecasts, 10-year timeline, evidence engine, 6 SVG chart visuals, and payload. |
| **`src/lib/career-analysis/career-engine.ts`** | Core calculation engine computing 11 score gauges, D10 Dashamsa, Jaimini Karakas, 14 suitability domains, top 20 industries, top 25 career roles, 12-month forecast, 10-year timeline, and invoking SVG chart generators. |
| **`src/lib/career-analysis/charts-generator.ts`** | Generates 6 standalone SVG vector graphics (Planet Strength Radar, House Power Bar, Career Domain Wheel, Salary Growth Graph, Career DNA Radar, Opportunity Map). |
| **`src/lib/career-analysis/pdf/`** | Dedicated PDF Engine module: <br/> • `career-pdf-template.ts`: 28 CAREER_SECTION_PRESETS <br/> • `career-pdf-builder.ts`: 38-page Gold/Indigo A4 Executive PDF Builder <br/> • `career-pdf-renderer.ts`: PDF renderer <br/> • `career-pdf-export.ts`: `generateCareerPdf()` & `downloadCareerPdf()`. |
| **`src/routes/tools.career-analysis.tsx`** | Public interactive tool route (`/tools/career-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/career-analysis/CareerAnalysisDashboard.tsx`** | Interactive Web Dashboard component with score gauges, Why/Evidence tabs, 14-part D10 card, dynamic career/industry lists, and timelines. |

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/career-analysis`
- **Dashboard Report Category**: `"career-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'career-analysis'`)
- **PDF Engine**: Dedicated `src/lib/career-analysis/pdf/` with `printHtmlReport` bulletproof Blob URL/iframe print fallback.
