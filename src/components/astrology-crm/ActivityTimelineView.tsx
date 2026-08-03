import React, { useState, useEffect } from "react";
import {
  History,
  FileText,
  Zap,
  Heart,
  Globe,
  Download,
  User,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActivityItem, ActivityType, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchActivityTimeline } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface ActivityTimelineViewProps {
  language: SupportedLanguage;
  userId?: string;
}

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  report_generated: <FileText className="size-4 text-blue-500" />,
  prediction_updated: <Calendar className="size-4 text-purple-500" />,
  remedy_added: <Zap className="size-4 text-amber-500" />,
  remedy_completed: <CheckCircle2 className="size-4 text-emerald-500" />,
  favorite_added: <Heart className="size-4 text-rose-500" />,
  language_changed: <Globe className="size-4 text-indigo-500" />,
  download_history: <Download className="size-4 text-teal-500" />,
  profile_updated: <User className="size-4 text-orange-500" />,
};

export function ActivityTimelineView({ language, userId = "user-1" }: ActivityTimelineViewProps) {
  const t = getTranslation(language);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    void fetchActivityTimeline(userId).then(setActivities);
  }, [userId]);

  const filtered = activities.filter(
    (a) => filterType === "all" || a.type === filterType,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <History className="size-6 text-accent" /> {t.timeline}
        </h2>
        <p className="text-sm text-muted-foreground">
          Chronological record of report generation, remedy completion, download history, and profile updates.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        <Button
          size="sm"
          variant={filterType === "all" ? "default" : "outline"}
          className="text-xs rounded-full"
          onClick={() => setFilterType("all")}
        >
          All Activity ({activities.length})
        </Button>
        <Button
          size="sm"
          variant={filterType === "report_generated" ? "default" : "outline"}
          className="text-xs rounded-full gap-1"
          onClick={() => setFilterType("report_generated")}
        >
          <FileText className="size-3" /> Reports
        </Button>
        <Button
          size="sm"
          variant={filterType === "remedy_completed" ? "default" : "outline"}
          className="text-xs rounded-full gap-1"
          onClick={() => setFilterType("remedy_completed")}
        >
          <CheckCircle2 className="size-3" /> Remedies
        </Button>
        <Button
          size="sm"
          variant={filterType === "download_history" ? "default" : "outline"}
          className="text-xs rounded-full gap-1"
          onClick={() => setFilterType("download_history")}
        >
          <Download className="size-3" /> Downloads
        </Button>
        <Button
          size="sm"
          variant={filterType === "favorite_added" ? "default" : "outline"}
          className="text-xs rounded-full gap-1"
          onClick={() => setFilterType("favorite_added")}
        >
          <Heart className="size-3" /> Favorites
        </Button>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-border pl-6 space-y-6 ml-3">
        {filtered.map((item) => (
          <div key={item.id} className="relative">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[37px] top-1 size-7 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-sm">
              {ACTIVITY_ICONS[item.type]}
            </div>

            <Card className="p-4 bg-card/80 hover:border-accent/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {item.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
