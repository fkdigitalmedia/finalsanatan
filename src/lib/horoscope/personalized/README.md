# Personalized Horoscope Engine (Phase 12.6)

Backend-only engine that fuses the caller's natal chart (Kundli) with
live planetary transits and the existing Daily / Weekly / Monthly /
Yearly rollups to produce a single structured personalized payload.

**No AI text. No frontend. No PDF. No SEO.** Pure JSON.

## Architecture

```
BirthInput ─────────────► Kundli Engine ─────► Natal Chart (cached)
                                                    │
Current Date ─► Transit Engine ─► Transit Snapshot ─┤
                                                    ▼
                                            Comparison Engine
                                                    │
                                                    ▼
                              ┌──────────► Planet Influence Map
                              │
Daily / Weekly / Monthly / Yearly Engines
   (called with natal Moon rashi)
                              │
                              ▼
                     Personalized Score Blender  ◄─── 20 life domains
                              │
                              ▼
                    Timeline Builder (today / week / month / year)
                              │
                              ▼
                     PersonalizedHoroscopeOutput (JSON)
```

## Files

| File            | Role                                                          |
| --------------- | ------------------------------------------------------------- |
| `types.ts`      | Structural contracts (input, output, comparison, influence).  |
| `constants.ts`  | Category vocabulary, source mapping, natal↔transit mix.       |
| `helpers.ts`    | Pure utilities (house math, cache keys, tz helpers).          |
| `validators.ts` | Input validation with structured error output.                |
| `cache.ts`      | Wraps TransitCache for birth chart / transit / final output.  |
| `birthchart.ts` | Loads natal chart via existing Kundli engine + snapshot.      |
| `transits.ts`   | Loads live transits via existing Transit engine.              |
| `comparison.ts` | Natal ↔ transit comparison + per-planet influence.            |
| `calculator.ts` | Blends natal + daily scores into 20 personalized categories.  |
| `timeline.ts`   | Runs Daily/Weekly/Monthly/Yearly engines by natal Moon rashi. |
| `engine.ts`     | Public orchestrator (`PersonalizedHoroscopeEngine`).          |
| `index.ts`      | Barrel export.                                                |

## Comparison Engine

For each of the 9 grahas we derive:

- **transitHouseFromLagna** — house counted from the natal ascendant.
- **transitHouseFromNatalMoon** — Chandra gochara house.
- **transitHouseFromNatalPlanet** — how many houses the planet has
  moved since birth (Sade-Sati style scaffold).
- **signChangedSinceBirth** — true if current sign ≠ natal sign.
- **degreesTravelledSinceBirth** — forward-arc ecliptic distance.
- **strengthDelta** — signed heuristic weighting benefic-house presence.

The per-planet influence entry combines:

- **Natal contribution** = dignity base × 0.5 + Shadbala-derived
  strengthScore × 0.5.
- **Transit contribution** = benefic-house-from-lagna base + Chandra
  gochara adjustment + retrograde modifier.
- **Confidence** rises when both lagna & moon houses agree.

## Scoring

Every personalized category maps to exactly one underlying daily
category (see `PERSONALIZED_CATEGORY_SOURCE`). Score math never runs
twice — the Daily Engine remains the single source of truth. Personal
weight comes from `CATEGORY_WEIGHTS` applied to natal planet scores
(dignity + Shadbala).

Final score = `natal × mix.natal + transit × mix.transit`, then nudged
by mean planet-influence for the category (±7.5 points).

## Timeline

Runs the shared engines using the natal Moon rashi so all downstream
data (trends, favorable days, festival calendar) is Chandra-based:

- **Daily** — always.
- **Weekly** — when period is `weekly` / `monthly` / `yearly`.
- **Monthly** — when period is `monthly` / `yearly`.
- **Yearly** — when period is `yearly` (12× monthly under the hood).

## Cache

`PersonalizedCache` layers three TransitCache instances:

| Layer   | TTL    | Purpose                                                      |
| ------- | ------ | ------------------------------------------------------------ |
| birth   | 60 min | Cached KundliResult per birth signature.                     |
| transit | 5 min  | Per-minute-bucket transit snapshots.                         |
| output  | 15 min | Final personalized payload per (birth+date+period+language). |

Underneath, Transit/Daily/Weekly/Monthly/Yearly engines re-use their
own TTL caches, so a single request lifecycle rarely recomputes the
same value twice.

## Extension Points

Reserved slots (all deliberately absent in Phase 12.6):

- **Mahadasha / Antardasha** — plug into `comparison.ts` by adding
  running-dasha lord modifiers to `strengthDelta`.
- **Gochar rules** — replace `BENEFIC_HOUSES_FROM_LAGNA` with a
  planet-specific gochara table for finer-grained influence.
- **AI Interpretation** — feed the output JSON into an LLM in a
  later phase (never inside this module).
- **Premium Reports** — attach richer per-planet remedies /
  yoga-strength / ashtakvarga bindus by extending PlanetInfluenceEntry.

## Output Shape

```jsonc
{
  "profile": { … },
  "birthChart": { … },
  "transits": { … },
  "comparison": [ … 9 planets … ],
  "planetInfluence": { "Sun": { … }, "Moon": { … }, … },
  "scores": {
    "overallEnergy": { "score": 72, "confidence": 0.83, "natal": 68, "transit": 74, "source": "...", "updatedAt": "..." },
    …19 more…
  },
  "timeline": { "todayHighlights": [ … ], "thisWeek": { … }, … },
  "luckyFactors": { "number": 3, "color": "Golden", … },
  "metadata": { "engineVersion": "…+personalized.1", … }
}
```
