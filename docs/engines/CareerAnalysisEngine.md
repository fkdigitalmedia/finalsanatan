# Career Analysis Engine v2.0 Architecture & Specification

## Overview
The **Career Analysis Engine v2.0** (`src/lib/career-analysis/`) is SanatanTools' enterprise commercial-grade career intelligence module. It generates the **Career Analysis Report Pro v2.0**, an independent 35–45 page commercial-grade PDF report detailing executive drive, D10 Dashamsa divisional chart alignment, Jaimini Atmakaraka & Amatyakaraka, 14 suitability domain ratings, 20 top industry rankings, 25 top career role rankings, 12-month unique career forecasts, 10-year timelines, 5-tier AI Career Coach strategies, evidence chains, and Vedic career remedies.

---

## File Structure & Module Responsibilities

| File | Purpose / Responsibility |
| :--- | :--- |
| **`src/lib/career-analysis/types.ts`** | Complete TypeScript interface contracts for inputs, 11 precision career scores, 14 domain suitabilities, top 20 industry items, top 25 career items, 12-month forecasts, 10-year timelines, risk analyses, remedies, evidence items, AI coach plan, and output payload. |
| **`src/lib/career-analysis/career-engine.ts`** | Primary engine orchestrator. Computes 11 scores, 1st/2nd/5th/6th/9th/10th/11th houses, D10 Dashamsa, Atmakaraka, Amatyakaraka, 14 suitability domains, top 20 industry rankings, top 25 career role rankings, 12-month forecast, 10-year timeline, evidence chains, and remedies. |
| **`src/lib/career-analysis/pdf-builder.ts`** | Professional 28-section printable HTML/PDF generator with luxury cover, executive scorecards, industry tables, career ranking tables, timeline blocks, evidence cards, and zero generic text/placeholders. |
| **`src/routes/tools.career-analysis.tsx`** | Public interactive tool route (`/tools/career-analysis`) supporting birth detail inputs, instant calculations, interactive dashboard, PDF download, saving to `/reports`, and sharing. |
| **`src/components/career-analysis/CareerAnalysisDashboard.tsx`** | Web dashboard component with 6 tabs: Executive Dashboard, 14 Domains & Roles, D10 & Yogas, Timelines, Risks & Remedies, Evidence & AI Coach. |
| **`src/components/admin/CareerAnalysisAdmin.tsx`** | Staff admin panel for controlling product status, retail price (₹299–₹499), discount rate, included subscription plans, and AI system prompts. |

---

## 28 Sections Breakdown

1. Luxury Cover
2. Table of Contents
3. Executive Dashboard (11 Core Scores & Risk/Opportunity Indices)
4. Executive AI Summary
5. Career DNA (Working Style, Leadership, Communication, Decision Making, Learning, Behaviour)
6. 14 Career Suitability Domains (Government, Private, Business, Freelancing, Startup, Consulting, Teaching, Creative, Tech, Finance, Medical, Legal, Digital, Entrepreneurship)
7. D10 Dashamsa Deep Analysis
8. 10th House Analysis
9. 10th Lord Analysis
10. Jaimini Atmakaraka
11. Jaimini Amatyakaraka
12. Career Yogas (Raj, Dhana, Bhadra, Vipreet, Neecha Bhanga)
13. Planet Career Analysis (9 Planets)
14. House Career Analysis (2nd, 6th, 10th, 11th, 5th, 9th)
15. Promotion Analysis
16. Salary Growth Analysis
17. Foreign Career & Remote Work
18. Top 20 Industry Rankings
19. Top 25 Career Role Rankings
20. 12-Month Unique Forecast
21. 10-Year Annual Timeline
22. Career Risk Analysis (Office Politics, Instability, Layoffs, Burnout)
23. Career Opportunity Analysis
24. Career Remedies (Temple, Mantra, Donation, Gemstone, Lifestyle, Professional Habits)
25. Lucky Elements (Colours, Days, Numbers, Direction)
26. Evidence Engine (Planet, House, D10, Yoga, Dasha, Transit, Confidence %)
27. AI Career Coach (5-Tier Plan)
28. Final Verdict

---

## Verification & API Endpoints

- **Public Tool Route**: `/tools/career-analysis`
- **Dashboard Report Category**: `"career-analysis"` in `/reports`
- **Database Table**: `pdf_reports` (column `report = 'career-analysis'`)
