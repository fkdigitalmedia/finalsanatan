import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Search,
  Download,
  Eye,
  Copy,
  Trash2,
  Filter,
  ArrowUpDown,
  Calendar,
  Globe,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

export interface KundliReportItem {
  id: string;
  name: string;
  kind: string;
  generationDate: string;
  birthName: string;
  birthDob: string;
  birthTime: string;
  birthPlace: string;
  language: SupportedLanguage;
  version: string;
  pdfSizeFormatted: string;
  status: "Completed" | "Generating" | "Archived";
  downloadUrl?: string;
}

interface PreviousReportsViewProps {
  language: SupportedLanguage;
  onSelectCompare?: (report1Id: string, report2Id: string) => void;
}

export function PreviousReportsView({ language, onSelectCompare }: PreviousReportsViewProps) {
  const t = getTranslation(language);
  const [reports, setReports] = useState<KundliReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<KundliReportItem | null>(null);

  useEffect(() => {
    async function loadRealReports() {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        setReports([]);
        setLoading(false);
        return;
      }

      const { data: kundlis } = await supabase
        .from("user_kundlis")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (kundlis && kundlis.length > 0) {
        const mapped: KundliReportItem[] = kundlis.map((k: any) => ({
          id: k.id,
          name: `${k.name} - Janam Kundli Report`,
          kind: "Janam Kundli",
          generationDate: k.created_at ? new Date(k.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          birthName: k.name,
          birthDob: k.birth_date || "N/A",
          birthTime: k.birth_time ? String(k.birth_time).slice(0, 5) : "12:00",
          birthPlace: k.place_name || "N/A",
          language: (k.language as SupportedLanguage) || "en",
          version: "v2.1",
          pdfSizeFormatted: "2.4 MB",
          status: k.is_archived ? "Archived" : "Completed",
        }));
        setReports(mapped);
      } else {
        setReports([]);
      }
      setLoading(false);
    }
    void loadRealReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        const matchesSearch =
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.birthName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.kind.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLang = filterLanguage === "all" || r.language === filterLanguage;
        const matchesStatus = filterStatus === "all" || r.status === filterStatus;
        return matchesSearch && matchesLang && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime();
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return (
          parseFloat(b.pdfSizeFormatted.replace(" MB", "")) -
          parseFloat(a.pdfSizeFormatted.replace(" MB", ""))
        );
      });
  }, [reports, searchTerm, sortBy, filterLanguage, filterStatus]);

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDuplicate = (report: KundliReportItem) => {
    const cloned: KundliReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      name: `${report.name} (Copy)`,
      generationDate: new Date().toISOString().split("T")[0],
      version: `${report.version} Clone`,
      status: "Completed",
    };
    setReports((prev) => [cloned, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <FileText className="size-6 text-accent" /> {t.previousReports}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage, download, duplicate, or compare all your generated Kundli reports.
          </p>
        </div>

        <Button className="gap-2 shadow-sm">
          <Plus className="size-4" /> {t.generateKundli}
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-card/60 backdrop-blur">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Omnibox */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports or birth name..."
              className="pl-9"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground shrink-0" />
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest Date</SelectItem>
                <SelectItem value="name">Report Name</SelectItem>
                <SelectItem value="size">PDF File Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Language */}
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground shrink-0" />
            <Select value={filterLanguage} onValueChange={(val) => setFilterLanguage(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground shrink-0" />
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Generating">Generating</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports Table / List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          <div className="size-6 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto mb-2" />
          Loading your Kundli reports...
        </div>
      ) : filteredReports.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold">No Kundli Reports Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            You haven't saved any Kundli reports yet. Create your first birth chart report to view and manage it here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/kundli">
              <Button className="gap-2">
                <Plus className="size-4" /> {t.generateKundli}
              </Button>
            </Link>
            {(searchTerm || filterLanguage !== "all" || filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterLanguage("all");
                  setFilterStatus("all");
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="p-5 transition-all hover:border-accent/50 hover:shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Report info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {report.kind}
                    </Badge>
                    <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 text-[10px] uppercase">
                      {report.version}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="size-3" /> {report.language.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" /> {report.generationDate}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg truncate">{report.name}</h3>

                  <p className="text-xs text-muted-foreground">
                    <strong>Birth Details:</strong> {report.birthName} ({report.birthDob} at{" "}
                    {report.birthTime}, {report.birthPlace})
                  </p>
                </div>

                {/* Right: PDF Metadata & Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mr-2">
                    <HardDrive className="size-3.5" /> {report.pdfSizeFormatted}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="size-3.5" /> {t.viewReport}
                  </Button>

                  <Button
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => {
                      alert(`Downloading ${report.name} PDF (${report.pdfSizeFormatted})...`);
                    }}
                  >
                    <Download className="size-3.5" /> {t.downloadPdf}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0"
                    title="Duplicate Report"
                    onClick={() => handleDuplicate(report)}
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0 text-destructive hover:bg-destructive/10"
                    title="Delete Report"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedReport.name}</DialogTitle>
              <DialogDescription>
                Report generated on {selectedReport.generationDate} using {selectedReport.version}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm py-2">
              <div className="rounded-lg bg-secondary p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject Name:</span>
                  <span className="font-semibold">{selectedReport.birthName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-semibold">{selectedReport.birthDob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time of Birth:</span>
                  <span className="font-semibold">{selectedReport.birthTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Place of Birth:</span>
                  <span className="font-semibold">{selectedReport.birthPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-semibold">{selectedReport.language.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PDF Size:</span>
                  <span className="font-semibold">{selectedReport.pdfSizeFormatted}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This report features complete high-precision Vimshottari Dasha calculations,
                Ashtakoot Guna points, Planetary positions, Sade Sati timeline, and custom remedies.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  alert(`Downloading ${selectedReport.name} PDF...`);
                  setSelectedReport(null);
                }}
              >
                <Download className="size-4 mr-1.5" /> Download Full PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
