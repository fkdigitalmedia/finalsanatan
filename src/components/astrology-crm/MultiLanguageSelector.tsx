import React from "react";
import { Globe, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface MultiLanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export function MultiLanguageSelector({
  currentLanguage,
  onSelectLanguage,
}: MultiLanguageSelectorProps) {
  const t = getTranslation(currentLanguage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Globe className="size-6 text-accent" /> Multi-Language Dashboard & Report Engine
        </h2>
        <p className="text-sm text-muted-foreground">
          Instant language switching for all Kundli calculations, daily horoscopes, remedies, and PDF reports.
        </p>
      </div>

      {/* Active Language Banner */}
      <Card className="p-5 bg-accent/5 border-accent/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.flag || "🌐"}
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Active Workspace Language
              </span>
              <h3 className="font-display text-xl font-bold text-foreground">
                {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.name} (
                {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName})
              </h3>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground font-semibold">
            Live Auto-Translation
          </Badge>
        </div>
      </Card>

      {/* Grid of 10 Supported Languages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLanguage;
          return (
            <Card
              key={lang.code}
              className={`p-4 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent"
                  : "hover:border-accent/40 hover:bg-secondary/40"
              }`}
              onClick={() => onSelectLanguage(lang.code)}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{lang.flag}</span>
                {isSelected && <Check className="size-4 text-accent font-bold" />}
              </div>

              <div className="mt-3">
                <p className="font-display font-semibold text-base">{lang.nativeName}</p>
                <p className="text-xs text-muted-foreground">{lang.name}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dynamic Regeneration Note */}
      <Card className="p-4 bg-secondary/30 border-border text-xs text-muted-foreground flex items-start gap-3">
        <Sparkles className="size-4 text-accent shrink-0 mt-0.5" />
        <p>
          Selecting a new language immediately re-renders your Kundli chart readings, Dasha interpretations,
          Panchang details, and generated PDF reports in the native script.
        </p>
      </Card>
    </div>
  );
}
