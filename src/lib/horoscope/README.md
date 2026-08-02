# Horoscope Engine (Phase 12.1 — Foundation)

Backend architecture only. No horoscope content, no AI narrative, no SEO
pages, and no premium gating live in this phase.

## Layout

| File            | Purpose                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `constants.ts`  | 12 Rashis (Sanskrit/English/Hindi/symbol/element/lord), horoscope types, languages.                                                                          |
| `types.ts`      | `HoroscopeInput`, `HoroscopeOutput`, `TransitData`, `PlanetSummary`, `LuckyInfo`, `HoroscopeMetadata`, `ValidationResult`.                                   |
| `helpers.ts`    | Pure utilities (longitude → Rashi, date/time composition).                                                                                                   |
| `validators.ts` | `validateHoroscopeInput` with structured errors.                                                                                                             |
| `core.ts`       | Bridge over the shared astronomy engine — never imports `astronomy-engine` directly.                                                                         |
| `config.ts`     | `DEFAULT_HOROSCOPE_CONFIG` + `resolveHoroscopeConfig`.                                                                                                       |
| `engine.ts`     | `HoroscopeEngine` class: `initialize`, `validateInput`, `loadCurrentPlanetaryData`, `loadPanchang`, `loadBirthChart`, `generate` (returns placeholder JSON). |

## Constraints (enforced)

- Reuses the existing Astronomy, Panchang, and Kundli engines — no duplicated calculations.
- No paid Horoscope APIs.
- No Swiss Ephemeris.

## Usage

```ts
import { createHoroscopeEngine } from "@/lib/horoscope";

const engine = createHoroscopeEngine();
const out = engine.generate({ type: "daily", rashi: "mesha" });
// out.placeholder === true — content generation ships in Phase 12.2.
```

## Next phases

- 12.2 Content rules + narrative sections
- 12.3 AI interpretation layer
- 12.4 SEO landing pages
- 12.5 Premium personalization
