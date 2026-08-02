# Phase 11 — Premium Astrology Tools Suite

Ye scope bahut bada hai (8 tools × 10 surfaces = ~80 deliverables). Ek turn me sab banane se quality suffer karegi. Isliye main ise **4 sprints** me deliver karunga, aur har sprint ke baad aap review kar sakte ho.

Sab kuch **existing engines** pe build hoga:

- `src/lib/kundli/*` — natal chart, dasha, doshas, yogas, shadbala
- `src/lib/panchang.ts` — tithi, nakshatra, muhurat, choghadiya
- `src/lib/kundli/pdf.ts` — premium PDF pipeline
- `src/lib/kundli/interpret.functions.ts` — AI Gateway explanations
- `src/lib/payments/*` — Razorpay + Lemon Squeezy paywall
- Admin CRUD + analytics + i18n infra — sab ready hai

## Shared foundation (Sprint 1 — half day)

Ek baar bana ke sab tools reuse karenge:

1. **`src/tools/registry.ts` extension** — 8 naye tool entries (slug, title, description, price, free/paid flag, PDF template key, AI prompt key)
2. **`ToolShell` upgrade** — breadcrumb + FAQ + how-to + benefits + related tools + newsletter + premium CTA slots (already partially exists, extend it)
3. **`generateToolPdf(toolSlug, data)`** helper — reuses `pdf.ts` header/footer/QR, per-tool page renderers plug in
4. **`explainWithAi(toolSlug, data, lang)`** helper — one server fn, per-tool prompt from `ai_prompts` table
5. **Admin `admin_tool_configs` migration** — enable/disable, price INR/USD, coupon, PDF template, AI prompt id, per-tool
6. **Analytics event helper** — `trackToolEvent(slug, action)` — view/generate/download/purchase

## Sprint 2 — Relationship tools (Kundli Matching already live)

Kundli Matching route `/kundli-matching` exists — move to `/tools/kundli-matching`, wire PDF + AI + premium paywall + FAQ + schema.

1. **Kundli Matching upgrade** — PDF (already has `pdf.ts`, add matching-specific pages), AI summary, admin controls, redirect old URL
2. **Marriage & Love Compatibility** `/tools/love-compatibility` — reuse matching engine + Venus/Mars synastry from D1 charts, softer language

## Sprint 3 — Personal charts

3. **Career & Business Report** `/tools/career-report` — 10th house lord, D10 chart (already computed), Saturn/Mercury/Sun analysis, Dasha timeline
4. **Annual Prediction (Varshphal)** `/tools/annual-varshphal` — solar return chart from existing engine, current dasha, transit themes
5. **Baby Name Generator** `/tools/baby-name-generator` — nakshatra pada letters (Vedic table), curated 500-name JSON dataset by starting syllable, filter by gender/language

## Sprint 4 — Educational tools

6. **Muhurat Finder** `/tools/muhurat-finder` — reuse panchang engine, scan date range for auspicious tithi+nakshatra+choghadiya combos per event type (marriage/griha pravesh/etc.), calendar view + PDF
7. **Numerology Report** `/tools/numerology-report` — pure math (Pythagorean/Chaldean), no astro engine. Clear "not Vedic" disclaimer
8. **Vastu Report** `/tools/vastu-report` — questionnaire → rule-based recommendations (direction, element balance). Educational-only disclaimer

## Per-tool deliverables (every tool gets all of these)

- Route file with SEO `head()` — unique title/desc/og
- JSON-LD schema (`HowTo` + `FAQPage` + `Product` when paid)
- Interactive form (reuses `PhotonPlacePicker`, `LocationPicker`, gender/date/time inputs)
- Free preview + paid full report gate (checks `user_entitlements` + site_settings free/paid toggle)
- PDF generator (per-tool section, shared header/QR)
- AI explanation server fn (Lovable AI Gateway, streaming)
- Admin row in `/admin/tools` — enable, pricing, template, prompt
- Analytics events wired
- i18n keys added to `en.json` + `hi.json` (other langs auto-translate via existing script)
- Related tools + newsletter + premium CTA in footer

## Technical notes

- No new astronomical code — sab existing engine calls
- No new payment gateway — existing Razorpay/Lemon Squeezy dono flows reuse
- Numerology + Vastu are non-astronomical (rules + math), documented clearly
- Baby names dataset: 500 hand-curated Sanskrit/regional names JSON (~50KB), lazy-loaded

## Ask

Ye 4 sprints hai, har sprint ~1 turn ka scope hai. Options:

**A.** Sprint 1 (shared foundation) abhi karo — bina iske baaki sab duplicate code hoga
**B.** Direct koi ek specific tool pehle chahiye (batao kaunsa) — foundation lightweight rakhunga
**C.** Poore Phase 11 ka rough scaffolding (sab 8 routes + basic UI, PDF/AI/paywall baad me) — fastest visible progress

Konsa chalein?
