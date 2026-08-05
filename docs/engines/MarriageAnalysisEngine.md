# Marriage Analysis Engine v2.0 Architecture & Specification (Commercial Release)

## Overview
The **Marriage Analysis Engine v2.0** (`src/lib/marriage-analysis/`) is SanatanTools' flagship enterprise commercial spousal intelligence module (target quality 9.8/10). It generates the **Marriage Analysis Report Pro v2.0**, an independent 34-page publication-grade PDF report and interactive Web Dashboard detailing:
- 6 Score Cards with Strength, Weakness, Reason, Evidence, and Recommendation.
- Deep 7th House & 7th Lord Analysis (Lord Placement, Dignity, Benefic/Malefic aspects, Navamsa D9 support).
- Dedicated Venus (Love & Romance) & Jupiter (Wisdom & Grace) Chapters.
- Expanded Mars & Manglik Dosha Chapter (Severity, Cancellation rules applied, Real impact, Conflict style, Temperament).
- 18-Point Comprehensive Spouse Profile (Appearance, Height, Body type, Voice, Profession, Income, Lifestyle, Romance, Finances, Communication, Children, Family background).
- 21 New Enterprise Chapters (Red Flags, Green Flags, Love Language, Conflict Resolution, Trust Index, Financial & In-Law Compatibility, Child Birth Timing, Foreign Spouse, Delay Causes, Navamsa Heatmap, 5-Year Roadmap).
- Structured Remedy Cards (Purpose, Why, Procedure, Best Day/Time, Duration, Benefit — zero developer placeholders).
- Visual Vector SVG Charts (Marriage Radar, House Power Bar, Compatibility Wheel, 5-Year Roadmap Graph).

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/marriage-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 6 score cards with breakdowns, expanded 7th House, Venus, Jupiter, Manglik, 18-point spouse profile, 21 new chapters, remedy cards, lucky elements, SVG visual chart strings, and output payload. |
| **`src/lib/marriage-analysis/marriage-engine.ts`** | Core engine orchestrator. Computes 6 score cards, expanded 7th House, Venus, Jupiter, Manglik dosha, 18-point spouse profile, 21 new chapters, 12-month unique forecast, 10-year timeline, evidence chains, structured remedy cards, and invokes SVG chart generators. |
| **`src/lib/marriage-analysis/charts-generator.ts`** | Standalone SVG vector chart generator producing inline vector graphics for Marriage Radar, House Power Bar, Compatibility Wheel, and 5-Year Roadmap Graph. |
| **`src/lib/marriage-analysis/pdf/`** | Dedicated, self-contained PDF Engine module: <br/> • `marriage-pdf-template.ts`: 34-chapter MARRIAGE_SECTION_PRESETS <br/> • `marriage-pdf-builder.ts`: Publication-grade A4 printable HTML layout compactor (34 pages) <br/> • `marriage-pdf-renderer.ts`: PDF renderer <br/> • `marriage-pdf-export.ts`: `generateMarriagePdf()` & `downloadMarriagePdf()`. |
| **`src/routes/tools.marriage-analysis.tsx`** | Public interactive tool route (`/tools/marriage-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/marriage-analysis/MarriageAnalysisDashboard.tsx`** | Web dashboard component with score cards, 7th House & planets, 18-point spouse profile, 12-month forecast, remedy cards, and evidence chain. |

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/marriage-analysis`
- **Dashboard Report Category**: `"marriage-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'marriage-analysis'`)
- **PDF Engine**: Dedicated `src/lib/marriage-analysis/pdf/` uncoupled from `default-templates.ts`.
