/**
 * Language detection & persistence helpers.
 *
 * Priority order used by the provider:
 *   1. URL prefix   — `/hi/...` wins so shared links keep their language.
 *   2. Cookie       — set by the language switcher, readable during SSR.
 *   3. localStorage — client-only fallback (older sessions before cookies).
 *   4. Browser `navigator.languages` / `Accept-Language`.
 *   5. DEFAULT_LANGUAGE.
 */

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_STORAGE_KEY,
  isSupportedLanguage,
} from "./config";

/** Extract the language code from the leading URL segment, if any. */
export function langFromPathname(pathname: string): string | undefined {
  const seg = pathname.split("/").filter(Boolean)[0];
  return isSupportedLanguage(seg) ? seg : undefined;
}

/** Strip a leading language segment, returning the path without prefix. */
export function stripLangPrefix(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!isSupportedLanguage(seg)) return pathname || "/";
  const rest = pathname.replace(new RegExp(`^/${seg}`), "");
  return rest.length === 0 ? "/" : rest;
}

/** Prepend a language segment to any path, replacing an existing one. */
export function withLangPrefix(pathname: string, lang: string): string {
  const bare = stripLangPrefix(pathname);
  const code = isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  return `/${code}${bare === "/" ? "" : bare}`;
}

/** Parse a raw `Accept-Language` header or `navigator.languages` array. */
export function pickFromAcceptLanguage(
  candidates: readonly string[] | string | undefined,
): string | undefined {
  if (!candidates) return undefined;
  const list: string[] = Array.isArray(candidates)
    ? [...candidates]
    : (candidates as string)
        .split(",")
        .map((part: string) => part.split(";")[0].trim())
        .filter(Boolean);

  for (const raw of list) {
    const primary = raw.toLowerCase().split("-")[0];
    if (LANGUAGE_CODES.includes(primary)) return primary;
  }
  return undefined;
}

/** Client-only: read the saved language from cookie or localStorage. */
export function readStoredLanguage(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const cookie = readCookie(LANGUAGE_COOKIE_NAME);
  if (isSupportedLanguage(cookie)) return cookie;
  try {
    const ls = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(ls)) return ls;
  } catch {
    /* storage unavailable */
  }
  return undefined;
}

/** Client-only: persist the chosen language to cookie + localStorage. */
export function writeStoredLanguage(lang: string): void {
  if (!isSupportedLanguage(lang)) return;
  if (typeof document === "undefined") return;
  // 1 year, path=/ so every route sees it, SameSite=Lax for normal nav.
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

/**
 * Resolve the active language on the client, applying the priority order.
 * SSR paths should use `langFromPathname` on the request URL directly.
 */
export function detectClientLanguage(pathname: string): string {
  return (
    langFromPathname(pathname) ??
    readStoredLanguage() ??
    (typeof navigator !== "undefined"
      ? pickFromAcceptLanguage(navigator.languages as readonly string[])
      : undefined) ??
    DEFAULT_LANGUAGE
  );
}
