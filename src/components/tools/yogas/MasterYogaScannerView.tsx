import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Crown,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Moon,
  Printer,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Sun,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { useLocation } from "@/lib/location";
import {
  scanAllYogasFromBirth,
  YOGA_DEFINITIONS,
  type YogaEvaluationResult,
} from "./universal-yoga-engine";

export function MasterYogaScannerView() {
  const [loc, setLoc] = useLocation();
  const [birthDate, setBirthDate] = useState<string>("1995-04-14");
  const [birthTime, setBirthTime] = useState<string>("10:30");
  const [scanData, setScanData] = useState<ReturnType<typeof scanAllYogasFromBirth> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Initial calculation on mount
  useMemo(() => {
    try {
      const res = scanAllYogasFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      setScanData(res);
    } catch {
      // ignore
    }
  }, []);

  const handleScan = () => {
    try {
      const res = scanAllYogasFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      setScanData(res);
      toast.success("कुण्डली के समस्त ३०+ योगों का परीक्षण पूर्ण हुआ!");
    } catch (e: any) {
      toast.error(e.message || "कुण्डली स्कैन में त्रुटि हुई।");
    }
  };

  const filteredResults = useMemo(() => {
    if (!scanData) return [];
    if (selectedCategory === "all") return scanData.results;
    if (selectedCategory === "active") return scanData.results.filter((r) => r.isPresent);
    return scanData.results.filter((r) => r.definition.category === selectedCategory);
  }, [scanData, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* SCANNER HERO CARD */}
      <Card className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6 md:p-8 shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Crown className="size-3.5" /> सम्पूर्ण वैदिक योग विश्लेषक (Universal Yoga Scanner)
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
              Kundli Yoga Scanner & Calculator Studio
            </h2>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl">
              Scan your birth chart for all classical Raja Yogas, Dhana Yogas, Pancha Mahapurusha
              Yogas, Gaja Kesari, Budhaditya, and Viparita Yogas in real time.
            </p>
          </div>

          {scanData && (
            <div className="rounded-2xl border border-border bg-background/80 p-4 text-center min-w-44 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Zap className="size-3 text-primary" /> उपस्थित योग संख्या
              </div>
              <div className="font-display font-extrabold text-3xl text-primary mt-1">
                {scanData.totalYogasFound} / {scanData.results.length}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                औसत सामर्थ्य: {scanData.overallYogaScore}%
              </div>
            </div>
          )}
        </div>

        {/* INPUT FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म तिथि (Date):</Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म समय (Time):</Label>
            <Input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म स्थान (Place):</Label>
            <LocationPicker value={loc} onChange={setLoc} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            onClick={handleScan}
            className="rounded-xl gap-2 text-xs font-semibold shadow-sm"
          >
            <Sparkles className="size-3.5" /> समस्त योगों का परीक्षण करें (Scan Chart)
          </Button>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: "all", label: "सभी योग" },
              { id: "active", label: "केवल उपस्थित (Active)" },
              { id: "Pancha Mahapurusha", label: "महापुरुष योग" },
              { id: "Raja Yoga", label: "राज योग" },
              { id: "Dhana Yoga", label: "धन योग" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border-border bg-card hover:border-primary/40 text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* YOGA SCANNER RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map((yoga) => (
          <div
            key={yoga.slug}
            className={`group rounded-3xl border p-6 space-y-4 shadow-sm hover:shadow-elegant transition-all flex flex-col justify-between ${
              yoga.isPresent
                ? "border-primary/40 bg-gradient-to-br from-card via-background to-primary/5"
                : "border-border/80 bg-card hover:border-primary/30"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition">
                      {yoga.nameHindi}
                    </h3>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    {yoga.nameEnglish} · {yoga.definition.category}
                  </div>
                </div>

                <Badge
                  variant={yoga.isPresent ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {yoga.isPresent ? `✓ उपस्थित (${yoga.strengthPercentage}%)` : "अनुपस्थित"}
                </Badge>
              </div>

              <p className="text-xs text-foreground font-devanagari leading-relaxed">
                {yoga.definition.summaryHindi}
              </p>

              <div className="p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground">
                <strong className="text-foreground">नियम:</strong> {yoga.definition.ruleFormula}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {yoga.definition.primaryGrahas.join(", ")}
              </span>

              <a
                href={`/yoga/${yoga.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                विस्तृत गणक व उपाय <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
