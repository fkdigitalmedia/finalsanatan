import React from "react";
import { Clock3, Calendar, CheckCircle, Sparkles, Home, Car, Building, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchSharedFamilyMuhurats } from "@/lib/family-astrology/family-api";

export function SharedMuhuratView() {
  const muhurats = fetchSharedFamilyMuhurats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Clock3 className="size-6 text-amber-500" /> 24.7 Shared Family Muhurats
        </h2>
        <p className="text-sm text-muted-foreground">
          Auspicious windows calculated to benefit multiple family members simultaneously.
        </p>
      </div>

      {/* Muhurats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {muhurats.map((m) => (
          <Card key={m.id} className="p-5 space-y-3 border-amber-500/20 hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500 text-white font-semibold text-[10px] uppercase">
                {m.category.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="text-accent font-bold text-[10px]">
                {m.auspiciousScore}% Score
              </Badge>
            </div>

            <h3 className="font-display font-bold text-lg">{m.title}</h3>

            <div className="text-xs space-y-1 text-muted-foreground bg-secondary/40 p-3 rounded-lg border border-border">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-accent" /> {m.date} ({m.startTime} – {m.endTime})
              </p>
              <p className="mt-1">{m.tithiNakshatra}</p>
            </div>

            <div className="pt-2 border-t border-border text-xs">
              <span className="text-muted-foreground block text-[10px] uppercase mb-1">
                Suitable For Family Members:
              </span>
              <div className="flex flex-wrap gap-1">
                {m.suitableForMembers.map((name) => (
                  <Badge key={name} variant="secondary" className="text-[10px]">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
