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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { CareerAnalysisResult } from "@/lib/career-analysis/types";
import { buildCareerAnalysisPdfHtml } from "@/lib/career-analysis/pdf-builder";

interface CareerAnalysisDashboardProps {
  result: CareerAnalysisResult;
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
  const [activeTab, setActiveTab] = useState("scorecard");
  const { input, scores, house1, house2, house6, house10, house11, d10Dashamsa, topCareerRoles, topIndustries, careerYogas, monthlyForecast, annualTimeline, aiCareerCoach, remedies, luckyElements, aiConsultantVerdict, evidenceChain } = result;

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
              Flagship Commercial Pro
            </Badge>
            <span className="text-xs text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Career Analysis Report Pro — {input.name}
          </h1>
          <p className="text-sm text-amber-100 mt-1 max-w-2xl">
            Complete 40-section career intelligence profile analyzing D10 Dashamsa, Jaimini Amatyakaraka, 30 top career roles, 17 industries, and 4-tier AI strategy.
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
          <TabsTrigger value="scorecard">11 Scores</TabsTrigger>
          <TabsTrigger value="roles">Top 30 Roles</TabsTrigger>
          <TabsTrigger value="d10">D10 & Planets</TabsTrigger>
          <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
          <TabsTrigger value="coach">AI Career Coach</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scorecard */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>11 Precision Career Score Metrics</CardTitle>
              <CardDescription>Quantitative evaluation of executive, financial, and leadership capacity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Overall Career Potential", score: scores.overallCareerScore },
                { label: "Leadership & Authority", score: scores.leadershipScore },
                { label: "Salary Growth Capacity", score: scores.salaryGrowthScore },
                { label: "Promotion Potential", score: scores.promotionScore },
                { label: "Private Corporate Sector", score: scores.privateJobScore },
                { label: "Government Job / IAS", score: scores.governmentJobScore },
                { label: "Business & Trade Feasibility", score: scores.businessSuitabilityScore },
                { label: "Entrepreneurship Drive", score: scores.entrepreneurshipScore },
                { label: "Foreign Career Postings", score: scores.foreignCareerScore },
                { label: "Team Management", score: scores.managementPotential },
                { label: "Career Stability & Retention", score: scores.careerStabilityScore },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score} className="h-2 bg-amber-100 dark:bg-amber-950" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Top 30 Roles & Industries */}
        <TabsContent value="roles" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 30 Career Roles Ranked</CardTitle>
              <CardDescription>Evaluated against D10 Dashamsa, Jaimini Amatyakaraka & 10th House</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topCareerRoles.map((r, i) => (
                  <div key={i} className="p-3 border rounded-xl space-y-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">#{i + 1} {r.role}</span>
                      <Badge className="bg-amber-600 text-white font-bold">{r.suitabilityScore}% Match</Badge>
                    </div>
                    <div className="text-slate-500 font-medium">{r.category} — {r.matchLevel}</div>
                    <p className="text-slate-600 dark:text-slate-400">{r.astrologicalReasoning}</p>
                    <div className="text-amber-700 dark:text-amber-300 font-semibold">Skills: {r.keySkillsRequired.join(", ")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 17 Industry Suitabilities</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {topIndustries.map((ind, i) => (
                <div key={i} className="p-3 border rounded-xl space-y-1 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{ind.industry}</span>
                    <Badge variant="outline">{ind.suitabilityScore}%</Badge>
                  </div>
                  <div className="text-slate-500">{ind.marketOutlook}</div>
                  <p className="text-slate-600 dark:text-slate-400">{ind.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: D10 & Planets */}
        <TabsContent value="d10" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>D10 Dashamsa & Jaimini Karakas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div><strong>D10 Ascendant:</strong> {d10Dashamsa.ascendantSign}</div>
                <div><strong>D10 10th Lord:</strong> {d10Dashamsa.house10Lord} in {d10Dashamsa.house10Sign}</div>
                <div><strong>Jaimini Atmakaraka (Soul):</strong> {d10Dashamsa.atmakaraka}</div>
                <div><strong>Jaimini Amatyakaraka (Career Minister):</strong> {d10Dashamsa.amatyakaraka}</div>
                <p className="text-slate-600 dark:text-slate-400 pt-2">{d10Dashamsa.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Career Houses (D1 Chart)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div><strong>10th House (Karma):</strong> {house10.rashi} (Lord: {house10.rashiLord}) — {house10.careerSignificance}</div>
                <div><strong>6th House (Service):</strong> {house6.rashi} (Lord: {house6.rashiLord}) — {house6.careerSignificance}</div>
                <div><strong>2nd House (Salary):</strong> {house2.rashi} (Lord: {house2.rashiLord}) — {house2.careerSignificance}</div>
                <div><strong>11th House (Gains):</strong> {house11.rashi} (Lord: {house11.rashiLord}) — {house11.careerSignificance}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 12-Month Forecast */}
        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyForecast.map((m, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold">{m.monthName}</CardTitle>
                    <div className="flex text-amber-500">
                      {Array.from({ length: m.careerRating }).map((_, i) => (
                        <Award key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs text-amber-600 dark:text-amber-400 font-medium">{m.focusArea}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <div><strong>Promotion:</strong> {m.promotionOutlook}</div>
                  <div><strong>Salary:</strong> {m.salaryOutlook}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: AI Career Coach */}
        <TabsContent value="coach" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>4-Tier AI Career Execution Roadmap</CardTitle>
              <CardDescription>Actionable 30-Day, 90-Day, 1-Year & 5-Year Strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-300">30-DAY IMMEDIATE PUSH</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{aiCareerCoach.day30Plan.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-300">90-DAY SKILL & PROMOTION PUSH</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{aiCareerCoach.day90Plan.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-lg space-y-1">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">1-YEAR HIGH GROWTH ROADMAP</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{aiCareerCoach.year1Plan.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>

              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500 rounded-r-lg space-y-1">
                <div className="font-bold text-purple-900 dark:text-purple-300">5-YEAR EXECUTIVE STRATEGY</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{aiCareerCoach.year5Strategy.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Evidence & Verdict */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planetary Evidence Chain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceChain.map((e, i) => (
                <div key={i} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-600 rounded-r-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-amber-950 dark:text-amber-200">
                    <span>{e.claim}</span>
                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                      {e.confidencePercent}% Confidence
                    </Badge>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Basis:</strong> {e.astrologicalBasis}</div>
                  <div className="text-slate-700 dark:text-slate-300"><strong>Advice:</strong> {e.actionableAdvice}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-900 to-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-amber-300">Final Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{aiConsultantVerdict.finalVerdict}</p>
              <div className="pt-2">
                <span className="font-bold text-xs uppercase text-amber-200">Action Plan:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-amber-100">
                  {aiConsultantVerdict.actionPlan.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
