import React from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SupportedLanguage, UserAstrologyProfile } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface DashboardHomeViewProps {
  profile: UserAstrologyProfile;
  language: SupportedLanguage;
  onNavigateTab: (tabKey: string) => void;
}

export function DashboardHomeView({ profile, language, onNavigateTab }: DashboardHomeViewProps) {
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      {/* 23.1 Welcome Card & Profile Header */}
      <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-r from-primary-soft/40 via-background to-accent/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={profile.name}
              className="size-16 md:size-20 rounded-full border-2 border-accent object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  Namaste, {profile.name}!
                </h2>
                <Badge className="bg-accent/20 text-accent border-accent/30 flex items-center gap-1">
                  <Crown className="size-3" /> Premium Plan
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.birthPlace} • {profile.dob} at {profile.birthTime}
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
                <p className="font-display text-2xl font-bold text-accent">45 Credits</p>
              </div>
              <Button size="sm" className="gap-1 shadow-sm">
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
              <div className="text-xs text-muted-foreground">14 Kundli reports</div>
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
              <div className="text-xs text-muted-foreground">4 Active Remedies</div>
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

      {/* Dashboard Statistics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Reports</span>
            <FileText className="size-4 text-accent" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">14</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Downloads</span>
            <Download className="size-4 text-blue-500" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">28</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Remedies</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">4</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Favorites</span>
            <Heart className="size-4 text-rose-500" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">5</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Saved Charts</span>
            <Star className="size-4 text-amber-500" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">3</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Credits</span>
            <Zap className="size-4 text-purple-500" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">45</p>
        </Card>
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
            <Badge variant="outline" className="text-[10px]">Active</Badge>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Mahadasha</p>
            <p className="font-display text-2xl font-bold text-foreground">Rahu Mahadasha</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ends August 2038</p>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Antardasha: <strong className="text-foreground">Ketu</strong></span>
              <span>48% Completed</span>
            </div>
            <Progress value={48} className="h-2 mt-2" />
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
            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30">
              84 / 100
            </Badge>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Gochar Verdict</p>
            <p className="font-display text-2xl font-bold text-foreground">Highly Auspicious</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jupiter transits 10th House (Career & Honor)
            </p>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Favorable Planets: <strong className="text-foreground">Jupiter, Sun, Venus</strong>
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

      {/* Latest Kundli Quick Preview & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Latest Kundli Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="size-5 text-accent" />
              <h3 className="font-display text-lg font-bold">{t.latestKundli}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-accent hover:underline"
              onClick={() => onNavigateTab("previous_reports")}
            >
              All Reports <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2 text-[10px] uppercase">
                  Janam Kundli • v2.1 Engine
                </Badge>
                <h4 className="font-semibold text-base">{profile.name} — Birth Chart</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lagna: Cancer (Karka) • Rashi: Virgo (Kanya) • Nakshatra: Hasta (Pada 2)
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => onNavigateTab("previous_reports")}>
                  {t.viewReport}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onNavigateTab("compare_reports")}>
                  Compare
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">SUN SIGN</span>
                <span className="font-semibold">Cancer 18° 42'</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">MOON SIGN</span>
                <span className="font-semibold">Virgo 05° 11'</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">MARS SIGN</span>
                <span className="font-semibold">Taurus 22° 15'</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">JUPITER SIGN</span>
                <span className="font-semibold">Aries 04° 50'</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-accent" />
              <h3 className="font-display text-lg font-bold">{t.recentActivity}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-accent hover:underline"
              onClick={() => onNavigateTab("timeline")}
            >
              Timeline <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="size-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold">Generated Full Janam Kundli</p>
                <p className="text-[11px] text-muted-foreground">PDF Report v2.1 • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="size-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold">Completed 7 Saturdays Daan</p>
                <p className="text-[11px] text-muted-foreground">Black Til Donation • Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-7 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Star className="size-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold">Saved Gajakesari Raj Yoga</p>
                <p className="text-[11px] text-muted-foreground">Added to Favorites • 2 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
