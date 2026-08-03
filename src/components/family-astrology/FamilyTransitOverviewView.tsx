import React from "react";
import { TrendingUp, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";
import { calculateFamilyTransitOverview } from "@/lib/family-astrology/family-api";

interface FamilyTransitOverviewViewProps {
  members: ExtendedFamilyMember[];
}

export function FamilyTransitOverviewView({ members }: FamilyTransitOverviewViewProps) {
  const transits = calculateFamilyTransitOverview(members);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="size-6 text-emerald-500" /> 24.6 Family Planetary Transit Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitor major transits (Jupiter, Saturn, Rahu/Ketu) and their specific impact level across every family member.
        </p>
      </div>

      {/* Family Transit Matrix Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Member</th>
                <th className="p-3">Jupiter Transit</th>
                <th className="p-3">Saturn Transit (Shani)</th>
                <th className="p-3">Rahu / Ketu</th>
                <th className="p-3">Overall Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transits.map((item) => (
                <tr key={item.memberId} className="hover:bg-secondary/20">
                  <td className="p-3 font-semibold">
                    <p className="text-foreground">{item.memberName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.relationship}</p>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <ImpactBadge level={item.jupiterTransitImpact} />
                      <span className="text-xs text-muted-foreground">{item.jupiterDescription}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <ImpactBadge level={item.saturnTransitImpact} />
                      <span className="text-xs text-muted-foreground">{item.saturnDescription}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <ImpactBadge level={item.rahuKetuTransitImpact} />
                      <span className="text-xs text-muted-foreground">{item.rahuKetuDescription}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <ImpactBadge level={item.overallImpact} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ImpactBadge({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "high") {
    return <Badge className="bg-rose-500 text-white text-[10px]">HIGH IMPACT</Badge>;
  }
  if (level === "medium") {
    return <Badge className="bg-amber-500 text-white text-[10px]">MEDIUM IMPACT</Badge>;
  }
  return <Badge className="bg-emerald-500 text-white text-[10px]">LOW / STABLE</Badge>;
}
