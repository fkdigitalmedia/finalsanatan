# Transit Engine (Phase 12.2)

Reusable planetary transit (Gochar) engine. Backend-only — no UI, PDFs, or
AI narrative live here.

## Constraints (enforced)

- Reuses `src/lib/astro/core` — never imports `astronomy-engine` directly.
- No paid APIs. No Swiss Ephemeris.
- Pure JSON output; UI code must call `TransitEngine`, never the
  calculator or core modules.

## Layout

| File            | Purpose                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `types.ts`      | `TransitInput`, `TransitSnapshot`, `PlanetTransit`, `PlanetMetadata`, validation types.                      |
| `constants.ts`  | 9 planets (Sun…Ketu with Sanskrit names), Rashi + Nakshatra tables, engine version.                          |
| `helpers.ts`    | Angle math, Rashi/Nakshatra/Pada lookups, date parsing.                                                      |
| `validators.ts` | `validateTransitInput` with structured errors.                                                               |
| `core.ts`       | Sidereal / tropical / latitude bridge over `@/lib/astro/core`; mean lunar node for Rahu/Ketu (Meeus Ch. 47). |
| `calculator.ts` | Per-planet compute: speed, retrograde, previous + next sign ingress with binary-search refinement.           |
| `cache.ts`      | TTL + FIFO-capped `TransitCache` with a `cacheKey` builder.                                                  |
| `engine.ts`     | `TransitEngine` orchestrator + `generateTransitSnapshot` one-shot.                                           |

## Supported planets

Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu.
Rahu/Ketu use the **mean** lunar node (accurate to a few arc-minutes,
matching every mainstream Vedic panchanga engine).

## Per-planet output

`name`, `sanskrit`, `longitude` (sidereal, Lahiri), `latitude`,
`rashi` / `rashiIndex` / `degreesInRashi`, `nakshatra` / `nakshatraIndex` /
`pada`, `speed` (°/day), `retrograde`, `signEntry` (previous ingress ISO),
`nextSignChange` (next ingress ISO).

## Usage

```ts
import { generateTransitSnapshot, createTransitEngine } from "@/lib/transit";

// One-shot
const snap = generateTransitSnapshot({
  date: "2026-07-29",
  location: { latitude: 28.61, longitude: 77.21, timezone: "Asia/Kolkata" },
});

// Long-lived (shares cache across calls)
const engine = createTransitEngine();
engine.detectRetrograde("Mercury", new Date());
engine.calculateNextIngress("Jupiter", new Date());
```

## Data flow

```text
TransitInput
    │
    ▼
validators.validateTransitInput  ──► TransitValidationResult
    │  (ok)
    ▼
engine.TransitEngine
    │
    ├─► core.ayanamsaAt(date)              (astro/core → Lahiri)
    │
    └─► calculator.calculatePlanetTransit  (per planet, memoised via cache.ts)
            │
            ├─► core.transitSiderealLongitude ─┐
            ├─► core.transitEclipticLatitude   ├─► astro/core → astronomy-engine
            └─► detectSpeed / detectRetrograde ┘
                calculatePreviousIngress
                calculateNextIngress            (binary-search refinement)
    │
    ▼
TransitSnapshot  { date, location, planets[], summary[], ayanamsa, meta }
```

## Module dependencies

```text
UI / horoscope / gochar / muhurat / festival / AI
        │
        ▼
   transit/engine.ts
        │
        ├──► transit/validators.ts
        ├──► transit/calculator.ts
        │         └──► transit/core.ts ──► @/lib/astro/core ──► astronomy-engine
        ├──► transit/cache.ts
        └──► transit/helpers.ts   (also used by calculator + core)
```

## Future-ready

The engine exposes the primitives every downstream module needs:

- **Daily / Weekly / Monthly / Yearly Horoscope** → per-planet Rashi + retrograde
- **Gochar Report** → `signEntry` + `nextSignChange` diffs vs natal chart
- **Varshphal** → yearly snapshot at solar return
- **Festival Engine** → Sun / Moon ingresses drive Sankranti, Amavasya, Purnima
- **Muhurat Engine** → live retrograde + Nakshatra lookups
- **AI Astrology Engine** → structured JSON is the prompt payload

## Testing

```bash
bunx vitest run src/lib/transit
```
