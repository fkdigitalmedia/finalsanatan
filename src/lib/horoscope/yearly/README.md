# Yearly Horoscope Engine (Phase 12.5)

Structured, JSON-only annual astrological calculator. No AI, no prose, no
frontend, no PDF, no SEO. Downstream phases consume the payload.

## Composition

```
YearlyHoroscopeEngine
  └─ MonthlyHoroscopeEngine  × 12
        └─ WeeklyHoroscopeEngine  × 4-5
              └─ DailyHoroscopeEngine  × 7
                    ├─ TransitEngine (cached)
                    └─ Panchang + Astronomy core
FestivalEngine (annual calendar)
```

Every underlying engine already caches its work, so the yearly engine never
duplicates ephemeris calculations across quarters, months, or weeks.

## Files

| File            | Responsibility                                            |
| --------------- | --------------------------------------------------------- |
| `engine.ts`     | Public orchestrator + cache + JSON assembly               |
| `calculator.ts` | Runs Monthly engine 12× for the target year               |
| `scores.ts`     | Rolls daily series into yearly category scores + trends   |
| `trends.ts`     | Quarterly + monthly rollups, opportunity/challenge labels |
| `timeline.ts`   | Planetary events (sign-change, retrograde, major transit) |
|                 | and annual festival calendar (via `src/lib/festivals`)    |
| `helpers.ts`    | Quarter bounds, averages, minMax                          |
| `validators.ts` | Input schema validation                                   |
| `constants.ts`  | Yearly categories + category→daily-source mapping         |
| `types.ts`      | Structural contracts (input, scores, quarters, output)    |

## Input

```ts
{
  year: number;             // 1900..2200
  rashi: RashiKey;          // 12 supported
  timezone?: string|number; // IANA or hour offset
  language?: string;        // 'en' | 'hi' | 'mr' | ...
  latitude?: number;        // -90..90 (tunes Panchang + festivals)
  longitude?: number;       // -180..180
  location?: string;        // free-form label
}
```

## Output (`YearlyHoroscopeOutput`)

Top-level fields:

- `overview` — annual trend, average score, peak/low month + day
- `scores` — 18 yearly categories, each `{score, confidence, source, min, max}`
- `trends` — same 18 categories, each `TrendResult`
- `quarters[4]` — quarterly bands, trends (overall/career/finance/relationships
  /health/travel/business), best & toughest month
- `months[12]` — monthly averages, trend, peak/low day, best & sensitive week
- `planetaryEvents` — sign-change / retrograde-start / retrograde-end /
  retrograde-window / major-transit
- `planetRetrogrades` — per-planet aggregated retrograde windows
- `festivals` — annual calendar with panchang metadata + quarter index
- `panchangSummary` — Ekadashi / Purnima / Amavasya / Sankashti counts + dates,
  yoga tallies
- `luckyFactors` — lucky months / dates / numbers / colors / direction,
  favorable time windows, high-opportunity + caution periods
- `opportunities` / `challenges` — canonical labels (no prose) rolled from
  monthly
- `categorySources` — reveals the daily bucket that fed each yearly category
- `monthly` — the raw monthly payloads (kept so downstream phases don't need
  to re-run the pipeline)
- `metadata` — timestamp, engine version, timezone, language, execution ms,
  data sources, counts

## Category mapping

The yearly engine exposes 18 life-domain categories. Each maps 1:1 to the
existing daily category that already scores it — the mapping lives in
`constants.ts#YEARLY_CATEGORY_SOURCE` and is echoed on every output as
`categorySources`.

## Caching

- Yearly cache: 6h TTL, 24 entries.
- Delegates to Monthly (1h) → Weekly → Daily (15m) → Transit cache.
- Cache key: `year|rashi|tz|lang|lat|lon`.

## Future extension points

- Phase 12.6 (Personalized): swap the general Rashi input with a natal chart
  driver; the same rollups work per-house instead of per-rashi.
- AI narration layer: consume `opportunities`, `challenges`, `trends`, and
  `planetaryEvents` — this engine will never produce prose itself.
- Regional festival sets: add slugs to `YEARLY_FESTIVAL_SLUGS` — the timeline
  builder is data-driven.
- PDF / SEO / frontend: strictly downstream — not implemented here.
