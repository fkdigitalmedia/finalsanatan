# Career Analysis Engine v4.0 Enterprise Architecture & Redesign Specification

## Overview
The **Career Analysis Engine v4.0** (`src/lib/career-analysis/`) is SanatanTools' flagship commercial executive career intelligence module (target tier ₹1999–₹4999). It generates the **Career Analysis Report Pro v4.0**, a 35-page publication-grade PDF report and interactive Web Dashboard inspired by McKinsey, BCG, and Bloomberg executive reports.

### Key Enterprise Features & Enhancements in v4.0
1. **Eliminated Excess White Space**: 85–95% printable area utilization on every page with zero half-empty pages.
2. **12 Standalone Vector SVG Visualizations**:
   - Graha Planetary Strength Radar SVG
   - Career House Power Index Bar SVG
   - Career Domain Alignment Matrix SVG
   - 10-Year Salary Growth & Earning Trajectory SVG
   - Career DNA Profile 8-Axis Competency Radar SVG
   - Career Opportunity Map Vector SVG
   - Promotion Probability Gauge SVG
   - 9 Graha Planetary Strength Wheel SVG
   - Career Progression Roadmap SVG
   - Career Risk & Stability Heatmap SVG
   - Executive Career Decision Matrix SVG
   - Executive Career SWOT Analysis Matrix SVG
3. **Graphical Evidence Engine (8-Node Flow)**:
   - Flowchart reasoning cards: `Planet → House → Aspect → Yoga → Current Dasha → Transit → Confidence Score → Final Conclusion`.
4. **Salary Timeline & Milestone Visualization**:
   - Milestone Cards (Current → Expected Raise → Promotion Window → Executive Position → Peak Income).
5. **Deeply Personalized Astrological Strategy (Explicit "WHY")**:
   - Recommendations explicitly explain WHY by referencing Mahadasha, Antardasha, Transit, Age, Career Stage, Planets, and Yogas.
6. **8 Executive Callout Insight Boxes**:
   - CEO Insight, Promotion Alert, High Income Window, Leadership Opportunity, Risk Alert, Foreign Window, Business Expansion, Hidden Potential.
7. **McKinsey / BCG / Bloomberg Luxury Executive Aesthetics**:
   - Gold Amber (`#d97706`) and Deep Navy (`#1e1b4b`) executive theme.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/career-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 11 score gauges, 14-part D10 Dashamsa, 25 roles, 20 industries, 12-month forecasts, 10-year timeline, evidence engine, 12 SVG chart visual fields, and output payload. |
| **`src/lib/career-analysis/career-engine.ts`** | Core calculation engine computing 11 score gauges, D10 Dashamsa, Jaimini Karakas, 14 suitability domains, top 20 industries, top 25 career roles, 12-month forecast, 10-year timeline, and invoking SVG chart generators. |
| **`src/lib/career-analysis/charts-generator.ts`** | Generates 12 standalone SVG vector graphics for charts, heatmaps, decision matrix, SWOT, and gauges. |
| **`src/lib/career-analysis/pdf/`** | Dedicated PDF Engine module: <br/> • `career-pdf-template.ts`: 28 CAREER_SECTION_PRESETS <br/> • `career-pdf-builder.ts`: 35-page Gold/Indigo A4 Executive PDF Builder <br/> • `career-pdf-renderer.ts`: PDF renderer <br/> • `career-pdf-export.ts`: `generateCareerPdf()` & `downloadCareerPdf()`. |
| **`src/routes/tools.career-analysis.tsx`** | Public interactive tool route (`/tools/career-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/career-analysis/CareerAnalysisDashboard.tsx`** | Interactive Web Dashboard component with score gauges, Why/Evidence tabs, 14-part D10 card, dynamic career/industry lists, and timelines. |

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/career-analysis`
- **Dashboard Report Category**: `"career-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'career-analysis'`)
- **PDF Engine**: Dedicated `src/lib/career-analysis/pdf/` with `printHtmlReport` bulletproof Blob URL/iframe print fallback.
