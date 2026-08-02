# Dasha Engine (Phase 13.1)

Backend-only Mahadasha / Antardasha / Pratyantar calculation engine
built on top of the existing Kundli engine. Vimshottari is the only
system implemented in this phase; the interface is designed so
Yogini, Kalachakra, Ashtottari, and Char dashas can plug in later
without touching call sites.

**No AI text. No frontend. No PDF. No SEO.** Pure JSON.

## Architecture

```
BirthInput ─► Kundli Engine ─► Natal Chart (cached)
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  DashaSystem.compute(ctx)     │
                    │  (Vimshottari today; more     │
                    │  systems drop in via registry)│
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    resolveTimelinePosition(timeline, nowISO)
                                    │
                                    ▼
                     DashaOutput (current + timeline)
```

## Files

| File             | Role                                                        |
| ---------------- | ----------------------------------------------------------- |
| `types.ts`       | Structural contracts + `DashaSystem` interface.             |
| `constants.ts`   | Version, YEAR_MS, implemented vs planned systems.           |
| `helpers.ts`     | Days-between, progress math, cache keys.                    |
| `validators.ts`  | Input validation with structured errors.                    |
| `cache.ts`       | TTL/FIFO cache for natal chart and full dasha output.       |
| `vimshottari.ts` | Adapter wrapping `kundli/dasha/vimshottari` (no re-derive). |
| `calculator.ts`  | System-agnostic current/prev/next resolver + progress math. |
| `engine.ts`      | Public `DashaEngine` (system registry + orchestration).     |
| `index.ts`       | Barrel export.                                              |

## Timeline Generation

Vimshottari math is not re-derived here — the shipped
`kundli/dasha/vimshottari` module already computes the classical
120-year cycle from the balance of the natal nakshatra. The adapter:

1. Reads Moon's sidereal longitude from the cached `KundliResult`.
2. Derives nakshatra index + fractional position (0..1).
3. Calls `computeVimshottari(birthUtc, moonNakshatraLord, fraction)`.
4. Maps the returned `MahadashaPeriod[]` into `MahadashaEntry[]`
   with duration-in-days pre-computed.

The shared calculator then finds the timeline slot containing
`currentUtc`, derives elapsed / remaining / progress, and picks the
matching Antardasha and Pratyantar.

## Pluggable System Registry

```ts
interface DashaSystem {
  key: DashaSystemKey; // "vimshottari" | "yogini" | ...
  totalYears: number;
  compute(ctx: DashaSystemContext): DashaSystemComputation;
}
```

`DashaEngine.registerSystem(system)` slots a new implementation in.
`DashaSystemContext` gives the system the natal chart + birth
instant + reference instant so it can derive its own start lord and
period lengths without recomputing astronomy.

Placeholder keys `yogini`, `kalachakra`, `ashtottari`, `char` are
declared in `constants.ALL_SYSTEM_KEYS`; validators reject them with
"not implemented" until a real adapter registers.

## Cache

`DashaCache` layers two `TransitCache` instances:

| Layer  | TTL    | Purpose                                                      |
| ------ | ------ | ------------------------------------------------------------ |
| birth  | 60 min | Cached `KundliResult` per birth signature.                   |
| output | 30 min | Cached final `DashaOutput` per (birth+date+system+language). |

## Extension Points

Reserved for future phases (all deliberately absent):

- **Yogini / Kalachakra / Ashtottari / Char** — implement
  `DashaSystem.compute()` and register via `registerSystem()`.
- **Sub-Sub Periods (Sookshma / Praana)** — deepen the
  `pratyantardashas` recursion inside a system adapter without
  touching the calculator.
- **Localized lord names** — attach a translator layer on the
  output; scoring logic stays language-neutral.
- **AI Interpretation** — feed `DashaOutput` into an LLM in a
  later phase (never inside this module).
- **Premium reports** — combine with Shadbala / Ashtakvarga /
  Kundli yogas already available on `KundliResult`.

## Output Shape

```jsonc
{
  "profile": { … },
  "balanceAtBirth": { "lord": "Venus", "yearsRemaining": 12.34, "daysRemaining": 4507.9 },
  "currentMahadasha": {
    "lord": "Sun",
    "startISO": "2020-01-01T00:00:00.000Z",
    "endISO":   "2026-01-01T00:00:00.000Z",
    "durationDays": 2192.05,
    "elapsedDays": 1500.32,
    "remainingDays": 691.73,
    "progress": 0.6844
  },
  "currentAntardasha": { … },
  "currentPratyantar": { … },
  "previousMahadasha": { "lord": "Venus", "years": 20, … },
  "nextMahadasha":     { "lord": "Moon",  "years": 10, … },
  "timeline": [ … 9 Mahadashas … ],
  "metadata": { "engineVersion": "0.1.0-dasha", "system": "vimshottari", … }
}
```
