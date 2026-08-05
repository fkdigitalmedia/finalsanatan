import { useState } from "react";
import {
  Activity,
  Heart,
  Shield,
  Sparkles,
  Zap,
  Moon,
  Smile,
  AlertTriangle,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Compass,
  Utensils,
  Sun,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { HealthAnalysisResult } from "@/lib/health-analysis/types";
import { buildHealthAnalysisPdfHtml } from "@/lib/health-analysis/pdf-builder";

interface HealthAnalysisDashboardProps {
  result: HealthAnalysisResult;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export function HealthAnalysisDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: HealthAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("scorecard");
  const { input, scores, constitution, house1, house6, house8, house12, organSystems, monthlyForecast, annualTimeline, exerciseAndNutrition, remedies, luckyElements, aiCoachVerdict, evidenceChain } = result;

  const downloadPdf = () => {
    const htmlContent = buildHealthAnalysisPdfHtml(result);
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
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Enterprise Pro Edition
            </Badge>
            <span className="text-xs text-emerald-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Health Analysis Report Pro — {input.name}
          </h1>
          <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
            Complete 34-section astrological wellness profile analyzing 1st, 6th, 8th & 12th houses, Ayurvedic Doshas, and 12-month forecast.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold shadow-md">
            <Download className="w-4 h-4 mr-2" /> Download PDF (34 Pages)
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

      {/* Non-Diagnostic Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Medical Safety Disclaimer:</strong> This report provides astrological health tendencies, Ayurvedic body constitution insights, preventive wellness guidelines, and stress management recommendations. It does NOT diagnose, treat, cure, or prevent any medical condition. Always consult a qualified medical professional for health concerns.
        </div>
      </div>

      {/* Primary Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Activity className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{scores.overallHealth}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Health</div>
            <Progress value={scores.overallHealth} className="h-1.5 mt-3 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-300 dark:border-teal-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-teal-700 dark:text-teal-300">{scores.immunity}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Immune Resilience</div>
            <Progress value={scores.immunity} className="h-1.5 mt-3 bg-teal-100 dark:bg-teal-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-300 dark:border-indigo-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Smile className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{scores.mentalWellness}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Mental Wellness</div>
            <Progress value={scores.mentalWellness} className="h-1.5 mt-3 bg-indigo-100 dark:bg-indigo-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-300 dark:border-amber-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{constitution.primaryDosha}</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Body Constitution</div>
            <div className="text-[10px] text-slate-500 mt-2">Vata {constitution.vataPercentage}% | Pitta {constitution.pittaPercentage}% | Kapha {constitution.kaphaPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="scorecard">10 Scores</TabsTrigger>
          <TabsTrigger value="body">Body & Houses</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle & Diet</TabsTrigger>
          <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
          <TabsTrigger value="remedies">Remedies & Luck</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scorecard */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>10 Core Health Score Metrics</CardTitle>
              <CardDescription>Quantitative evaluation of astrological health indicators.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Overall Health Index", score: scores.overallHealth },
                { label: "Mental Wellness", score: scores.mentalWellness },
                { label: "Physical Vitality", score: scores.physicalVitality },
                { label: "Daily Energy", score: scores.energy },
                { label: "Immune Defense", score: scores.immunity },
                { label: "Recovery Capacity", score: scores.recovery },
                { label: "Lifestyle Balance", score: scores.lifestyleBalance },
                { label: "Sleep Quality", score: scores.sleep },
                { label: "Emotional Stability", score: scores.emotionalStability },
                { label: "Stress Load", score: scores.stress, isStress: true },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`text-lg font-extrabold ${item.isStress ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score} className={`h-2 ${item.isStress ? "bg-rose-100" : ""}`} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Body & Houses */}
        <TabsContent value="body" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ayurvedic Constitution ({constitution.primaryDosha})</CardTitle>
                <CardDescription>Tridosha Energy Composition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>{constitution.summary}</p>
                <div className="space-y-2">
                  <div><strong>Recommendations:</strong></div>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {constitution.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health House Overview</CardTitle>
                <CardDescription>Key Houses (1st, 6th, 8th & 12th)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div><strong>1st House (Lagna):</strong> {house1.rashi} (Lord: {house1.rashiLord}) — {house1.healthSignificance}</div>
                <div><strong>6th House (Roga):</strong> {house6.rashi} (Lord: {house6.rashiLord}) — {house6.healthSignificance}</div>
                <div><strong>8th House (Ayur):</strong> {house8.rashi} (Lord: {house8.rashiLord}) — {house8.healthSignificance}</div>
                <div><strong>12th House (Vyaya):</strong> {house12.rashi} (Lord: {house12.rashiLord}) — {house12.healthSignificance}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Organ System Tendencies</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {organSystems.map((os, i) => (
                <div key={i} className="p-4 border rounded-xl space-y-1.5 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{os.systemName}</span>
                    <Badge variant="outline">{os.wellnessStatus}</Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{os.description}</p>
                  <div className="text-slate-500 font-medium">Tips: {os.preventiveTips.join(", ")}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Lifestyle & Diet */}
        <TabsContent value="lifestyle" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise & Sattvic Nutrition</CardTitle>
              <CardDescription>Daily routine and dietary alignment</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div><strong>Recommended Exercises:</strong></div>
                <div className="flex flex-wrap gap-1.5">
                  {exerciseAndNutrition.recommendedExercises.map((ex, i) => (
                    <Badge key={i} variant="secondary">{ex}</Badge>
                  ))}
                </div>
                <div><strong>Foods to Favor:</strong> {exerciseAndNutrition.foodsToFavor.join(", ")}</div>
              </div>
              <div className="space-y-3">
                <div><strong>Nutrition Guidance:</strong></div>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {exerciseAndNutrition.nutritionGuidance.map((ng, i) => <li key={i}>{ng}</li>)}
                </ul>
                <div><strong>Foods to Moderate:</strong> {exerciseAndNutrition.foodsToModerate.join(", ")}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 12-Month Forecast */}
        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyForecast.map((m, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold">{m.monthName}</CardTitle>
                    <div className="flex text-emerald-500">
                      {Array.from({ length: m.wellnessRating }).map((_, i) => (
                        <Award key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs text-teal-600 dark:text-teal-400 font-medium">{m.focusArea}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <div><strong>Diet:</strong> {m.dietAdvice}</div>
                  <div><strong>Meditation:</strong> {m.meditationGuidance}</div>
                  <div><strong>Exercise:</strong> {m.exerciseTip}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Remedies & Luck */}
        <TabsContent value="remedies" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preventive Ayurvedic Remedies</CardTitle>
                <CardDescription>Planetary alignment & energy practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {remedies.map((r, i) => (
                  <div key={i} className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-lg text-xs space-y-1">
                    <div className="font-bold text-emerald-900 dark:text-emerald-300">[{r.category.toUpperCase()}] {r.title}</div>
                    <div className="text-slate-600 dark:text-slate-400">{r.description}</div>
                    <div className="text-slate-500 font-medium">Best Time: {r.bestTime}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lucky Elements & Healing Herbs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Healing Herbs:</strong> {luckyElements.healingHerbs.join(", ")}</div>
                <div><strong>Lucky Colors:</strong> {luckyElements.colors.join(", ")}</div>
                <div><strong>Lucky Days:</strong> {luckyElements.days.join(", ")}</div>
                <div><strong>Lucky Numbers:</strong> {luckyElements.numbers.join(", ")}</div>
                <div><strong>Lucky Directions:</strong> {luckyElements.directions.join(", ")}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 6: Evidence & Verdict */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planetary Evidence Chain</CardTitle>
              <CardDescription>Verification metrics & confidence percentages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceChain.map((e, i) => (
                <div key={i} className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border-l-4 border-teal-600 rounded-r-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-teal-950 dark:text-teal-200">
                    <span>{e.claim}</span>
                    <Badge variant="outline" className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      {e.confidencePercent}% Confidence
                    </Badge>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Basis:</strong> {e.astrologicalBasis}</div>
                  <div className="text-slate-700 dark:text-slate-300"><strong>Lifestyle Advice:</strong> {e.lifestyleAdvice}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
            <CardHeader>
              <CardTitle className="text-emerald-300">Final Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{aiCoachVerdict.finalVerdict}</p>
              <div className="pt-2">
                <span className="font-bold text-xs uppercase text-emerald-200">Action Plan:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-emerald-100">
                  {aiCoachVerdict.actionPlan.map((act, i) => (
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
