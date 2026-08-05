# Career Analysis Engine Architecture & Specification

## Overview
The **Career Analysis Engine** (`src/lib/career-analysis/`) is SanatanTools' flagship astrological processing module. It generates the **Career Analysis Report Pro**, an independent 35–45 page commercial-grade PDF report detailing executive drive, D10 Dashamsa divisional chart alignment, Jaimini Amatyakaraka, Govt vs Private Job suitability, 30 top career role rankings, 17 industry suitabilities, 12-month unique career forecasts, 4-tier AI Career Coach strategies, evidence chains, and Vedic career remedies.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/career-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 11 precision career scores, top 30 career role items, 17 industry items, remedies, evidence items, AI coach plan, and output payload. |
| **`src/lib/career-analysis/career-engine.ts`** | Primary engine orchestrator. Computes 11 scores, 1st/2nd/5th/6th/9th/10th/11th houses, D10 Dashamsa, Atmakaraka, Amatyakaraka, top 30 career role rankings, 17 industries, 12-month forecast, evidence chains, and career remedies. |
| **`src/lib/career-analysis/pdf-builder.ts`** | Professional 40-section printable HTML/PDF generator with page breaks, header/footer page numbers, scorecards, career ranking tables, timeline blocks, and evidence cards. |
| **`src/routes/tools.career-analysis.tsx`** | Public interactive tool route (`/tools/career-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/career-analysis/CareerAnalysisDashboard.tsx`** | Web dashboard component with tabs for 11 Scores, Top 30 Roles & Industries, D10 & Planets, 12-Month Forecast, AI Career Coach, Evidence & Verdict. |
| **`src/components/admin/CareerAnalysisAdmin.tsx`** | Staff admin panel for controlling product status, retail price (₹299–₹499), discount rate, included subscription plans, and AI system prompts. |

---

## Technical Specifications & Data Contracts

### Primary Input Schema (`CareerAnalysisInput`)
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

### Calculated Precision Scores (`CareerScores`)
- **`overallCareerScore`**: Overall career potential & executive drive (0–100).
- **`governmentJobScore`**: Civil services & public sector competitive exam success (0–100).
- **`privateJobScore`**: Corporate MNC & private sector employment (0–100).
- **`businessSuitabilityScore`**: Entrepreneurship, trade & independent enterprise (0–100).
- **`leadershipScore`**: Executive authority, command & decision-making (0–100).
- **`promotionScore`**: Rank advancement & elevation probability (0–100).
- **`salaryGrowthScore`**: Compensation growth & wealth accumulation (0–100).
- **`managementPotential`**: Team management & administrative oversight (0–100).
- **`entrepreneurshipScore`**: Startup founding & risk-taking capacity (0–100).
- **`foreignCareerScore`**: Global employment & international postings (0–100).
- **`careerStabilityScore`**: Job retention & long-term stability (0–100).

---

## Astrological Methodology & Career Ranking Engine

1. **D10 Dashamsa & Jaimini Karakas**:
   - Derives the 10th divisional chart (D10 Dashamsa) governing executive status and professional achievements.
   - Computes Jaimini **Atmakaraka** (highest degree planet) and Jaimini **Amatyakaraka** (2nd highest degree planet, governing career minister role).

2. **Top 30 Career Role Rankings**:
   - Evaluates 30 modern high-growth professions against D10, Amatyakaraka, and 10th House alignments:
     - AI Engineer, Data Scientist, Prompt Engineer, Software Engineer, Cyber Security, Cloud Engineer, Product Manager, Startup Founder, Doctor, Lawyer, CA, Govt IAS/IPS Officer, Investment Banker, Business Owner, Professor, YouTuber/Creator, Marketing Director, Sales Lead, UI/UX Designer, Management Consultant, Freelancer, Agency Owner, Manufacturing Ops Head, Real Estate Developer, Agritech Operator, Film/Media Director, Quant Trader, HR Director, Logistics Lead, Clean Energy Lead.

3. **Top 17 Industry Suitability Rankings**:
   - Evaluates market outlook (Surging Growth / Stable High Growth) and ruling planet strengths across AI, Tech, Healthcare, Finance, Education, Real Estate, E-commerce, Marketing, Manufacturing, Construction, FMCG, Hospitality, Import-Export, Logistics, Media, Agritech, Clean Energy.

4. **4-Tier AI Career Coach Execution Plan**:
   - **30-Day Plan**: Immediate portfolio audit, LinkedIn optimization, and 1-on-1 stakeholder alignment.
   - **90-Day Plan**: Specialized certification completion, high-visibility project presentation, and recruiter outreach.
   - **1-Year Plan**: 25%+ compensation increment or higher-tier transition, whitepaper publishing, team leadership.
   - **5-Year Strategy**: C-suite rank (VP/CTO/CEO/MD) or founding a ₹10Cr+ revenue business, multi-stream passive income.

---

## PDF Generation Pipeline (40 Sections)

The PDF generator (`pdf-builder.ts`) compiles 40 distinct structural sections:
1. Cover Page
2. Table of Contents
3. Executive Career Summary
4. Career Dashboard
5. Overall Career Score
6. Career DNA
7. Profession Type
8. Government vs Private Job
9. Business vs Job
10. D10 Dashamsa Analysis
11. Atmakaraka & Amatyakaraka
12. 10th House Analysis
13. 10th Lord Analysis
14. 6th House Analysis
15. 2nd House Analysis
16. 11th House Analysis
17. Planet-wise Career Impact
18. Career Yogas
19. Raj Yogas
20. Dhana Yogas
21. Promotion Potential
22. Salary Growth
23. Foreign Career
24. Leadership Analysis
25. Team Management
26. Entrepreneurship
27. Best Industries (17 Ranked)
28. Best Career Fields (Top 30 Roles Table)
29. Best Age for Success & Timing Windows
30. Monthly Career Timeline (12 Months unique)
31. Annual Career Timeline (5 Years)
32. Risk Periods & Precautionary Windows
33. Opportunity Windows
34. AI Career Coach 4-Tier Plan (30d, 90d, 1y, 5y)
35. Recommended Certifications & Skill Development
36. Career Remedies
37. Lucky Elements
38. AI Career Coach & Evidence Engine
39. Action Plan
40. Final Verdict

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/career-analysis`
- **Dashboard Report Category**: `"career-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'career-analysis'`)
