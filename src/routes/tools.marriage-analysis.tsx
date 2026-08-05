import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Sparkles, User, Calendar, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQList } from "@/components/ui-kit/FAQList";
import { toolSchema } from "@/components/tools/PremiumToolShell";
import { computeMarriageAnalysis } from "@/lib/marriage-analysis/marriage-engine";
import type { MarriageAnalysisResult, MarriageAnalysisInput } from "@/lib/marriage-analysis/types";
import { MarriageAnalysisDashboard } from "@/components/marriage-analysis/MarriageAnalysisDashboard";
import { useAuth } from "@/hooks/useAuth";
import { pdfSaveReport, pdfDeleteReport } from "@/lib/pdf.functions";

const FAQS = [
  {
    q: "What is Marriage Analysis Report Pro?",
    a: "Marriage Analysis Report Pro is an enterprise-grade 34-page astrological report analyzing 7th House, D9 Navamsha, Jaimini Darakaraka, Love vs Arranged feasibility, 12-month forecast, and Vedic remedies.",
  },
  {
    q: "Does this modify or replace Janam Kundli or Kundli Matching?",
    a: "No. This is a completely independent premium report product designed specifically for single individuals or couples seeking comprehensive marital and relationship insights.",
  },
  {
    q: "What information is required to generate the report?",
    a: "You need Name, Gender, Date of Birth, Time of Birth, and City of Birth (Latitude/Longitude).",
  },
  {
    q: "How many pages is the generated PDF report?",
    a: "The full downloadable PDF report spans 30 to 40 pages with detailed scorecards, evidence chains, and Remedies.",
  },
];

export const Route = createFileRoute("/tools/marriage-analysis" as any)({
  head: () => ({
    meta: [
      { title: "Marriage Analysis Report Pro — Enterprise Astrological Guidance" },
      {
        name: "description",
        content:
          "Generate a 30–40 page professional Marriage Analysis Report covering 7th house, Venus, D9 Navamsha, Darakaraka, love vs arranged indicators, and 12-month relationship forecast.",
      },
      { property: "og:title", content: "Marriage Analysis Report Pro — Enterprise Astrological Guidance" },
      {
        property: "og:description",
        content: "Enterprise Vedic marriage analysis report with 9 precision scores, spouse nature, and remedies.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Marriage Analysis Report Pro",
          description: "Enterprise-grade 34-page Vedic marriage analysis report.",
          url: "https://sanatantools.com/tools/marriage-analysis",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: MarriageAnalysisPage,
});

function MarriageAnalysisPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "Aarav Sharma",
    gender: "male" as "male" | "female",
    date: "1995-08-15",
    time: "10:30",
    placeName: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    language: "en",
  });

  const [result, setResult] = useState<MarriageAnalysisResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    try {
      setIsCalculating(true);
      const birthInput: MarriageAnalysisInput = {
        name: formData.name,
        gender: formData.gender,
        date: formData.date,
        time: formData.time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: formData.timezone,
        place: formData.placeName,
        language: formData.language,
      };

      const res = computeMarriageAnalysis(birthInput);
      setResult(res);
      toast.success("Marriage Analysis Report Pro generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate Marriage Analysis Report.");
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
          report: "marriage-analysis",
          title: `Marriage Analysis Report Pro - ${result.input.name}`,
          filename: `marriage-analysis-${result.input.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          language: formData.language,
          pages: 34,
          bytes: 2450000,
          meta: {
            scores: result.scores,
            input: result.input,
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" /> Premium Product ₹249 - ₹499
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Marriage Analysis Report Pro
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Enterprise 34-Page Vedic Report: 7th House, Venus, D9 Navamsha, Jaimini Darakaraka, Love vs Arranged Scores, and 12-Month Forecast.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" /> Enter Birth Details for Marriage Report
              </CardTitle>
              <CardDescription>
                Precision calculations powered by Vedic ephemeris, D9 Navamsha & Jaimini Darakaraka.
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
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val: "male" | "female") => setFormData({ ...formData, gender: val })}
                  >
                    <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div className="space-y-2">
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
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-500 hover:to-indigo-600 text-white font-bold text-base shadow-lg transition-all"
              >
                {isCalculating ? "Calculating 34-Page Marriage Analysis…" : "Generate Marriage Analysis Report Pro"}
                {!isCalculating && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Results Dashboard View */}
          {result && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <MarriageAnalysisDashboard
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
