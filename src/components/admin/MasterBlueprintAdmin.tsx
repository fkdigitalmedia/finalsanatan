import { useState } from "react";
import { toast } from "sonner";
import { Crown, DollarSign, Sparkles, Save, Cpu, BarChart3, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MasterBlueprintAdmin() {
  const [enabled, setEnabled] = useState(true);
  const [priceInr, setPriceInr] = useState(1499);
  const [discountPercent, setDiscountPercent] = useState(30);
  const [includedPlans, setIncludedPlans] = useState(["lifetime_vip", "enterprise"]);
  const [selectedAiModel, setSelectedAiModel] = useState("gpt-4o");
  const [languages, setLanguages] = useState(["en", "hi"]);
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    "You are the Master AI Life Strategy Synthesizer for SanatanTools. Synthesize Vedic astrology engines (Kundli, D10, D9, Jaimini, Varshphal, Numerology) into coherent life strategies. Explain trade-offs, answer practical questions with evidence, and produce zero duplicate statements."
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Master Life Blueprint Admin Settings saved successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight">AI Master Life Blueprint — Flagship Admin Control</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage ultimate flagship pricing, subscription tier mapping, AI models, and synthesis prompt versions.</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-500 hover:to-indigo-600 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Admin Settings"}
        </Button>
      </div>

      {/* Analytics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="text-xs font-semibold text-slate-500">Product Status</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
            <Badge className={enabled ? "bg-gradient-to-r from-amber-500 to-indigo-600 text-white" : "bg-slate-500"}>
              {enabled ? "ULTIMATE FLAGSHIP ACTIVE" : "DISABLED"}
            </Badge>
          </div>
        </Card>
        <Card className="p-4 bg-teal-500/5 border-teal-500/20">
          <div className="text-xs font-semibold text-slate-500">Base Retail Price</div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">₹{priceInr}</div>
          <div className="text-xs text-slate-400">Effective: ₹{Math.round(priceInr * (1 - discountPercent / 100))}</div>
        </Card>
        <Card className="p-4 bg-indigo-500/5 border-indigo-500/20">
          <div className="text-xs font-semibold text-slate-500">Master Reports Generated</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">1,940</div>
          <div className="text-xs text-emerald-600 font-semibold">+68.4% growth</div>
        </Card>
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="text-xs font-semibold text-slate-500">Master Revenue (30d)</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹20,35,050</div>
          <div className="text-xs text-slate-400">Avg PDF length: 96 pages</div>
        </Card>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4 text-amber-500" /> Pricing & Monitization Controls
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
                min={999}
                max={2999}
              />
              <p className="text-xs text-slate-500">Recommended flagship range: ₹999 to ₹1999</p>
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
                {["lifetime_vip", "enterprise", "astrologer_pro"].map((plan) => {
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
              <Cpu className="w-4 h-4 text-indigo-500" /> AI Reasoning Model & Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <Label htmlFor="ai-model">Primary Reasoning AI Model</Label>
              <Select value={selectedAiModel} onValueChange={setSelectedAiModel}>
                <SelectTrigger id="ai-model"><SelectValue placeholder="Select AI model" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">OpenAI GPT-4o (High Reasoning)</SelectItem>
                  <SelectItem value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="deepseek-r1">DeepSeek R1 Reasoning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">System Master Synthesis Prompt</Label>
              <Textarea
                id="prompt"
                rows={4}
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
