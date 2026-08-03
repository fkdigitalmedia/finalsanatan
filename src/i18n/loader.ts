/**
 * Translation loader — dynamically imports language JSON on demand and caches
 * it in memory. New languages just need a file at
 * `src/i18n/translations/<code>.json` and an entry in `src/i18n/config.ts`.
 */

import { DEFAULT_LANGUAGE, isSupportedLanguage } from "./config";
import enTranslations from "./translations/en.json";

export type TranslationDict = Record<string, unknown>;

// Vite glob import — every JSON file under translations/ is discoverable
// without an explicit switch statement. `import: "default"` returns the
// parsed JSON directly and `eager: false` (default) makes each language a
// separate async chunk so only what's used ships to the browser.
const modules = import.meta.glob<TranslationDict>("./translations/*.json", {
  import: "default",
});

const cache = new Map<string, TranslationDict>();
cache.set(DEFAULT_LANGUAGE, enTranslations as TranslationDict);

/** English translations are always available synchronously as the fallback. */
export const fallbackTranslations: TranslationDict = enTranslations as TranslationDict;

/**
 * Merge a flat map of dotted-key overrides (from the TMS database) into an
 * already-loaded language dictionary. Returns a NEW dict so React sees the
 * reference change.
 */
export function applyOverrides(
  base: TranslationDict,
  overrides: Record<string, string>,
): TranslationDict {
  if (!overrides || Object.keys(overrides).length === 0) return base;
  const clone = structuredClone(base);
  for (const [dottedKey, value] of Object.entries(overrides)) {
    const parts = dottedKey.split(".");
    let node: Record<string, unknown> = clone as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const p = parts[i];
      if (typeof node[p] !== "object" || node[p] === null) node[p] = {};
      node = node[p] as Record<string, unknown>;
    }
    node[parts[parts.length - 1]] = value;
  }
  return clone;
}

/**
 * Flatten a nested translation dict into `{"a.b.c": "value"}` — used by the
 * admin panel to list every source key when detecting missing translations.
 */
export function flattenDict(
  dict: TranslationDict,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  for (const [k, v] of Object.entries(dict)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[path] = v;
    else if (v && typeof v === "object" && !Array.isArray(v))
      flattenDict(v as TranslationDict, path, out);
  }
  return out;
}

/**
 * Load a translation dictionary. Falls back to English on any failure.
 * The English bundle is inlined so SSR and first paint never wait on I/O.
 */
export async function loadTranslations(lang: string): Promise<TranslationDict> {
  const code = isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  const cached = cache.get(code);
  if (cached) return cached;

  const importer = modules[`./translations/${code}.json`];
  if (!importer) {
    cache.set(code, fallbackTranslations);
    return fallbackTranslations;
  }

  try {
    const dict = await importer();
    cache.set(code, dict);
    return dict;
  } catch (err) {
    console.warn(`[i18n] failed to load '${code}', falling back to English`, err);
    cache.set(code, fallbackTranslations);
    return fallbackTranslations;
  }
}

/** Synchronous accessor — only returns a dict if it's already cached. */
export function getCachedTranslations(lang: string): TranslationDict | undefined {
  return cache.get(lang);
}

const STATIC_FALLBACKS: Record<string, string> = {
  "kundli.aiPanel.title": "AI Kundli Analysis & Insights",
  "kundli.aiPanel.subtitle": "Personalized AI-powered astrological interpretation of your birth chart",
  "kundli.aiPanel.premium_badge": "PREMIUM REPORT",
  "kundli.aiPanel.free_preview_badge": "FREE PREVIEW",
  "kundli.aiPanel.unlock_full_report": "Unlock Full Report",
  "kundli.aiPanel.premium_only": "Premium Feature",
  "kundli.aiPanel.loading_title": "GENERATING AI KUNDLI INTERPRETATION",
  "kundli.aiPanel.loading_subtitle": "Analyzing planetary placements, house positions & classical Vedic yogas...",
  "kundli.aiPanel.loading_tips.0": "Calculating planetary dignities and Ashtakavarga strength...",
  "kundli.aiPanel.loading_tips.1": "Synthesizing Vimshottari Dasha sub-periods with natal chart placements...",
  "kundli.aiPanel.loading_tips.2": "Evaluating 150+ classical Yogas and Dosha cancellation rules...",
  "kundli.aiPanel.loading_tips.3": "Formatting custom personalized life recommendations...",
  "kundli.aiPanel.could_not_generate": "Could not generate AI interpretation",
  "kundli.aiPanel.retry": "Retry",
  "kundli.aiPanel.disclaimer": "Disclaimer: AI interpretations are generated using classical Vedic astrology principles for guidance and educational purposes."
};

/**
 * Read a dotted key path (`common.sign_in`) out of a translation dict.
 * Falls back to English if the target language is missing the key.
 * Returns a human-readable fallback if neither has it, so raw dotted keys never appear.
 */
export function resolveKey(
  dict: TranslationDict | undefined,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value =
    pick(dict, key) ??
    pick(fallbackTranslations, key) ??
    STATIC_FALLBACKS[key];

  if (typeof value !== "string") {
    const parts = key.split(".");
    const lastPart = parts[parts.length - 1] ?? key;
    const readable = lastPart
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return vars ? interpolate(readable, vars) : readable;
  }
  return vars ? interpolate(value, vars) : value;
}

function pick(dict: TranslationDict | undefined, key: string): unknown {
  if (!dict) return undefined;
  const parts = key.split(".");
  let node: unknown = dict;
  for (const p of parts) {
    if (node && typeof node === "object" && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return node;
}

/**
 * Read a dotted key and return the raw value (string | object | array).
 * Falls back to English when the language dict is missing the key.
 * Useful for structured content like FAQ arrays.
 */
export function resolveRaw(dict: TranslationDict | undefined, key: string): unknown {
  return pick(dict, key) ?? pick(fallbackTranslations, key);
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  // Supports both `{name}` and `{{name}}` placeholders.
  return template.replace(/\{\{?\s*(\w+)\s*\}?\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
