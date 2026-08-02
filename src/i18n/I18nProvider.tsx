/**
 * I18nProvider — the single source of truth for the active language,
 * translation dictionary, and helpers used across the app.
 *
 * Consumers should NOT hardcode strings. Use:
 *   - `useTranslation()` → `{ t, lang, dir, setLanguage, localizedPath }`
 *   - `<Trans i18nKey="common.sign_in" />` for JSX
 */

import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";

import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  getLanguage,
  isSupportedLanguage,
  type LanguageDef,
} from "./config";
import {
  detectClientLanguage,
  langFromPathname,
  stripLangPrefix,
  withLangPrefix,
  writeStoredLanguage,
} from "./detect";
import {
  applyOverrides,
  fallbackTranslations,
  getCachedTranslations,
  loadTranslations,
  resolveKey,
  resolveRaw,
  type TranslationDict,
} from "./loader";
import { getPublicOverrides } from "@/lib/translations.functions";

export interface I18nContextValue {
  /** Active language code, e.g. `"hi"`. */
  lang: string;
  /** Full metadata for the active language. */
  language: LanguageDef;
  /** Writing direction — mirrors `language.dir`. */
  dir: "ltr" | "rtl";
  /** All languages configured in the app. */
  languages: LanguageDef[];
  /** True while a non-English dictionary is still loading. */
  loading: boolean;
  /**
   * Translate a key. Missing keys fall through to English, then to the key
   * itself so nothing crashes if a translation file is incomplete.
   */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Read a dotted key and return the raw value (string | object | array). */
  raw: <T = unknown>(key: string) => T | undefined;
  /** Rewrite an app path to include the current (or a specified) language prefix. */
  localizedPath: (path: string, overrideLang?: string) => string;
  /** Strip the language prefix from any path (safe for signed-out routes). */
  stripLanguage: (path: string) => string;
  /** Persist + navigate to the given language while keeping the current path. */
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
  /** Optional initial language (SSR-provided). Falls back to detection. */
  initialLanguage?: string;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initial = useMemo(() => {
    const fromUrl = langFromPathname(pathname);
    if (fromUrl) return fromUrl;
    if (isSupportedLanguage(initialLanguage)) return initialLanguage!;
    return DEFAULT_LANGUAGE;
  }, [pathname, initialLanguage]);

  const [lang, setLangState] = useState<string>(initial);
  const [dict, setDict] = useState<TranslationDict>(
    () => getCachedTranslations(initial) ?? fallbackTranslations,
  );
  const [loading, setLoading] = useState<boolean>(() => !getCachedTranslations(initial));

  // Keep <html lang> and <html dir> in sync with the active language.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = getLanguage(lang);
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  // Reconcile with URL changes and browser detection on first client mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const detected = detectClientLanguage(window.location.pathname);
    if (detected !== lang) {
      setLangState(detected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the URL prefix changes (user navigates to /hi/... etc.), follow it.
  useEffect(() => {
    const fromUrl = langFromPathname(pathname);
    if (fromUrl && fromUrl !== lang) setLangState(fromUrl);
  }, [pathname, lang]);

  // Load the dictionary whenever the active language changes, then merge
  // any admin-approved overrides from the TMS on top of it.
  useEffect(() => {
    let cancelled = false;
    const cached = getCachedTranslations(lang);
    const applyDictAndOverrides = async (base: TranslationDict) => {
      if (cancelled) return;
      setDict(base);
      setLoading(false);
      // Best-effort — TMS overrides are optional; failures fall through to JSON.
      try {
        const { overrides } = await getPublicOverrides({ data: { lang } });
        if (cancelled) return;
        if (overrides && Object.keys(overrides).length > 0) {
          setDict(applyOverrides(base, overrides));
        }
      } catch {
        /* ignore — public site keeps working with baseline JSON */
      }
    };
    if (cached) {
      void applyDictAndOverrides(cached);
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    loadTranslations(lang)
      .then((d) => applyDictAndOverrides(d))
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => resolveKey(dict, key, vars),
    [dict],
  );

  const raw = useCallback(<T,>(key: string) => resolveRaw(dict, key) as T | undefined, [dict]);

  const localizedPath = useCallback(
    (path: string, overrideLang?: string) => withLangPrefix(path, overrideLang ?? lang),
    [lang],
  );

  const setLanguage = useCallback((next: string) => {
    if (!isSupportedLanguage(next)) return;
    writeStoredLanguage(next);
    setLangState(next);
    if (typeof window !== "undefined") {
      const newPath = withLangPrefix(window.location.pathname, next);
      const target = newPath + window.location.search + window.location.hash;
      // Hard replace so every subtree re-reads the new dictionary cleanly.
      window.history.replaceState(null, "", target);
      // Trigger router re-sync without a full reload for prefixed languages.
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      language: getLanguage(lang),
      dir: getLanguage(lang).dir,
      languages: LANGUAGES.filter((l) => l.enabled),
      loading,
      t,
      raw,
      localizedPath,
      stripLanguage: stripLangPrefix,
      setLanguage,
    }),
    [lang, loading, t, raw, localizedPath, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Primary hook: `const { t, lang, setLanguage } = useTranslation();` */
export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <I18nProvider>");
  }
  return ctx;
}

/** Convenience alias for components that only care about the active language. */
export function useLanguage(): LanguageDef {
  return useTranslation().language;
}

/**
 * Declarative translation component.
 *
 *   <Trans i18nKey="common.sign_in" />
 *   <Trans i18nKey="greeting" vars={{ name: user.name }} as="h1" className="..." />
 */
export interface TransProps {
  i18nKey: string;
  vars?: Record<string, string | number>;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  fallback?: string;
}

export function Trans({ i18nKey, vars, as, className, fallback }: TransProps) {
  const { t } = useTranslation();
  const value = t(i18nKey, vars);
  const text = value === i18nKey && fallback ? fallback : value;
  if (!as) return <>{text}</>;
  const Tag = as as React.ElementType;
  return <Tag className={className}>{text}</Tag>;
}
