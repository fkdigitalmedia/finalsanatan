import React, { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  HeartHandshake,
  Landmark,
  Shield,
  Utensils,
  Flame,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  RemedyCategory,
  RemedyPriority,
  RemedyStatus,
  SavedRemedy,
  SupportedLanguage,
} from "@/lib/astrology-crm/crm-types";
import {
  deleteUserRemedy,
  fetchUserRemedies,
  saveUserRemedy,
} from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface SavedRemediesViewProps {
  language: SupportedLanguage;
  userId?: string;
}

const CATEGORY_ICONS: Record<RemedyCategory, React.ReactNode> = {
  mantra: <BookOpen className="size-4 text-purple-500" />,
  donation: <HeartHandshake className="size-4 text-emerald-500" />,
  temple_visit: <Landmark className="size-4 text-amber-500" />,
  gemstone: <Shield className="size-4 text-blue-500" />,
  fasting: <Utensils className="size-4 text-rose-500" />,
  puja: <Flame className="size-4 text-orange-500" />,
};

const CATEGORY_LABELS: Record<RemedyCategory, string> = {
  mantra: "Mantra Chanting",
  donation: "Donation (Daan)",
  temple_visit: "Temple Visit",
  gemstone: "Gemstone Wear",
  fasting: "Fasting (Vrat)",
  puja: "Puja & Archana",
};

export function SavedRemediesView({ language, userId = "user-1" }: SavedRemediesViewProps) {
  const t = getTranslation(language);
  const [remedies, setRemedies] = useState<SavedRemedy[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePriority, setActivePriority] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<RemedyCategory>("mantra");
  const [formPlanet, setFormPlanet] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<RemedyPriority>("high");
  const [formTargetDays, setFormTargetDays] = useState(21);
  const [formNotes, setFormNotes] = useState("");

  const loadData = async () => {
    const list = await fetchUserRemedies(userId);
    setRemedies(list);
  };

  useEffect(() => {
    void loadData();
  }, [userId]);

  const filteredRemedies = remedies.filter((r) => {
    const matchesCat = activeCategory === "all" || r.category === activeCategory;
    const matchesPrio = activePriority === "all" || r.priority === activePriority;
    return matchesCat && matchesPrio;
  });

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    await saveUserRemedy({
      userId,
      title: formTitle,
      category: formCategory,
      planetOrDosha: formPlanet,
      description: formDesc,
      priority: formPriority,
      status: "not_started",
      targetDays: formTargetDays,
      completedDays: 0,
      notes: formNotes,
    });
    setFormTitle("");
    setFormDesc("");
    setFormNotes("");
    setIsAddDialogOpen(false);
    void loadData();
  };

  const handleToggleComplete = async (remedy: SavedRemedy) => {
    const nextStatus: RemedyStatus = remedy.status === "completed" ? "in_progress" : "completed";
    await saveUserRemedy({
      ...remedy,
      status: nextStatus,
      completedDays: nextStatus === "completed" ? remedy.targetDays || 1 : remedy.completedDays,
    });
    void loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteUserRemedy(id);
    void loadData();
  };

  const completedCount = remedies.filter((r) => r.status === "completed").length;
  const inProgressCount = remedies.filter((r) => r.status === "in_progress").length;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Zap className="size-6 text-amber-500" /> {t.savedRemedies}
          </h2>
          <p className="text-sm text-muted-foreground">
            Personal remedy manager — track Mantras, Donations, Fasting, Gemstones & Pujas.
          </p>
        </div>

        <Button className="gap-2 shadow-sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="size-4" /> {t.addRemedy}
        </Button>
      </div>

      {/* Progress Summary Header */}
      <Card className="p-5 bg-gradient-to-r from-amber-500/10 via-background to-purple-500/10 border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Overall Remedial Progress
            </span>
            <h3 className="font-display text-xl font-bold mt-0.5">
              {completedCount} of {remedies.length} Remedies Completed
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {inProgressCount} currently active in daily discipline.
            </p>
          </div>
          <div className="w-full sm:w-48">
            <Progress
              value={remedies.length ? (completedCount / remedies.length) * 100 : 0}
              className="h-3"
            />
            <span className="text-[11px] text-muted-foreground mt-1 block text-right">
              {remedies.length ? Math.round((completedCount / remedies.length) * 100) : 0}% Done
            </span>
          </div>
        </div>
      </Card>

      {/* Category Tabs & Priority Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={activeCategory === "all" ? "default" : "outline"}
            className="text-xs rounded-full"
            onClick={() => setActiveCategory("all")}
          >
            {t.filterAll} ({remedies.length})
          </Button>

          {(Object.keys(CATEGORY_LABELS) as RemedyCategory[]).map((cat) => {
            const count = remedies.filter((r) => r.category === cat).length;
            return (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                className="text-xs rounded-full gap-1.5"
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_ICONS[cat]}
                {CATEGORY_LABELS[cat]} ({count})
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="size-3.5 text-muted-foreground" />
          <Select value={activePriority} onValueChange={(val) => setActivePriority(val)}>
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Remedies List */}
      {filteredRemedies.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Zap className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold">{t.emptyStateTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            No saved remedies found under this category filter. Add a new remedy to start tracking.
          </p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="size-4 mr-1.5" /> {t.addRemedy}
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredRemedies.map((remedy) => {
            const isCompleted = remedy.status === "completed";
            const progressPct =
              remedy.targetDays && remedy.targetDays > 0
                ? Math.min(100, Math.round(((remedy.completedDays || 0) / remedy.targetDays) * 100))
                : isCompleted
                ? 100
                : 0;

            return (
              <Card
                key={remedy.id}
                className={`p-5 transition-all relative ${
                  isCompleted
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "hover:border-accent/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary">
                      {CATEGORY_ICONS[remedy.category]}
                    </div>
                    <div>
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {CATEGORY_LABELS[remedy.category]}
                      </Badge>
                      {remedy.planetOrDosha && (
                        <p className="text-xs font-medium text-accent mt-0.5">
                          {remedy.planetOrDosha}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge
                      className={
                        remedy.priority === "high"
                          ? "bg-rose-500 text-white text-[10px]"
                          : remedy.priority === "medium"
                          ? "bg-amber-500 text-white text-[10px]"
                          : "bg-blue-500 text-white text-[10px]"
                      }
                    >
                      {remedy.priority.toUpperCase()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(remedy.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <h3 className={`font-display font-semibold text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                  {remedy.title}
                </h3>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {remedy.description}
                </p>

                {/* Progress bar */}
                {remedy.targetDays && remedy.targetDays > 1 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>
                        Progress: {remedy.completedDays || 0} / {remedy.targetDays} Days
                      </span>
                      <span>{progressPct}%</span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                  </div>
                )}

                {remedy.notes && (
                  <p className="mt-3 text-[11px] italic text-muted-foreground bg-secondary/40 p-2 rounded border border-border">
                    " {remedy.notes} "
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Added {new Date(remedy.createdAt).toLocaleDateString()}
                  </span>

                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    className="text-xs gap-1.5"
                    onClick={() => handleToggleComplete(remedy)}
                  >
                    <CheckCircle2 className="size-3.5" />
                    {isCompleted ? "Completed" : t.markCompleted}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Remedy Modal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{t.addRemedy}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div>
              <label className="text-xs font-semibold block mb-1">Remedy Title</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Mahamrityunjaya Mantra (108 Chants)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Category</label>
                <Select
                  value={formCategory}
                  onValueChange={(val: any) => setFormCategory(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mantra">Mantra Chanting</SelectItem>
                    <SelectItem value="donation">Donation (Daan)</SelectItem>
                    <SelectItem value="temple_visit">Temple Visit</SelectItem>
                    <SelectItem value="gemstone">Gemstone Wear</SelectItem>
                    <SelectItem value="fasting">Fasting (Vrat)</SelectItem>
                    <SelectItem value="puja">Puja & Archana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Priority</label>
                <Select
                  value={formPriority}
                  onValueChange={(val: any) => setFormPriority(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Target Planet or Dosha</label>
              <Input
                value={formPlanet}
                onChange={(e) => setFormPlanet(e.target.value)}
                placeholder="e.g. Rahu / Saturn Sadesati"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Instructions / Description</label>
              <Textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Chant daily morning facing East..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Target Days</label>
                <Input
                  type="number"
                  value={formTargetDays}
                  onChange={(e) => setFormTargetDays(parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Personal Notes</label>
                <Input
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional reminder"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save Remedy</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
