import React from "react";
import {
  Users,
  Sparkles,
  Heart,
  Calendar,
  FileText,
  Clock3,
  GitCompare,
  Zap,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";

interface FamilyDashboardViewProps {
  members: ExtendedFamilyMember[];
  onNavigateTab: (tabKey: string) => void;
  onAddMemberClick: () => void;
}

export function FamilyDashboardView({
  members,
  onNavigateTab,
  onAddMemberClick,
}: FamilyDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Card & Overview */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-accent/15 via-background to-purple-500/10 border-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 md:size-20 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0 shadow-md">
              <Users className="size-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  Family Astrology Workspace
                </h2>
                {members.length > 0 && (
                  <Badge className="bg-emerald-500 text-white font-semibold">
                    92% Family Harmony
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {members.length} Family Members • Row Level Security Active
              </p>
            </div>
          </div>

          <Button size="lg" className="gap-2 shadow-md" onClick={onAddMemberClick}>
            <PlusCircle className="size-5" /> Add Family Member
          </Button>
        </div>
      </Card>

      {/* Empty State when no members exist */}
      {members.length === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto bg-card border-dashed border-2">
          <div className="size-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <UserPlus className="size-8" />
          </div>
          <h3 className="font-display text-xl font-bold">No Family Members Added Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Add family profiles (Spouse, Children, Parents, Siblings) to build your interactive Family Tree, calculate parent-child compatibility, and monitor planetary transits.
          </p>
          <Button onClick={onAddMemberClick} className="gap-2 shadow-md px-6">
            <PlusCircle className="size-4" /> Add Your First Family Member
          </Button>
        </Card>
      ) : (
        <>
          {/* Quick Action Shortcuts Grid */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
              Quick Family Actions
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
                onClick={() => onNavigateTab("tree")}
              >
                <div className="size-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center mr-3 shrink-0">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Family Tree</div>
                  <div className="text-xs text-muted-foreground">Interactive Generational Tree</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
                onClick={() => onNavigateTab("couple")}
              >
                <div className="size-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mr-3 shrink-0">
                  <Heart className="size-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Couple Dashboard</div>
                  <div className="text-xs text-muted-foreground">Ashtakoot Matching</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
                onClick={() => onNavigateTab("transit_overview")}
              >
                <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mr-3 shrink-0">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Transit Overview</div>
                  <div className="text-xs text-muted-foreground">Jupiter, Saturn & Rahu</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
                onClick={() => onNavigateTab("shared_muhurat")}
              >
                <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3 shrink-0">
                  <Clock3 className="size-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Shared Muhurat</div>
                  <div className="text-xs text-muted-foreground">Griha Pravesh & Property</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Active Member Dashas Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-accent" />
                <h3 className="font-display font-bold text-lg">Active Family Member Dashas</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-accent hover:underline"
                onClick={() => onNavigateTab("multiple_kundlis")}
              >
                View All Charts <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((m) => (
                <Card key={m.id} className="p-4 bg-secondary/30 border-border space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={m.name}
                      className="size-10 rounded-full object-cover border border-accent"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{m.name}</h4>
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {m.relationship}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs space-y-0.5 pt-1 border-t border-border">
                    <p className="text-muted-foreground">
                      Lagna: <strong className="text-foreground">{m.lagnaSign}</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Dasha: <strong className="text-accent">{m.currentMahadasha}</strong>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
