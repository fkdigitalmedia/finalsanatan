import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sun,
  Sparkles,
  Clock3,
  TrendingUp,
  FileText,
  Download,
  Star,
  Crown,
  Bell,
  ArrowRight,
  Activity,
  PlusCircle,
  Zap,
  Globe,
  GitCompare,
  ShieldCheck,
  Heart,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SupportedLanguage, UserAstrologyProfile } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";
import { fetchLiveUserDasha, fetchLiveUserTransit } from "@/lib/astrology-crm/crm-api";

interface DashboardHomeViewProps {
  profile: UserAstrologyProfile;
  language: SupportedLanguage;
  onNavigateTab: (tabKey: string) => void;
}

export function DashboardHomeView({ profile, language, onNavigateTab }: DashboardHomeViewProps) {
  const t = getTranslation(language);

  const [dasha, setDasha] = useState<{
    mahadasha: string;
    antardasha: string;
    pratyantardasha: string;
    endDate: string;
  } | null>(null);

  const [transit, setTransit] = useState<{
    jupiterTransit: string;
    saturnTransit: string;
    rahuTransit: string;
    harmonyScore: number;
  } | null>(null);

  useEffect(() => {
    void fetchLiveUserDasha(profile.userId).then(setDasha);
    void fetchLiveUserTransit(profile.userId).then(setTransit);
  }, [profile.userId]);

  return (
    <div className="space-y-6">
      {/* 23.1 Welcome Card & Profile Header */}
      <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-r from-primary-soft/40 via-background to-accent/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                profile.photoUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={profile.name}
              className="size-16 md:size-20 rounded-full border-2 border-accent object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  Namaste, {profile.name}!
                </h2>
                <Badge className="bg-accent/20 text-accent border-accent/30 flex items-center gap-1">
                  <Crown className="size-3" /> {profile.currentSubscription}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.birthPlace ? `${profile.birthPlace} • ${profile.dob}` : "No Birth Details Set"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <Globe className="size-3.5 text-accent" /> Lang: {language.toUpperCase()}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-500" /> RLS Protected
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Card className="bg-card/80 p-4 border border-border shadow-sm flex items-center justify-between md:justify-start gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.creditsBalance}
                </p>
                <p className="font-display text-2xl font-bold text-accent">
                  {profile.creditsRemaining} Credits
                </p>
              </div>
              <Button size="sm" className="gap-1 shadow-sm" onClick={() => onNavigateTab("billing")}>
                <PlusCircle className="size-4" /> Top Up
              </Button>
            </Card>
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
          {t.quickActions}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
            onClick={() => onNavigateTab("previous_reports")}
          >
            <div className="size-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center mr-3 shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{t.previousReports}</div>
              <div className="text-xs text-muted-foreground">Manage Kundli reports</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
            onClick={() => onNavigateTab("compare_reports")}
          >
            <div className="size-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3 shrink-0">
              <GitCompare className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{t.compareReports}</div>
              <div className="text-xs text-muted-foreground">Diff Old vs Latest</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
            onClick={() => onNavigateTab("saved_remedies")}
          >
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3 shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{t.savedRemedies}</div>
              <div className="text-xs text-muted-foreground">Remedies & Pujas</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 justify-start text-left bg-card hover:bg-accent/5 hover:border-accent"
            onClick={() => onNavigateTab("language")}
          >
            <div className="size-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mr-3 shrink-0">
              <Globe className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Switch Language</div>
              <div className="text-xs text-muted-foreground">10 Languages</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Astrology Highlights: Current Dasha, Transit & Muhurat */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Dasha Card */}
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center justify-between text-accent">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.currentDasha}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {dasha ? "Active" : "No Kundli"}
            </Badge>
          </div>

          <div className="mt-4">
            {dasha ? (
              <>
                <p className="text-xs text-muted-foreground">Mahadasha</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {dasha.mahadasha}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Ends {dasha.endDate}</p>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Antardasha: <strong className="text-foreground">{dasha.antardasha}</strong>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground space-y-2">
                <AlertCircle className="size-6 text-muted-foreground mx-auto" />
                <p className="font-bold text-sm text-foreground">No Kundli Generated Yet</p>
                <p>Generate your first Janam Kundli to calculate active Mahadasha.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Current Transit Card */}
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-emerald-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.currentTransit}
              </span>
            </div>
            {transit && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                {transit.harmonyScore} / 100
              </Badge>
            )}
          </div>

          <div className="mt-4">
            {transit ? (
              <>
                <p className="text-xs text-muted-foreground">Gochar Verdict</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  Highly Auspicious
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{transit.jupiterTransit}</p>
              </>
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground space-y-2">
                <AlertCircle className="size-6 text-muted-foreground mx-auto" />
                <p className="font-bold text-sm text-foreground">No Transit Data Available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Muhurat Card */}
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-amber-500">
            <div className="flex items-center gap-2">
              <Clock3 className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.upcomingMuhurat}
              </span>
            </div>
            <Badge variant="secondary" className="text-[10px]">Today</Badge>
          </div>

          <ul className="mt-4 space-y-3 text-xs">
            <li className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="font-semibold text-foreground">Abhijit Muhurat</span>
              <span className="text-accent font-medium">11:54 AM – 12:46 PM</span>
            </li>
            <li className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="font-semibold text-foreground">Amrit Kalam</span>
              <span className="text-accent font-medium">04:12 PM – 05:48 PM</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Vijay Muhurat</span>
              <span className="text-accent font-medium">02:30 PM – 03:22 PM</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
