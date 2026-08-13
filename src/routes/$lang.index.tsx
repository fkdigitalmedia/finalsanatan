/**
 * Landing route for bare `/en`, `/hi`, `/ta`, etc. Same behavior as the
 * splat: set the cookie and forward to the un-prefixed homepage.
 */

import { createFileRoute, redirect } from "@tanstack/react-router";
import { LANGUAGE_COOKIE_NAME, isSupportedLanguage } from "@/i18n/config";
import { HomePage } from "./index";

export const Route = createFileRoute("/$lang/")({
  beforeLoad: ({ params }) => {
    const lang = params.lang;
    if (!isSupportedLanguage(lang) || lang === "en") {
      throw redirect({ href: "/", statusCode: 301 });
    }
    if (typeof document !== "undefined") {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  },
  component: HomePage,
});
