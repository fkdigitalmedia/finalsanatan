# Sade Sati & Dhaiya Engine (Phase 13.3)

Backend-only, JSON-only engine for Saturn's classical periods:
**Sade Sati** (7½ years, Saturn in the 12th / 1st / 2nd from the natal Moon)
and **Dhaiya** (2½ years — Kantaka Shani in the 4th, Ashtama Shani in the 8th).

No AI text, no frontend, no PDF, no SEO.

---

## Architecture

```
src/lib/sadesati/
├── types.ts        structural contracts (input / output / phases / dhaiya)
├── constants.ts    phase metadata, scan tuning, intensity baselines
├── helpers.ts      rashi math, date math, humanized durations, cache keys
├── validators.ts   structured input validation
├── cache.ts        3-tier TTL/FIFO cache (natal, occupancy, output)
├── saturn.ts       Saturn ephemeris scan → sign-occupancy timeline
├── calculator.ts   cycles, phases, status, dhaiya derivation
├── engine.ts       SadeSatiEngine orchestrator + one-shot helper
└── __tests__/      24 automated tests
```

### Reused modules (no duplicated math)

| Need                               | Source                                                |
| ---------------------------------- | ----------------------------------------------------- |
| Natal Moon sign, Lagna             | `@/lib/kundli` → `generateKundli()`                   |
| Saturn sidereal longitude (Lahiri) | `@/lib/transit/core` → `transitSiderealLongitude()`   |
| TTL / FIFO cache primitive         | `@/lib/transit/cache` → `TransitCache`                |
| Language / timezone defaults       | `@/lib/horoscope/config`, `@/lib/horoscope/constants` |

---

## Saturn scanner

`buildSaturnOccupancies(from, to)` walks the window in 8-day steps, detects each
sign change, and bisects the boundary to 6-hour precision. Retrograde wobble near
a cusp can split one classical stay into several short intervals, so any stay
shorter than `MIN_STAY_DAYS` (140) flanked by the same sign is merged back. The
result is a continuous, strictly forward, one-sign-at-a-time timeline:

```json
{ "rashiIndex": 9, "rashi": "Makara", "startISO": "...", "endISO": "...", "durationDays": 906.5 }
```

## Calculation flow

1. Validate input → structured `{ field, message }` errors.
2. Load natal chart (cached per birth signature) → Moon rashi + Lagna rashi.
3. Build Saturn occupancy timeline over `currentDate ± windowYears/2` (default 40y).
4. Match consecutive triples `(Moon+11, Moon+0, Moon+1)` → **Sade Sati cycles**.
5. Classify each cycle / phase as `past | active | upcoming` vs. `currentDate`.
6. Derive status: start, end, elapsed, remaining (days + humanized), progress,
   `intensityScore` (0–100, phase baseline with a mid-phase bell taper).
7. Filter occupancies in the 4th / 8th from Moon → **Dhaiya periods** + status.
8. Emit the **Saturn transit summary** (longitude, sign, degrees, retrograde,
   daily speed, house from Moon and Lagna, current sign window, next ingress).

## Output shape

```
profile { birth…, currentDate, moonRashi(Index), lagnaRashi(Index) }
sadeSati { active, currentPhase, startISO, endISO, elapsedDays,
           remainingDays, remaining{days,months,years,humanized},
           progress, intensityScore }
phases { first, second, third }        // of the active (else next/previous) cycle
cycles[] { startISO, endISO, durationDays, status, phases[3] }
previousCycle | currentCycle | nextCycle
dhaiya { active, current, remainingDays, remaining, progress, next, previous }
dhaiyaPeriods[] { kind: kantaka|ashtama, houseFromMoon: 4|8, … }
saturnTransit { siderealLongitude, rashi, degreesInRashi, retrograde,
                dailySpeed, houseFromMoon, houseFromLagna,
                currentSignStartISO/EndISO, nextSignRashi, daysUntilNextSign }
metadata { engineVersion, dataSource, calculationDurationMs, windowYears,
           occupanciesScanned, cacheHits, timezone, language }
```

## Usage

```ts
import { generateSadeSati, createSadeSatiEngine } from "@/lib/sadesati";

const out = generateSadeSati({
  birth: { date: "1990-06-15", time: "10:30", place: "Mumbai, India",
           latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata" },
  currentDate: "2026-07-29",
});

// Long-lived instance keeps the natal / occupancy / output caches warm:
const engine = createSadeSatiEngine();
engine.generate({ ... });
```

## Caching

| Tier               | TTL    | Key                                                |
| ------------------ | ------ | -------------------------------------------------- |
| Natal chart        | 60 min | birth date/time/lat/lon/tz                         |
| Saturn occupancies | 24 h   | scan window (from\|to dates) — shared across users |
| Output             | 60 min | birth + currentDate + language + windowYears       |

## Validation

`validateSadeSatiInput()` checks birth date/time format, place, lat/lon ranges,
timezone (IANA string or −14…+14 offset), `currentDate` format, supported
language, and `windowYears` ∈ [10, 120]. `generate()` throws on invalid input.

## Testing

```
bunx vitest run src/lib/sadesati
```

24 tests cover validation, timeline continuity / monotonic sign advance /
2.5-year pacing / ephemeris agreement at midpoints, cycle structure and 7.5-year
span, phase sign placement, status consistency, dhaiya house placement, the
mutual exclusivity of Sade Sati and Dhaiya, transit summary sanity, JSON
serialisation, and cache identity.

## Extension points

- **Remedies / severity grading** — extend `PHASE_INTENSITY_BASE` and layer
  natal Saturn strength (`shadbala`) on `intensityScore`.
- **Dasha overlay** — join with `@/lib/dasha` to flag Sade Sati running inside a
  Saturn Mahadasha/Antardasha.
- **Gochar blend** — feed `saturnTransit` into `@/lib/gochar` for a combined
  transit verdict.
- **AI interpretation / premium reports / frontend** — consume the JSON only;
  this module must stay text-free and presentation-free.
