import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Sparkles, User, Calendar, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQList } from "@/components/ui-kit/FAQList";
import { toolSchema } from "@/components/tools/PremiumToolShell";
import { computeCareerAnalysis } from "@/lib/career-analysis/career-engine";
import type { CareerAnalysisResultV2, CareerAnalysisInput } from "@/lib/career-analysis/types";
import { CareerAnalysisDashboard } from "@/components/career-analysis/CareerAnalysisDashboard";
import { useAuth } from "@/hooks/useAuth";
import { pdfSaveReport, pdfDeleteReport } from "@/lib/pdf.functions";

const FAQS = [
  {
    q: "What is Career Analysis Report Pro v2.0?",
    a: "Career Analysis Report Pro v2.0 is SanatanTools' completely rewritten 28-section flagship career intelligence report analyzing D10 Dashamsa, Jaimini Karakas, 14 Suitability Domains, 20 Industries, 25 Ranked Career Roles, and 5-Tier AI strategy.",
  },
  {
    q: "How does the 25 Top Career Role Ranking work?",
    a: "The engine evaluates your 10th House, D10 Dashamsa, Atmakaraka, Amatyakaraka, and planetary dignities against 25 modern high-growth professions with zero generic statements.",
  },
  {
    q: "What birth details are required?",
    a: "You need Name, Date of Birth, Time of Birth, and Birth Location (Latitude/Longitude).",
  },
  {
    q: "Can I save and download the generated report?",
    a: "Yes! You can instantly download a 40-page commercial A4 PDF or save it to your User Dashboard (/reports) for lifetime access.",
  },
];

export const Route = createFileRoute("/tools/career-analysis")({
  head: () => ({
    meta: [
      { title: "Career Analysis Report Pro v2.0 — Flagship Vedic Career Intelligence" },
      {
        name: "description",
        content:
          "Generate a 40-page flagship Career Analysis Report v2.0 covering D10 Dashamsa, Jaimini Karakas, 14 Suitability Domains, 20 Industries, 25 Ranked Career Roles, and 5-Tier AI Career Coach strategy.",
      },
      { property: "og:title", content: "Career Analysis Report Pro v2.0 — Flagship Vedic Career Intelligence" },
      {
        property: "og:description",
        content: "Enterprise Vedic career report with 11 precision scores, D10 Dashamsa, and 25 ranked career roles.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Career Analysis Report Pro v2.0",
          description: "Flagship 40-page enterprise Vedic career intelligence report v2.0.",
          url: "https://sanatantools.com/tools/career-analysis",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: CareerAnalysisPage,
});

function CareerAnalysisPage() {
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

  const [result, setResult] = useState<CareerAnalysisResultV2 | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    try {
      setIsCalculating(true);
      const birthInput: CareerAnalysisInput = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: formData.timezone,
        place: formData.placeName,
        language: formData.language,
      };

      const res = computeCareerAnalysis(birthInput);
      setResult(res);
      toast.success("Career Analysis Report Pro v2.0 generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate Career Analysis Report.");
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
          report: "career-analysis",
          title: `Career Analysis Report Pro v2.0 - ${result.input.name}`,
          filename: `career-analysis-${result.input.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          language: formData.language,
          pages: 40,
          bytes: 2850000,
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" /> Enterprise Commercial Pro v2.0 ₹299 - ₹499
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Career Analysis Report Pro v2.0
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Enterprise 40-Page Vedic Report: D10 Dashamsa, Jaimini Karakas, 14 Suitability Domains, 20 Top Industries, 25 Ranked Careers, and 5-Tier AI Strategy.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" /> Enter Birth Details for Career Report v2.0
              </CardTitle>
              <CardDescription>
                Precision calculations powered by Vedic ephemeris, D10 Dashamsa & Jaimini Karakas.
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
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base shadow-lg transition-all"
              >
                {isCalculating ? "Calculating 40-Page Career Analysis v2.0…" : "Generate Career Analysis Report Pro v2.0"}
                {!isCalculating && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Results Dashboard View */}
          {result && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <CareerAnalysisDashboard
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
