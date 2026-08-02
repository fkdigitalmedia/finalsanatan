# Monthly Horoscope Engine (Phase 12.4)

Structured, deterministic monthly astrology data. **No text. No AI.**

## Module map

```
src/lib/horoscope/monthly/
├── engine.ts       # MonthlyHoroscopeEngine — public orchestrator
├── calculator.ts   # runWeeklyWindow + aggregateMonthly
├── rules.ts        # panchang aggregate + retrograde windows
├── validators.ts   # pure input validation
├── helpers.ts      # month bounds + 7-day chunking
├── types.ts        # Input / Output contracts
├── index.ts        # barrel
```

## Dependencies (reused, never duplicated)

- `src/lib/horoscope/weekly` — one call per 7-day chunk within the month
- `src/lib/horoscope/daily` (indirect) — score categories, tithi/yoga tables
- `src/lib/horoscope/trend` — shared classifier for series → TrendResult
- `src/lib/transit` + `src/lib/panchang` (indirect, via daily)

## Calculation flow

```
MonthlyHoroscopeInput (year, month, rashi, tz…)
        ↓
   validators
        ↓
   cache.memoize(key = year|month|rashi|tz|lang)
        ↓
   monthBounds(year, month) → chunkWeeks() → [7-day windows]
        ↓
   WeeklyEngine.generate() × N
        ↓
   aggregateMonthly → per-category series → classifyTrendMap
        ↓
   overallTrend (from daily overall scores)
        ↓
   best-week / most-sensitive-week (weekly.overall.average sort)
        ↓
   rules: panchang tally + retrograde windows
        ↓
   luckyFactors: top-5 dates + union of daily lucky attributes
        ↓
MonthlyHoroscopeOutput (pure JSON)
```

## Key surfaces

- `overview.trend` / `overview.averageScore` / `overview.peakDay` / `overview.lowDay`
- `trends` — every DailyScoreCategory classified via `../trend`
- `scores` — {average, min, max} per category
- `bestWeek` / `mostSensitiveWeek` — ranked weekly overall averages
- `planetRetrogrades` — first observed start/end + total retrograde days
- `panchangSummary` — Ekadashi / Purnima / Amavasya / Sankashti dates + yoga counts
- `weeks[]` and `days[]` — raw payloads for callers who need drill-down

## Extension points

- **AI** — feed `trends`, `overview`, `bestWeek`, `planetRetrogrades` into a monthly prompt.
- **Frontend** — `dailyScores[]` + `weeks[].dailyScores` are chart-ready; `planetRetrogrades[]` is timeline-ready.
- **SEO** — canonical labels + panchang date arrays map cleanly to landing-page schemas.
- **Premium reports** — `days[]` gives every field required for a 30-page monthly PDF.
