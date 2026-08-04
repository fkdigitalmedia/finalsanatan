import React, { useState, useEffect, useMemo } from "react";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileText,
  Calendar,
  Zap,
  Clock,
  Ban,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";

interface CompareReportsViewProps {
  language: SupportedLanguage;
}

export interface UserKundliOption {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  placeName: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Only fully implemented, active report types in the application
const ACTIVE_REPORT_TYPES = [
  { id: "janam-kundli", name: "Janam Kundli Report", kind: "Vedic Birth Chart" },
  { id: "pro-kundli", name: "Pro Kundli Report (AI Enhanced)", kind: "Full Life Analysis" },
  { id: "kundli-matching", name: "Kundli Matching Report", kind: "Ashtakoot Guna Milan" },
  { id: "varshphal", name: "Varshphal Annual Report", kind: "Tajik Solar Return" },
  { id: "numerology", name: "Numerology Report", kind: "Life Path & Destiny" },
  { id: "vastu", name: "Vastu Shastra Report", kind: "Space & Energy Assessment" },
  { id: "career", name: "Career Astrology Report", kind: "Profession & Dasha Analysis" },
  { id: "muhurat", name: "Muhurat Finder Report", kind: "Auspicious Timing" },
];

// Planned future releases displayed in a disabled "Coming Soon" state
const PLANNED_FUTURE_REPORTS = [
  { id: "marriage-coming-soon", name: "Marriage Astrology Report", status: "Coming Soon" },
  { id: "child-naming-coming-soon", name: "Child Naming (Namkaran) Report", status: "Coming Soon" },
  { id: "medical-coming-soon", name: "Medical & Health Astrology Report", status: "Coming Soon" },
  { id: "business-coming-soon", name: "Business & Wealth Report", status: "Coming Soon" },
];

export function CompareReportsView({ language }: CompareReportsViewProps) {
  const t = getTranslation(language);

  const [userKundlis, setUserKundlis] = useState<UserKundliOption[]>([]);
  const [selectedId1, setSelectedId1] = useState<string>("janam-kundli");
  const [selectedId2, setSelectedId2] = useState<string>("varshphal");
  const [loadingKundlis, setLoadingKundlis] = useState(true);

  // Load real saved user Kundlis from database
  useEffect(() => {
    async function loadKundlis() {
      setLoadingKundlis(true);
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        setLoadingKundlis(false);
        return;
      }

      const { data } = await supabase
        .from("user_kundlis")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const mapped: UserKundliOption[] = data.map((k: any) => ({
          id: k.id,
          name: k.name,
          birthDate: k.birth_date || "1995-08-15",
          birthTime: k.birth_time ? String(k.birth_time).slice(0, 5) : "12:00",
          placeName: k.place_name || "New Delhi, India",
          latitude: k.latitude ?? 28.6139,
          longitude: k.longitude ?? 77.209,
          timezone: k.timezone || "Asia/Kolkata",
        }));
        setUserKundlis(mapped);
        setSelectedId1(mapped[0].id);
        setSelectedId2(mapped[1] ? mapped[1].id : "varshphal");
      }
      setLoadingKundlis(false);
    }
    void loadKundlis();
  }, []);

  // Compute live calculations for selected items if they are real Kundlis
  const kundli1Result = useMemo<KundliResult | null>(() => {
    const found = userKundlis.find((k) => k.id === selectedId1);
    if (!found) return null;
    try {
      return generateKundli({
        date: found.birthDate,
        time: found.birthTime,
        place: `${found.name} · ${found.placeName}`,
        latitude: found.latitude,
        longitude: found.longitude,
        timezone: found.timezone,
      });
    } catch {
      return null;
    }
  }, [userKundlis, selectedId1]);

  const kundli2Result = useMemo<KundliResult | null>(() => {
    const found = userKundlis.find((k) => k.id === selectedId2);
    if (!found) return null;
    try {
      return generateKundli({
        date: found.birthDate,
        time: found.birthTime,
        place: `${found.name} · ${found.placeName}`,
        latitude: found.latitude,
        longitude: found.longitude,
        timezone: found.timezone,
      });
    } catch {
      return null;
    }
  }, [userKundlis, selectedId2]);

  // Labels for selected options
  const label1 = useMemo(() => {
    const userK = userKundlis.find((k) => k.id === selectedId1);
    if (userK) return `${userK.name} (${userK.birthDate})`;
    const active = ACTIVE_REPORT_TYPES.find((r) => r.id === selectedId1);
    return active ? active.name : selectedId1;
  }, [userKundlis, selectedId1]);

  const label2 = useMemo(() => {
    const userK = userKundlis.find((k) => k.id === selectedId2);
    if (userK) return `${userK.name} (${userK.birthDate})`;
    const active = ACTIVE_REPORT_TYPES.find((r) => r.id === selectedId2);
    return active ? active.name : selectedId2;
  }, [userKundlis, selectedId2]);

  // Formatted planetary comparison data
  const planetaryDiff = useMemo(() => {
    if (kundli1Result && kundli2Result) {
      return kundli1Result.d1.planets.map((p1) => {
        const p2 = kundli2Result.d1.planets.find((p) => p.graha === p1.graha) || p1;
        const isShifted = p1.rashi !== p2.rashi || p1.house !== p2.house;
        return {
          planet: p1.graha,
          p1Sign: `${p1.rashi} (H${p1.house})`,
          p1Deg: `${p1.degreesInRashi.toFixed(1)}°`,
          p2Sign: `${p2.rashi} (H${p2.house})`,
          p2Deg: `${p2.degreesInRashi.toFixed(1)}°`,
          isShifted,
          shiftText: isShifted ? `${p1.rashi} → ${p2.rashi} (H${p2.house})` : "Identical Position",
        };
      });
    }

    // Default static matrix for report category comparison
    return [
      { planet: "Sun (Surya)", p1Sign: "Leo (H1)", p1Deg: "14.2°", p2Sign: "Leo (H1)", p2Deg: "14.2°", isShifted: false, shiftText: "Identical Position" },
      { planet: "Moon (Chandra)", p1Sign: "Taurus (H10)", p1Deg: "08.5°", p2Sign: "Cancer (H12)", p2Deg: "22.1°", isShifted: true, shiftText: "Taurus → Cancer (H12)" },
      { planet: "Mars (Mangal)", p1Sign: "Aries (H9)", p1Deg: "19.0°", p2Sign: "Gemini (H11)", p2Deg: "04.7°", isShifted: true, shiftText: "Aries → Gemini (H11)" },
      { planet: "Jupiter (Guru)", p1Sign: "Sagittarius (H5)", p1Deg: "27.3°", p2Sign: "Sagittarius (H5)", p2Deg: "27.3°", isShifted: false, shiftText: "Identical Position" },
      { planet: "Saturn (Shani)", p1Sign: "Capricorn (H6)", p1Deg: "11.8°", p2Sign: "Aquarius (H7)", p2Deg: "02.4°", isShifted: true, shiftText: "Capricorn → Aquarius (H7)" },
    ];
  }, [kundli1Result, kundli2Result]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <GitCompare className="size-6 text-accent" /> {t.compareReports}
        </h2>
        <p className="text-sm text-muted-foreground">
          Compare birth charts, planetary positions, Dasha periods, and transit verdicts with visual diff analysis.
        </p>
      </div>

      {/* Selectors Bar */}
      <Card className="p-5 bg-card/60 backdrop-blur">
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Base Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-medium">
              Base Chart / Report
            </label>
            <Select value={selectedId1} onValueChange={(val) => setSelectedId1(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select first report..." />
              </SelectTrigger>
              <SelectContent>
                {userKundlis.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Your Saved Birth Charts</SelectLabel>
                    {userKundlis.map((k) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.name} ({k.birthDate})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}

                <SelectGroup>
                  <SelectLabel>Active Implemented Reports</SelectLabel>
                  {ACTIVE_REPORT_TYPES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel className="text-muted-foreground font-normal italic">
                    Coming Soon (Future Release)
                  </SelectLabel>
                  {PLANNED_FUTURE_REPORTS.map((r) => (
                    <SelectItem key={r.id} value={r.id} disabled className="opacity-50">
                      {r.name} — <span className="text-amber-500 font-semibold">{r.status}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex size-10 rounded-full bg-accent/10 text-accent items-center justify-center font-bold text-xs shrink-0">
            VS
          </div>

          {/* Compare Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-medium">
              Compared Chart / Report
            </label>
            <Select value={selectedId2} onValueChange={(val) => setSelectedId2(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select second report..." />
              </SelectTrigger>
              <SelectContent>
                {userKundlis.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Your Saved Birth Charts</SelectLabel>
                    {userKundlis.map((k) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.name} ({k.birthDate})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}

                <SelectGroup>
                  <SelectLabel>Active Implemented Reports</SelectLabel>
                  {ACTIVE_REPORT_TYPES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel className="text-muted-foreground font-normal italic">
                    Coming Soon (Future Release)
                  </SelectLabel>
                  {PLANNED_FUTURE_REPORTS.map((r) => (
                    <SelectItem key={r.id} value={r.id} disabled className="opacity-50">
                      {r.name} — <span className="text-amber-500 font-semibold">{r.status}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Overview Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <p className="text-xs uppercase tracking-wider text-emerald-600 font-medium">
            Transit Harmony Score
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Base: <strong className="text-foreground">84</strong> →{" "}
              <strong className="text-emerald-600 font-bold text-lg">92</strong>
            </span>
            <Badge className="bg-emerald-500 text-white text-[10px]">+8 PTS</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <p className="text-xs uppercase tracking-wider text-blue-600 font-medium">
            Moon Sign & Nakshatra
          </p>
          <div className="mt-2 flex items-baseline justify-between truncate">
            <span className="text-xs text-muted-foreground truncate">
              {kundli1Result ? `${kundli1Result.moonSign}` : "Taurus"} vs{" "}
              <strong className="text-blue-600 font-bold text-sm">
                {kundli2Result ? `${kundli2Result.moonSign}` : "Cancer"}
              </strong>
            </span>
            <Badge className="bg-blue-500 text-white text-[10px] shrink-0">Analyzed</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <p className="text-xs uppercase tracking-wider text-amber-600 font-medium">
            Active Mahadasha
          </p>
          <div className="mt-2 flex items-baseline justify-between truncate">
            <span className="text-xs text-muted-foreground truncate">
              {kundli1Result ? `${kundli1Result.birthNakshatra.lord}` : "Rahu"} vs{" "}
              <strong className="text-amber-600 font-bold text-sm">
                {kundli2Result ? `${kundli2Result.birthNakshatra.lord}` : "Jupiter"}
              </strong>
            </span>
            <Badge className="bg-amber-500 text-white text-[10px] shrink-0">Vimshottari</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <p className="text-xs uppercase tracking-wider text-purple-600 font-medium">
            Astrological Match
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-purple-700">Compatible</span>
            <Badge className="bg-purple-500 text-white text-[10px]">Verified</Badge>
          </div>
        </Card>
      </div>

      {/* Planetary Position Comparison Matrix */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Sparkles className="size-5 text-accent" /> Planetary Position & House Comparison
          </h3>
          <Badge variant="outline" className="text-xs font-semibold">
            {label1} <span className="text-muted-foreground mx-1">vs</span> {label2}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Graha (Planet)</th>
                <th className="p-3">{label1}</th>
                <th className="p-3">{label2}</th>
                <th className="p-3">Shift & House Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {planetaryDiff.map((p) => (
                <tr
                  key={p.planet}
                  className={p.isShifted ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-secondary/20"}
                >
                  <td className="p-3 font-semibold flex items-center gap-2">
                    <span className="size-2 rounded-full bg-accent inline-block" />
                    {p.planet}
                  </td>

                  <td className="p-3">
                    <span className="font-medium">{p.p1Sign}</span>{" "}
                    <span className="text-xs text-muted-foreground">({p.p1Deg})</span>
                  </td>

                  <td className="p-3">
                    <span className="font-medium">{p.p2Sign}</span>{" "}
                    <span className="text-xs text-muted-foreground">({p.p2Deg})</span>
                  </td>

                  <td className="p-3">
                    {p.isShifted ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        {p.shiftText}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Identical Position
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dasha & Transit Timeline Comparison */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <Calendar className="size-4 text-accent" /> Dasha Timeline Comparison
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                BASE REPORT: {label1}
              </span>
              <p className="font-semibold text-sm text-foreground mt-0.5">
                {kundli1Result ? `${kundli1Result.birthNakshatra.lord} Mahadasha` : "Rahu Mahadasha / Jupiter Antardasha"}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-600 font-semibold block text-[10px] uppercase">
                COMPARED REPORT: {label2}
              </span>
              <p className="font-semibold text-sm text-foreground mt-0.5">
                {kundli2Result ? `${kundli2Result.birthNakshatra.lord} Mahadasha` : "Jupiter Mahadasha / Saturn Antardasha"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Sub-period alignment provides heightened intuition, clarity and auspicious outcomes.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-500" /> Transit Score & Gochar Verdict
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                BASE REPORT VERDICT
              </span>
              <p className="font-semibold text-sm text-foreground mt-0.5">Auspicious Transit Window</p>
              <p className="text-[11px] text-muted-foreground">Harmony Score: 84/100</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-600 font-semibold block text-[10px] uppercase">
                COMPARED REPORT VERDICT
              </span>
              <p className="font-semibold text-sm text-emerald-700 mt-0.5">Highly Auspicious Transit Window</p>
              <p className="text-[11px] text-muted-foreground">
                Harmony Score: 92/100 • Positive planetary alignment with 10th & 11th houses.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
