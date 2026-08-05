# Master Life Blueprint Engine Architecture & Specification

## Overview
The **Master Life Blueprint Engine** (`src/lib/master-blueprint/`) is SanatanTools' ultimate flagship decision intelligence module. It generates the **AI Master Life Blueprint**, an independent 80–120 page publication-grade PDF report and interactive web dashboard.

Rather than duplicating or concatenating individual reports, the Master Engine acts as a **cross-domain reasoning system**. It synthesizes outputs from Janam Kundli Pro, Career Analysis, Business Analysis, Marriage Analysis, Health Analysis, Foreign Relocation, Varshphal, Numerology, and Muhurat into one integrated life strategy.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/master-blueprint/types.ts`** | Complete TypeScript interface contracts for inputs, 14 executive life scores, 7 life timeline stages, 10-year forecasts, 8 AI decisions, action plans, evidence items, and output payload. |
| **`src/lib/master-blueprint/blueprint-engine.ts`** | Primary engine orchestrator. Invokes underlying engines (`generateKundli`, `computeCareerAnalysis`, `computeMarriageAnalysis`, `computeHealthAnalysis`, `computeForeignSettlementAnalysis`, `calculateVarshphal`), derives 14 life scores, performs cross-domain synthesis, evaluates 8 AI life decisions, builds 7-stage life timeline, 10-year forecast, 7-tier action plan, and evidence chain. |
| **`src/lib/master-blueprint/pdf-builder.ts`** | Printable 40-chapter (80–120 page) HTML/PDF generator with luxury cover, certificate of analysis, executive scorecards, decision cards, timeline tables, and zero generic text. |
| **`src/routes/tools.master-life-blueprint.tsx`** | Public interactive tool route (`/tools/master-life-blueprint`) supporting birth detail inputs, instant calculation, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/master-blueprint/MasterBlueprintDashboard.tsx`** | Web dashboard component with tabs for 14 Scores, AI Decision Engine, Life Timeline, 10-Year Forecast, 7-Tier Action Plan, Evidence & Verdict. |
| **`src/components/admin/MasterBlueprintAdmin.tsx`** | Staff admin panel for controlling flagship status, retail price (₹999–₹1999), discount rate, included subscription plans (Lifetime VIP, Enterprise), AI model selection, and system prompts. |

---

## Technical Specifications & Data Contracts

### Primary Input Schema (`MasterBlueprintInput`)
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

### Calculated 14 Executive Life Scores (`ExecutiveLifeScores`)
1. **`overallLifeScore`**: Overall life potential & harmony (0–100).
2. **`careerScore`**: Professional growth, status & rank (0–100).
3. **`businessScore`**: Entrepreneurship & commercial trade (0–100).
4. **`marriageScore`**: Relationship harmony & spouse compatibility (0–100).
5. **`financeScore`**: Wealth accumulation & liquidity (0–100).
6. **`healthScore`**: Immunity, Ayurvedic constitution & longevity (0–100).
7. **`foreignScore`**: Overseas relocation & PR suitability (0–100).
8. **`educationScore`**: Academic & intellectual mastery (0–100).
9. **`propertyScore`**: Real estate & vehicle asset acquisition (0–100).
10. **`spiritualScore`**: Inner peace & spiritual realization (0–100).
11. **`leadershipScore`**: Executive authority & team command (0–100).
12. **`successProbability`**: Cumulative life success index (0–100).
13. **`riskIndex`**: Risk vulnerability index (0–100).
14. **`opportunityIndex`**: Growth opportunity density (0–100).

---

## AI Decision Engine (8 Practical Life Questions)

Evaluates 8 core practical decisions with `YES`, `NO`, or `CONDITIONAL` verdicts, astrological evidence, confidence percentages, and recommended timing:
1. **Job Change**: Should I change my job or seek a new role?
2. **Business Launch**: Should I start an independent business or startup?
3. **Investing**: Should I make major long-term financial investments?
4. **Property Purchase**: Should I buy real estate or property?
5. **Relocation**: Should I relocate to a new city or state?
6. **Foreign Relocation**: Should I move or settle abroad (PR / Work Visa)?
7. **Marriage Timing**: Should I get married or finalize life partnership?
8. **Higher Education**: Should I pursue higher education or advanced certification?

---

## 7-Stage Age-Wise Life Timeline & 10-Year Forecast

- **Life Stages**:
  - `0-10`: Foundation & Early Learning
  - `10-20`: Academic Mastery & Identity Formation
  - `20-30`: Career Launch, Marriage & Foreign Entry
  - `30-40`: Executive Elevation & Asset Building
  - `40-50`: Enterprise Leadership & Global Status
  - `50-60`: Legacy Building & Strategic Advisory
  - `60+`: Spiritual Fulfillment & Elder Wisdom
- **10-Year Forecast**: Year-by-year outlook for Career, Business, Finance, Marriage, Health, Foreign Relocation, Property, Opportunities, and Cautions.

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/master-life-blueprint`
- **Dashboard Report Category**: `"master-life-blueprint"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'master-life-blueprint'`)
