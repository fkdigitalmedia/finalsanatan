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
  const { input, scores, house7, venus, jupiter, manglik, spouseProfile, monthlyForecast, annualTimeline, remedies, luckyElements, evidenceChain, newChapters, finalVerdict } = result;

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
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Commercial Release v2.0 (Enterprise Quality)
            </Badge>
            <span className="text-xs text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Marriage Analysis Report Pro v2.0 — {input.name}
          </h1>
          <p className="text-sm text-amber-100 mt-1 max-w-2xl">
            34-Chapter Publication-Grade Vedic Spousal Intelligence analyzing 7th House, Venus, Jupiter, Manglik Dosha, 18-Point Spouse Profile, and Structured Remedies.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-md">
            <Download className="w-4 h-4 mr-2" /> Download PDF (34 Pages)
          </Button>
          {onSave && (
            <Button onClick={onSave} disabled={isSaving} size="sm" variant="outline" className="border-amber-400 text-amber-200 hover:bg-amber-500/20">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> {isSaving ? "Saving…" : "Save to Dashboard"}
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare} size="sm" variant="outline" className="border-amber-400 text-amber-200 hover:bg-amber-500/20">
              <Share2 className="w-4 h-4" />
            </Button>
          )}
          {onRegenerate && (
            <Button onClick={onRegenerate} size="sm" variant="outline" className="border-amber-400 text-amber-200 hover:bg-amber-500/20">
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
            <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{scores.overallScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Overall Marital Harmony</div>
            <Progress value={scores.overallScore} className="h-1.5 mt-3 bg-amber-100 dark:bg-amber-950" />
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
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{newChapters.trustIndexScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Trust & Emotional Bond</div>
            <Progress value={newChapters.trustIndexScore} className="h-1.5 mt-3 bg-emerald-100 dark:bg-emerald-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-300 dark:border-purple-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Compass className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-black text-purple-700 dark:text-purple-300">{newChapters.loveMarriageProbabilityPercent}%</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Love Marriage Feasibility</div>
            <Progress value={newChapters.loveMarriageProbabilityPercent} className="h-1.5 mt-3 bg-purple-100 dark:bg-purple-950" />
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="scorecard">6 Score Cards</TabsTrigger>
          <TabsTrigger value="planets">7th House & Planets</TabsTrigger>
          <TabsTrigger value="spouse">18-Pt Spouse Profile</TabsTrigger>
          <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
          <TabsTrigger value="remedies">Remedies & Cards</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scorecard */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>6 Detailed Score Cards</CardTitle>
              <CardDescription>Comprehensive scores with Strength, Weakness, Reason, Evidence, and Recommendation.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scores.details && Object.values(scores.details).map((sd, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{sd.label}</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">{sd.score}/100</span>
                  </div>
                  <Progress value={sd.score} className="h-2 bg-amber-100 dark:bg-amber-950" />
                  <div><strong>Strength:</strong> {sd.strength}</div>
                  <div><strong>Weakness:</strong> {sd.weakness}</div>
                  <div><strong>Why:</strong> {sd.reason}</div>
                  <div className="italic text-amber-700 dark:text-amber-300">"{sd.recommendation}"</div>
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
                <CardTitle>7th House Deep Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div><strong>Lord Dignity:</strong> {house7.lordDignity}</div>
                <div><strong>Placement:</strong> {house7.lordPlacement}</div>
                <div><strong>Navamsa D9 Support:</strong> {house7.navamsaSupport}</div>
                <div><strong>Long-Term Effects:</strong> {house7.longTermMarriageEffects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Venus & Jupiter Alignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div><strong>Love Language:</strong> {venus.loveLanguage}</div>
                <div><strong>Romantic Expression:</strong> {venus.romanticExpression}</div>
                <div><strong>Physical Attraction Index:</strong> {venus.physicalAttractionIndex}/100</div>
                <div><strong>Spouse Wisdom Level:</strong> {jupiter.spouseWisdomLevel}</div>
                <div><strong>Marriage Stability Impact:</strong> {jupiter.marriageStabilityImpact}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 18-Point Spouse Profile */}
        <TabsContent value="spouse" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>18-Point Comprehensive Spouse Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div><strong>1. Appearance:</strong> {spouseProfile.appearance}</div>
                <div><strong>2. Height Estimate:</strong> {spouseProfile.heightEstimate}</div>
                <div><strong>3. Body Type:</strong> {spouseProfile.bodyType}</div>
                <div><strong>4. Face Structure:</strong> {spouseProfile.faceStructure}</div>
                <div><strong>5. Voice & Tone:</strong> {spouseProfile.voiceAndTone}</div>
                <div><strong>6. Nature:</strong> {spouseProfile.nature}</div>
                <div><strong>7. Temperament:</strong> {spouseProfile.temperament}</div>
                <div><strong>8. Education:</strong> {spouseProfile.educationBackground}</div>
                <div><strong>9. Profession:</strong> {spouseProfile.likelyProfession}</div>
              </div>
              <div className="space-y-2">
                <div><strong>10. Estimated Income:</strong> {spouseProfile.estimatedIncomeLevel}</div>
                <div><strong>11. Lifestyle:</strong> {spouseProfile.lifestylePreferences}</div>
                <div><strong>12. Habits & Interests:</strong> {spouseProfile.habitsAndInterests}</div>
                <div><strong>13. Romantic Nature:</strong> {spouseProfile.romanticNature}</div>
                <div><strong>14. Financial Attitude:</strong> {spouseProfile.financialAttitude}</div>
                <div><strong>15. Communication:</strong> {spouseProfile.communicationStyle}</div>
                <div><strong>16. Children Preference:</strong> {spouseProfile.childrenPreference}</div>
                <div><strong>17. Family Background:</strong> {spouseProfile.familyBackground}</div>
                <div><strong>18. Summary:</strong> {spouseProfile.summary}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 12-Month Forecast */}
        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {monthlyForecast.map((m, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold">{m.monthName}</CardTitle>
                    <span className="text-amber-500">{'★'.repeat(m.romanceRating)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div><strong>Love:</strong> {m.loveOutlook}</div>
                  <div><strong>Communication:</strong> {m.communicationOutlook}</div>
                  <div><strong>Finance:</strong> {m.financeOutlook}</div>
                  <div><strong>Family:</strong> {m.familyOutlook}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Remedies & Cards */}
        <TabsContent value="remedies" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Structured Vedic Remedy Cards</CardTitle>
              <CardDescription>Actionable planetary alignment procedures (No developer placeholders)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {remedies.map((r, i) => (
                <div key={i} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-300 text-sm">{r.title}</div>
                  <div><strong>Purpose:</strong> {r.purpose}</div>
                  <div><strong>Why Recommended:</strong> {r.whyRecommended}</div>
                  <div><strong>Procedure:</strong> {r.procedure}</div>
                  <div><strong>Best Day & Time:</strong> {r.bestDay} ({r.bestTime}) | <strong>Duration:</strong> {r.duration}</div>
                  <div className="text-emerald-700 font-semibold">Expected Benefit: {r.expectedBenefit}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Evidence & Verdict */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planetary Evidence Chain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {evidenceChain.map((e, i) => (
                <div key={i} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600 rounded-r-xl space-y-1">
                  <div className="flex justify-between font-bold text-indigo-950 dark:text-indigo-200">
                    <span>{e.claim}</span>
                    <Badge variant="outline">{e.confidencePercent}% Confidence</Badge>
                  </div>
                  <div><strong>Planet:</strong> {e.planet} | <strong>House:</strong> {e.house} | <strong>Evidence:</strong> {e.evidence}</div>
                  <div className="text-slate-600 dark:text-slate-400"><strong>Conclusion:</strong> {e.conclusion}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-950 to-indigo-950 text-white">
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
