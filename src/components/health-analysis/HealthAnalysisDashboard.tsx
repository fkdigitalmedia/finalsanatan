import { useState } from "react";
import {
  Activity, Heart, Shield, Sparkles, Zap, Moon, Smile,
  AlertTriangle, Download, Share2, RefreshCw, Trash2,
  CheckCircle2, Clock, Award, Brain, Leaf, Flame, Target,
  TrendingUp, TrendingDown, Minus, Eye, Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { HealthAnalysisResult, OrganDashboardCard, RiskDashboardCard } from "@/lib/health-analysis/types";
import { buildHealthAnalysisPdfHtml } from "@/lib/health-analysis/pdf-builder";
import { printHtmlReport } from "@/lib/pdf/print-html-report";

interface HealthAnalysisDashboardProps {
  result: HealthAnalysisResult;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function colorForRisk(risk: number): string {
  if (risk <= 20) return "text-emerald-600";
  if (risk <= 35) return "text-amber-600";
  if (risk <= 55) return "text-orange-600";
  return "text-rose-600";
}

function bgForOrgan(colorIndicator: string): string {
  if (colorIndicator === "green")  return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800";
  if (colorIndicator === "yellow") return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
  if (colorIndicator === "orange") return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
  return "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800";
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Improving") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "Worsening") return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function severityBadge(sev: string) {
  const map: Record<string, string> = {
    Low:      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    High:     "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Critical: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${map[sev] || map.Low}`}>{sev}</span>;
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function HealthAnalysisDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: HealthAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("scorecard");
  const {
    input, scores, constitution, house1, house6, house8, house12,
    organDashboard, riskDashboard, ayurvedicChapter, aiHealthCoach,
    monthlyForecast, annualTimeline, exerciseAndNutrition,
    remedies, luckyElements, aiCoachVerdict, evidenceChain,
    finalVerdict, wellnessTimeline, svgCharts,
  } = result;

  const downloadPdf = () => {
    const htmlContent = buildHealthAnalysisPdfHtml(result);
    printHtmlReport(htmlContent, `Health_Analysis_Report_${input.name}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">

      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Enterprise Pro Edition v2.0
            </Badge>
            <span className="text-xs text-emerald-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Real-Time Calculation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Health Analysis Report Pro — {input.name}
          </h1>
          <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
            35-section enterprise wellness profile: 13 organs, 10 disease risks, 12-month unique forecast, Ayurvedic chapter, AI Coach & evidence chain.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold shadow-md">
            <Download className="w-4 h-4 mr-2" /> Download PDF (35 Pages)
          </Button>
          {onSave && (
            <Button onClick={onSave} disabled={isSaving} size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> {isSaving ? "Saving…" : "Save"}
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

      {/* ── Disclaimer ── */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Medical Safety Disclaimer:</strong> This report provides astrological health tendencies and Ayurvedic wellness guidelines only. It does NOT diagnose, treat, cure, or prevent any medical condition. Always consult a qualified medical professional for health concerns.
        </div>
      </div>

      {/* ── Top KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50">
          <CardContent className="p-5 text-center">
            <Activity className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{scores.overallHealth}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Health</div>
            <Progress value={scores.overallHealth} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-300 dark:border-teal-700/50">
          <CardContent className="p-5 text-center">
            <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-teal-700 dark:text-teal-300">{scores.immunity}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Immune Resilience</div>
            <Progress value={scores.immunity} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-300 dark:border-indigo-700/50">
          <CardContent className="p-5 text-center">
            <Smile className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{scores.mentalWellness}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Mental Wellness</div>
            <Progress value={scores.mentalWellness} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-300 dark:border-amber-700/50">
          <CardContent className="p-5 text-center">
            <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{constitution.primaryDosha}</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Body Constitution</div>
            <div className="text-[10px] text-slate-500 mt-2">V:{constitution.vataPercentage}% P:{constitution.pittaPercentage}% K:{constitution.kaphaPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-8 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
          <TabsTrigger value="scorecard" className="text-xs">10 Scores</TabsTrigger>
          <TabsTrigger value="organs"    className="text-xs">13 Organs</TabsTrigger>
          <TabsTrigger value="risks"     className="text-xs">Risk Dashboard</TabsTrigger>
          <TabsTrigger value="ayurveda" className="text-xs">Ayurveda</TabsTrigger>
          <TabsTrigger value="forecast"  className="text-xs">12-Month</TabsTrigger>
          <TabsTrigger value="aicoach"   className="text-xs">AI Coach</TabsTrigger>
          <TabsTrigger value="remedies"  className="text-xs">Remedies</TabsTrigger>
          <TabsTrigger value="evidence"  className="text-xs">Evidence</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Scorecard ── */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>10 Core Health Score Metrics</CardTitle>
              <CardDescription>Quantitative astrological wellness evaluation for {input.name}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {label:"Overall Health Index",   score:scores.overallHealth},
                {label:"Mental Wellness",        score:scores.mentalWellness},
                {label:"Physical Vitality",      score:scores.physicalVitality},
                {label:"Daily Energy",           score:scores.energy},
                {label:"Immune Defense",         score:scores.immunity},
                {label:"Recovery Capacity",      score:scores.recovery},
                {label:"Lifestyle Balance",      score:scores.lifestyleBalance},
                {label:"Sleep Quality",          score:scores.sleep},
                {label:"Emotional Stability",    score:scores.emotionalStability},
                {label:"Stress Load (lower=better)", score:scores.stress, isStress:true},
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`text-lg font-extrabold ${(item as any).isStress ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Final Verdict — {finalVerdict.overallHealthRating}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-slate-700 dark:text-slate-300">{finalVerdict.planetarySummary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase mb-2">Top Strengths</p>
                  <ul className="space-y-1">
                    {finalVerdict.topStrengths.map((s, i) => <li key={i} className="text-xs text-slate-600 dark:text-slate-400">✅ {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-400 text-xs uppercase mb-2">Watch Points</p>
                  <ul className="space-y-1">
                    {finalVerdict.topWeaknesses.map((w, i) => <li key={i} className="text-xs text-slate-600 dark:text-slate-400">⚠️ {w}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Organ Dashboard ── */}
        <TabsContent value="organs" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {organDashboard.map((organ, i) => (
              <Card key={i} className={`border ${bgForOrgan(organ.colorIndicator)}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{organ.organName}</span>
                    <Badge variant="outline" className={`text-xs ${organ.colorIndicator === "green" ? "border-emerald-500 text-emerald-700" : organ.colorIndicator === "yellow" ? "border-amber-500 text-amber-700" : "border-rose-500 text-rose-700"}`}>
                      {organ.currentStrength}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Health Score</span>
                      <span className="font-bold text-emerald-600">{organ.healthScore}/100</span>
                    </div>
                    <Progress value={organ.healthScore} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Risk Level</span>
                      <span className={`font-bold ${colorForRisk(organ.riskPercent)}`}>{organ.riskPercent}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div><span className="text-slate-500">Planet: </span><span className="font-semibold">{organ.planet}</span></div>
                    <div><span className="text-slate-500">House: </span><span className="font-semibold">{organ.house}</span></div>
                    <div><span className="text-slate-500">Trend: </span><span className="font-semibold flex items-center gap-1"><TrendIcon trend={organ.futureTrend} />{organ.futureTrend}</span></div>
                    <div><span className="text-slate-500">Recovery: </span><span className="font-semibold">{organ.recoveryPotential}</span></div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 border-t pt-2">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Best Foods: {organ.bestFoods.slice(0,3).join(", ")}</p>
                    <p className="text-rose-600 dark:text-rose-400">Avoid: {organ.worstFoods.slice(0,2).join(", ")}</p>
                    <p className="mt-1">🌿 {organ.ayurvedicHerbs.slice(0,3).join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 3: Risk Dashboard ── */}
        <TabsContent value="risks" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskDashboard.map((risk, i) => (
              <Card key={i} className={`border-l-4 ${risk.currentSeverity === "High" ? "border-l-rose-500 bg-rose-50 dark:bg-rose-950/20" : risk.currentSeverity === "Moderate" ? "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{risk.conditionName}</span>
                    <span className={`text-2xl font-black ${colorForRisk(risk.riskPercent)}`}>{risk.riskPercent}%</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {severityBadge(risk.currentSeverity)}
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                      <TrendIcon trend={risk.futureTrend} />{risk.futureTrend}
                    </span>
                    <span className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                      Priority: {risk.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{risk.preventiveSummary}</p>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    {risk.actionItems.map((a, idx) => <li key={idx}>• {a}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 4: Ayurveda ── */}
        <TabsContent value="ayurveda" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prakriti — {constitution.primaryDosha}</CardTitle>
                <CardDescription>Constitutional Nature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>{ayurvedicChapter.prakriti}</p>
                <div className="space-y-2">
                  {[
                    {label:"Vata", pct:constitution.vataPercentage, col:"bg-indigo-500"},
                    {label:"Pitta", pct:constitution.pittaPercentage, col:"bg-rose-500"},
                    {label:"Kapha", pct:constitution.kaphaPercentage, col:"bg-teal-500"},
                  ].map(d => (
                    <div key={d.label}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{d.label}</span><span>{d.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-2 ${d.col} rounded-full`} style={{width:`${d.pct}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ideal Schedule</CardTitle>
                <CardDescription>Ayurvedic Dinacharya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Wake:</span>{ayurvedicChapter.idealWakeTime.split("(")[0]}</div>
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Sleep:</span>{ayurvedicChapter.idealSleepTime.split("(")[0]}</div>
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Breakfast:</span>{ayurvedicChapter.breakfast}</div>
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Lunch:</span>{ayurvedicChapter.lunch.substring(0,80)}...</div>
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Dinner:</span>{ayurvedicChapter.dinner.substring(0,80)}...</div>
                <div className="flex gap-2"><span className="text-emerald-600 font-bold">Massage Oil:</span>{ayurvedicChapter.massageOil.split("—")[0]}</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Morning Routine — Dinacharya</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {ayurvedicChapter.morningRoutine.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                    <span className="text-slate-700 dark:text-slate-300">{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {title:"☀️ Summer", content:ayurvedicChapter.seasonalAdvice.summer},
              {title:"🌧️ Monsoon", content:ayurvedicChapter.seasonalAdvice.monsoon},
              {title:"❄️ Winter", content:ayurvedicChapter.seasonalAdvice.winter},
            ].map(s => (
              <Card key={s.title}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{s.title}</CardTitle></CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400">{s.content}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 5: 12-Month Forecast ── */}
        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyForecast.map((m, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-bold">{m.monthName}</CardTitle>
                      <CardDescription className="text-xs text-teal-600 dark:text-teal-400 font-medium">{m.focusArea}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-500">{"★".repeat(m.wellnessRating)}{"☆".repeat(5 - m.wellnessRating)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">⚡{m.energyScore}</span>
                    <span className="text-xs bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-semibold">😤{m.stressScore}</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">♻️{m.recoveryScore}</span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <div><strong>Season:</strong> {m.season} | <strong>Transit:</strong> {m.transitPlanet}</div>
                  <div><strong>Diet:</strong> {m.dietAdvice.substring(0, 80)}...</div>
                  <div><strong>Exercise:</strong> {m.exerciseTip.substring(0, 60)}...</div>
                  <div><strong>Lucky Day:</strong> ⭐ {m.luckyDay}</div>
                  <div className="text-rose-600 dark:text-rose-400"><strong>Avoid:</strong> {m.thingsToAvoid[0]}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 6: AI Health Coach ── */}
        <TabsContent value="aicoach" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
            <CardHeader>
              <CardTitle className="text-emerald-300">Today's Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-100">{aiHealthCoach.todaysFocus}</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Top 5 Priorities</CardTitle></CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {aiHealthCoach.top5Priorities.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs">{p}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Mistakes to Avoid</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {aiHealthCoach.topMistakes.map((m, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-rose-500 shrink-0">✗</span>{m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-rose-600">Emergency Warnings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {aiHealthCoach.emergencyWarnings.map((w, i) => (
                <div key={i} className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 px-4 py-3 rounded-r-lg text-xs text-rose-800 dark:text-rose-300">{w}</div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recovery Goals</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiHealthCoach.recoveryGoals.map((g, i) => (
                <div key={i} className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300">✅ {g}</div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-6">
              <p className="text-sm italic text-slate-700 dark:text-slate-300 text-center">"{aiHealthCoach.motivationalGuidance}"</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 7: Remedies ── */}
        <TabsContent value="remedies" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remedies.map((r, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm">{r.title}</CardTitle>
                    <Badge className="bg-emerald-600 text-white text-xs">{r.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <p>{r.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>Planet:</strong> {r.relatedPlanet}</div>
                    <div><strong>Best Day:</strong> {r.bestDay}</div>
                    <div><strong>Frequency:</strong> {r.frequency}</div>
                    <div><strong>Difficulty:</strong> {r.difficulty}</div>
                    <div><strong>Cost:</strong> {r.estimatedCost}</div>
                    <div><strong>Best Time:</strong> {r.bestTime}</div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-2">
                    <strong className="text-emerald-700 dark:text-emerald-400">Expected Result:</strong> {r.expectedResult}
                  </div>
                  <div className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                    ⚕ {r.medicalDisclaimer}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Lucky Elements (14 Healing Attributes)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                {icon:"🎨",label:"Colors",val:luckyElements.colors.join(", ")},
                {icon:"🔢",label:"Numbers",val:luckyElements.numbers.join(", ")},
                {icon:"📅",label:"Days",val:luckyElements.days[0]},
                {icon:"💎",label:"Gemstone",val:luckyElements.gemstone},
                {icon:"⚗️",label:"Metal",val:luckyElements.metal.split("—")[0]},
                {icon:"🌿",label:"Herbs",val:luckyElements.healingHerbs.slice(0,3).join(", ")},
                {icon:"📿",label:"Mantra",val:luckyElements.mantra.substring(0,50)+"..."},
                {icon:"🧘",label:"Mudra",val:luckyElements.mudra.split("(")[0]},
              ].map(l => (
                <div key={l.label} className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{l.icon}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">{l.label}</div>
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{l.val}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 8: Evidence ── */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Explainable AI — 9-Step Evidence Chain</CardTitle>
              <CardDescription>Every health conclusion is traceable through a complete astrological logic chain.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {evidenceChain.map((e, i) => (
                <div key={i} className="bg-teal-50/50 dark:bg-teal-950/20 border-l-4 border-teal-600 rounded-r-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-teal-900 dark:text-teal-200">{e.claim}</span>
                    <Badge variant="outline" className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      {e.confidencePercent}% Confidence
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    {[e.planet, `House ${e.house}`, `Lord: ${e.lord}`, e.yoga, e.dasha].map((node, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-md font-semibold">{node}</span>
                        {idx < 4 && <span className="text-slate-400">→</span>}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300"><strong>Logic:</strong> {e.astrologicalLogic}</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400"><strong>Conclusion:</strong> {e.conclusion}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400"><strong>Lifestyle Advice:</strong> {e.lifestyleAdvice}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
            <CardHeader><CardTitle className="text-emerald-300">Final AI Health Verdict</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{finalVerdict.finalAIVerdict}</p>
              <div>
                <span className="font-bold text-xs uppercase text-emerald-200">Action Plan:</span>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-xs text-emerald-100">
                  {finalVerdict.actionPlan.map((a, i) => <li key={i}>{a}</li>)}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
