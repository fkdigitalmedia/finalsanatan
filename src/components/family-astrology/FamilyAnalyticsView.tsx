import React from "react";
import { BarChart3, Users, FileText, Zap, Calendar, Bot, Sparkles, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchFamilyWorkspaceAnalytics } from "@/lib/family-astrology/family-api";

export function FamilyAnalyticsView() {
  const analytics = fetchFamilyWorkspaceAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="size-6 text-accent" /> 24.17 & 24.19 Family Analytics & Future Readiness
        </h2>
        <p className="text-sm text-muted-foreground">
          Track workspace usage metrics and access staged architecture for Family AI Chat, Wealth & Health Trends.
        </p>
      </div>

      {/* Analytics Counters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Family Members
          </span>
          <p className="font-display text-2xl font-bold mt-1 text-foreground">
            {analytics.totalFamilyMembers}
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Reports Generated
          </span>
          <p className="font-display text-2xl font-bold mt-1 text-accent">
            {analytics.reportsGenerated}
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Compatibility Checks
          </span>
          <p className="font-display text-2xl font-bold mt-1 text-purple-600">
            {analytics.compatibilityReportsCount}
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Shared Remedies
          </span>
          <p className="font-display text-2xl font-bold mt-1 text-amber-500">
            {analytics.sharedRemediesCount}
          </p>
        </Card>
      </div>

      {/* 24.19 Future Ready Modules Preview */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-accent" /> 24.19 Generational & Future AI Modules
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="size-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-2">
              <Bot className="size-4" />
            </div>
            <h4 className="font-bold text-sm">Family AI Chat</h4>
            <p className="text-xs text-muted-foreground mt-1">Ask questions about family dynamics and remedies.</p>
            <Badge variant="outline" className="mt-3 text-[9px]">STAGED API READY</Badge>
          </div>

          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
              <Sparkles className="size-4" />
            </div>
            <h4 className="font-bold text-sm">Shared Horoscope</h4>
            <p className="text-xs text-muted-foreground mt-1">Combined daily planetary influence for household.</p>
            <Badge variant="outline" className="mt-3 text-[9px]">STAGED API READY</Badge>
          </div>

          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
              <Heart className="size-4" />
            </div>
            <h4 className="font-bold text-sm">Family Wealth & Health</h4>
            <p className="text-xs text-muted-foreground mt-1">Generational wealth windows & wellness trends.</p>
            <Badge variant="outline" className="mt-3 text-[9px]">STAGED API READY</Badge>
          </div>

          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
              <Users className="size-4" />
            </div>
            <h4 className="font-bold text-sm">Generational Astrology</h4>
            <p className="text-xs text-muted-foreground mt-1">Multi-generational karma & lineage analysis.</p>
            <Badge variant="outline" className="mt-3 text-[9px]">STAGED API READY</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
