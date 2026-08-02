# Daily Horoscope Engine (Phase 12.3)

Structured, deterministic daily astrology data.
**No text. No AI. No PDFs. No routes.** Phase 12.4+ will consume this JSON.

## Module map

```
src/lib/horoscope/daily/
├── engine.ts        # DailyHoroscopeEngine — public orchestrator
├── calculator.ts    # Composes Transit + Panchang into a raw snapshot
├── score.ts         # 0..100 category scoring + confidence
├── rules.ts         # Traditional lucky-factor + activity rules
├── validators.ts    # Pure input validation
├── helpers.ts       # Pure utilities (clamp, house math, tz dates)
├── constants.ts     # Static tables (gochara, weights, tithi classes)
├── types.ts         # Structural contracts (Input / Output / Scores)
├── index.ts         # Barrel export
└── __tests__/
    └── daily.test.ts
```

## Dependencies (reused, never duplicated)

- `src/lib/transit` — Planetary Transit Engine (Phase 12.2)
- `src/lib/panchang` — Tithi / Nakshatra / Yoga / Karana / Sunrise / Choghadiya / Abhijit
- `src/lib/astro/core` (indirect, via transit engine)
- `src/lib/horoscope` foundation — RashiKey, RASHIS, config

No paid APIs. No Swiss Ephemeris. No new astronomy code.

## Calculation flow

```
DailyHoroscopeInput
        │
        ▼
   validators
        │
        ▼
   cache.memoize(key = date|rashi|tz|lang)
        │
        ▼
   compute()
        ├── TransitEngine.generateTransitSnapshot()
        │       └── planets, retrograde, ingresses, ayanamsa
        ├── Panchang primitives (tithi, nakshatra, yoga, karana, sun)
        ├── Moon-status derivation (chandra-gochara house)
        ├── rules.ts   — lucky number / color / direction / activities
        ├── Choghadiya / Abhijit Muhurat  — lucky time window
        └── score.ts   — weighted category scoring
        │
        ▼
DailyHoroscopeOutput  (pure JSON)
```

## Scoring flow

1. For each transiting planet, compute `planetBaseScore(planet, natalIndex)`:
   - Base 75 if the planet's current house from the caller's Moon sign is
     in that planet's traditional Chandra-gochara benefic list.
   - Base 40 otherwise; further −10 in classic malefic houses (4, 8, 12).
   - ±6 (benefic) / +4 (malefic) modifier when the planet is retrograde.
2. For each of the 15 `DailyScoreCategory` values, weight the per-planet
   scores using `CATEGORY_WEIGHTS[category]` and return the normalized
   mean (0..100), along with a confidence figure = (matched planets /
   weighted planets).

All scores carry `{ score, confidence, source, updatedAt }`.

## JSON schema (abridged)

```jsonc
{
  "date": "YYYY-MM-DD",
  "rashi": "mesha",
  "planetaryInfluence": {
    "summary": [{ "name": "Sun", "rashi": "Cancer", "nakshatra": "...", "retrograde": false }],
    "detailed": [ /* PlanetTransit[] */ ],
    "retrograde": ["Mercury", "Rahu"],
    "imminentSignChanges": [{ "planet": "Mars", "from": "Leo", "to": "Virgo", "when": "ISO" }]
  },
  "moonStatus": { "rashi": "...", "houseFromNatal": 1, "favorable": true, ... },
  "transits": { "referenceInstant": "ISO", "ayanamsaDegrees": 24.2, "planetCount": 9 },
  "panchang": { "tithi": {...}, "nakshatra": {...}, "yoga": {...}, "karana": {...},
                "sunrise": "ISO", "sunset": "ISO", "moonPhase": "Waxing", "paksha": "Shukla" },
  "luckyFactors": {
    "number": 9, "color": "Red", "direction": "East",
    "timeWindow": { "start": "ISO", "end": "ISO", "label": "Abhijit Muhurat" },
    "favorableActivities": ["..."], "activitiesToAvoid": ["..."]
  },
  "scores": {
    "overall":    { "score": 72.5, "confidence": 1.0, "source": "chandra-gochara+weights[overall]", "updatedAt": "ISO" },
    "career":     { ... }, /* 15 categories total */
  },
  "metadata": {
    "calculationTimestamp": "ISO", "timezone": "Asia/Kolkata",
    "engineVersion": "0.3.0-daily", "language": "en",
    "dataSource": "sanatan-tools/transit+panchang",
    "calculationDurationMs": 42
  }
}
```

## Caching

- Layer 1: `DailyHoroscopeEngine` uses a `TransitCache<DailyHoroscopeOutput>`
  (15 min TTL, 128 entries) keyed on `date|rashi|tz|lang`.
- Layer 2: The underlying `TransitEngine` reuses its per-minute planet cache,
  so multiple rashi requests for the same date share planetary compute.

## Extension points (for Phase 12.4+ / AI phase)

- `DailyHoroscopeOutput` is the sole contract narrative generators consume.
- To swap scoring rules: replace `score.ts` — `types.ts` is unchanged.
- To add personalized (birth-chart) mode: extend `validators.ts` +
  branch inside `engine.compute()` to consult a natal Kundli instead
  of a rashi-only natal index. Foundation already caches a Kundli.
- To add localized labels: attach a translator in a future phase; this
  engine stores only canonical English identifiers.

## Non-goals (explicitly deferred)

- Natural-language horoscope text (Phase 12.4+)
- AI interpretation (later phase)
- Frontend pages / SEO / PDFs
- Personalized (birth-chart) daily mode
