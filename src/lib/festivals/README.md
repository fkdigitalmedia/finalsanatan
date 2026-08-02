# Festival Rules Engine

Dedicated engine that resolves Hindu festival dates. **Does not duplicate
any astronomical math** — every rule module calls helpers that in turn
call the Panchang engine (`src/lib/panchang.ts`), which uses the shared
astronomical core (`src/lib/astro/core.ts`).

```
src/lib/festivals/
├── types.ts           FestivalRule contract (metadata + resolve())
├── helpers.ts         Only file allowed to call panchang.ts
├── engine.ts          resolveFestival / resolveAllFestivals
├── registry.ts        Central list of all rule modules
└── rules/
    ├── diwali.ts
    ├── holi.ts
    ├── raksha-bandhan.ts
    ├── janmashtami.ts
    ├── maha-shivaratri.ts
    ├── ganesh-chaturthi.ts
    ├── navratri.ts
    ├── makar-sankranti.ts
    ├── karva-chauth.ts
    ├── ekadashi.ts      (multi-emit: all Ekadashis of year)
    ├── purnima.ts       (multi-emit)
    └── amavasya.ts      (multi-emit)
```

## Rule module contract

Every rule exports a `FestivalRule` with:

| Field                   | Purpose                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| `dependencies`          | Declarative astronomical inputs (tithi, nakshatra, lunar month, rashi, anchor) |
| `traditionalRule`       | Human-readable Shastric rule                                                   |
| `regionalVariations`    | Region-specific differences and overrides                                      |
| `edgeCases`             | Documented handling for double-tithi, absent nakshatra, etc.                   |
| `i18n`                  | Localization keys for `nameKey` and `descriptionKey`                           |
| `validation.knownDates` | Reference dates from DrikPanchang / traditional almanacs                       |
| `resolve(year, loc)`    | Returns `ResolvedFestival[]` for the Gregorian year                            |

## Usage

```ts
import { resolveFestival, resolveAllFestivals } from "@/lib/festivals/engine";
import { DEFAULT_LOCATION } from "@/lib/panchang";

const diwali2026 = resolveFestival("diwali", 2026, DEFAULT_LOCATION);
const all2026 = resolveAllFestivals(2026, DEFAULT_LOCATION);
```

## Adding a new festival

1. Create `src/lib/festivals/rules/<slug>.ts` implementing `FestivalRule`.
2. Register it in `src/lib/festivals/registry.ts`.
3. Add reference dates to `validation.knownDates`.
4. Run `bun run scripts/validate-festivals.ts`.

## Validation

```bash
bun run scripts/validate-festivals.ts
```

Compares each rule's `knownDates` against `resolve()` output. `tolerance: 1`
allows ±1 day drift for festivals whose date depends on pradosh / nishitha
kaal (Diwali, Shivaratri, Janmashtami) where a pure sunrise-vyapini
approximation can shift by one day at the tithi boundary.
