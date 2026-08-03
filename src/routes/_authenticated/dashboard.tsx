import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Zap,
  History,
  Heart,
  Globe,
  Search,
  Bell,
  User,
  ShieldCheck,
  Users,
  BarChart3,
  HardDrive,
  Star,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type { SupportedLanguage, UserAstrologyProfile } from "@/lib/astrology-crm/crm-types";
import { fetchUserAstrologyProfile } from "@/lib/astrology-crm/crm-api";
import { DashboardHomeView } from "@/components/astrology-crm/DashboardHomeView";
import { PreviousReportsView } from "@/components/astrology-crm/PreviousReportsView";
import { CompareReportsView } from "@/components/astrology-crm/CompareReportsView";
import { SavedRemediesView } from "@/components/astrology-crm/SavedRemediesView";
import { PdfVersionHistoryView } from "@/components/astrology-crm/PdfVersionHistoryView";
import { FavoritesCenterView } from "@/components/astrology-crm/FavoritesCenterView";
import { MultiLanguageSelector } from "@/components/astrology-crm/MultiLanguageSelector";
import { SearchCenterView } from "@/components/astrology-crm/SearchCenterView";
import { ActivityTimelineView } from "@/components/astrology-crm/ActivityTimelineView";
import { NotificationCenterView } from "@/components/astrology-crm/NotificationCenterView";
import { AstrologyUserProfileView } from "@/components/astrology-crm/AstrologyUserProfileView";
import { SecurityDashboardView } from "@/components/astrology-crm/SecurityDashboardView";
import { AdminCrmView } from "@/components/astrology-crm/AdminCrmView";
import { AstrologyAnalyticsView } from "@/components/astrology-crm/AstrologyAnalyticsView";
import { StorageManagerView } from "@/components/astrology-crm/StorageManagerView";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Astrology CRM & User Dashboard — Sanatan Dharma Suite" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

type CRMTab =
  | "overview"
  | "previous_reports"
  | "compare_reports"
  | "saved_remedies"
  | "version_history"
  | "favorites"
  | "language"
  | "search"
  | "timeline"
  | "notifications"
  | "user_profile"
  | "security"
  | "admin_crm"
  | "analytics"
  | "storage";

const CRM_TABS: { key: CRMTab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "23.1 Home", icon: <LayoutDashboard className="size-4" /> },
  { key: "previous_reports", label: "23.2 Reports", icon: <FileText className="size-4" /> },
  { key: "compare_reports", label: "23.3 Compare", icon: <GitCompare className="size-4" /> },
  { key: "saved_remedies", label: "23.4 Remedies", icon: <Zap className="size-4 text-amber-500" /> },
  { key: "version_history", label: "23.5 PDF Versions", icon: <History className="size-4" /> },
  { key: "favorites", label: "23.6 Favorites", icon: <Heart className="size-4 text-rose-500" /> },
  { key: "language", label: "23.7 Multi-Lang", icon: <Globe className="size-4 text-purple-500" /> },
  { key: "search", label: "23.8 Search", icon: <Search className="size-4" /> },
  { key: "timeline", label: "23.9 Timeline", icon: <History className="size-4" /> },
  { key: "notifications", label: "23.10 Alerts", icon: <Bell className="size-4 text-accent" /> },
  { key: "user_profile", label: "23.11 Profile", icon: <User className="size-4" /> },
  { key: "security", label: "23.12 Security", icon: <ShieldCheck className="size-4 text-emerald-500" /> },
  { key: "admin_crm", label: "23.13 Admin CRM", icon: <Users className="size-4 text-blue-500" /> },
  { key: "analytics", label: "23.14 Analytics", icon: <BarChart3 className="size-4 text-accent" /> },
  { key: "storage", label: "23.15 Storage", icon: <HardDrive className="size-4" /> },
];

function DashboardPage() {
  const { user } = useAuth();
  const uid = user?.id || "user-1";
  const [activeTab, setActiveTab] = useState<CRMTab>("overview");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [profile, setProfile] = useState<UserAstrologyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchUserAstrologyProfile(uid).then((p) => {
      setProfile(p);
      if (p.preferredLanguage) setLanguage(p.preferredLanguage);
      setLoading(false);
    });
  }, [uid]);

  const handleSelectTab = (tabKey: string) => {
    setActiveTab(tabKey as CRMTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardShell
      title="Astrology CRM & Customer Dashboard"
      description="Manage all your Kundli reports, compare predictions, track remedies, view PDF versions, and organize favorites."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs uppercase font-semibold">
            {language.toUpperCase()}
          </Badge>
          <Link to="/kundli">
            <Button className="gap-1.5 shadow-sm">
              <Sparkles className="size-4 text-amber-300" /> Generate Kundli
            </Button>
          </Link>
        </div>
      }
    >
      {/* Tab Navigation Scrollable Strip */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max border-b border-border pb-2">
          {CRM_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                className={`text-xs font-semibold gap-1.5 rounded-xl transition-all ${
                  isActive ? "shadow-sm bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleSelectTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* View Loader / Tab Content */}
      {loading || !profile ? (
        <div className="p-12 text-center space-y-3">
          <div className="size-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your Astrology CRM Workspace...</p>
        </div>
      ) : (
        <div>
          {activeTab === "overview" && (
            <DashboardHomeView
              profile={profile}
              language={language}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === "previous_reports" && (
            <PreviousReportsView language={language} />
          )}

          {activeTab === "compare_reports" && (
            <CompareReportsView language={language} />
          )}

          {activeTab === "saved_remedies" && (
            <SavedRemediesView language={language} userId={uid} />
          )}

          {activeTab === "version_history" && (
            <PdfVersionHistoryView language={language} />
          )}

          {activeTab === "favorites" && (
            <FavoritesCenterView language={language} userId={uid} />
          )}

          {activeTab === "language" && (
            <MultiLanguageSelector
              currentLanguage={language}
              onSelectLanguage={(lang) => setLanguage(lang)}
            />
          )}

          {activeTab === "search" && (
            <SearchCenterView language={language} onNavigateTab={handleSelectTab} />
          )}

          {activeTab === "timeline" && (
            <ActivityTimelineView language={language} userId={uid} />
          )}

          {activeTab === "notifications" && (
            <NotificationCenterView language={language} userId={uid} />
          )}

          {activeTab === "user_profile" && (
            <AstrologyUserProfileView
              language={language}
              userId={uid}
              onLanguageChange={(lang) => setLanguage(lang)}
            />
          )}

          {activeTab === "security" && (
            <SecurityDashboardView language={language} userId={uid} />
          )}

          {activeTab === "admin_crm" && (
            <AdminCrmView language={language} />
          )}

          {activeTab === "analytics" && (
            <AstrologyAnalyticsView language={language} />
          )}

          {activeTab === "storage" && (
            <StorageManagerView language={language} />
          )}
        </div>
      )}
    </DashboardShell>
  );
}
