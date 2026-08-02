/**
 * Localized tool content packs.
 *
 * Each language directory (e.g. `./hi/todays-panchang.json`) is generated
 * by `scripts/translate-tool-content.ts` and contains a translated
 * FlagshipContentSpec. Missing files fall through to English.
 *
 * The JSON is loaded LAZILY, one (lang, slug) pair at a time. An eager glob
 * inlined ~2 MB of translated copy for all languages and all ~90 tools into
 * the /tools/:slug route chunk, which every tool page had to download before
 * it could render. Each pack is a few KB on its own.
 */
import { useEffect, useState } from "react";
import type { FlagshipContentSpec } from "@/tools/content/flagship";

type Loader = () => Promise<FlagshipContentSpec>;

// Lazy glob: Vite emits one small chunk per JSON file instead of inlining them.
const MODULES = import.meta.glob<FlagshipContentSpec>("./*/*.json", {
  import: "default",
}) as unknown as Record<string, Loader>;

// key: "hi/todays-panchang" → loader
const INDEX: Record<string, Loader> = {};
for (const [path, load] of Object.entries(MODULES)) {
  const m = path.match(/^\.\/([a-z]{2})\/(.+)\.json$/);
  if (!m) continue;
  INDEX[`${m[1]}/${m[2]}`] = load;
}

/** True when a translated pack exists for this pair (no download). */
export function hasLocalizedToolContent(slug: string, lang: string): boolean {
  if (!lang || lang === "en") return false;
  return `${lang}/${slug}` in INDEX;
}

/** Fetch one translated pack; resolves undefined when there is none. */
export async function loadLocalizedToolContent(
  slug: string,
  lang: string,
): Promise<FlagshipContentSpec | undefined> {
  if (!lang || lang === "en") return undefined;
  const load = INDEX[`${lang}/${slug}`];
  if (!load) return undefined;
  try {
    return await load();
  } catch {
    // A missing/corrupt pack must never break the page — fall back to English.
    return undefined;
  }
}

/**
 * Translated copy for a tool, or undefined while loading / when English.
 * Callers fall back field-by-field to the English spec.
 */
export function useLocalizedToolContent(
  slug: string,
  lang: string,
): FlagshipContentSpec | undefined {
  const [spec, setSpec] = useState<FlagshipContentSpec>();

  useEffect(() => {
    let active = true;
    setSpec(undefined);
    if (!hasLocalizedToolContent(slug, lang)) return;
    void loadLocalizedToolContent(slug, lang).then((next) => {
      if (active) setSpec(next);
    });
    return () => {
      active = false;
    };
  }, [slug, lang]);

  return spec;
}
