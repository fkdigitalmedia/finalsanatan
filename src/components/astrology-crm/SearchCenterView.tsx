import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Sparkles,
  Zap,
  Star,
  Clock3,
  User,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";
import { supabase } from "@/integrations/supabase/client";

interface SearchHit {
  id: string;
  category: "Report" | "Yoga" | "Dosha" | "Prediction" | "Remedy" | "Muhurat" | "BirthDetail";
  title: string;
  subtitle: string;
  dateOrDetail?: string;
}

interface SearchCenterViewProps {
  language: SupportedLanguage;
  onNavigateTab: (tabKey: string) => void;
}

const GENERAL_ASTRO_HITS: SearchHit[] = [
  {
    id: "s-2",
    category: "Yoga",
    title: "Gajakesari Raj Yoga",
    subtitle: "Jupiter & Moon in mutual Kendra alignment",
    dateOrDetail: "Auspicious Yoga",
  },
  {
    id: "s-3",
    category: "Dosha",
    title: "Kalsarp Dasha Analysis",
    subtitle: "Rahu & Ketu natal axis evaluation",
    dateOrDetail: "Chart Check",
  },
  {
    id: "s-5",
    category: "Remedy",
    title: "Mahamrityunjaya Mantra Chanting",
    subtitle: "Daily 108 chants for health & peace",
    dateOrDetail: "Recommended",
  },
  {
    id: "s-6",
    category: "Muhurat",
    title: "Daily Abhijit Muhurat",
    subtitle: "Daily midday auspicious window",
    dateOrDetail: "Daily",
  },
];

export function SearchCenterView({ language, onNavigateTab }: SearchCenterViewProps) {
  const t = getTranslation(language);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [userHits, setUserHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    async function loadUserHits() {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return;

      const { data: kundlis } = await supabase
        .from("user_kundlis")
        .select("*")
        .eq("user_id", userId);

      if (kundlis && kundlis.length > 0) {
        const hits: SearchHit[] = kundlis.map((k: any) => ({
          id: `rep-${k.id}`,
          category: "Report",
          title: `${k.name} - Birth Chart`,
          subtitle: `Born on ${k.birth_date || 'N/A'} at ${k.place_name || 'N/A'}`,
          dateOrDetail: k.created_at ? new Date(k.created_at).toISOString().split("T")[0] : "Saved Chart",
        }));
        setUserHits(hits);
      }
    }
    void loadUserHits();
  }, []);

  const allHits = [...userHits, ...GENERAL_ASTRO_HITS];

  const results = allHits.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Search className="size-6 text-accent" /> {t.searchCenter}
        </h2>
        <p className="text-sm text-muted-foreground">
          Omnibox search across all your saved Reports, Yogas, Doshas, Predictions, Remedies, Dates & Birth details.
        </p>
      </div>

      {/* Omnibox Search Input */}
      <Card className="p-4 bg-card/80 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-accent" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-12 pr-4 h-12 text-base rounded-xl border-accent/20 focus:border-accent"
          />
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="size-3" /> Category:
          </span>
          {["All", "Report", "Yoga", "Dosha", "Prediction", "Remedy", "Muhurat", "BirthDetail"].map(
            (cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "ghost"}
                className="text-xs h-7 rounded-full"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ),
          )}
        </div>
      </Card>

      {/* Search Hits List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Search className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-display text-lg font-semibold">{t.emptyStateTitle}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              No matching results found for "{query}". Try searching "Kundli", "Mahamrityunjaya", or "Rahul".
            </p>
          </Card>
        ) : (
          results.map((hit) => (
            <Card
              key={hit.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/50 transition-all cursor-pointer"
              onClick={() => {
                if (hit.category === "Report") onNavigateTab("previous_reports");
                else if (hit.category === "Remedy") onNavigateTab("saved_remedies");
                else if (hit.category === "BirthDetail") onNavigateTab("user_profile");
                else onNavigateTab("favorites");
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {hit.category}
                  </Badge>
                  {hit.dateOrDetail && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {hit.dateOrDetail}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-base">{hit.title}</h3>
                <p className="text-xs text-muted-foreground">{hit.subtitle}</p>
              </div>

              <Button size="sm" variant="ghost" className="gap-1 text-xs text-accent shrink-0">
                View Detail <ArrowRight className="size-3.5" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
