import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Globe,
  Heart,
  HardDrive,
  Clock,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AnalyticsMetrics, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchCRMAnalytics } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface AstrologyAnalyticsViewProps {
  language: SupportedLanguage;
}

export function AstrologyAnalyticsView({ language }: AstrologyAnalyticsViewProps) {
  const t = getTranslation(language);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);

  useEffect(() => {
    void fetchCRMAnalytics().then(setMetrics);
  }, []);

  if (!metrics) return <div className="p-8 text-center text-sm text-muted-foreground">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="size-6 text-accent" /> {t.analytics}
        </h2>
        <p className="text-sm text-muted-foreground">
          Platform performance metrics — DAU, Reports Generated, Language Distribution, and Conversion Funnel.
        </p>
      </div>

      {/* Top Stat Counters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-card">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Daily Active Users (DAU)
          </span>
          <p className="font-display text-2xl font-bold mt-2 text-foreground">
            {metrics.dailyActiveUsers.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 mt-1">↑ +14% vs last week</p>
        </Card>

        <Card className="p-4 bg-card">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Total Reports Generated
          </span>
          <p className="font-display text-2xl font-bold mt-2 text-foreground">
            {metrics.reportsGeneratedCount.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 mt-1">Avg {metrics.averageReportGenSeconds}s generation time</p>
        </Card>

        <Card className="p-4 bg-card">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Subscription Conversion Rate
          </span>
          <p className="font-display text-2xl font-bold mt-2 text-accent">
            {metrics.subscriptionConversionRate}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Free → Pro/Premium</p>
        </Card>

        <Card className="p-4 bg-card">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Storage Usage
          </span>
          <p className="font-display text-2xl font-bold mt-2 text-foreground">
            {metrics.storageUsedMB} MB
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF Archive & Cache</p>
        </Card>
      </div>

      {/* Language Breakdown & Popular Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Language Usage Breakdown */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Globe className="size-5 text-accent" /> Language Distribution (%)
          </h3>

          <div className="space-y-3">
            {Object.entries(metrics.languageUsageBreakdown).map(([lang, pct]) => (
              <div key={lang}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{lang.toUpperCase()}</span>
                  <span>{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Reports */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="size-5 text-purple-500" /> Popular Generated Reports
          </h3>

          <div className="space-y-4">
            {metrics.popularReports.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {item.count.toLocaleString()} requests
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
