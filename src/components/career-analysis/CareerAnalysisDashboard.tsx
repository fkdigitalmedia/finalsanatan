import { useState } from "react";
import {
  Briefcase,
  TrendingUp,
  Award,
  Crown,
  Target,
  Sparkles,
  Zap,
  Building2,
  Cpu,
  GraduationCap,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { CareerAnalysisResultV2 } from "@/lib/career-analysis/types";
import { buildCareerAnalysisPdfHtml } from "@/lib/career-analysis/pdf-builder";

interface CareerAnalysisDashboardProps {
  result: CareerAnalysisResultV2;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export function CareerAnalysisDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: CareerAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { input, scores, executiveSummary, dna, suitabilityDomains, d10Dashamsa, atmakaraka, amatyakaraka, yogas, topIndustries, topCareerRoles, monthlyTimeline, annualTimeline, riskAnalysis, remedies, luckyElements, evidenceChain, aiCoach, finalVerdict } = result;

  const downloadPdf = () => {
    const htmlContent = buildCareerAnalysisPdfHtml(result);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Enterprise Commercial Pro v2.0
            </Badge>
            <span className="text-xs text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Career Analysis Report Pro v2.0 — {input.name}
          </h1>
          <p className="text-sm text-amber-100 mt-1 max-w-2xl">
            28-Section Commercial Vedic Career Intelligence analyzing D10 Dashamsa, Jaimini Karakas, 14 Suitability Domains, 20 Industries, 25 Ranked Careers, and 5-Tier AI Strategy.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-md">
            <Download className="w-4 h-4 mr-2" /> Download PDF (40 Pages)
          </Button>
          {onSave && (
            <Button onClick={onSave} disabled={isSaving} size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> {isSaving ? "Saving…" : "Save to Dashboard"}
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare} size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Share2 className="w-4 h-4 mr-1.5" /> Share
            </Button>
          )}
          {onRegenerate && (
            <Button onClick={onRegenerate} size="sm" variant="ghost" className="text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} size="sm" variant="ghost" className="text-red-200 hover:bg-red-500/20">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Primary Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-300 dark:border-amber-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Briefcase className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{scores.overallCareerScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Career Potential</div>
            <Progress value={scores.overallCareerScore} className="h-1.5 mt-3 bg-amber-100 dark:bg-amber-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-300 dark:border-blue-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300">{scores.leadershipScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Leadership Score</div>
            <Progress value={scores.leadershipScore} className="h-1.5 mt-3 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{scores.salaryGrowthScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Salary Growth Score</div>
            <Progress value={scores.salaryGrowthScore} className="h-1.5 mt-3 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-300 dark:border-purple-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Cpu className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-black text-purple-700 dark:text-purple-300">{topCareerRoles[0].role}</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Top Career Role Match</div>
            <div className="text-xs text-purple-600 font-bold mt-2">{topCareerRoles[0].suitabilityScore}% Match Fit</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="dashboard">11 Scores</TabsTrigger>
          <TabsTrigger value="roles">14 Domains & Roles</TabsTrigger>
          <TabsTrigger value="d10">D10 & Yogas</TabsTrigger>
          <TabsTrigger value="timeline">Timelines</TabsTrigger>
          <TabsTrigger value="risks">Risks & Remedies</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & AI Coach</TabsTrigger>
        </TabsList>

        {/* Tab 1: Executive Dashboard & Scores */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>11 Precision Career Score Metrics & Indices</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Overall Career Potential", score: scores.overallCareerScore },
                { label: "Promotion Potential", score: scores.promotionScore },
                { label: "Leadership Score", score: scores.leadershipScore },
                { label: "Team Management", score: scores.managementScore },
                { label: "Business Suitability", score: scores.businessSuitabilityScore },
                { label: "Government Job / Civil Services", score: scores.governmentJobScore },
                { label: "Private Corporate Sector", score: scores.privateJobScore },
                { label: "Salary Growth Capacity", score: scores.salaryGrowthScore },
                { label: "Foreign Career & MNC", score: scores.foreignCareerScore },
                { label: "Opportunity Density", score: scores.opportunityIndex },
                { label: "Risk Index", score: scores.riskIndex, isRisk: true },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`text-base font-extrabold ${item.isRisk ? "text-rose-600" : "text-amber-600 dark:text-amber-400"}`}>
                      {item.score}%
                    </span>
                  </div>
                  <Progress value={item.score} className={`h-1.5 ${item.isRisk ? "bg-rose-100" : "bg-amber-100 dark:bg-amber-950"}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executive AI Summary & Career DNA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{executiveSummary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 border rounded-xl bg-amber-50/50 dark:bg-amber-950/20"><strong>Working Style:</strong> {dna.workingStyle}</div>
                <div className="p-3 border rounded-xl bg-amber-50/50 dark:bg-amber-950/20"><strong>Leadership Style:</strong> {dna.leadershipStyle}</div>
                <div className="p-3 border rounded-xl bg-amber-50/50 dark:bg-amber-950/20"><strong>Communication:</strong> {dna.communicationStyle}</div>
                <div className="p-3 border rounded-xl bg-amber-50/50 dark:bg-amber-950/20"><strong>Decision Making:</strong> {dna.decisionMakingStyle}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 14 Domains, Top 20 Industries, Top 25 Careers */}
        <TabsContent value="roles" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>14 Career Suitability Domains Ranked</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {suitabilityDomains.map((d, i) => (
                <div key={i} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">#{d.rank} {d.category}</span>
                    <div className="text-slate-500 text-[11px]">{d.astrologicalBasis}</div>
                  </div>
                  <Badge className="bg-amber-600 text-white font-bold">{d.suitabilityScore}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 25 Ranked Career Roles</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {topCareerRoles.map((r, i) => (
                <div key={i} className="p-3 border rounded-xl space-y-1 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>#{r.rank} {r.role}</span>
                    <Badge variant="outline">{r.suitabilityScore}%</Badge>
                  </div>
                  <div className="text-slate-500">{r.astrologicalWhy}</div>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold">Skills: {r.keySkills.join(", ")}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: D10 & Yogas */}
        <TabsContent value="d10" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>D10 Dashamsa & Jaimini Karakas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div><strong>D10 Ascendant:</strong> {d10Dashamsa.ascendantSign}</div>
                <div><strong>D10 10th Lord:</strong> {d10Dashamsa.house10Lord} in {d10Dashamsa.house10Sign}</div>
                <div><strong>Jaimini Atmakaraka (Soul Ambition):</strong> {atmakaraka.planet} in {atmakaraka.sign}</div>
                <div><strong>Jaimini Amatyakaraka (Career Minister):</strong> {amatyakaraka.planet} in {amatyakaraka.sign}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Yogas Identified</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {yogas.map((y, i) => (
                  <div key={i} className="p-3 border rounded-xl space-y-1 bg-slate-50 dark:bg-slate-900">
                    <div className="font-bold text-amber-700 dark:text-amber-300">{y.yogaName} ({y.confidencePercent}% Confidence)</div>
                    <p className="text-slate-600 dark:text-slate-400">{y.meaning}</p>
                    <div className="text-slate-500 font-medium">Evidence: {y.evidence}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Monthly & Annual Timelines */}
        <TabsContent value="timeline" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>12-Month Unique Career Forecast</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {monthlyTimeline.map((m, i) => (
                <div key={i} className="p-3.5 border rounded-xl space-y-1.5 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{m.monthName}</span>
                    <span className="text-amber-500">{'★'.repeat(m.monthRating)}</span>
                  </div>
                  <div><strong>Focus:</strong> {m.careerFocus}</div>
                  <div><strong>Promotion:</strong> {m.promotionOutlook}</div>
                  <div><strong>Opportunity:</strong> {m.opportunityWindow}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Risks & Remedies */}
        <TabsContent value="risks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Risks & Vedic Remedies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 border-l-4 border-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-r-lg space-y-1">
                <div className="font-bold text-rose-900 dark:text-rose-300">RISK ASSESSMENT</div>
                <div><strong>Office Politics Risk:</strong> {riskAnalysis.officePoliticsRisk}</div>
                <div><strong>Layoff Probability:</strong> {riskAnalysis.layoffProbabilityPercent}%</div>
                <div><strong>Burnout Risk Level:</strong> {riskAnalysis.burnoutRiskLevel}</div>
              </div>

              <div className="p-3 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 rounded-r-lg space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-300">RECOMMENDED REMEDIES & LUCKY ELEMENTS</div>
                <div><strong>Mantras:</strong> {remedies.mantras.join(", ")}</div>
                <div><strong>Gemstones:</strong> {remedies.gemstones.join(", ")}</div>
                <div><strong>Lucky Colours:</strong> {luckyElements.colours.join(", ")}</div>
                <div><strong>Lucky Days:</strong> {luckyElements.days.join(", ")}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Evidence & AI Coach */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {evidenceChain.map((e, i) => (
                <div key={i} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{e.claim}</span>
                    <Badge variant="outline">{e.confidencePercent}% Confidence</Badge>
                  </div>
                  <div><strong>Planet:</strong> {e.planet} | <strong>House:</strong> {e.house} | <strong>D10:</strong> {e.d10}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-900 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="text-amber-300">Final Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{finalVerdict.finalRecommendation}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
