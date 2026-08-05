import { useState } from "react";
import {
  Globe,
  Plane,
  FileCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Compass,
  Award,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { ForeignSettlementResult } from "@/lib/foreign-settlement/types";
import { buildForeignSettlementPdfHtml } from "@/lib/foreign-settlement/pdf-builder";

interface ForeignSettlementDashboardProps {
  result: ForeignSettlementResult;
  onRegenerate?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export function ForeignSettlementDashboard({
  result,
  onRegenerate,
  onSave,
  onDelete,
  onShare,
  isSaving = false,
}: ForeignSettlementDashboardProps) {
  const [activeTab, setActiveTab] = useState("scorecard");
  const { input, scores, house4, house7, house9, house10, house12, countryRankings, foreignYogas, monthlyForecast, remedies, luckyElements, aiConsultantVerdict, evidenceChain } = result;

  const downloadPdf = () => {
    const htmlContent = buildForeignSettlementPdfHtml(result);
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
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-400 text-slate-900 font-bold px-3 py-1 text-xs uppercase tracking-wide">
              Enterprise Pro Edition
            </Badge>
            <span className="text-xs text-blue-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Calculated in Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Foreign Settlement & Travel Pro — {input.name}
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-2xl">
            Complete 36-section astrological relocation profile analyzing 4th, 7th, 9th, 10th & 12th houses, PR probability, and country suitability.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={downloadPdf} size="sm" className="bg-blue-400 hover:bg-blue-300 text-slate-900 font-bold shadow-md">
            <Download className="w-4 h-4 mr-2" /> Download PDF (36 Pages)
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
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-300 dark:border-blue-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300">{scores.foreignSettlementScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Foreign Settlement</div>
            <Progress value={scores.foreignSettlementScore} className="h-1.5 mt-3 bg-blue-100 dark:bg-blue-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-300 dark:border-teal-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <FileCheck className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-teal-700 dark:text-teal-300">{scores.prProbabilityScore}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">PR Probability</div>
            <Progress value={scores.prProbabilityScore} className="h-1.5 mt-3 bg-teal-100 dark:bg-teal-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-300 dark:border-indigo-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <Plane className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{scores.visaSuccessPotential}/100</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Visa Success Potential</div>
            <Progress value={scores.visaSuccessPotential} className="h-1.5 mt-3 bg-indigo-100 dark:bg-indigo-950" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-300 dark:border-emerald-700/50 shadow-sm">
          <CardContent className="p-5 text-center">
            <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{countryRankings[0].country}</div>
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mt-1">Top Recommended Country</div>
            <div className="text-xs text-emerald-600 font-bold mt-2">{countryRankings[0].suitabilityScore}% Suitability Match</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger value="scorecard">9 Scores</TabsTrigger>
          <TabsTrigger value="countries">Country Rankings</TabsTrigger>
          <TabsTrigger value="houses">Houses & Planets</TabsTrigger>
          <TabsTrigger value="forecast">12-Month Forecast</TabsTrigger>
          <TabsTrigger value="remedies">Remedies & Luck</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Verdict</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scorecard */}
        <TabsContent value="scorecard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>9 Precision Relocation Score Metrics</CardTitle>
              <CardDescription>Quantitative evaluation of astrological foreign indicators.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Foreign Settlement Index", score: scores.foreignSettlementScore },
                { label: "Foreign Travel Frequency", score: scores.foreignTravelScore },
                { label: "PR Probability", score: scores.prProbabilityScore },
                { label: "Visa Success Potential", score: scores.visaSuccessPotential },
                { label: "Foreign Job Opportunities", score: scores.foreignJobScore },
                { label: "Education Abroad Potential", score: scores.educationAbroadScore },
                { label: "Business & Trade Abroad", score: scores.businessAbroadScore },
                { label: "Long Stay Probability", score: scores.longStayProbability },
                { label: "Permanent Residence Potential", score: scores.permanentSettlementProbability },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score} className="h-2 bg-blue-100 dark:bg-blue-950" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Country Rankings */}
        <TabsContent value="countries" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Global Country Suitability Ranking</CardTitle>
              <CardDescription>Astrological alignment for work, education, PR, and permanent stay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {countryRankings.map((c, i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{c.flag}</span> #{i + 1} {c.country}
                      </span>
                      <Badge className="bg-blue-600 text-white font-bold">{c.suitabilityScore}% Match</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{c.astrologicalReasoning}</p>
                    <div className="text-blue-700 dark:text-blue-300 font-semibold">Best Sectors: {c.bestSector}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Houses & Planets */}
        <TabsContent value="houses" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Foreign House & Planetary Analysis</CardTitle>
              <CardDescription>Evaluation of 4th, 7th, 9th, 10th & 12th houses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div><strong>4th House (Motherland):</strong> {house4.rashi} (Lord: {house4.rashiLord}) — {house4.foreignSignificance}</div>
              <div><strong>7th House (Trade):</strong> {house7.rashi} (Lord: {house7.rashiLord}) — {house7.foreignSignificance}</div>
              <div><strong>9th House (Long Travel):</strong> {house9.rashi} (Lord: {house9.rashiLord}) — {house9.foreignSignificance}</div>
              <div><strong>10th House (Foreign Career):</strong> {house10.rashi} (Lord: {house10.rashiLord}) — {house10.foreignSignificance}</div>
              <div><strong>12th House (Foreign Stay):</strong> {house12.rashi} (Lord: {house12.rashiLord}) — {house12.foreignSignificance}</div>
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
                    <div className="flex text-blue-500">
                      {Array.from({ length: m.travelRating }).map((_, i) => (
                        <Award key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs text-blue-600 dark:text-blue-400 font-medium">{m.focusArea}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <div><strong>Visa Outlook:</strong> {m.visaOutlook}</div>
                  <div><strong>Action:</strong> {m.recommendedAction}</div>
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
                <CardTitle>Vedic Travel Remedies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {remedies.map((r, i) => (
                  <div key={i} className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-600 rounded-r-lg text-xs space-y-1">
                    <div className="font-bold text-blue-900 dark:text-blue-300">[{r.category.toUpperCase()}] {r.title}</div>
                    <div className="text-slate-600 dark:text-slate-400">{r.description}</div>
                    <div className="text-slate-500 font-medium">Best Time: {r.bestTime}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lucky Elements for Relocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Lucky Colors:</strong> {luckyElements.colors.join(", ")}</div>
                <div><strong>Lucky Days:</strong> {luckyElements.days.join(", ")}</div>
                <div><strong>Lucky Numbers:</strong> {luckyElements.numbers.join(", ")}</div>
                <div><strong>Lucky Directions:</strong> {luckyElements.directions.join(", ")}</div>
                <div><strong>Auspicious Filing Dates:</strong> Dates {luckyElements.auspiciousDatesMonth.join(", ")}</div>
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
                  <div className="text-slate-700 dark:text-slate-300"><strong>Advice:</strong> {e.actionableAdvice}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
            <CardHeader>
              <CardTitle className="text-blue-300">Final Astrological Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{aiConsultantVerdict.finalVerdict}</p>
              <div className="pt-2">
                <span className="font-bold text-xs uppercase text-blue-200">Action Plan:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-blue-100">
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
