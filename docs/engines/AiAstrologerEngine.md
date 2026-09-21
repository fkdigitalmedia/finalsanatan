# AI Astrologer Engine & Educational Integration Architecture

## Overview

The **AI Astrologer Engine** bridges SanatanTools' mathematically validated Vedic astronomy calculation engine (`astronomy-engine`, sidereal Lahiri Ayanamsa, Parasari whole-sign houses) with contextual natural-language interpretations.

Crucially, **the AI Astrologer never replaces or bypasses the calculation engine**, nor does it invent planetary positions, Bhavas, Dashas, Yogas, Nakshatras, medical diagnoses, or financial guarantees.

```
Birth Details (Date, Time, Lat/Lon)
         │
         ▼
SanatanTools Astrology Calculation Engine (Astronomy Engine + Lahiri Sidereal)
         │
         ▼
Verified Kundli Data (D1–D12, Bhavas, Graha Longitudes, Vimshottari Dasha, Yogas/Doshas)
         │
         ▼
AI Astrologer Interpretation Layer (`src/components/blog/AiAstrologerCta.tsx` & `src/components/kundli/KundliAiPanel.tsx`)
         │
         ▼
Personalized Vedic Explanation (Zero Hallucination)
         │
         ▼
Relevant Actionable Tool / Premium Report (Career Pro, Kundli Matching, Janam Kundli Pro)
```

---

## Key Principles & Guardrails

1. **Calculation-First Architecture**:
   - Every planetary coordinate, house placement, Nakshatra pada, and Dasha period must be computed deterministically before AI narration takes place.
   - The AI is supplied strictly with verified calculation JSON (e.g., Lagna lord, Graha dignities, Shadbala, active Mahadasha/Antardasha, Koota scores).
2. **Zero Fabrication Policy**:
   - The AI is instructed to explain and interpret calculated data. It is strictly prohibited from inventing astrological facts or claiming events with rigid fatalism.
3. **Seamless Content-to-Tool Funnel**:
   - Educational articles (`/blog/$slug`) naturally present contextual suggested questions (e.g. 7th house and Kuja Dosha for compatibility articles; 10th house and D10 for career articles).
   - Logged-in users with saved charts can ask questions directly about their saved profiles (e.g. "Ask about Rohit's chart").
   - Guest users or users without saved charts are guided to enter birth details to compute their authentic chart before receiving an interpretation.
4. **Relevant Pro Upgrades**:
   - Contextual recommendations guide users to deep-dive reports (e.g., `Career & Business Astrology Report`, `Marriage & Compatibility Pro`, `Janam Kundli Pro`).

---

## Component Specifications

### 1. `AiAstrologerCta.tsx` (`src/components/blog/AiAstrologerCta.tsx`)
- **Props**:
  - `articleTitle?: string`: Used for contextual topic detection.
  - `category?: string`: Category identifier (`ASTROLOGY`, `LIFESTYLE`, etc.).
  - `tags?: string[]`: Tags for granular topic matching (e.g., `Kundli Matching`, `Career`, `Dasha`).
  - `topic?: AstrologyTopic`: Explicit topic override (`kundli` | `marriage` | `career` | `finance` | `remedies` | `general`).
  - `customHeading?: string`: Optional custom title override.
  - `customSuggestedQuestions?: string[]`: Context-tailored suggested prompts.
  - `recommendedReport?: RecommendedReportConfig`: Contextual premium report badge and link.
- **Dynamic State**:
  - Checks user authentication (`useAuth`).
  - Queries saved charts (`useKundlis`).
  - If saved charts exist: presents a chart selector and headings personalized with the chart's name.
  - On submit: deep-links to `/kundli` with search parameters (`name`, `dob`, `tob`, `place`, `lat`, `lon`, `tz`, `q`, `auto=true`).

### 2. `KundliLandingPage` URL Protocol (`src/routes/kundli.tsx`)
- **Query Parameters**:
  - `name`: Profile name.
  - `dob`: Birth date in `YYYY-MM-DD` format.
  - `tob`: Birth time in `HH:mm` format.
  - `place`: Birth city/location label.
  - `lat`: Geographic latitude.
  - `lon`: Geographic longitude.
  - `tz`: IANA timezone string.
  - `q`: User question for AI Astrologer.
  - `auto`: Boolean flag (`true` to auto-calculate on mount).
- **Behavior**:
  - Populates birth inputs.
  - When `auto=true`, executes `generateKundli()` on mount.
  - Displays the active AI inquiry banner at the top of the form.
  - Passes `question` to `<KundliAiPanel />` to display the active inquiry above chart narratives.

### 3. `AIDharmaAssistant` Query Handshake (`src/tools/ai.tsx`)
- Reads `?q=...` from the URL to allow seamless one-click transition for general philosophical and scriptural inquiries not requiring birth data.

---

## Verification & Maintenance

- To test the CTA component and blog integration, visit any astrology article (e.g., `/blog/understanding-your-janam-kundli` or `/blog/kundli-matching-36-guna-milan-guide`).
- Verify that clicking any suggested question populates the inquiry box.
- Verify that clicking the CTA navigates to `/kundli` with all query parameters intact, computes the chart, and highlights the AI question.
