/**
 * LocalizedHead — client-side sync of head tags to the active language.
 *
 * Emits per-language:
 *   - <title>
 *   - meta description
 *   - og:title / og:description / og:locale / og:url / og:type
 *   - twitter:title / twitter:description / twitter:card
 *   - <link rel="canonical"> (self-referencing per language)
 *   - <link rel="alternate" hreflang="…"> for every supported language + x-default
 *   - Optional JSON-LD script (with `inLanguage`)
 *
 * Route `head()` still ships English at SSR; this component takes over on
 * the client, keeping the head consistent with URL prefix + user language.
 */

import { useEffect } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import { DEFAULT_LANGUAGE, LANGUAGES, getLanguage } from "@/i18n/config";
import { stripLangPrefix } from "@/i18n/detect";

export interface LocalizedHeadProps {
  /** i18n key for <title>, e.g. `home.meta.title` */
  titleKey: string;
  /** i18n key for meta description */
  descriptionKey?: string;
  /** Optional i18n key for og:title (defaults to titleKey) */
  ogTitleKey?: string;
  /** Optional i18n key for og:description (defaults to descriptionKey) */
  ogDescriptionKey?: string;
  /** Override og:type (defaults to "website"). */
  ogType?: string;
  /** Optional structured-data (JSON-LD) object; stringified into a script tag with id `ld-<id>`. */
  structuredData?: { id: string; data: Record<string, unknown> };
}

function setMeta(selector: string, value: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, name] = selector.match(/\[(?:name|property)="([^"]+)"\]/) ?? [];
    if (name) {
      if (selector.includes("property=")) el.setAttribute("property", name);
      else el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function pathFor(lang: string, path: string): string {
  const bare = stripLangPrefix(path) || "/";
  return `/${lang}${bare === "/" ? "" : bare}`;
}

/**
 * Rewrite the language-alternate + canonical link tags in the document head
 * to reflect the current URL path. All previously-managed alternates are
 * removed first, then the current set is written — this keeps head tags in
 * sync when the user navigates between routes without reloading.
 */
function syncLinkAlternates(currentPath: string, currentLang: string, origin: string) {
  if (typeof document === "undefined") return;

  // Clean up any previously managed alternates + canonical
  document.head
    .querySelectorAll<HTMLLinkElement>('link[data-i18n-managed="true"]')
    .forEach((el) => el.remove());

  const bare = stripLangPrefix(currentPath) || "/";

  // Canonical → self-referencing for the current language variant
  const canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", origin + pathFor(currentLang, bare));
  canonical.setAttribute("data-i18n-managed", "true");
  document.head.appendChild(canonical);

  // hreflang alternates for every enabled language + x-default
  for (const lang of LANGUAGES.filter((l) => l.enabled)) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang.code);
    link.setAttribute("href", origin + pathFor(lang.code, bare));
    link.setAttribute("data-i18n-managed", "true");
    document.head.appendChild(link);
  }
  const xDefault = document.createElement("link");
  xDefault.setAttribute("rel", "alternate");
  xDefault.setAttribute("hreflang", "x-default");
  xDefault.setAttribute("href", origin + pathFor(DEFAULT_LANGUAGE, bare));
  xDefault.setAttribute("data-i18n-managed", "true");
  document.head.appendChild(xDefault);
}

function applyLocalizedHead(
  lang: string,
  title: string | undefined,
  description: string | undefined,
  ogType: string,
  structuredData?: { id: string; data: Record<string, unknown> },
) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const language = getLanguage(lang);
  const origin = window.location.origin;
  const path = window.location.pathname;

  // Update HTML lang attribute dynamically
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;

  if (title) {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
  }
  if (description) {
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:description"]', description);
  }
  setMeta('meta[property="og:locale"]', language.code);
  setMeta('meta[property="og:url"]', origin + pathFor(lang, path));
  setMeta('meta[property="og:type"]', ogType);
  setMeta('meta[name="twitter:card"]', "summary_large_image");
  // Alternate og:locale entries help Facebook show the right variant.
  document.head
    .querySelectorAll<HTMLMetaElement>(
      'meta[property="og:locale:alternate"][data-i18n-managed="true"]',
    )
    .forEach((el) => el.remove());
  for (const l of LANGUAGES.filter((l) => l.enabled && l.code !== lang)) {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:locale:alternate");
    m.setAttribute("content", l.code);
    m.setAttribute("data-i18n-managed", "true");
    document.head.appendChild(m);
  }

  syncLinkAlternates(path, lang, origin);

  if (structuredData) {
    const id = `ld-${structuredData.id}`;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      inLanguage: language.code,
      ...structuredData.data,
    });
  }
}

export function LocalizedHead({
  titleKey,
  descriptionKey,
  ogTitleKey,
  ogDescriptionKey,
  ogType = "website",
  structuredData,
}: LocalizedHeadProps) {
  const { t, lang } = useTranslation();

  useEffect(() => {
    const title = titleKey ? t(ogTitleKey ?? titleKey) : undefined;
    const description = descriptionKey ? t(ogDescriptionKey ?? descriptionKey) : undefined;
    applyLocalizedHead(
      lang,
      title && title !== (ogTitleKey ?? titleKey) ? title : undefined,
      description && description !== (ogDescriptionKey ?? descriptionKey) ? description : undefined,
      ogType,
      structuredData,
    );
  }, [t, lang, titleKey, descriptionKey, ogTitleKey, ogDescriptionKey, ogType, structuredData]);

  return null;
}

/**
 * Same as LocalizedHead but takes already-resolved strings — useful when
 * the title/description come from a per-item dictionary (e.g. per-tool i18n)
 * rather than a translation key.
 */
export function LocalizedHeadRaw({
  title,
  description,
  ogType = "website",
  structuredData,
}: {
  title: string;
  description?: string;
  ogType?: string;
  structuredData?: { id: string; data: Record<string, unknown> };
}) {
  const { lang } = useTranslation();
  useEffect(() => {
    applyLocalizedHead(lang, title, description, ogType, structuredData);
  }, [lang, title, description, ogType, structuredData]);
  return null;
}
