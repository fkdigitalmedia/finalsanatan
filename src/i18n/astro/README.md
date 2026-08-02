# Dynamic Translation System (Sanatan Astro Terms)

Separates **calculations** from **language**. Engines emit neutral IDs;
this layer produces display strings.

```
Engine  →  Internal ID  →  Translation Layer  →  Selected Language  →  UI
```

## Rules

1. **Engines return IDs only.** Never a Hindi/Tamil/English string.
   - `panchang.tithi.index` → `11`
   - `kundli.planets[0].body` → `"sun"`
   - `festivals.rules[0].slug` → `"diwali"`
2. **UI translates via the layer**, not by mapping tables inside components.
3. **Sanskrit terms are preserved** across languages (Panchang, Tithi,
   Nakshatra, Yoga, Karana, Rahu Kaal, Lagna, Kundli, Navamsa, Mahadasha,
   Antardasha, Ekadashi, …). Only the _script_ changes.
4. **Never Google-Translate.** Culturally accurate wording only.

## Domains

`tithi`, `paksha`, `nakshatra`, `yoga`, `karana`, `weekday`,
`month_gregorian`, `month_lunar`, `month_solar`, `rashi`, `planet`,
`house`, `muhurat`, `temple_type`, `element`, `direction`, `dosha`,
`yogas`, `dasha`, `planet_status`, `planet_strength`, `retrograde`,
`festival`, `astro_term`.

## Usage

### React component

```tsx
import { useAstroTerm } from "@/i18n/astro";

const astro = useAstroTerm();
<span>{astro("tithi", tithi.index)}</span>       // एकादशी
<span>{astro("nakshatra", nak.index)}</span>     // रोहिणी
<span>{astro("planet", "jupiter")}</span>        // गुरु
```

### Non-React (server fn, PDF, email)

```ts
import { getAstroLabel } from "@/i18n/astro";
getAstroLabel("tithi", 11, "hi"); // एकादशी
```

## Admin overrides

The `translations` table stores rows with keys of the form
`astro.<domain>.<id>` (e.g. `astro.tithi.11`). Approved rows are merged
into the runtime dictionary by `I18nProvider` and take precedence over
the built-in labels. The admin panel already ships editor, missing-key
report, import/export and AI queue — see
`/admin/translations`.

## Adding a language

1. Add an entry to `src/i18n/config.ts` (`LANGUAGES`).
2. Add a partial map to `LOCALIZED` in `terms.ts` — only the strings
   that diverge from English need to be listed.
3. Missing keys automatically fall back to English so the UI never
   crashes.
