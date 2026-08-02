# Weekly Horoscope Engine (Phase 12.4)

Structured, deterministic weekly astrology data. **No text. No AI.**

## Module map

```
src/lib/horoscope/weekly/
├── engine.ts       # WeeklyHoroscopeEngine — public orchestrator
├── calculator.ts   # runDailyWindow + aggregateWeekly
├── rules.ts        # opportunity/challenge/panchang/planet derivation
├── validators.ts   # pure input validation
├── helpers.ts      # date math + iso helpers
├── types.ts        # Input / Output contracts
├── index.ts        # barrel
```

## Dependencies (reused, never duplicated)

- `src/lib/horoscope/daily` — daily engine + score categories + tithi/yoga classifications
- `src/lib/horoscope/trend` — reusable trend classifier
- `src/lib/transit` (indirect, via daily engine)
- `src/lib/panchang` (indirect, via daily engine)

## Calculation flow

```
WeeklyHoroscopeInput
        ↓
   validators
        ↓
   cache.memoize(key = start|end|rashi|tz|lang)
        ↓
   runDailyWindow → DailyEngine.generate() × N (7–14 days)
        ↓
   aggregateWeekly → per-category series → classifyTrendMap
        ↓
   rules: opportunities / challenges / planet highlights / panchang summary
        ↓
   lucky: top-3 scoring days, union of daily lucky numbers/colors
        ↓
WeeklyHoroscopeOutput (pure JSON)
```

## Trend classification

Delegates to `src/lib/horoscope/trend`:

- `improving` — positive slope ≥ 0.5 score-units/day
- `declining` — negative slope ≤ −0.5 score-units/day
- `mixed` — |slope| < 0.5 with volatility ≥ 12
- `stable` — |slope| < 0.5 with volatility < 12

## Score bands

Every `DailyScoreCategory` returns `{ average, min, max }` across the window.
Overall scores are surfaced in `dailyScores[]` for chart-ready callers.

## Favorable / caution days

- `favorableDays` — days with overall score ≥ 68
- `cautionDays` — days with overall score ≤ 45

## Extension points

- **AI** — feed `trends`, `opportunities`, `challenges` into a narrative prompt.
- **Frontend** — `dailyScores[]` is chart-ready; `planetHighlights[]` is timeline-ready.
- **SEO** — canonical labels (`opportunity:career`, `challenge:health`) map cleanly to translations.
- **Premium** — swap the classifier in `rules.ts` for a richer rule set without touching types.
