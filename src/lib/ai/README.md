# AI Astrology Interpretation Engine (Phase 14.1)

The narration layer for SanatanTools. It turns **already-calculated** engine
JSON into clean Markdown in ten languages.

> **Hard rule:** the AI never calculates. No planetary positions, no Dasha, no
> Panchang, no Gochar, no scores. Every number in a report comes from the
> calculation engines; the model only explains what it is given, and the prompt
> forbids altering or inventing values.

---

## Architecture

```
src/lib/ai/
├── types.ts        contracts: input, prompt template, adapter, result
├── constants.ts    reports, depths, languages, safety rules, disclaimers, budgets
├── validators.ts   input validation (JSON-safe, size-capped) + output validation
├── prompts.ts      14 modular templates + admin-overridable registry + resolver
├── templates.ts    Markdown skeletons, depth-aware sections, footer builder
├── formatter.ts    fence/preamble stripping, normalisation, section split, footer
├── providers.ts    adapter layer over the existing AI Router + fallbacks
├── cache.ts        stable hashing + TTL/FIFO report cache
├── engine.ts       AiInterpretationEngine orchestrator
└── __tests__/      31 automated tests
```

Reused: `src/lib/ai-router.server.ts` (provider resolution, retry, failover,
`ai_usage_logs`), and the calculation engines under `src/lib/kundli`,
`horoscope`, `dasha`, `transit`, `gochar`, `sadesati`, `yogadosha`, `panchang`.

## Provider flow

```
engine.generate()
  └─ completeWithFallback()          providers.ts
       ├─ activeAdapter  (default: routerAdapter)
       │     └─ callAi({ feature: "interpretation.<report>", … })
       │           └─ ai_feature_mappings → ai_providers (enabled, priority)
       │                 ├─ primary provider  → retry ×N
       │                 ├─ mapped fallbacks
       │                 └─ remaining enabled providers
       └─ adapter fallbacks (optional, e.g. an offline/static adapter)
```

Provider families the router already speaks: **OpenAI, Gemini, Claude
(Anthropic), OpenRouter, DeepSeek, Groq, Mistral, Cohere, Lovable AI, custom
OpenAI-compatible**. Admins enable/disable, reorder, re-key or add providers
from **Admin → AI Providers** and map a provider per report through the
`interpretation.<report>` feature key — no code change, no redeploy.

Swap the whole transport for tests or a future gateway:

```ts
setProviderAdapter({ id: "my-adapter", async complete(req) { … } });
setFallbackAdapters([backupAdapter]);
resetProviderAdapters();
```

## Prompt flow

````
resolvePrompt({ report, depth, language, data, context, lowConfidence })
  ├─ getPrompt(report)        override (admin) ?? DEFAULT_PROMPTS[report]
  ├─ system  = role + safety rules (never guarantee, no medical/legal/financial)
  └─ prompt  = instruction + language + depth style + section list
             + Markdown skeleton + ```json <engine data>```
````

Nothing is hardcoded in the engine. Templates live in a registry:

```ts
registerPrompt({ ...DEFAULT_PROMPTS["career-report"], version: 2, instruction: "…" });
setPromptOverrides(rowsFromAdminPanel); // e.g. hydrated from ai_prompts
clearPromptOverrides("career-report");
```

Bumping `version` automatically invalidates every cached report for that
template.

## Template system

| Depth          | Sections              | Style                                    |
| -------------- | --------------------- | ---------------------------------------- |
| `summary`      | first 2               | ~180 words, no jargon                    |
| `beginner`     | all                   | every Sanskrit term defined, warm tone   |
| `detailed`     | all                   | full report, bullets + short paragraphs  |
| `professional` | all + Technical Notes | Sanskrit terminology, cites exact values |

`buildSkeleton()` gives the model the exact heading order; `formatter.ts`
re-normalises whatever comes back and appends the localized disclaimer (plus a
low-confidence note when the engine's `confidence < 45`).

## Supported reports (14)

Daily / Weekly / Monthly / Yearly Horoscope · Kundli Summary · Career ·
Marriage Compatibility · Guna Milan · Varshphal · Muhurat · Numerology ·
Vastu · Dosha · Yoga.

## Languages (10)

English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi,
Bengali. Add one by extending `InterpretationLanguage`, `LANGUAGE_NAMES` and
`DISCLAIMERS`.

## Usage

```ts
import { interpret } from "@/lib/ai";
import { detectYogasAndDoshas } from "@/lib/yogadosha";

const engineOutput = detectYogasAndDoshas({ birth }); // calculation
const report = await interpret({
  // narration only
  report: "dosha",
  data: engineOutput, // structured JSON from an engine — required
  depth: "beginner",
  language: "hi",
  confidence: engineOutput.summary.balanceScore,
  userId,
});

report.markdown; // clean Markdown incl. disclaimer
report.sections; // [{ heading, body }]
report.meta; // provider, model, adapter, cached, cacheKey, wordCount …
```

Call it from a `createServerFn` handler (the router adapter is server-only).

## Safety

Every system prompt carries the same non-negotiable block: traditional guidance
framing, no guarantees, no medical/legal/financial advice, no death/disease
predictions, no invented numbers, say "not available" instead of guessing.
Low engine confidence surfaces both in the prompt and as a visible note above
the disclaimer.

## Caching

Key = `report : depth : language : v<templateVersion> : hash(stable JSON of data + context)`.

Identical calculation data ⇒ identical key ⇒ cached Markdown reused. Any change
to a single engine number, the depth, the language or the template version
produces a new key, so the cache self-invalidates. TTL 6 h, 300 entries, FIFO.
`bypassCache: true` forces a regeneration; `engine.invalidate(report)` drops a
whole report family.

## Testing

```
bunx vitest run src/lib/ai
```

31 tests: input validation (unknown report/depth/language, empty, cyclic, NaN,
oversized, bad confidence), output validation, template coverage for all 14
reports, safety-rule presence, feature-key namespacing, prompt loading and admin
override, depth budgets, Markdown normalisation (fences, preambles, bullets,
headings), section extraction, single-disclaimer guarantee, stable hashing,
cache hit/miss/bypass/invalidate-on-data-change, provider switching, fallback
provider support, all-adapters-failed error, empty-response rejection, and a
full sweep of every report × depth plus every language.

## Future extension points

- **Admin prompt editor** — persist templates in `ai_prompts` and hydrate with
  `setPromptOverrides()` at request time.
- **Persistent cache** — swap `InterpretationCache` for a Supabase-backed store
  using the same `buildCacheKey()`.
- **Streaming** — add a `completeStream` method to `AiProviderAdapter`; the
  formatter already works on partial Markdown.
- **New reports** — add a `ReportKind`, one entry in `DEFAULT_PROMPTS`, done.
- **New providers** — insert a row in `ai_providers`; no code change.
- **Phase 14.2** — server functions + UI wiring on top of this foundation.
