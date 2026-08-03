import React, { useState, useEffect } from "react";
import { Zap, CheckCircle2, Landmark, HeartHandshake, Utensils, Flame, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SharedFamilyRemedy } from "@/lib/family-astrology/family-types";
import { fetchSharedFamilyRemedies } from "@/lib/family-astrology/family-api";

interface SharedRemediesViewProps {
  userId?: string;
}

export function SharedRemediesView({ userId = "user-1" }: SharedRemediesViewProps) {
  const [remedies, setRemedies] = useState<SharedFamilyRemedy[]>([]);

  useEffect(() => {
    void fetchSharedFamilyRemedies(userId).then(setRemedies);
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Zap className="size-6 text-amber-500" /> 24.10 Shared Family Remedies
        </h2>
        <p className="text-sm text-muted-foreground">
          Detect and track remedial practices (Mantras, Temple Visits, Charity, Fasting & Pujas) benefiting multiple family members.
        </p>
      </div>

      {/* Shared Remedies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {remedies.map((rem) => {
          const isCompleted = rem.status === "completed";
          return (
            <Card
              key={rem.id}
              className={`p-5 flex flex-col justify-between transition-all ${
                isCompleted ? "bg-emerald-500/5 border-emerald-500/30" : "hover:border-accent/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {rem.category}
                  </Badge>
                  <Badge
                    className={
                      isCompleted
                        ? "bg-emerald-500 text-white text-[10px]"
                        : rem.status === "in_progress"
                        ? "bg-amber-500 text-white text-[10px]"
                        : "bg-secondary text-foreground text-[10px]"
                    }
                  >
                    {rem.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <h3 className="font-display font-bold text-base">{rem.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rem.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beneficiaries:</span>
                  <span className="font-semibold">{rem.benefitingMemberNames.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-semibold text-accent">{rem.targetDateOrFrequency}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
