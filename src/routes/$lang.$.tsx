/**
 * Language prefix catch-all — handles `/hi`, `/hi/panchang`, `/ta/tools/...`
 *
 * Phase 1 of multilingual only wires the architecture, so this route
 * transparently sets the language cookie and forwards the request to the
 * un-prefixed URL. Once actual translated pages exist, this route can be
 * replaced with a proper `_lang` layout that renders localized content in
 * place instead of redirecting.
 */

import { createFileRoute, redirect } from "@tanstack/react-router";
import { LANGUAGE_COOKIE_NAME, isSupportedLanguage } from "@/i18n/config";
import { stripLangPrefix } from "@/i18n/detect";

export const Route = createFileRoute("/$lang/$")({
  beforeLoad: ({ params, location }) => {
    const lang = params.lang;
    if (!isSupportedLanguage(lang)) {
      throw redirect({ href: "/", replace: true });
    }
    const stripped = stripLangPrefix(location.pathname) || "/";
    if (typeof document !== "undefined") {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    throw redirect({
      href: stripped + (location.searchStr ?? ""),
      replace: true,
    });
  },
  component: () => null,
});
