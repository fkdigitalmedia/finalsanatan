// ============================================================
// Public API for the dynamic Sanatan translation layer.
//
// Usage in a component:
//   const astro = useAstroTerm();
//   astro("tithi", panchang.tithi.index);      // "एकादशी"
//   astro("nakshatra", nakshatra.index);       // "रोहिणी"
//   astro("planet", "jupiter");                // "गुरु"
//
// Usage in a server function or non-React module:
//   getAstroLabel("tithi", 11, "hi");          // "एकादशी"
//
// NEVER hardcode Sanskrit/Hindi/Tamil labels in engines. Engines
// return IDs; this layer produces display strings.
// ============================================================

import { useCallback, useMemo } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import { getAstroLabel, type AstroDomain } from "./terms";

export type { AstroDomain } from "./terms";
export { getAstroLabel, listAstroKeys, astroCoverage, LOCALIZED } from "./terms";

/**
 * React hook that returns a translator bound to the active language.
 * Also honors admin overrides written under `astro.<domain>.<id>` in
 * the main translation dictionary (via `t()` fallback).
 */
export function useAstroTerm() {
  const { lang, t } = useTranslation();
  return useCallback(
    (domain: AstroDomain, id: string | number): string => {
      // First check whether an admin override exists in the JSON dict.
      const key = `astro.${domain}.${id}`;
      const overridden = t(key);
      if (overridden && overridden !== key) return overridden;
      return getAstroLabel(domain, id, lang);
    },
    [lang, t],
  );
}

/** Convenience: bulk translate an array of IDs in a single call. */
export function useAstroList() {
  const astro = useAstroTerm();
  return useMemo(
    () => (domain: AstroDomain, ids: (string | number)[]) => ids.map((id) => astro(domain, id)),
    [astro],
  );
}
