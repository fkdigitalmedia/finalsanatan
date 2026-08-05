/**
 * LanguageSwitcher — dropdown UI that lets the user change language.
 * Reads the list of enabled languages from `src/i18n/config.ts`, so adding
 * a new language automatically shows it here.
 */

import { Check, Globe } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps {
  /** Compact icon-only trigger for headers; false shows the native label. */
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({ compact = true, className }: LanguageSwitcherProps) {
  const { lang, language, languages, setLanguage, t } = useTranslation();
  const a11yLabel = t("a11y.language_switcher");
  const badgeCode = language.badge || language.code.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "sm" : "sm"}
          aria-label={a11yLabel}
          className={cn("gap-1.5 px-2.5", className)}
        >
          <Globe className="size-4 text-muted-foreground" aria-hidden="true" />
          <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-bold tracking-wide uppercase bg-primary/15 text-primary border-primary/20 hover:bg-primary/20">
            {badgeCode}
          </Badge>
          {!compact && <span className="text-sm font-medium">{language.nativeLabel}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("nav.language")}</span>
          <span className="text-xs text-muted-foreground font-semibold">Active: {badgeCode}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => {
          const active = l.code === lang;
          return (
            <DropdownMenuItem
              key={l.code}
              onSelect={(e) => {
                e.preventDefault();
                setLanguage(l.code);
              }}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block min-w-[24px] text-center font-bold text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                  {l.badge || l.code.toUpperCase()}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium text-sm">{l.nativeLabel}</span>
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                </span>
              </span>
              {active && <Check className="size-4 text-primary" aria-hidden="true" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
