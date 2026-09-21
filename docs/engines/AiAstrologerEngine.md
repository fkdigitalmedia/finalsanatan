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

### 4. `AIAstrologer` Tool (`src/tools/ai-astrologer.tsx` & `/tools/ai-astrologer`)
- **Direct Interactive AI Astrologer**:
  - Lets users compute any Vedic birth chart and ask targeted questions across Career, Marriage, Wealth, Dasha cycles, and Remedies.
  - Answers in the exact same language or dialect the user asks in (Hindi, Hinglish, Gujarati, Marathi, Tamil, Telugu, Bengali, English).
- **Free vs Pro/Premium Quota Model**:
  - **Free Users & Guests**: Allowed up to **3 questions** maximum (`FREE_QUESTIONS_LIMIT = 3`).
    - Visual quota status card displays questions used (e.g. `2/3 used`, `1 question left`) with 3 step indicator dots.
    - Persistent tracking via `localStorage` (`sanatan_ai_astrologer_questions_used`) and server-side verification in `/api/ai`.
    - Once 3 questions are used, an Upgrade Banner is displayed with links to `/pricing` and `/login`.
    - Submit button transforms into an Upgrade CTA: *"3 Free Questions Used • Upgrade to Pro for Unlimited"*.
  - **Pro, Premium & Lifetime Users**:
    - Entitlements recognized: `pro`, `premium`, `premium_access`, `pro-monthly`, `pro-yearly`, `lifetime`, `lifetime_vip`, `admin`, `all_tools`.
    - Enjoy **unlimited questions** without any barrier or question limit.
    - Quota status badge shows: `👑 Pro / Premium Account Active • Unlimited Questions (असीमित सवाल)`.

---

## Quota & Entitlements Architecture

```
User Question Request
         │
         ▼
Check User Session & Entitlements
         │
    ┌────┴───────────────────────────────┐
    ▼                                    ▼
Pro / Premium User                   Free User / Guest
(Active Subscription)                (No Active Paid Plan)
    │                                    │
    ▼                                    ▼
Unlimited Questions Permitted        Questions Used < 3 ?
    │                                ┌───┴────────────────┐
    ▼                                ▼                    ▼
Proceed to AI Analysis             YES (e.g. 1st/2nd)   NO (>= 3 used)
                                     │                    │
                                     ▼                    ▼
                               Execute & Record      Block Execution &
                               Usage in DB/State     Display Upgrade Card
```

### Server-Side Protection (`/api/ai`):
1. Reads `Authorization: Bearer <token>` to identify user and resolve active entitlements (`user_entitlements`, `subscription_plans`, `orders`, `is_staff`).
2. For free accounts, verifies usage in `ai_usage_logs` (`feature_key = 'tool:ai-astrologer'`) and client header `x-questions-used`.
3. If questions used >= 3, responds with HTTP `402` and error code `LIMIT_EXCEEDED` with upgrade instructions.
4. For Pro users, executes `callAi` with no usage limit.

---

## Verification & Maintenance

- To test the CTA component and blog integration, visit any astrology article (e.g., `/blog/understanding-your-janam-kundli` or `/blog/kundli-matching-36-guna-milan-guide`).
- Verify that clicking any suggested question populates the inquiry box and navigates to `/tools/ai-astrologer`.
- Verify that a free user sees the 3 questions quota counter and can submit up to 3 questions.
- Verify that asking a 4th question on a free account is blocked with the Pro upgrade card.
- Verify that a Pro or Premium user sees the Unlimited badge and can ask questions continuously without restriction.
