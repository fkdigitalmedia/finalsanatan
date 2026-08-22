# Kundli PDF Generation Engine Architecture & Multilingual Specification

## Overview
The **Kundli PDF Engine** (`src/lib/kundli/pdf.ts`, `src/lib/kundli/pdf-i18n.ts`, `src/lib/kundli/pdf-i18n-extra.ts`, `src/lib/kundli/pdf-complex-text.ts`, `src/lib/kundli/pdf-charts.ts`) produces print-ready, professional A4 PDF reports (from 6 pages in the compact free tier up to 32 pages in the premium tier) with native vector charts, customized layouts, and full multi-language localization.

## 12 Supported Indian Languages
1. **English (`en`)**: Latin-1 Helvetica / standard typography.
2. **Hindi (`hi`)**: Devanagari script via dynamic Noto Sans Devanagari font and OpenType text shaping.
3. **Marathi (`mr`)**: Devanagari script with Marathi astrological terminology.
4. **Gujarati (`gu`)**: Gujarati script via Noto Sans Gujarati.
5. **Bengali (`bn`)**: Eastern Nagari / Bengali script via Noto Sans Bengali.
6. **Tamil (`ta`)**: Tamil script via Noto Sans Tamil.
7. **Telugu (`te`)**: Telugu script via Noto Sans Telugu.
8. **Kannada (`kn`)**: Kannada script via Noto Sans Kannada.
9. **Malayalam (`ml`)**: Malayalam script via Noto Sans Malayalam.
10. **Punjabi (`pa`)**: Gurmukhi script via Noto Sans Gurmukhi.
11. **Odia (`or`)**: Odia script via Noto Sans Oriya.
12. **Assamese (`as`)**: Assamese script via Noto Sans Bengali.

## Key Subsystems & Files

- **`src/lib/kundli/pdf.ts`**:
  - Main orchestrator (`generateKundliPdf`, `downloadKundliPdf`).
  - Implements all 32 pages: Cover, Table of Contents, Executive Dashboard, D1 Rashi Charts (North/South/East Indian styles), Planet Positions & Dignities, House Cusps & Nakshatras, Planet Strength Engine (0–100 status bars), 12 House Bhavas Key Analysis, Birth Panchang & Avakahada Chakra, Vimshottari Mahadasha Overview & Gantt Timeline, Yogas & Deep Meanings, Doshas & Mitigation, Remedies, 11 Life Domain Predictions, Personalized Life Domains, Explainable AI Rule Traces, Classical Citations, Decision Support, Opportunity/Risk Matrix, Multi-Year Timeline, Divisional Charts (D3, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60), Shadbala & Ashtakvarga, Lucky Factors, Custom Remedy Planner, Decade Timeline (0–60+), FAQs, Sanskrit Glossary, Astronomical Appendix, and Comprehensive Life Analysis.

- **`src/lib/kundli/pdf-i18n.ts`**:
  - Base `PDF_LABELS` dictionary for Core Pages 1–6 across all 12 languages.
  - Runtime Noto TTF font loader (`ensurePdfFont`) registering virtual fonts inside jsPDF.

- **`src/lib/kundli/pdf-i18n-extra.ts`**:
  - Advanced `PDF_EXTRA_LABELS` dictionary for Pages 7–32 across all 12 languages.
  - Localized section headings, metric badges, prediction domain titles, risk alerts, lucky factor categories, and routine intervals.

- **`src/lib/kundli/pdf-complex-text.ts`**:
  - Unicode text shaper (`installComplexTextShaper`) ensuring conjunct consonants and matras in Indic scripts render accurately in PDF vector text streams.

- **`src/lib/kundli/pdf-charts.ts`**:
  - Native vector renderers for North Indian (diamond), South Indian (box), and East Indian (triangular/bengali) Kundli chart formats.

## Public API

```typescript
import { generateKundliPdf, downloadKundliPdf } from "@/lib/kundli/pdf";

// Generate jsPDF instance in a specific language
const doc = await generateKundliPdf(kundliResult, {
  language: "hi",     // 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'ml' | 'pa' | 'or' | 'as'
  premium: true,      // Full 32-page report
  filename: "kundli-report-hindi.pdf"
});

// Or trigger direct browser download
await downloadKundliPdf(kundliResult, {
  language: "gu",
  premium: true
});
```
