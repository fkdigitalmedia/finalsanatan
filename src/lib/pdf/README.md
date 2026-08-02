# Universal PDF Report Engine (`src/lib/pdf/`)

Template-driven PDF generation for **every** report on SanatanTools. The
engine contains **no hardcoded layouts** — a report is a JSON template
(paper + theme + branding + ordered sections) rendered against a data
context. New reports need new template rows, not new code.

## Architecture

```text
GenerateOptions ─► PDFEngine.generate()
                     │
                     ├─ template-loader ─► backend (pdf_templates) ─► cache ─► default-templates
                     ├─ template-manager ─► themes (built-in + admin)
                     ├─ fonts       (lazy Noto per language, Indic shaping)
                     ├─ images      (logo / watermark / background / QR)
                     ├─ renderer    (section registry → components/tables/charts)
                     ├─ toc         (reserved page, filled after the pass)
                     ├─ header/footer/watermark (stamped on every page)
                     └─ export      (blob + data URL, optional encryption)
```

| File                                                                   | Responsibility                                                                                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `engine.ts`                                                            | `PDFEngine`: `generate/preview/download/save/loadTemplate/renderTemplate/renderCharts/renderTables/renderHeader/renderFooter/renderTOC/compress` |
| `renderer.ts`                                                          | Section registry + dispatch, markdown renderer, data binding                                                                                     |
| `template-manager.ts`                                                  | In-memory templates + themes, duplicate/publish/archive                                                                                          |
| `template-loader.ts`                                                   | Backend source with TTL cache, safe fallbacks                                                                                                    |
| `default-templates.ts`                                                 | Starter templates (data, not layout code)                                                                                                        |
| `components.ts`                                                        | Text, headings, panels, badges, bars, score cards, timeline, borders                                                                             |
| `tables.ts`                                                            | Generic table renderer + planet/house/strength mappers                                                                                           |
| `charts.ts`                                                            | North / South / East Indian + wheel / planet-wheel / house-wheel                                                                                 |
| `fonts.ts` `images.ts` `watermark.ts` `header.ts` `footer.ts` `toc.ts` | Supporting layers                                                                                                                                |
| `cache.ts` `validators.ts` `helpers.ts` `constants.ts` `types.ts`      | Infrastructure                                                                                                                                   |

## Themes

Built-in: `classic`, `premium`, `luxury`, `modern`, `minimal`, `temple`.
Admins add unlimited custom themes (`pdf_themes`); `registerTheme()` merges
them into the resolver. A theme controls colours, typography (size, scale,
line height, letter spacing, RTL) and decoration (backgrounds, borders,
divider style, corner radius).

## Sections

`cover, introduction, summary, toc, divider, heading, paragraph, markdown,
keyvalue, table, planet-table, house-table, planet-strength-table, chart,
wheel-chart, dasha-timeline, transit-timeline, timeline, dosha-summary,
yoga-summary, festival-calendar, scorecards, progress-bars, badges,
recommendations, image, qrcode, signature, disclaimer, appendix, pagebreak,
spacer`

Register more at runtime:

```ts
pdfEngine.registerSection("my-block", (ctx, section) => {
  /* draw */
});
```

Each section supports `title`, `enabled`, `inToc`, `newPage`, `visibleWhen`
and free-form `options`.

## Variables

Any string option or title may contain `{{path}}` placeholders resolved
against the data context (`{{user}}`, `{{birthDate}}`, `{{lagna}}`,
`{{mahadasha}}`, `{{summary}}`, `{{branding.company}}`, `{{page}}`,
`{{pages}}`, …). `{{a.b[0].c|fallback}}` works; unknown variables collapse
to an empty string. Structured options bind by reference with
`<option>Source`, e.g. `{ planetsSource: "planetTable" }`.

## Usage

```ts
import { pdfEngine } from "@/lib/pdf";

const result = await pdfEngine.download({
  report: "janam-kundli",
  language: "hi",
  data: { user, birthDate, kundliChart, planetTable, mahadasha, summary },
});
```

`preview()` returns a data URL for an `<iframe>`; `save(options, persist)`
hands the blob to any storage callback.

## Rendering flow

1. Load + merge template, validate, resolve theme/fonts/images/QR.
2. Walk sections; each may paginate, register TOC entries and reserve pages.
3. Fill the reserved TOC page with real page numbers.
4. Stamp watermark, decorative border, header and footer on every page.
5. Export (optionally encrypted) and cache by template + data hash.

## Multilingual

English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam,
Punjabi, Bengali, Odia, Assamese. Indic scripts reuse the proven Kundli
font + shaping pipeline; RTL is detected per language for future scripts.

## Caching & performance

Templates cache for 10 min, PDFs for 15 min, both keyed on a stable hash so
any data change invalidates automatically. Fonts load lazily, images are
downsampled to the export DPI, and output is compressed unless the template
requests print quality.

## Admin guide

`/admin/pdf` manages templates and themes: create, duplicate, live-preview,
publish, archive and delete; edit paper size, orientation, margins, header,
footer, branding, watermark, QR, signature and the section list.

## Developer extension points

- `registerSection(type, renderer)` — new components
- `registerTheme(theme)` — new themes
- `setTemplateSource(source)` — alternative template backends
- `buildDefaultTemplate(report)` — starter template for future reports

## Testing

`src/lib/pdf/__tests__/pdf-engine.test.ts` — 58 tests covering variables,
themes, validation, caching, template loading/fallbacks, text pagination,
tables with repeating headers, all chart styles, visual components, cover,
header/footer, watermark, TOC, unicode, a full Kundli pass and a large
report performance check.
