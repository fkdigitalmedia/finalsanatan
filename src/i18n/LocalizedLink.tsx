/**
 * LocalizedLink — a thin wrapper around TanStack's `<Link>` that
 * automatically prepends the active language prefix. Prefer this over
 * `<Link>` in shared components so language switching preserves the URL.
 */

import { Link, type LinkProps } from "@tanstack/react-router";
import { forwardRef } from "react";
import { useTranslation } from "@/i18n/I18nProvider";

export type LocalizedLinkProps = Omit<LinkProps, "to"> & {
  to: string;
  /** Force a specific language instead of the active one. */
  lang?: string;
  className?: string;
  children?: React.ReactNode;
};

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  function LocalizedLink({ to, lang, ...rest }, ref) {
    const { localizedPath } = useTranslation();
    const href = localizedPath(to, lang);
    // We intentionally pass a string `to`; TanStack accepts absolute paths and
    // this keeps LocalizedLink usable from any route without `from` typing.
    return <Link ref={ref} to={href as LinkProps["to"]} {...rest} />;
  },
);
