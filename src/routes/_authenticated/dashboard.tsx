import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Star,
  Sparkles,
  GitCompare,
  Sun,
  Crown,
  Plus,
  ArrowRight,
  Clock,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "User Dashboard — Sanatan Dharma Suite" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const { user } = useAuth();
  const [kundlisCount, setKundlisCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [recentKundli, setRecentKundli] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const [kRes, rRes, recentRes] = await Promise.all([
        supabase.from("user_kundlis").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("user_reports").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("user_kundlis").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      ]);

      setKundlisCount(kRes.count ?? 0);
      setReportsCount(rRes.count ?? 0);
      if (recentRes.data && recentRes.data.length > 0) {
        setRecentKundli(recentRes.data[0]);
      }
      setLoading(false);
    }

    void loadDashboardData();
  }, [user?.id]);

  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Sanatan User";

  return (
    <DashboardShell
      title="User Workspace Dashboard"
      description="Manage your birth charts, view generated reports, and access Vedic astrology tools."
      actions={
        <Link to="/kundli">
          <Button className="gap-1.5 shadow-sm">
            <Sparkles className="size-4 text-amber-300" /> Generate Kundli
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-r from-primary-soft/40 via-background to-accent/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-16 md:size-20 rounded-full border-2 border-accent bg-accent/20 text-accent font-bold font-display text-2xl flex items-center justify-center shadow-md shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl md:text-3xl font-bold">
                    Namaste, {userName}!
                  </h2>
                  <Badge className="bg-accent/20 text-accent border-accent/30 flex items-center gap-1">
                    <Crown className="size-3" /> Standard Member
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome to your personal Vedic astrology workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/kundli">
                <Button className="gap-2 shadow-sm">
                  <Plus className="size-4" /> New Birth Chart
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center justify-between border-l-4 border-l-accent">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Saved Kundlis
              </p>
              <p className="font-display text-2xl font-bold mt-1">{loading ? "…" : kundlisCount}</p>
            </div>
            <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Star className="size-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Saved Reports
              </p>
              <p className="font-display text-2xl font-bold mt-1">{loading ? "…" : reportsCount}</p>
            </div>
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FileText className="size-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Account Status
              </p>
              <p className="font-display text-base font-bold mt-1 text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="size-4" /> Active & Verified
              </p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Crown className="size-5" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
            Quick Actions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/kundli">
              <Card className="p-4 hover:border-accent hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Janam Kundli</h4>
                    <p className="text-xs text-muted-foreground">Generate Vedic Birth Chart</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/kundli-matching">
              <Card className="p-4 hover:border-accent hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <GitCompare className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Kundli Matching</h4>
                    <p className="text-xs text-muted-foreground">36-Point Ashtakoot Milan</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/panchang">
              <Card className="p-4 hover:border-accent hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Sun className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Daily Panchang</h4>
                    <p className="text-xs text-muted-foreground">Tithi, Nakshatra & Muhurat</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/my-kundlis">
              <Card className="p-4 hover:border-accent hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Star className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">My Saved Charts</h4>
                    <p className="text-xs text-muted-foreground">View & Manage Birth Charts</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Latest Kundli Preview */}
        {recentKundli && (
          <Card className="p-6 border-accent/30 bg-accent/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold mb-1">
                  Most Recent Chart
                </Badge>
                <h3 className="font-display font-bold text-xl">{recentKundli.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Birth Details: {recentKundli.birth_date} at {String(recentKundli.birth_time).slice(0, 5)} • {recentKundli.place_name || "N/A"}
                </p>
              </div>

              <Link to="/my-kundlis">
                <Button variant="outline" className="gap-1.5 text-xs">
                  View All Charts <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
