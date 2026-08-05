import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Activity, Sparkles, User, Calendar, Clock, MapPin, Globe, ArrowRight, AlertTriangle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQList } from "@/components/ui-kit/FAQList";
import { toolSchema } from "@/components/tools/PremiumToolShell";
import { computeHealthAnalysis } from "@/lib/health-analysis/health-engine";
import type { HealthAnalysisResult, HealthAnalysisInput } from "@/lib/health-analysis/types";
import { HealthAnalysisDashboard } from "@/components/health-analysis/HealthAnalysisDashboard";
import { useAuth } from "@/hooks/useAuth";
import { pdfSaveReport, pdfDeleteReport } from "@/lib/pdf.functions";

const FAQS = [
  {
    q: "What is Health Analysis Report Pro?",
    a: "Health Analysis Report Pro is an enterprise-grade 34-page astrological report analyzing 1st, 6th, 8th, and 12th houses, Ayurvedic Tridosha constitution (Vata/Pitta/Kapha), 12-month wellness forecast, and preventive remedies.",
  },
  {
    q: "Does this report diagnose medical diseases or conditions?",
    a: "No. This report strictly adheres to non-diagnostic guidelines. It provides astrological health tendencies, Ayurvedic constitution insights, stress management, and preventive lifestyle guidance. Always consult a licensed medical doctor for health concerns.",
  },
  {
    q: "What information is required to generate the report?",
    a: "You need Name, Date of Birth, Time of Birth, and City of Birth (Latitude/Longitude).",
  },
  {
    q: "How many pages is the generated PDF report?",
    a: "The full downloadable PDF report spans 30 to 40 pages with detailed scorecards, organ system tendencies, evidence chains, and Ayurvedic Remedies.",
  },
];

export const Route = createFileRoute("/tools/health-analysis")({
  head: () => ({
    meta: [
      { title: "Health Analysis Report Pro — Enterprise Astrological Wellness Guidance" },
      {
        name: "description",
        content:
          "Generate a 30–40 page professional Health Analysis Report covering 1st, 6th, 8th, 12th houses, Tridosha constitution, organ tendencies, and 12-month wellness forecast.",
      },
      { property: "og:title", content: "Health Analysis Report Pro — Enterprise Astrological Wellness Guidance" },
      {
        property: "og:description",
        content: "Enterprise Vedic health analysis report with 10 precision scores, Ayurvedic body constitution, and preventive remedies.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Health Analysis Report Pro",
          description: "Enterprise-grade 34-page Vedic health analysis report.",
          url: "https://sanatantools.com/tools/health-analysis",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: HealthAnalysisPage,
});

function HealthAnalysisPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "Aarav Sharma",
    date: "1995-08-15",
    time: "10:30",
    placeName: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    language: "en",
  });

  const [result, setResult] = useState<HealthAnalysisResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    try {
      setIsCalculating(true);
      const birthInput: HealthAnalysisInput = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: formData.timezone,
        place: formData.placeName,
        language: formData.language,
      };

      const res = computeHealthAnalysis(birthInput);
      setResult(res);
      toast.success("Health Analysis Report Pro generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate Health Analysis Report.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!result) return;
    if (!user) {
      toast.error("Please sign in to save reports to your account dashboard.");
      return;
    }
    try {
      setIsSaving(true);
      const savedRow = await pdfSaveReport({
        data: {
          report: "health-analysis",
          title: `Health Analysis Report Pro - ${result.input.name}`,
          filename: `health-analysis-${result.input.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          language: formData.language,
          pages: 34,
          bytes: 2450000,
          meta: {
            scores: result.scores,
            input: result.input,
            result: result,
          },
        },
      });
      setSavedReportId(savedRow.id);
      toast.success("Report saved to your User Dashboard (/reports)!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to save report to dashboard.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSavedReport = async () => {
    if (!savedReportId) {
      setResult(null);
      return;
    }
    try {
      await pdfDeleteReport({ data: { id: savedReportId } });
      setSavedReportId(null);
      setResult(null);
      toast.success("Report removed from database.");
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete report.");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Page link copied to clipboard!");
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          
          {/* Header Description */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" /> Premium Product ₹249 - ₹499
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Health Analysis Report Pro
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Enterprise 34-Page Vedic Report: 1st, 6th, 8th & 12th Houses, Tridosha Constitution, Organ Tendencies, and 12-Month Wellness Forecast.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-emerald-500" /> Enter Birth Details for Health Report
              </CardTitle>
              <CardDescription>
                Precision calculations powered by Vedic ephemeris, Ayurvedic Tridosha & D6 Shashtamsha.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" /> Date of Birth
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" /> Time of Birth
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place" className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500" /> Birth City / Place
                  </Label>
                  <Input
                    id="place"
                    value={formData.placeName}
                    onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                    placeholder="e.g. New Delhi, India"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="language" className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-500" /> Report Language
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(val) => setFormData({ ...formData, language: val })}
                  >
                    <SelectTrigger id="language"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isCalculating}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-base shadow-lg transition-all"
              >
                {isCalculating ? "Calculating 34-Page Health Analysis…" : "Generate Health Analysis Report Pro"}
                {!isCalculating && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Results Dashboard View */}
          {result && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <HealthAnalysisDashboard
                result={result}
                onRegenerate={handleGenerate}
                onSave={handleSaveToDashboard}
                onDelete={handleDeleteSavedReport}
                onShare={handleShare}
                isSaving={isSaving}
              />
            </div>
          )}

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto pt-10">
            <h2 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h2>
            <FAQList items={FAQS} />
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
