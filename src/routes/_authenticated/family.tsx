import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  GitCompare,
  Heart,
  TrendingUp,
  Clock3,
  FileText,
  Zap,
  Calendar,
  ShieldCheck,
  BarChart3,
  Plus,
  Star,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { ExtendedFamilyMember, FamilyRelationship } from "@/lib/family-astrology/family-types";
import { fetchFamilyMembers, saveFamilyMember } from "@/lib/family-astrology/family-api";

import { FamilyDashboardView } from "@/components/family-astrology/FamilyDashboardView";
import { FamilyTreeView } from "@/components/family-astrology/FamilyTreeView";
import { MultipleKundlisView } from "@/components/family-astrology/MultipleKundlisView";
import { ParentChildCompatibilityView } from "@/components/family-astrology/ParentChildCompatibilityView";
import { CoupleDashboardView } from "@/components/family-astrology/CoupleDashboardView";
import { FamilyTransitOverviewView } from "@/components/family-astrology/FamilyTransitOverviewView";
import { SharedMuhuratView } from "@/components/family-astrology/SharedMuhuratView";
import { CompareFamilyKundlisView } from "@/components/family-astrology/CompareFamilyKundlisView";
import { FamilyReportsView } from "@/components/family-astrology/FamilyReportsView";
import { SharedRemediesView } from "@/components/family-astrology/SharedRemediesView";
import { FamilyCalendarView } from "@/components/family-astrology/FamilyCalendarView";
import { FamilyPermissionsView } from "@/components/family-astrology/FamilyPermissionsView";
import { AdminFamilyWorkspaceView } from "@/components/family-astrology/AdminFamilyWorkspaceView";
import { FamilyAnalyticsView } from "@/components/family-astrology/FamilyAnalyticsView";

export const Route = createFileRoute("/_authenticated/family")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Family Astrology Workspace — SanatanTools" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FamilyPage,
});

type FamilyTab =
  | "dashboard"
  | "tree"
  | "multiple_kundlis"
  | "parent_child"
  | "couple"
  | "transit_overview"
  | "shared_muhurat"
  | "compare"
  | "reports"
  | "remedies"
  | "calendar"
  | "permissions"
  | "admin"
  | "analytics";

function FamilyPage() {
  const { user } = useAuth();
  const uid = user?.id || "user-1";

  const [members, setMembers] = useState<ExtendedFamilyMember[]>([]);
  const [activeTab, setActiveTab] = useState<FamilyTab>("dashboard");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Member Form
  const [formName, setFormName] = useState("");
  const [formRel, setFormRel] = useState<FamilyRelationship>("son");
  const [formGender, setFormGender] = useState<"male" | "female" | "other">("male");
  const [formDob, setFormDob] = useState("2021-11-05");
  const [formTime, setFormTime] = useState("08:10");
  const [formPlace, setFormPlace] = useState("New Delhi, India");

  const loadData = async () => {
    const list = await fetchFamilyMembers(uid);
    setMembers(list);
  };

  useEffect(() => {
    void loadData();
  }, [uid]);

  const handleAddMember = async () => {
    if (!formName.trim()) return;
    await saveFamilyMember({
      userId: uid,
      name: formName,
      relationship: formRel,
      gender: formGender,
      dob: formDob,
      birthTime: formTime,
      birthPlace: formPlace,
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      preferredLanguage: "en",
      lagnaSign: "Scorpio (Vrishchika)",
      rashiSign: "Sagittarius (Dhanu)",
      nakshatra: "Mula (Pada 2)",
      currentMahadasha: "Ketu Mahadasha",
      currentAntardasha: "Venus Antardasha",
      permission: "editable",
    });
    setFormName("");
    setIsAddOpen(false);
    void loadData();
  };

  return (
    <DashboardShell
      title="Family Astrology Workspace (Enterprise Edition)"
      description="Manage family members, compare Kundlis, analyze parent-child & couple compatibility, and generate combined reports."
      actions={
        <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Add Profile
        </Button>
      }
    >
      {/* Navigation Sub-Tabs */}
      <div className="mb-6 border-b border-border pb-2 flex items-center gap-1.5 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("dashboard")}
        >
          <Users className="size-3.5" /> 24.1 Overview
        </Button>
        <Button
          size="sm"
          variant={activeTab === "tree" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("tree")}
        >
          <Users className="size-3.5 text-accent" /> 24.2 Family Tree
        </Button>
        <Button
          size="sm"
          variant={activeTab === "multiple_kundlis" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("multiple_kundlis")}
        >
          <Star className="size-3.5 text-amber-500" /> 24.3 Isolated Kundlis
        </Button>
        <Button
          size="sm"
          variant={activeTab === "parent_child" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("parent_child")}
        >
          <Heart className="size-3.5 text-rose-500" /> 24.4 Parent–Child
        </Button>
        <Button
          size="sm"
          variant={activeTab === "couple" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("couple")}
        >
          <Heart className="size-3.5 text-rose-500 fill-rose-500" /> 24.5 Couple Dashboard
        </Button>
        <Button
          size="sm"
          variant={activeTab === "transit_overview" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("transit_overview")}
        >
          <TrendingUp className="size-3.5 text-emerald-500" /> 24.6 Transits
        </Button>
        <Button
          size="sm"
          variant={activeTab === "shared_muhurat" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("shared_muhurat")}
        >
          <Clock3 className="size-3.5 text-amber-500" /> 24.7 Muhurat
        </Button>
        <Button
          size="sm"
          variant={activeTab === "compare" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("compare")}
        >
          <GitCompare className="size-3.5" /> 24.8 Compare
        </Button>
        <Button
          size="sm"
          variant={activeTab === "reports" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("reports")}
        >
          <FileText className="size-3.5" /> 24.9 Family Reports
        </Button>
        <Button
          size="sm"
          variant={activeTab === "remedies" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("remedies")}
        >
          <Zap className="size-3.5 text-amber-500" /> 24.10 Remedies
        </Button>
        <Button
          size="sm"
          variant={activeTab === "calendar" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar className="size-3.5 text-purple-500" /> 24.12 Calendar
        </Button>
        <Button
          size="sm"
          variant={activeTab === "permissions" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("permissions")}
        >
          <ShieldCheck className="size-3.5 text-emerald-500" /> 24.13 Security
        </Button>
        <Button
          size="sm"
          variant={activeTab === "admin" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("admin")}
        >
          <Users className="size-3.5 text-blue-500" /> 24.14 Admin
        </Button>
        <Button
          size="sm"
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 className="size-3.5 text-accent" /> 24.17 Analytics
        </Button>
      </div>

      {/* Tab Views */}
      <div>
        {activeTab === "dashboard" && (
          <FamilyDashboardView
            members={members}
            onNavigateTab={(tab) => setActiveTab(tab as FamilyTab)}
            onAddMemberClick={() => setIsAddOpen(true)}
          />
        )}

        {activeTab === "tree" && (
          <FamilyTreeView
            members={members}
            onAddMemberClick={() => setIsAddOpen(true)}
          />
        )}

        {activeTab === "multiple_kundlis" && (
          <MultipleKundlisView
            members={members}
            onAddMemberClick={() => setIsAddOpen(true)}
          />
        )}

        {activeTab === "parent_child" && (
          <ParentChildCompatibilityView members={members} />
        )}

        {activeTab === "couple" && (
          <CoupleDashboardView members={members} />
        )}

        {activeTab === "transit_overview" && (
          <FamilyTransitOverviewView members={members} />
        )}

        {activeTab === "shared_muhurat" && (
          <SharedMuhuratView />
        )}

        {activeTab === "compare" && (
          <CompareFamilyKundlisView members={members} />
        )}

        {activeTab === "reports" && (
          <FamilyReportsView members={members} userId={uid} />
        )}

        {activeTab === "remedies" && (
          <SharedRemediesView userId={uid} />
        )}

        {activeTab === "calendar" && (
          <FamilyCalendarView />
        )}

        {activeTab === "permissions" && (
          <FamilyPermissionsView members={members} />
        )}

        {activeTab === "admin" && (
          <AdminFamilyWorkspaceView />
        )}

        {activeTab === "analytics" && (
          <FamilyAnalyticsView />
        )}
      </div>

      {/* Add Member Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Family Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-sm">
            <div>
              <label className="text-xs font-semibold block mb-1">Member Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Relationship</label>
                <Select value={formRel} onValueChange={(val: any) => setFormRel(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="grandfather">Grandfather</SelectItem>
                    <SelectItem value="grandmother">Grandmother</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Gender</label>
                <Select value={formGender} onValueChange={(val: any) => setFormGender(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Date of Birth</label>
                <Input
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Time of Birth</label>
                <Input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Place of Birth</label>
              <Input
                value={formPlace}
                onChange={(e) => setFormPlace(e.target.value)}
                placeholder="e.g. New Delhi, India"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Save Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
