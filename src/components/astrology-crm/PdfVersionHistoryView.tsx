import React, { useState, useEffect } from "react";
import {
  History,
  Download,
  RotateCcw,
  CheckCircle,
  HardDrive,
  Calendar,
  Layers,
  FileCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReportVersion, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchReportVersions, restoreReportVersion } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface PdfVersionHistoryViewProps {
  language: SupportedLanguage;
  reportId?: string;
}

export function PdfVersionHistoryView({ language, reportId = "rep-latest" }: PdfVersionHistoryViewProps) {
  const t = getTranslation(language);
  const [versions, setVersions] = useState<ReportVersion[]>([]);

  const loadData = async () => {
    const list = await fetchReportVersions(reportId);
    setVersions(list);
  };

  useEffect(() => {
    void loadData();
  }, [reportId]);

  const handleRestore = async (versionId: string) => {
    await restoreReportVersion(versionId);
    void loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <History className="size-6 text-accent" /> {t.versionHistory}
        </h2>
        <p className="text-sm text-muted-foreground">
          Track, download, or restore every PDF version generated for your birth chart.
        </p>
      </div>

      {/* Version History Timeline */}
      <div className="relative border-l-2 border-border pl-6 space-y-6 ml-3">
        {versions.map((ver) => (
          <div key={ver.id} className="relative">
            {/* Dot marker */}
            <span
              className={`absolute -left-[31px] top-1.5 size-4 rounded-full border-2 bg-background ${
                ver.isCurrent ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground"
              }`}
            />

            <Card className={`p-5 ${ver.isCurrent ? "border-emerald-500/40 bg-emerald-500/5" : ""}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={ver.isCurrent ? "bg-emerald-500" : "bg-accent/20 text-accent"}>
                      {ver.versionNumber}
                    </Badge>
                    {ver.isCurrent && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[10px]">
                        Active Version
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />{" "}
                      {new Date(ver.generatedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base flex items-center gap-2">
                    <FileCode className="size-4 text-accent" /> {ver.engineVersion}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-1.5">{ver.changesDescription}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1">
                    <HardDrive className="size-3.5" /> {ver.fileSizeFormatted}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => alert(`Downloading previous version ${ver.versionNumber}...`)}
                  >
                    <Download className="size-3.5" /> Download
                  </Button>

                  {!ver.isCurrent && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-xs text-accent hover:bg-accent/10"
                      onClick={() => handleRestore(ver.id)}
                    >
                      <RotateCcw className="size-3.5" /> Restore
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
