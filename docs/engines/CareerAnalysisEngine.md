# Career Analysis Engine v3.0 Architecture & Specification (Commercial Release)

## Overview
The **Career Analysis Engine v3.0** (`src/lib/career-analysis/`) is SanatanTools' flagship enterprise commercial career intelligence module (target quality 9.8/10). It generates the **Career Analysis Report Pro v3.0**, an independent 32–40 page publication-grade PDF report and interactive Web Dashboard detailing:
- 11 Score Gauges with Why, Evidence, and Interpretation breakdowns.
- 14-Part Expanded D10 Dashamsa Divisional Analysis (Lagna, Lagnesh, 10th Lord, 9 Planets in D10, D10 Yogas, Weaknesses, Hidden Potential, Corporate/Govt/Entrepreneur/Foreign suitability scores).
- Dynamic 25 Career Role Rankings & 20 Industry Rankings (varying dynamically per unique horoscope).
- 100% Unique 12-Month Transit Gochar Forecast with Best & Worst Dates.
- 100% Unique 10-Year Annual Timeline.
- Visual SVG Vector Charts (Planet Strength Radar, House Strength Bar, Career Wheel, Salary Growth Graph).
- Evidence Engine with confidence percentages (94%-96%).
- 5-Tier AI Career Coach Action Roadmap.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/career-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 11 score gauges with reasons/evidence/interpretations, 14-part D10 Dashamsa, dynamic 20 industries, dynamic 25 career roles, 12-month transit forecasts with best/worst dates, 10-year timelines, remedies, evidence items, AI coach plan, SVG visual chart strings, and output payload. |
| **`src/lib/career-analysis/career-engine.ts`** | Core engine orchestrator. Computes 11 score gauges, D10 Dashamsa 14-part analysis, Jaimini Karakas (Atmakaraka & Amatyakaraka), 14 suitability domains, top 20 dynamic industries, top 25 dynamic career roles, 12-month unique forecast with transit dates, 10-year timeline, evidence chains, remedies, and invokes SVG chart generators. |
| **`src/lib/career-analysis/charts-generator.ts`** | Standalone SVG vector chart generator producing inline vector graphics for Planet Strength Radar, House Power Bar, Career Domain Wheel, and Salary Growth Trajectory. |
| **`src/lib/career-analysis/pdf/`** | Dedicated, self-contained PDF Engine module: <br/> • `career-pdf-template.ts`: 28-chapter CAREER_SECTION_PRESETS <br/> • `career-pdf-builder.ts`: Publication-grade A4 printable HTML layout compactor (32–40 pages) <br/> • `career-pdf-renderer.ts`: PDF renderer <br/> • `career-pdf-export.ts`: `generateCareerPdf()` & `downloadCareerPdf()`. |
| **`src/routes/tools.career-analysis.tsx`** | Public interactive tool route (`/tools/career-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/career-analysis/CareerAnalysisDashboard.tsx`** | Web dashboard component with score gauges, Why/Evidence tabs, 14-part D10 card, dynamic career/industry lists, and timelines. |

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/career-analysis`
- **Dashboard Report Category**: `"career-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'career-analysis'`)
- **PDF Engine**: Dedicated `src/lib/career-analysis/pdf/` uncoupled from `default-templates.ts`.
