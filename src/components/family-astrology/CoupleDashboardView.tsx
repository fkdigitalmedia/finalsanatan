import React from "react";
import {
  Heart,
  Sparkles,
  Calendar,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Gift,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";
import { generateCoupleDashboard } from "@/lib/family-astrology/family-api";

interface CoupleDashboardViewProps {
  members: ExtendedFamilyMember[];
}

export function CoupleDashboardView({ members }: CoupleDashboardViewProps) {
  const self = members.find((m) => m.relationship === "self") || members[0];
  const spouse = members.find((m) => m.relationship === "spouse") || members[1];

  const couple = generateCoupleDashboard(self, spouse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Heart className="size-6 text-rose-500 fill-rose-500" /> 24.5 Couple Compatibility Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Dedicated marital dashboard for {self.name} & {spouse.name} — Ashtakoot Guna points, transit impacts & remedies.
        </p>
      </div>

      {/* Ashtakoot Compatibility Banner */}
      <Card className="p-6 bg-gradient-to-r from-rose-500/15 via-background to-accent/10 border-rose-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-md">
              <Heart className="size-8 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl">
                  {couple.spouse1Name} ❤️ {couple.spouse2Name}
                </h3>
                <Badge className="bg-rose-500 text-white font-bold text-sm">
                  {couple.ashtakootScore} / 36 Gunas
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{couple.gunasSummary}</p>
              <p className="text-xs font-semibold text-accent mt-1">
                Active Dashas: {couple.currentActiveDashas}
              </p>
            </div>
          </div>

          <Button
            className="gap-1.5 shadow-sm"
            onClick={() => alert(`Downloading Couple Compatibility PDF Report...`)}
          >
            Download Couple PDF
          </Button>
        </div>
      </Card>

      {/* Transit & Shared Strengths */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-500" /> Combined Transit Impact
          </h4>
          <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs">
            <span className="font-semibold text-emerald-600 block mb-1">Jupiter 10th House Transit</span>
            <p className="text-muted-foreground">{couple.transitImpactVerdict}</p>
          </div>

          <div className="mt-4">
            <h5 className="font-semibold text-xs text-muted-foreground uppercase mb-2">
              Shared Strengths
            </h5>
            <ul className="space-y-2 text-xs">
              {couple.sharedStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <Calendar className="size-4 text-purple-500" /> Relationship Timeline & Milestones
          </h4>

          <ul className="space-y-3 text-xs">
            {couple.relationshipMilestones.map((ms, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between font-semibold">
                  <span>{ms.title}</span>
                  <Badge variant="outline" className="text-[10px]">{ms.date}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">{ms.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
