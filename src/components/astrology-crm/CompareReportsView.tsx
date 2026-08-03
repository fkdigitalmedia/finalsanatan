import React, { useState } from "react";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { generateReportComparison } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface CompareReportsViewProps {
  language: SupportedLanguage;
}

export function CompareReportsView({ language }: CompareReportsViewProps) {
  const t = getTranslation(language);
  const [rep1Name, setRep1Name] = useState("Kundli Report v1.0 (2024 Initial)");
  const [rep2Name, setRep2Name] = useState("Kundli Report v2.1 (2026 Latest Engine)");

  const comparison = generateReportComparison(rep1Name, rep2Name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <GitCompare className="size-6 text-accent" /> {t.compareReports}
        </h2>
        <p className="text-sm text-muted-foreground">
          Compare planetary positions, Dasha timelines, transit scores, predictions and remedies
          between two reports with visual diff highlighting.
        </p>
      </div>

      {/* Selectors Bar */}
      <Card className="p-5 bg-card/60">
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-medium">
              Base Report (Old)
            </label>
            <Select value={rep1Name} onValueChange={(val) => setRep1Name(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kundli Report v1.0 (2024 Initial)">
                  Kundli Report v1.0 (2024 Initial)
                </SelectItem>
                <SelectItem value="Kundli Report v1.5 (Mid 2025)">
                  Kundli Report v1.5 (Mid 2025)
                </SelectItem>
                <SelectItem value="Career Report v1.8 (2025)">
                  Career Report v1.8 (2025)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex size-10 rounded-full bg-accent/10 text-accent items-center justify-center font-bold">
            VS
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-medium">
              Compared Report (Latest)
            </label>
            <Select value={rep2Name} onValueChange={(val) => setRep2Name(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kundli Report v2.1 (2026 Latest Engine)">
                  Kundli Report v2.1 (2026 Latest Engine)
                </SelectItem>
                <SelectItem value="Ashtakoot Matching v2.0">
                  Ashtakoot Matching v2.0
                </SelectItem>
                <SelectItem value="Varshphal Annual Report 2026">
                  Varshphal Annual Report 2026
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Overview Metric Delta Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <p className="text-xs uppercase tracking-wider text-emerald-600 font-medium">
            Transit Score Shift
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {comparison.report1.transitScore} →{" "}
              <strong className="text-emerald-600 font-bold text-lg">
                {comparison.report2.transitScore}
              </strong>
            </span>
            <Badge className="bg-emerald-500 text-white text-[10px]">+16 PTS (Auspicious)</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <p className="text-xs uppercase tracking-wider text-blue-600 font-medium">
            Antardasha Transition
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {comparison.report1.antardasha} →{" "}
              <strong className="text-blue-600 font-bold text-lg">
                {comparison.report2.antardasha}
              </strong>
            </span>
            <Badge className="bg-blue-500 text-white text-[10px]">Updated Period</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <p className="text-xs uppercase tracking-wider text-amber-600 font-medium">
            New Predictions
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {comparison.report1.predictionsCount} →{" "}
              <strong className="text-amber-600 font-bold text-lg">
                {comparison.report2.predictionsCount}
              </strong>
            </span>
            <Badge className="bg-amber-500 text-white text-[10px]">+8 Deep Insights</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <p className="text-xs uppercase tracking-wider text-purple-600 font-medium">
            Recommended Remedies
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {comparison.report1.remediesCount} →{" "}
              <strong className="text-purple-600 font-bold text-lg">
                {comparison.report2.remediesCount}
              </strong>
            </span>
            <Badge className="bg-purple-500 text-white text-[10px]">+3 Customized</Badge>
          </div>
        </Card>
      </div>

      {/* Planetary Position Comparison Matrix */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-accent" /> Planetary Positions & Degree Shifts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Graha (Planet)</th>
                <th className="p-3">{comparison.report1.title}</th>
                <th className="p-3">{comparison.report2.title}</th>
                <th className="p-3">Shift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.report1.planets.map((p1: any, idx: number) => {
                const p2 = comparison.report2.planets[idx];
                const isShifted = p1.sign !== p2.sign || p1.house !== p2.house;
                return (
                  <tr
                    key={p1.planet}
                    className={
                      isShifted ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-secondary/20"
                    }
                  >
                    <td className="p-3 font-semibold flex items-center gap-2">
                      <span className="size-2 rounded-full bg-accent inline-block" />
                      {p1.planet}
                    </td>

                    <td className="p-3">
                      <span className="font-medium">{p1.sign}</span> (House {p1.house} •{" "}
                      {p1.degrees})
                    </td>

                    <td className="p-3">
                      <span className="font-medium">{p2.sign}</span> (House {p2.house} •{" "}
                      {p2.degrees})
                    </td>

                    <td className="p-3">
                      {isShifted ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Moved: {p1.sign} → {p2.sign} (H{p2.house})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Unchanged
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dasha & Transit Timeline Comparison */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <Calendar className="size-4 text-accent" /> Dasha Timeline Diff
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[10px]">REPORT 1 DASHA</span>
              <p className="font-semibold text-sm">
                {comparison.report1.mahadasha} Mahadasha / {comparison.report1.antardasha}{" "}
                Antardasha
              </p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-600 font-semibold block text-[10px]">
                REPORT 2 (UPDATED DASHA)
              </span>
              <p className="font-semibold text-sm text-foreground">
                {comparison.report2.mahadasha} Mahadasha / {comparison.report2.antardasha}{" "}
                Antardasha
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Sub-period shifted to Ketu, invoking heightened intuition and spiritual clarity.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-500" /> Transit Score & Verdict Diff
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[10px]">REPORT 1 TRANSIT</span>
              <p className="font-semibold text-sm">{comparison.report1.transitVerdict}</p>
              <p className="text-[11px] text-muted-foreground">
                Score: {comparison.report1.transitScore}/100
              </p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-600 font-semibold block text-[10px]">
                REPORT 2 (CURRENT TRANSIT)
              </span>
              <p className="font-semibold text-sm text-emerald-700">
                {comparison.report2.transitVerdict} (+16% Improvement)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Score: {comparison.report2.transitScore}/100 • Jupiter transit in 10th House
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
