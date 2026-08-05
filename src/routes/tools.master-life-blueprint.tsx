import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Crown, Sparkles, User, Calendar, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQList } from "@/components/ui-kit/FAQList";
import { toolSchema } from "@/components/tools/PremiumToolShell";
import { computeMasterLifeBlueprint } from "@/lib/master-blueprint/blueprint-engine";
import type { MasterBlueprintResult, MasterBlueprintInput } from "@/lib/master-blueprint/types";
import { MasterBlueprintDashboard } from "@/components/master-blueprint/MasterBlueprintDashboard";
import { useAuth } from "@/hooks/useAuth";
import { pdfSaveReport, pdfDeleteReport } from "@/lib/pdf.functions";

const FAQS = [
  {
    q: "What is AI Master Life Blueprint?",
    a: "AI Master Life Blueprint is the ultimate platform flagship report (96-120 pages) that synthesizes Janam Kundli, Career, Business, Marriage, Health, Foreign Relocation, Varshphal, and Numerology engines into an integrated AI Decision Intelligence System.",
  },
  {
    q: "How does the AI Decision Engine work?",
    a: "Instead of simply merging reports, the Master AI Engine cross-analyzes timing across domains to provide evidence-backed verdicts for 8 practical questions (Job Change, Business Launch, Investing, Property Purchase, Relocation, Foreign Travel, Marriage Timing, Higher Education).",
  },
  {
    q: "What birth details are required?",
    a: "You need Name, Date of Birth, Time of Birth, and Birth Location (Latitude/Longitude).",
  },
  {
    q: "Can I save and download the generated report?",
    a: "Yes! You can instantly download a 96-page publication-grade PDF or save it to your User Dashboard (/reports) for lifetime VIP access.",
  },
];

export const Route = createFileRoute("/tools/master-life-blueprint")({
  head: () => ({
    meta: [
      { title: "AI Master Life Blueprint — Ultimate Vedic Life Intelligence Report" },
      {
        name: "description",
        content:
          "Generate the 96-120 page flagship AI Master Life Blueprint combining Janam Kundli, Career, Business, Marriage, Health, Foreign, and Varshphal into integrated life intelligence.",
      },
      { property: "og:title", content: "AI Master Life Blueprint — Ultimate Vedic Life Intelligence Report" },
      {
        property: "og:description",
        content: "Platform flagship Vedic life intelligence report with 14 executive scores, AI Decision Engine, and 10-year forecast.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "AI Master Life Blueprint",
          description: "Platform flagship 96-page Vedic Decision Intelligence report.",
          url: "https://sanatantools.com/tools/master-life-blueprint",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: MasterBlueprintPage,
});

function MasterBlueprintPage() {
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

  const [result, setResult] = useState<MasterBlueprintResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    try {
      setIsCalculating(true);
      const birthInput: MasterBlueprintInput = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: formData.timezone,
        place: formData.placeName,
        language: formData.language,
      };

      const res = computeMasterLifeBlueprint(birthInput);
      setResult(res);
      toast.success("AI Master Life Blueprint generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to generate Master Life Blueprint.");
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
          report: "master-life-blueprint",
          title: `AI Master Life Blueprint - ${result.input.name}`,
          filename: `master-life-blueprint-${result.input.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          language: formData.language,
          pages: 96,
          bytes: 6850000,
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4 text-amber-500" /> Platform Flagship Product ₹999 - ₹1999
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Master Life Blueprint
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              The Ultimate AI-Powered Vedic Life Intelligence Report: 96-Page Integrated Strategy across Career, Business, Marriage, Health & Foreign Relocation.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto shadow-xl border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-amber-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Enter Birth Details for Master Life Blueprint
              </CardTitle>
              <CardDescription>
                Precision multi-engine synthesis powered by Vedic ephemeris, D10, D9, Jaimini & AI Decision Reasoning.
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
                className="w-full h-13 bg-gradient-to-r from-indigo-700 via-indigo-800 to-amber-600 hover:from-indigo-600 hover:to-amber-500 text-white font-extrabold text-base shadow-xl transition-all"
              >
                {isCalculating ? "Synthesizing 96-Page AI Master Life Blueprint…" : "Generate AI Master Life Blueprint (96 Pages)"}
                {!isCalculating && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Results Dashboard View */}
          {result && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <MasterBlueprintDashboard
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
