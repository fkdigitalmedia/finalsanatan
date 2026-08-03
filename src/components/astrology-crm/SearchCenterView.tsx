import React, { useState } from "react";
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

interface SearchHit {
  id: string;
  category: "Report" | "Yoga" | "Dosha" | "Prediction" | "Remedy" | "Muhurat" | "BirthDetail";
  title: string;
  subtitle: string;
  dateOrDetail?: string;
}

const SEARCH_DATABASE: SearchHit[] = [
  {
    id: "s-1",
    category: "Report",
    title: "Rahul Sharma - Complete Janam Kundli 2026",
    subtitle: "Full 45-page Janam Kundli report generated on v2.1 Engine",
    dateOrDetail: "03 Aug 2026",
  },
  {
    id: "s-2",
    category: "Yoga",
    title: "Gajakesari Raj Yoga",
    subtitle: "Jupiter & Moon in mutual Kendra in 1st/7th House",
    dateOrDetail: "Strong Benefit",
  },
  {
    id: "s-3",
    category: "Dosha",
    title: "Kalsarp Dasha Shadow (Anant Kalsarp)",
    subtitle: "Rahu in 1st house & Ketu in 7th house alignment",
    dateOrDetail: "Remedy Required",
  },
  {
    id: "s-4",
    category: "Prediction",
    title: "Career Elevation & Foreign Placement Window",
    subtitle: "October 2026 - March 2027 Jupiter transit over 10th House",
    dateOrDetail: "Oct 2026 - Mar 2027",
  },
  {
    id: "s-5",
    category: "Remedy",
    title: "Mahamrityunjaya Mantra Chanting",
    subtitle: "Daily 108 chants for Rahu/Saturn pacification",
    dateOrDetail: "41-Day Discipline",
  },
  {
    id: "s-6",
    category: "Muhurat",
    title: "Abhijit Muhurat - Auspicious Financial Dealings",
    subtitle: "Daily 11:54 AM to 12:46 PM auspicious window",
    dateOrDetail: "Daily",
  },
  {
    id: "s-7",
    category: "BirthDetail",
    title: "Rahul Sharma Birth Chart Data",
    subtitle: "04 Aug 1992 at 07:30 AM in New Delhi, India (28.6139 N, 77.2090 E)",
    dateOrDetail: "Primary Chart",
  },
];

interface SearchCenterViewProps {
  language: SupportedLanguage;
  onNavigateTab: (tabKey: string) => void;
}

export function SearchCenterView({ language, onNavigateTab }: SearchCenterViewProps) {
  const t = getTranslation(language);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const results = SEARCH_DATABASE.filter((item) => {
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
