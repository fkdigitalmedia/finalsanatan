import { useState } from "react";
import {
  Sparkles,
  Award,
  Crown,
  Compass,
  Briefcase,
  Globe,
  Heart,
  Activity,
  ShieldCheck,
  Building2,
  TrendingUp,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { MasterBlueprintResult } from "@/lib/master-blueprint/types";
import { buildMasterBlueprintPdfHtml } from "@/lib/master-blueprint/pdf-builder";

interface MasterBlueprintDashboardProps {
  result: MasterBlueprintResult;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export function MasterBlueprintDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: MasterBlueprintDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { input, scores, synthesizedInsights, lifeStageTimeline, tenYearForecast, aiDecisions, remedies, luckyElements, actionPlan, aiCoachVerdict, evidenceChain } = result;

  const downloadPdf = () => {
    const htmlContent = buildMasterBlueprintPdfHtml(result);
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
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold px-3.5 py-1 text-xs uppercase tracking-wider shadow-sm">
              Platform Ultimate Flagship
            </Badge>
            <span className="text-xs text-indigo-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            AI Master Life Blueprint — {input.name}
          </h1>
          <p className="text-sm text-indigo-200 mt-1 max-w-3xl">
            Vedic Decision Intelligence System synthesizing Kundli Pro, Career, Business, Marriage, Health, Foreign, Varshphal, and Numerology into 96 pages of integrated strategy.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold shadow-lg">
            <Download className="w-4 h-4 mr-2" /> Download Blueprint (96 Pages)
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
        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-300 dark:border-indigo-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Crown className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{scores.overallLifeScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Life Score</div>
            <Progress value={scores.overallLifeScore} className="h-1.5 mt-3 bg-indigo-100 dark:bg-indigo-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-300 dark:border-amber-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{scores.successProbability}%</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Success Probability Index</div>
            <Progress value={scores.successProbability} className="h-1.5 mt-3 bg-amber-100 dark:bg-amber-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{scores.careerScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Career & Business</div>
            <Progress value={scores.careerScore} className="h-1.5 mt-3 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-300 dark:border-blue-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300">{scores.foreignScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Foreign Relocation</div>
            <Progress value={scores.foreignScore} className="h-1.5 mt-3 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="dashboard">14 Scores</TabsTrigger>
          <TabsTrigger value="decisions">AI Decision Engine</TabsTrigger>
          <TabsTrigger value="timeline">Life Timeline</TabsTrigger>
          <TabsTrigger value="forecast">10-Year Forecast</TabsTrigger>
          <TabsTrigger value="plan">7-Tier Action Plan</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Executive Dashboard (14 Scores) */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>14 Executive Life Score Metrics & Indices</CardTitle>
              <CardDescription>Synthesized quantitative evaluation across all life domains.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Life Blueprint", score: scores.overallLifeScore },
                { label: "Success Probability", score: scores.successProbability },
                { label: "Opportunity Density", score: scores.opportunityIndex },
                { label: "Risk Vulnerability", score: scores.riskIndex, isRisk: true },
                { label: "Career Potential", score: scores.careerScore },
                { label: "Business & Trade", score: scores.businessScore },
                { label: "Finance & Wealth", score: scores.financeScore },
                { label: "Marriage Bliss", score: scores.marriageScore },
                { label: "Health & Immunity", score: scores.healthScore },
                { label: "Foreign Relocation", score: scores.foreignScore },
                { label: "Academic Intellect", score: scores.educationScore },
                { label: "Property & Real Estate", score: scores.propertyScore },
                { label: "Spiritual Peace", score: scores.spiritualScore },
                { label: "Executive Command", score: scores.leadershipScore },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`text-base font-extrabold ${item.isRisk ? "text-rose-600" : "text-indigo-600 dark:text-indigo-400"}`}>
                      {item.score}%
                    </span>
                  </div>
                  <Progress value={item.score} className={`h-1.5 ${item.isRisk ? "bg-rose-100" : ""}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Synthesized Cross-Domain Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {synthesizedInsights.map((s, i) => (
                <div key={i} className="p-4 border border-indigo-200 dark:border-indigo-800/50 rounded-xl space-y-1 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">{s.domainName}: {s.headline}</div>
                  <p className="text-slate-700 dark:text-slate-300">{s.synthesisDetails}</p>
                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Rationale: {s.astrologicalRationale}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: AI Decision Engine */}
        <TabsContent value="decisions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Decision Engine — 8 Practical Life Questions</CardTitle>
              <CardDescription>Evidence-backed astrological verdicts for major life choices</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {aiDecisions.map((d, i) => (
                <div key={i} className="p-4 border rounded-xl space-y-2 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Q: {d.questionText}</span>
                    <Badge className={d.decision === "YES" ? "bg-emerald-600" : "bg-amber-600"}>{d.decision} ({d.confidencePercent}%)</Badge>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{d.verdictSummary}</p>
                  <div className="text-slate-500 font-medium">Timing: {d.recommendedTiming}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Life Timeline */}
        <TabsContent value="timeline" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Stage Age-Wise Life Timeline (0 to 60+)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {lifeStageTimeline.map((st, i) => (
                <div key={i} className="p-4 border rounded-xl space-y-1.5 bg-slate-50 dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{st.stageTitle}</div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">Focus: {st.astrologicalFocus}</div>
                  <div className="text-slate-700 dark:text-slate-300"><strong>Opportunities:</strong> {st.majorOpportunities.join(", ")}</div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Strategy:</strong> {st.recommendedStrategy}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 10-Year Forecast */}
        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenYearForecast.map((y, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">{y.year} (Age {y.yearAge})</CardTitle>
                  <CardDescription className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{y.keyOpportunity}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div><strong>Career:</strong> {y.careerOutlook}</div>
                  <div><strong>Finance:</strong> {y.financeOutlook}</div>
                  <div><strong>Marriage & Foreign:</strong> {y.marriageOutlook} | {y.foreignOutlook}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: 7-Tier Action Plan */}
        <TabsContent value="plan" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Tier Action Plan & Vision Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-300">IMMEDIATE & 30-DAY ACTIONS</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{actionPlan.immediateActions.concat(actionPlan.day30Plan).map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-300">90-DAY & 1-YEAR ROADMAP</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{actionPlan.day90Plan.concat(actionPlan.year1Roadmap).map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>

              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500 rounded-r-lg space-y-1">
                <div className="font-bold text-purple-900 dark:text-purple-300">5-YEAR & 10-YEAR LIFE STRATEGY</div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">{actionPlan.year5Vision.concat(actionPlan.year10LifeStrategy).map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Evidence & Verdict */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Master Evidence Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceChain.map((e, i) => (
                <div key={i} className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600 rounded-r-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-indigo-950 dark:text-indigo-200">
                    <span>[{e.domain}] {e.claim}</span>
                    <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {e.confidencePercent}% Confidence
                    </Badge>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Rule:</strong> {e.ruleUsed}</div>
                  <div className="text-slate-700 dark:text-slate-300"><strong>Insight:</strong> {e.actionableInsight}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-950 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="text-indigo-300">Final Master Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{aiCoachVerdict.finalVerdict}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
