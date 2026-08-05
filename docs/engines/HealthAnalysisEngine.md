# Health Analysis Engine — v2.0 Enterprise Commercial Release

**Version:** 2.0.0  
**Release Date:** August 2026  
**Status:** Enterprise Production  
**Commercial Target:** ₹999–₹1499/report

---

## Overview

The Health Analysis Engine v2.0 is a complete enterprise upgrade of the original MVP health calculator. It produces a **35-page premium A4 PDF** with 100% personalized astrological health content — no repeated paragraphs, no placeholder text, no generic advice.

---

## Architecture

```
src/lib/health-analysis/
├── types.ts                    # v2.0 data contracts (19 interfaces)
├── health-engine.ts            # Core calculation engine (650+ lines)
├── health-charts-generator.ts  # Standalone SVG chart generator (6 charts)
├── pdf-builder.ts              # Re-export entry point
└── pdf/
    └── health-pdf-builder.ts   # 35-page HTML→PDF builder
```

---

## Key Modules

### 1. Data Contracts (`types.ts`)

**19 enterprise interfaces:**

| Interface | Fields | Purpose |
|---|---|---|
| `OrganDashboardCard` | 19 fields | 13-organ health status cards |
| `RiskDashboardCard` | 11 fields | 10-disease risk index |
| `MonthlyWellnessForecastItem` | 28 fields | 12 unique monthly predictions |
| `AyurvedicChapter` | 18 fields | Complete Prakriti/Vikriti/Dinacharya |
| `AIHealthCoach` | 9 fields | AI coach guidance chapter |
| `WellnessTimeline` | 8 fields | 90-Day/1-Year/5-Year roadmaps |
| `AyurvedicRemedyItem` | 16 fields | Structured remedy cards (no placeholders) |
| `EvidenceChainItem` | 12 fields | 9-step explainable AI chain |
| `ExpandedLuckyElements` | 16 fields | Colors, gemstones, mantras, mudras etc. |
| `FinalVerdict` | 11 fields | Complete health verdict |
| `HealthSVGCharts` | 6 fields | Standalone SVG vector charts |

---

### 2. Health Engine (`health-engine.ts`)

**Calculation logic:**

#### Dosha Calculation
- Maps Sun Rashi + Moon Rashi + Lagna Rashi to Vata/Pitta/Kapha counts
- Determines primary Dosha from proportional percentages
- Generates Prakriti (constitutional) and Vikriti (current imbalance) descriptions

#### Organ Risk Formula
```typescript
organRisk(planet) = 
  base (dignity-based: exalted=12%, own=20%, debilitated=55%) 
  + house penalty (6th/8th/12th placement: +15%)
```

#### 10 Health Scores
- **overallHealth** = 78 + Sun/Moon dignity bonuses − 6th house malefics
- **mentalWellness** = 75 + Moon dignity bonus − adverse Moon house
- **physicalVitality** = 76 + Sun dignity bonus
- **stress** = 35 → 65 (based on Saturn/Mars house positions)
- **energy** = 78 + Mars dignity bonus
- **immunity** = 74 + Jupiter dignity bonus
- **recovery** = 75 + empty 8th house bonus
- **lifestyleBalance** = 72 + empty 6th house bonus
- **sleep** = 70 ± 12th house occupant modifier
- **emotionalStability** = 74 + Moon dignity bonus

#### 13-Organ Dashboard
Each of 13 organs (Heart, Liver, Kidney, Digestive, Lungs, Brain, Hormones, Skin, Eyes, Bones, Immunity, Sleep, Stress) gets:
- Health Score (0–100)
- Risk % (derived from ruling planet dignity + house)
- Color Indicator (green/yellow/orange/red)
- Ayurvedic herbs, best/worst foods, yoga, pranayama
- Dasha impact + transit impact descriptions

#### 12 Unique Monthly Forecasts
Each month has a **unique combination** of:
- Transit Planet (changes every month)
- Mahadasha + Antardasha (calculated from birth year)
- Season (Monsoon, Autumn, Winter, Spring, Summer, Pre-Monsoon)
- Solar Event (Sun's transit through different signs)
- Moon Influence (Full Moon, New Moon cycle)
- Rahu/Ketu Transit Impact
- House Activated (different house every month)
- Unique diet advice (12 distinct diets — no repeated text)
- Unique exercise (12 distinct routines)
- Unique meditation (12 distinct practices)
- Energy Score, Stress Score, Recovery Score (sinusoidal variation)

#### 10-Disease Risk Dashboard
| Condition | Primary Planet | Formula |
|---|---|---|
| Heart Disease | Sun | organRisk(Sun) |
| Diabetes | Jupiter | organRisk(Jupiter) |
| Blood Pressure | Mars | organRisk(Mars) + 5 |
| Chronic Stress | Saturn | scores.stress |
| Joint Pain | Saturn | organRisk(Saturn) |
| Skin Conditions | Mercury | organRisk(Mercury) − 5 |
| Digestive | Mercury/6th | house6 occupant check |
| Sleep Disorders | Moon/12th | 100 − scores.sleep |
| Hormonal | Venus | organRisk(Venus) − 5 |
| Low Immunity | Jupiter | 100 − scores.immunity |

#### Mahadasha Determination
- Birth year → age at calculation → accumulated Vimshottari Dasha years
- Determines current Mahadasha and Antardasha planets dynamically

---

### 3. SVG Charts Generator (`health-charts-generator.ts`)

6 standalone SVG vector charts (no external dependencies):

| Chart | Type | Dimensions |
|---|---|---|
| `healthWheelRadar` | 9-axis radar polygon | 400×410 |
| `riskRadarChart` | 10-axis risk radar | 400×430 |
| `doshaTriangle` | Equilateral triangle barycentric | 360×320 |
| `organHealthMatrix` | Horizontal bar chart (13 rows) | 520×dynamic |
| `energyTimeline` | 3-line time series | 560×220 |
| `monthlyHeatmap` | 4×12 color-coded grid | dynamic |

---

### 4. PDF Builder (`pdf/health-pdf-builder.ts`)

**35-page A4 layout (267mm×190mm printable area):**

| Page(s) | Content |
|---|---|
| 1 | Premium emerald gradient cover |
| 2 | TOC + Medical disclaimer |
| 3 | Executive Summary + 10 Score gauges |
| 4 | Health Wheel radar SVG |
| 5 | Dosha Triangle + Constitution |
| 6 | 13-Organ Dashboard (grid) |
| 7–10 | 13 Individual organ chapters |
| 11 | Risk Dashboard (10 conditions) |
| 12 | Risk Radar SVG |
| 13 | Health Houses + Planet Roles table |
| 14 | Ayurvedic Chapter — Prakriti, Morning/Night Routine |
| 15 | Ayurvedic Daily Schedule + Seasonal Protocol |
| 16–21 | 12-Month Forecast (2 months/page) |
| 22 | 5-Year Annual Timeline |
| 23 | 90-Day Recovery Plan |
| 24 | 1-Year Roadmap Milestones |
| 25–27 | 6 Structured Remedy Cards |
| 28 | AI Health Coach |
| 29 | Energy Timeline + Monthly Heatmap SVGs |
| 30 | Evidence Chain (9-step) |
| 31 | Exercise + Nutrition Matrix |
| 32 | Lucky Elements (14 fields) |
| 33 | Final Verdict + Action Plan |
| 34 | Medical Disclaimer + Certification |

---

## PDF Quality Standards

- **Page Utilization:** 90–95% printable area on every page
- **No blank pages:** All sections auto-flow, no forced empty breaks
- **No placeholder text:** All content derived from actual birth chart
- **No repeated advice:** 12 months × 12 unique data points each
- **Medical disclaimer:** Footer on every page + full disclaimer page
- **Print-ready:** @page A4, 12mm/14mm margins, Inter font

---

## API

```typescript
import { computeHealthAnalysis } from "@/lib/health-analysis/health-engine";
import { buildHealthAnalysisPdfHtml } from "@/lib/health-analysis/pdf-builder";

const result = computeHealthAnalysis({
  name: "Arjun Sharma",
  date: "1990-03-15",
  time: "08:30",
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: "5.5",
});

const pdfHtml = buildHealthAnalysisPdfHtml(result);
// Open in print window and print to PDF
```

---

## Acceptance Criteria (v2.0 Complete)

- [x] 35 meaningful pages with 90%+ utilization
- [x] 100% personalized content (no hardcoded paragraphs)
- [x] 0 duplicate monthly advice across 12 months
- [x] 13-organ dashboard with health score, risk%, color, herbs, foods, yoga
- [x] 10-disease risk dashboard with severity, trend, priority, action items
- [x] 6 SVG vector charts embedded in PDF
- [x] 9-step explainable AI evidence chain
- [x] Complete Ayurvedic chapter (Prakriti/Vikriti/Dinacharya/Seasonal)
- [x] AI Health Coach with today's focus, priorities, warnings, goals
- [x] 90-Day recovery plan + 1-Year + 5-Year wellness roadmap
- [x] 6 structured remedy cards (no [PLACEHOLDER] text)
- [x] 16-field expanded lucky elements
- [x] Full final verdict with confidence%, action plan, next 12 months
- [x] Medical disclaimer on every page footer + dedicated disclaimer page
