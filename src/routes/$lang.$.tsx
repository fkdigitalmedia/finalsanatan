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
import { HomePage } from "./index";
import { KundliLandingPage } from "./kundli";
import { MatchingPage } from "./kundli-matching";

export const Route = createFileRoute("/$lang/$")({
  beforeLoad: ({ params }) => {
    const lang = params.lang;
    if (!isSupportedLanguage(lang)) {
      throw redirect({ href: "/", statusCode: 301 });
    }
    if (lang === "en") {
      const rawSplat = params._splat ?? "";
      const cleanSplat = rawSplat.replace(/^(en\/+|en$)/i, "").replace(/^\/+/, "");
      const target = cleanSplat ? `/${cleanSplat}` : "/";
      throw redirect({ href: target, statusCode: 301 });
    }
    if (typeof document !== "undefined") {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  },
  component: LanguageRouteComponent,
});

function LanguageRouteComponent() {
  const { _splat } = Route.useParams();
  const cleanPath = (_splat ?? "").toLowerCase().replace(/^\/+|\/+$/g, "");

  if (cleanPath === "kundli") {
    return <KundliLandingPage />;
  }
  if (cleanPath === "kundli-matching") {
    return <MatchingPage />;
  }
  return <HomePage />;
}
