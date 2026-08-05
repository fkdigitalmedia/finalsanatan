import { useState } from "react";
import { toast } from "sonner";
import { Activity, Settings, DollarSign, Globe, Sparkles, Save, ToggleLeft, BarChart3, ShieldCheck, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function HealthAnalysisAdmin() {
  const [enabled, setEnabled] = useState(true);
  const [priceInr, setPriceInr] = useState(349);
  const [discountPercent, setDiscountPercent] = useState(30);
  const [includedPlans, setIncludedPlans] = useState(["enterprise", "astrologer_pro"]);
  const [languages, setLanguages] = useState(["en", "hi"]);
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    "You are a Senior Ayurvedic & Medical Astrologer. Strictly adhere to non-diagnostic guidelines. Never claim medical certainty. Provide evidence citing 1st/6th/8th/12th houses, Tridosha constitution, planetary dignities, and Ayurvedic lifestyle guidance."
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Health Analysis Admin Settings saved successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold tracking-tight">Health Analysis Report Pro — Admin Control</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Configure product pricing, included subscription tiers, AI persona, and system status.</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Admin Settings"}
        </Button>
      </div>

      {/* Analytics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="text-xs font-semibold text-slate-500">Product Status</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <Badge className={enabled ? "bg-emerald-500" : "bg-slate-500"}>{enabled ? "ACTIVE" : "DISABLED"}</Badge>
          </div>
        </Card>
        <Card className="p-4 bg-teal-500/5 border-teal-500/20">
          <div className="text-xs font-semibold text-slate-500">Base Retail Price</div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">₹{priceInr}</div>
          <div className="text-xs text-slate-400">Effective: ₹{Math.round(priceInr * (1 - discountPercent / 100))}</div>
        </Card>
        <Card className="p-4 bg-indigo-500/5 border-indigo-500/20">
          <div className="text-xs font-semibold text-slate-500">Reports Generated (30d)</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">1,890</div>
          <div className="text-xs text-emerald-600 font-semibold">+22.1% this month</div>
        </Card>
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="text-xs font-semibold text-slate-500">Total Revenue (30d)</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">₹4,61,160</div>
          <div className="text-xs text-slate-400">Avg PDF length: 34 pages</div>
        </Card>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Pricing & Monitization Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable Product</Label>
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Standalone Price (INR ₹)</Label>
              <Input
                id="price"
                type="number"
                value={priceInr}
                onChange={(e) => setPriceInr(Number(e.target.value))}
                min={199}
                max={999}
              />
              <p className="text-xs text-slate-500">Recommended range: ₹249 to ₹499</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                min={0}
                max={80}
              />
            </div>

            <div className="space-y-2">
              <Label>Included Subscription Tiers</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {["pro", "enterprise", "astrologer_pro"].map((plan) => {
                  const isInc = includedPlans.includes(plan);
                  return (
                    <Badge
                      key={plan}
                      variant={isInc ? "default" : "outline"}
                      className="cursor-pointer uppercase text-xs"
                      onClick={() => {
                        if (isInc) setIncludedPlans(includedPlans.filter((p) => p !== plan));
                        else setIncludedPlans([...includedPlans, plan]);
                      }}
                    >
                      {plan}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-emerald-500" /> AI Persona & System Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <Label htmlFor="prompt">System AI Persona Prompt</Label>
              <Textarea
                id="prompt"
                rows={5}
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Supported Languages</Label>
              <div className="flex gap-2">
                {["en", "hi", "sa", "mr", "gu", "ta"].map((lang) => {
                  const isSupported = languages.includes(lang);
                  return (
                    <Badge
                      key={lang}
                      variant={isSupported ? "default" : "outline"}
                      className="cursor-pointer uppercase"
                      onClick={() => {
                        if (isSupported) setLanguages(languages.filter((l) => l !== lang));
                        else setLanguages([...languages, lang]);
                      }}
                    >
                      {lang}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
