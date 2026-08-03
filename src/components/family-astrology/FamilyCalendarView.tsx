import React from "react";
import { Calendar, Cake, Heart, Clock3, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchFamilyCalendarEvents } from "@/lib/family-astrology/family-api";

export function FamilyCalendarView() {
  const events = fetchFamilyCalendarEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Calendar className="size-6 text-purple-500" /> 24.12 Family Astrological Calendar
        </h2>
        <p className="text-sm text-muted-foreground">
          Track birthdays, anniversaries, shared Muhurats, planetary transits & Dasha transitions.
        </p>
      </div>

      {/* Calendar Event Cards List */}
      <div className="space-y-3">
        {events.map((evt) => (
          <Card key={evt.id} className="p-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  {evt.type === "birthday" ? (
                    <Cake className="size-5" />
                  ) : evt.type === "anniversary" ? (
                    <Heart className="size-5 text-rose-500" />
                  ) : evt.type === "muhurat" ? (
                    <Clock3 className="size-5 text-amber-500" />
                  ) : (
                    <TrendingUp className="size-5 text-emerald-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                      {evt.type}
                    </Badge>
                    <span className="text-xs font-bold text-accent">{evt.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-base">{evt.title}</h3>
                  <p className="text-xs text-muted-foreground">{evt.description}</p>
                </div>
              </div>

              {evt.memberName && (
                <Badge className="bg-secondary text-foreground text-[10px]">
                  {evt.memberName}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
