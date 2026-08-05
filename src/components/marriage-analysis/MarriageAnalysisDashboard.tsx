import { useState } from "react";
import {
  Heart,
  Sparkles,
  Award,
  ShieldAlert,
  Calendar,
  Compass,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ChevronRight,
  User,
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { MarriageAnalysisResult } from "@/lib/marriage-analysis/types";
import { buildMarriageAnalysisPdfHtml } from "@/lib/marriage-analysis/pdf-builder";

interface MarriageAnalysisDashboardProps {
  result: MarriageAnalysisResult;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export function MarriageAnalysisDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: MarriageAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("scorecard");
  const { input, scores, house7, house7Lord, venus, jupiter, mars, spouseProfile, monthlyForecast, annualTimeline, remedies, luckyElements, aiCoachVerdict, evidenceChain } = result;

  const downloadPdf = () => {
    const htmlContent = buildMarriageAnalysisPdfHtml(result);
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
      <div className="bg-gradient-to-r from-amber-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Enterprise Pro Edition
            </Badge>
            <span className="text-xs text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Marriage Analysis Report Pro — {input.name}
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-2xl">
            Complete 34-section astrological roadmap analyzing 7th House, D9 Navamsha, Jaimini Darakaraka, and 12-month relationship forecast.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-md">
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

      {/* Primary Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-300 dark:border-amber-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{scores.marriageScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Marriage Score</div>
            <Progress value={scores.marriageScore} className="h-1.5 mt-3 bg-amber-100 dark:bg-amber-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-300 dark:border-indigo-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{scores.spouseCompatibilityScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Spouse Compatibility</div>
            <Progress value={scores.spouseCompatibilityScore} className="h-1.5 mt-3 bg-indigo-100 dark:bg-indigo-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{scores.longTermStabilityScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Long-Term Stability</div>
            <Progress value={scores.longTermStabilityScore} className="h-1.5 mt-3 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-300 dark:border-purple-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Compass className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-purple-700 dark:text-purple-300">{scores.loveMarriageScore}%</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Love Marriage Feasibility</div>
            <Progress value={scores.loveMarriageScore} className="h-1.5 mt-3 bg-purple-100 dark:bg-purple-950" />
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="planets">7th House & Planets</TabsTrigger>
          <TabsTrigger value="spouse">Spouse Profile</TabsTrigger>
          <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
          <TabsTrigger value="remedies">Remedies & Luck</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scorecard */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>9 Core Marriage Score Metrics</CardTitle>
              <CardDescription>Comprehensive quantitative evaluation of chart indicators.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Overall Marriage Score", score: scores.marriageScore },
                { label: "Relationship Bonding", score: scores.relationshipScore },
                { label: "Love Marriage Feasibility", score: scores.loveMarriageScore },
                { label: "Arranged Marriage Feasibility", score: scores.arrangedMarriageScore },
                { label: "Spouse Compatibility", score: scores.spouseCompatibilityScore },
                { label: "Communication Harmony", score: scores.communicationScore },
                { label: "Family & In-Laws Alignment", score: scores.familyHarmonyScore },
                { label: "Long-Term Stability", score: scores.longTermStabilityScore },
                { label: "Marriage Delay Risk", score: scores.marriageDelayScore, isRisk: true },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`text-lg font-extrabold ${item.isRisk ? "text-rose-600" : "text-amber-600 dark:text-amber-400"}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score} className={`h-2 ${item.isRisk ? "bg-rose-100" : ""}`} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 7th House & Planets */}
        <TabsContent value="planets" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>7th House Overview</CardTitle>
                <CardDescription>House of Marriage & Primary Partnerships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>7th House Rashi:</strong> {house7.rashi}</div>
                <div><strong>7th Lord Planet:</strong> {house7.rashiLord}</div>
                <div><strong>Planets Placed:</strong> {house7.planetsInHouse.length > 0 ? house7.planetsInHouse.join(", ") : "None (Unoccupied)"}</div>
                <div><strong>Aspecting Planets:</strong> {house7.aspectingPlanets.length > 0 ? house7.aspectingPlanets.join(", ") : "None"}</div>
                <p className="text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">{house7.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7th House Lord Placement</CardTitle>
                <CardDescription>Ruler ({house7Lord.planet}) Position Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Placed in House:</strong> House {house7Lord.house} ({house7Lord.rashi})</div>
                <div><strong>Dignity:</strong> <Badge variant="outline" className="capitalize">{house7Lord.dignity}</Badge></div>
                <div><strong>Marital Influence:</strong> {house7Lord.impactOnMarriage}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Venus (Shukra)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>House {venus.house} ({venus.rashi})</div>
                <div className="text-xs text-slate-500">{venus.impactOnMarriage}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Jupiter (Guru)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>House {jupiter.house} ({jupiter.rashi})</div>
                <div className="text-xs text-slate-500">{jupiter.impactOnMarriage}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Mars (Mangal)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>House {mars.house} ({mars.rashi})</div>
                <div className="text-xs text-slate-500">{mars.impactOnMarriage}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Spouse Profile */}
        <TabsContent value="spouse" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spouse Characteristics & Career</CardTitle>
              <CardDescription>Derived from Jaimini Darakaraka & 7th House Lords</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div><strong>Physical Demeanor:</strong> {spouseProfile.physicalAppearance}</div>
                <div><strong>Nature & Temperament:</strong> {spouseProfile.natureAndTemperament}</div>
                <div><strong>Direction of Origin:</strong> {spouseProfile.directionOfOrigin}</div>
                <div><strong>Distance of Origin:</strong> {spouseProfile.distanceOfOrigin}</div>
              </div>
              <div className="space-y-3">
                <div><strong>Probable Professions:</strong></div>
                <div className="flex flex-wrap gap-1.5">
                  {spouseProfile.probableProfessions.map((prof, i) => (
                    <Badge key={i} variant="secondary">{prof}</Badge>
                  ))}
                </div>
                <div><strong>Financial Standing:</strong> {spouseProfile.financialStanding}</div>
                <div><strong>Communication Style:</strong> {spouseProfile.communicationStyle}</div>
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
                    <div className="flex text-amber-500">
                      {Array.from({ length: m.relationshipRating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{m.focusArea}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <div><strong>Guidance:</strong> {m.communicationTip}</div>
                  <div><strong>Travel:</strong> {m.travelProbability}</div>
                  <div><strong>Finance:</strong> {m.financeAdvice}</div>
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
                <CardTitle>Vedic Remedies</CardTitle>
                <CardDescription>Customized planetary alignment practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {remedies.map((r, i) => (
                  <div key={i} className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg text-xs space-y-1">
                    <div className="font-bold text-amber-900 dark:text-amber-300">[{r.category.toUpperCase()}] {r.title}</div>
                    <div className="text-slate-600 dark:text-slate-400">{r.description}</div>
                    <div className="text-slate-500 font-medium">Best Time: {r.bestTime}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lucky Elements Summary</CardTitle>
                <CardDescription>Favorable frequencies and directions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Lucky Colors:</strong> {luckyElements.colors.join(", ")}</div>
                <div><strong>Lucky Days:</strong> {luckyElements.days.join(", ")}</div>
                <div><strong>Lucky Numbers:</strong> {luckyElements.numbers.join(", ")}</div>
                <div><strong>Lucky Directions:</strong> {luckyElements.directions.join(", ")}</div>
                <div><strong>Lucky Gemstones:</strong> {luckyElements.gemstones.join(", ")}</div>
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
                <div key={i} className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600 rounded-r-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-indigo-950 dark:text-indigo-200">
                    <span>{e.claim}</span>
                    <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {e.confidencePercent}% Confidence
                    </Badge>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Basis:</strong> {e.astrologicalBasis}</div>
                  <div className="text-slate-700 dark:text-slate-300"><strong>Insight:</strong> {e.actionableInsight}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
            <CardHeader>
              <CardTitle className="text-amber-300">Final Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{aiCoachVerdict.finalVerdict}</p>
              <div className="pt-2">
                <span className="font-bold text-xs uppercase text-amber-200">Action Plan:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-indigo-100">
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
