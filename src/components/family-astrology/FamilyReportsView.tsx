import React, { useState, useEffect } from "react";
import { FileText, Download, Plus, CheckCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CombinedFamilyReport, ExtendedFamilyMember } from "@/lib/family-astrology/family-types";
import { fetchCombinedFamilyReports } from "@/lib/family-astrology/family-api";

interface FamilyReportsViewProps {
  members: ExtendedFamilyMember[];
  userId?: string;
}

export function FamilyReportsView({ members, userId = "user-1" }: FamilyReportsViewProps) {
  const [reports, setReports] = useState<CombinedFamilyReport[]>([]);

  useEffect(() => {
    void fetchCombinedFamilyReports(userId).then(setReports);
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <FileText className="size-6 text-accent" /> 24.9 Combined Family PDF Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate combined multi-member PDF reports, Couple Compatibility guides, and Family Transit forecasts.
          </p>
        </div>

        <Button
          className="gap-2 shadow-sm"
          onClick={() => alert("Building new Combined Family PDF Report...")}
        >
          <Plus className="size-4" /> Generate Family PDF
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id} className="p-5 hover:border-accent/50 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/10 text-accent font-semibold text-[10px] uppercase border-accent/20">
                    {report.kind.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{report.generatedDate}</span>
                </div>
                <h3 className="font-display font-bold text-lg">{report.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Included Members: <strong>{report.includedMemberNames.join(", ")}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">{report.fileSizeFormatted}</span>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => alert(`Downloading ${report.title}...`)}
                >
                  <Download className="size-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
