import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Plane, Sparkles, User, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQList } from "@/components/ui-kit/FAQList";
import { toolSchema } from "@/components/tools/PremiumToolShell";
import { computeForeignSettlementAnalysis } from "@/lib/foreign-settlement/foreign-engine";
import type { ForeignSettlementResult, ForeignSettlementInput } from "@/lib/foreign-settlement/types";
import { ForeignSettlementDashboard } from "@/components/foreign-settlement/ForeignSettlementDashboard";
import { useAuth } from "@/hooks/useAuth";
import { pdfSaveReport, pdfDeleteReport } from "@/lib/pdf.functions";

const FAQS = [
  {
    q: "What is Foreign Settlement & Foreign Travel Analysis Pro?",
    a: "Foreign Settlement Pro is an enterprise 36-page Vedic report analyzing 4th, 7th, 9th, 10th, and 12th houses, PR probability, top 10 global country suitability rankings, 12-month immigration timeline, and remedies.",
  },
  {
    q: "How does the Country Suitability Ranking work?",
    a: "The engine evaluates planetary placements in your birth chart (Rahu, Jupiter, Saturn, 9th & 12th houses) against international point systems to rank destinations like Canada, Australia, USA, UK, Germany, Dubai, and Singapore.",
  },
  {
    q: "What birth details are required?",
    a: "You need Name, Date of Birth, Time of Birth, and Birth Location (Latitude/Longitude).",
  },
  {
    q: "Can I save and download the generated report?",
    a: "Yes! You can instantly download a 36-page professional A4 PDF or save it to your User Dashboard (/reports) for lifetime access.",
  },
];

export const Route = createFileRoute("/tools/foreign-settlement-analysis" as any)({
  head: () => ({
    meta: [
      { title: "Foreign Settlement & Foreign Travel Analysis Pro — Vedic Overseas Relocation Guidance" },
      {
        name: "description",
        content:
          "Generate a 36-page enterprise Foreign Settlement Report covering PR probability, visa timing, country suitability rankings (Canada, USA, Australia, UK, Germany, Dubai), and 12-month immigration timeline.",
      },
      { property: "og:title", content: "Foreign Settlement & Foreign Travel Analysis Pro" },
      {
        property: "og:description",
        content: "Enterprise Vedic foreign relocation report with 9 precision scores, country rankings, and visa success timing.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Foreign Settlement & Foreign Travel Analysis Pro",
          description: "Enterprise-grade 36-page Vedic foreign settlement report.",
          url: "https://sanatantools.com/tools/foreign-settlement-analysis",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: ForeignSettlementPage,
});

function ForeignSettlementPage() {
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

  const [result, setResult] = useState<ForeignSettlementResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    try {
      setIsCalculating(true);
      const birthInput: ForeignSettlementInput = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: formData.timezone,
        place: formData.placeName,
        language: formData.language,
      };

      const res = computeForeignSettlementAnalysis(birthInput);
      setResult(res);
      toast.success("Foreign Settlement Analysis Report Pro generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate Foreign Settlement Report.");
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
          report: "foreign-settlement-analysis",
          title: `Foreign Settlement Report Pro - ${result.input.name}`,
          filename: `foreign-settlement-${result.input.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          language: formData.language,
          pages: 36,
          bytes: 2550000,
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" /> Premium Product ₹299 - ₹499
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Foreign Settlement & Travel Pro
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Enterprise 36-Page Vedic Report: 4th, 7th, 9th, 10th & 12th Houses, PR Probability, Top 10 Country Rankings, and 12-Month Immigration Forecast.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-blue-500" /> Enter Birth Details for Foreign Settlement Report
              </CardTitle>
              <CardDescription>
                Precision calculations powered by Vedic ephemeris, Rahu-Jupiter transits & 12th House Foreign Residence rules.
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-base shadow-lg transition-all"
              >
                {isCalculating ? "Calculating 36-Page Foreign Settlement Analysis…" : "Generate Foreign Settlement Report Pro"}
                {!isCalculating && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Results Dashboard View */}
          {result && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <ForeignSettlementDashboard
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
