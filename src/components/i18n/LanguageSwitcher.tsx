/**
 * LanguageSwitcher — dropdown UI that lets the user change language.
 * Reads the list of enabled languages from `src/i18n/config.ts`, so adding
 * a new language automatically shows it here.
 */

import { Check, Globe } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          aria-label={a11yLabel}
          className={cn(compact ? "" : "gap-2", className)}
        >
          <Globe className="size-4" aria-hidden="true" />
          {!compact && <span className="text-sm font-medium">{language.nativeLabel}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
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
              <span className="flex flex-col">
                <span className="font-medium">{l.nativeLabel}</span>
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </span>
              {active && <Check className="size-4 text-primary" aria-hidden="true" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
