import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  FileText,
  Sparkles,
  Zap,
  Clock3,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { FavoriteItem, FavoriteItemType, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchUserFavorites, toggleFavorite } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface FavoritesCenterViewProps {
  language: SupportedLanguage;
  userId?: string;
}

const TYPE_ICONS: Record<FavoriteItemType, React.ReactNode> = {
  report: <FileText className="size-4 text-blue-500" />,
  yoga: <Sparkles className="size-4 text-purple-500" />,
  remedy: <Zap className="size-4 text-amber-500" />,
  prediction: <Star className="size-4 text-emerald-500" />,
  muhurat: <Clock3 className="size-4 text-rose-500" />,
};

export function FavoritesCenterView({ language, userId = "user-1" }: FavoritesCenterViewProps) {
  const t = getTranslation(language);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    const list = await fetchUserFavorites(userId);
    setFavorites(list);
  };

  useEffect(() => {
    void loadData();
  }, [userId]);

  const filtered = favorites.filter((item) => {
    const matchesTab = activeTab === "all" || item.itemType === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleRemove = async (item: FavoriteItem) => {
    await toggleFavorite(item);
    void loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Heart className="size-6 text-rose-500 fill-rose-500" /> {t.favorites}
        </h2>
        <p className="text-sm text-muted-foreground">
          Quick access to your saved Reports, Yogas, Remedies, Predictions & Muhurats.
        </p>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={activeTab === "all" ? "default" : "outline"}
            className="text-xs rounded-full"
            onClick={() => setActiveTab("all")}
          >
            All ({favorites.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "report" ? "default" : "outline"}
            className="text-xs rounded-full gap-1"
            onClick={() => setActiveTab("report")}
          >
            <FileText className="size-3.5" /> Reports
          </Button>
          <Button
            size="sm"
            variant={activeTab === "yoga" ? "default" : "outline"}
            className="text-xs rounded-full gap-1"
            onClick={() => setActiveTab("yoga")}
          >
            <Sparkles className="size-3.5" /> Yogas
          </Button>
          <Button
            size="sm"
            variant={activeTab === "remedy" ? "default" : "outline"}
            className="text-xs rounded-full gap-1"
            onClick={() => setActiveTab("remedy")}
          >
            <Zap className="size-3.5" /> Remedies
          </Button>
          <Button
            size="sm"
            variant={activeTab === "prediction" ? "default" : "outline"}
            className="text-xs rounded-full gap-1"
            onClick={() => setActiveTab("prediction")}
          >
            <Star className="size-3.5" /> Predictions
          </Button>
          <Button
            size="sm"
            variant={activeTab === "muhurat" ? "default" : "outline"}
            className="text-xs rounded-full gap-1"
            onClick={() => setActiveTab("muhurat")}
          >
            <Clock3 className="size-3.5" /> Muhurats
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search favorites..."
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Heart className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold">{t.emptyStateTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            No favorite items found. Click the heart icon on any yoga, remedy or report to save it here.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between hover:border-accent/50 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase gap-1">
                    {TYPE_ICONS[item.itemType]} {item.itemType}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(item)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <h3 className="font-display font-semibold text-base">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">
                  Saved {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-accent">
                  Open <ExternalLink className="size-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
