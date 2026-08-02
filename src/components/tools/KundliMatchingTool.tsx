// Reusable Kundli Matching (Guna Milan) tool component.
// Used by both /kundli-matching and /tools/kundli-matching routes.
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { computeMatching, type MatchingResult } from "@/lib/kundli/matching";

interface PersonForm {
  name: string;
  date: string;
  time: string;
  loc: LatLon;
}
const emptyPerson = (): PersonForm => ({
  name: "",
  date: "",
  time: "12:00",
  loc: { ...DEFAULT_LOCATION },
});

export function KundliMatchingTool({ softLanguage = false }: { softLanguage?: boolean } = {}) {
  const [boy, setBoy] = useState<PersonForm>(emptyPerson());
  const [girl, setGirl] = useState<PersonForm>(emptyPerson());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchingResult | null>(null);

  const handleGenerate = () => {
    if (!boy.date || !boy.time || !girl.date || !girl.time) {
      toast.error("Please fill both partners' date & time of birth.");
      return;
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      try {
        const r = computeMatching(
          {
            date: boy.date,
            time: boy.time,
            place: boy.loc.label,
            latitude: boy.loc.lat,
            longitude: boy.loc.lon,
            timezone: boy.loc.tz,
            gender: "male",
          },
          {
            date: girl.date,
            time: girl.time,
            place: girl.loc.label,
            latitude: girl.loc.lat,
            longitude: girl.loc.lon,
            timezone: girl.loc.tz,
            gender: "female",
          },
        );
        r.boy.name = boy.name || (softLanguage ? "Partner 1" : "Boy");
        r.girl.name = girl.name || (softLanguage ? "Partner 2" : "Girl");
        setResult(r);
        setTimeout(
          () => document.getElementById("match-result")?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong. Please verify inputs.");
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const p1Label = softLanguage ? "Partner 1" : "Boy's Details";
  const p2Label = softLanguage ? "Partner 2" : "Girl's Details";

  return (
    <>
      <section className="rounded-2xl bg-gradient-to-br from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-500/20 p-8 md:p-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 px-3 py-1 text-xs font-semibold mb-3">
          <Heart className="size-3.5" /> Ashtakoot — 36 Guna Milan
        </div>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Traditional Vedic compatibility across 8 kootas — Varna, Vashya, Tara, Yoni, Graha Maitri,
          Gana, Bhakoot and Nadi. Includes Mangal Dosha analysis.
        </p>
      </section>

      <section className="mt-8 grid md:grid-cols-2 gap-6">
        <PersonCard
          title={p1Label}
          gradient="from-blue-500/10 to-cyan-500/10 border-blue-500/20"
          person={boy}
          setPerson={setBoy}
        />
        <PersonCard
          title={p2Label}
          gradient="from-pink-500/10 to-rose-500/10 border-pink-500/20"
          person={girl}
          setPerson={setGirl}
        />
      </section>

      <div className="mt-6 text-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={loading}
          className="min-w-[240px] bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" /> Matching...
            </>
          ) : (
            <>
              <Sparkles className="size-4 mr-2" /> Match Charts — Free
            </>
          )}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">100% free · No signup · Nothing stored</p>
      </div>

      {loading && (
        <div className="mt-10">
          <SanatanLoader
            title="Matching Charts"
            subtitle="Reading both birth charts and computing Ashtakoot compatibility..."
          />
        </div>
      )}
      {result && <ResultView result={result} softLanguage={softLanguage} />}

      <section className="mt-16 grid md:grid-cols-3 gap-4">
        {KOOTA_INFO.map((k) => (
          <Card key={k.name} className="p-5">
            <div className="font-semibold flex items-center gap-2">
              <Badge variant="secondary">{k.max}</Badge> {k.name}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{k.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Want a full Vedic chart?{" "}
          <Link to="/kundli" className="text-primary underline underline-offset-4">
            Generate Free Janam Kundli →
          </Link>
        </p>
      </section>
    </>
  );
}

function PersonCard({
  title,
  gradient,
  person,
  setPerson,
}: {
  title: string;
  gradient: string;
  person: PersonForm;
  setPerson: (p: PersonForm) => void;
}) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient}`}>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Users className="size-4" /> {title}
      </h3>
      <div className="space-y-3">
        <div>
          <Label>Full Name (optional)</Label>
          <Input
            value={person.name}
            onChange={(e) => setPerson({ ...person, name: e.target.value })}
            placeholder="e.g. Rahul Sharma"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={person.date}
              onChange={(e) => setPerson({ ...person, date: e.target.value })}
            />
          </div>
          <div>
            <Label>Time of Birth</Label>
            <Input
              type="time"
              value={person.time}
              onChange={(e) => setPerson({ ...person, time: e.target.value })}
            />
          </div>
        </div>
        <PhotonPlacePicker value={person.loc} onChange={(loc) => setPerson({ ...person, loc })} />
      </div>
    </Card>
  );
}

function ResultView({ result, softLanguage }: { result: MatchingResult; softLanguage: boolean }) {
  const pct = Math.round((result.totalScore / 36) * 100);
  const color =
    result.verdict === "excellent"
      ? "text-emerald-600"
      : result.verdict === "very_good"
        ? "text-green-600"
        : result.verdict === "good"
          ? "text-blue-600"
          : result.verdict === "average"
            ? "text-amber-600"
            : "text-red-600";
  return (
    <section id="match-result" className="mt-12 space-y-8">
      <Card className="p-8 text-center bg-gradient-to-br from-primary/5 via-orange-500/5 to-rose-500/5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Total Guna Score
        </div>
        <div className="mt-2 text-6xl md:text-7xl font-black">
          {result.totalScore}
          <span className="text-3xl text-muted-foreground"> / 36</span>
        </div>
        <div className={`mt-2 text-xl font-bold ${color}`}>
          {result.verdictLabel} · {pct}%
        </div>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">{result.summary}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm">
          <div className="rounded-lg bg-background/60 border p-3">
            <div className="text-xs text-muted-foreground">
              {softLanguage ? "Partner 1" : "Boy"}
            </div>
            <div className="font-semibold">{result.boy.name}</div>
            <div className="text-xs mt-1">
              {result.boy.moonRashi} · {result.boy.nakshatra}
            </div>
          </div>
          <div className="rounded-lg bg-background/60 border p-3">
            <div className="text-xs text-muted-foreground">
              {softLanguage ? "Partner 2" : "Girl"}
            </div>
            <div className="font-semibold">{result.girl.name}</div>
            <div className="text-xs mt-1">
              {result.girl.moonRashi} · {result.girl.nakshatra}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Ashtakoot Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Koota</th>
                <th className="py-2 text-center">Score</th>
                <th className="py-2 text-center">Max</th>
                <th className="py-2">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => {
                const good = k.score === k.max;
                const bad = k.score === 0;
                return (
                  <tr key={k.key} className="border-b last:border-0">
                    <td className="py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        {good ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : bad ? (
                          <XCircle className="size-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="size-4 text-amber-500" />
                        )}
                        {k.label}
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono font-bold">{k.score}</td>
                    <td className="py-3 text-center text-muted-foreground">{k.max}</td>
                    <td className="py-3 text-muted-foreground">{k.note}</td>
                  </tr>
                );
              })}
              <tr className="bg-muted/40 font-bold">
                <td className="py-3">Total</td>
                <td className="py-3 text-center">{result.totalScore}</td>
                <td className="py-3 text-center">36</td>
                <td className="py-3">{result.verdictLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <DoshaCard
          title="Mangal Dosha"
          ok={
            (!result.doshas.manglik.boy && !result.doshas.manglik.girl) ||
            result.doshas.manglik.cancelled
          }
          note={result.doshas.manglik.note}
        />
        <DoshaCard
          title="Nadi Dosha"
          ok={!result.doshas.nadi}
          note={
            result.doshas.nadi
              ? "Same Nadi — traditionally considered a major dosha affecting progeny & health."
              : "No Nadi Dosha — excellent."
          }
        />
        <DoshaCard
          title="Bhakoot Dosha"
          ok={!result.doshas.bhakoot}
          note={
            result.doshas.bhakoot
              ? "Rashi placement forms a dosha (2/12, 5/9 or 6/8). Consider expert consultation."
              : "No Bhakoot Dosha — good."
          }
        />
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
        <strong>Disclaimer:</strong> Guna Milan is one traditional Vedic tool for compatibility.
        Always consult a qualified astrologer for major life decisions.
      </p>
    </section>
  );
}

function DoshaCard({ title, ok, note }: { title: string; ok: boolean; note: string }) {
  return (
    <Card
      className={`p-5 border ${ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {ok ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <AlertTriangle className="size-4 text-amber-500" />
        )}
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </Card>
  );
}

const KOOTA_INFO = [
  {
    name: "Varna",
    max: 1,
    desc: "Spiritual & ego compatibility based on Moon sign varna hierarchy.",
  },
  { name: "Vashya", max: 2, desc: "Mutual attraction and influence between partners." },
  { name: "Tara", max: 3, desc: "Health and destiny compatibility from birth nakshatras." },
  { name: "Yoni", max: 4, desc: "Physical & biological compatibility based on 14 yoni animals." },
  { name: "Graha Maitri", max: 5, desc: "Mental & intellectual harmony via Moon-sign lords." },
  { name: "Gana", max: 6, desc: "Behavioural temperament: Deva, Manushya, Rakshasa." },
  { name: "Bhakoot", max: 7, desc: "Family life, prosperity and progeny — rashi distance." },
  { name: "Nadi", max: 8, desc: "Progeny, health, genetic compatibility — Adi, Madhya, Antya." },
];
