# Dosha & Yoga Detection Engine (Phase 13.4)

Backend-only, JSON-only detection of classical Doshas and Yogas from the natal
D1 chart. No AI text, no frontend, no PDF, no SEO.

---

## Architecture

```
src/lib/yogadosha/
├── types.ts        contracts: input, ChartContext, YogaDoshaRule, output
├── constants.ts    sign lords, kendra/trikona/dusthana/upachaya, aspects, orbs
├── helpers.ts      rashi + house math, confidence→strength, cache keys
├── context.ts      buildChartContext() — the read-only view rules receive
├── validators.ts   input validation + defensive rule-outcome validation
├── cache.ts        TTL/FIFO cache (natal chart + output), reuses TransitCache
├── registry.ts     RuleRegistry + DEFAULT_RULES + registerRule()
├── rules/          one file per rule (14 shipped)
├── engine.ts       YogaDoshaEngine orchestrator
└── __tests__/      27 automated tests
```

Reused modules: `@/lib/kundli` (natal chart), `@/lib/transit/cache` (cache
primitive), `@/lib/horoscope/config|constants` (language defaults). No astronomy
is recomputed here.

## Modular rule system

A rule is a plain object — no engine changes are needed to add one:

```ts
import { registerRule } from "@/lib/yogadosha";

registerRule({
  id: "kemadruma-yoga",
  name: "Kemadruma Yoga",
  kind: "dosha",
  category: "Chandra Yoga",
  description: "No planet in the 2nd or 12th from the Moon …",
  evaluate(ctx) {
    const moonHouse = ctx.houseOf("Moon")!;
    const empty =
      ctx.planetsInHouse((moonHouse % 12) + 1).length === 0 &&
      ctx.planetsInHouse(((moonHouse + 10) % 12) + 1).length === 0;
    return {
      detected: empty,
      confidence: empty ? 75 : 0,
      ruleApplied: "2nd and 12th from the Moon are both unoccupied",
      planetCombination: ["Moon"],
      affectedHouses: [moonHouse],
    };
  },
});
```

`ChartContext` gives rules everything they need: `planet`, `houseOf`,
`planetsInHouse`, `rashiOfHouse`, `lordOfHouse`, `lordOfRashi`, `houseFrom`,
`houseFromMoon`, `dignity`, `isBenefic`, `aspectsHouse` (full graha drishti),
`areConnected`, `separation`, `isCombust`.

The engine isolates failures: a rule that throws or returns a malformed outcome
is reported as `detected: false` with the reason in `ruleApplied` — the run
never crashes.

## Shipped rules (14)

| id                     | kind  | classical condition                                                            |
| ---------------------- | ----- | ------------------------------------------------------------------------------ |
| `mangal-dosha`         | dosha | Mars in 1/2/4/7/8/12 from Lagna, Moon or Venus                                 |
| `kaal-sarp-yoga`       | dosha | all seven grahas hemmed between Rahu and Ketu (12 named types)                 |
| `pitra-dosha`          | dosha | Sun / 9th house / 9th lord afflicted by Saturn, Rahu or Ketu                   |
| `guru-chandal-yoga`    | dosha | Jupiter conjoined Rahu or Ketu                                                 |
| `gaj-kesari-yoga`      | yoga  | Jupiter in a kendra from the Moon                                              |
| `raj-yoga`             | yoga  | kendra lord ↔ trikona lord: conjunction, mutual aspect, exchange or yogakaraka |
| `neech-bhang-raj-yoga` | yoga  | debilitation cancelled by dispositor / exaltation lord in kendra               |
| `vipreet-raj-yoga`     | yoga  | 6/8/12 lord in a dusthana — Harsha, Sarala, Vimala                             |
| `budhaditya-yoga`      | yoga  | Sun conjoined Mercury                                                          |
| `chandra-mangal-yoga`  | yoga  | Moon conjoined or in mutual aspect with Mars                                   |
| `parivartan-yoga`      | yoga  | two house lords exchange signs — Maha / Dainya / Khala                         |
| `adhi-yoga`            | yoga  | Mercury, Jupiter, Venus in 6/7/8 from the Moon                                 |
| `lakshmi-yoga`         | yoga  | strong 9th lord in kendra/trikona + strong Lagna lord                          |
| `vasumati-yoga`        | yoga  | benefics in upachaya houses (3/6/10/11) from Lagna or Moon                     |

## Output

```
profile { birth…, lagnaRashi(Index), moonRashi(Index), language }
detections[] / doshas[] / yogas[] {
  id, name, sanskrit, kind, category, description,
  detected,                 // boolean
  confidence,               // 0..100
  ruleApplied,              // the exact classical clause that fired
  planetCombination[],      // grahas forming the combination
  affectedHouses[],         // 1..12
  strength,                 // none | mild | moderate | strong
  cancellations[],          // mitigating clauses
  details{}                 // structured evidence (types, exchanges, orbs …)
}
summary { totalRulesEvaluated, detectedCount, doshaCount, yogaCount,
          detectedIds[], strongest, balanceScore }
metadata { engineVersion, dataSource, calculationDurationMs, ruleCount,
           cacheHits, timezone, language }
```

`includeUndetected: false` trims the arrays to detected records only;
`rules: [...]` restricts evaluation to specific rule ids.

## Usage

```ts
import { detectYogasAndDoshas, createYogaDoshaEngine } from "@/lib/yogadosha";

const out = detectYogasAndDoshas({
  birth: {
    date: "1990-06-15",
    time: "10:30",
    place: "Mumbai, India",
    latitude: 19.076,
    longitude: 72.8777,
    timezone: "Asia/Kolkata",
  },
});

const engine = createYogaDoshaEngine(); // keeps caches warm
engine.ruleIds();
```

## Caching

| Tier        | TTL    | Key                                                |
| ----------- | ------ | -------------------------------------------------- |
| Natal chart | 60 min | birth date/time/lat/lon/tz                         |
| Output      | 60 min | birth + language + rule filter + includeUndetected |

## Testing

```
bunx vitest run src/lib/yogadosha
```

27 tests cover input validation, rule-outcome validation, registry contents and
custom-rule registration/removal, chart-context lordship and aspect math, the
required output fields on every record, summary consistency, filters,
independent chart cross-checks (Mangal, Budhaditya, Gaj Kesari, Parivartan),
five diverse charts running without runtime errors, JSON serialisability, cache
identity, and isolation of a throwing rule.

## Extension points

- More yogas — add a file under `rules/` and append to `DEFAULT_RULES`, or call
  `registerRule()` at runtime.
- Divisional charts — `buildChartContext(natal.d9)` works unchanged.
- Dasha timing — join detections with `@/lib/dasha` to time when a yoga fires.
- Remedies / AI narration / reports — consume the JSON; this module stays
  text-generation-free.
