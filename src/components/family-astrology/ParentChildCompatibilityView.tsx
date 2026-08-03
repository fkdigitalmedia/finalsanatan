import React, { useState } from "react";
import {
  Heart,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";
import { analyzeParentChildCompatibility } from "@/lib/family-astrology/family-api";

interface ParentChildCompatibilityViewProps {
  members: ExtendedFamilyMember[];
}

export function ParentChildCompatibilityView({ members }: ParentChildCompatibilityViewProps) {
  const parents = members.filter(
    (m) => m.relationship === "father" || m.relationship === "mother" || m.relationship === "self",
  );
  const children = members.filter(
    (m) =>
      m.relationship === "son" ||
      m.relationship === "daughter" ||
      m.relationship === "grandson" ||
      m.relationship === "granddaughter",
  );

  const [parentId, setParentId] = useState<string>(parents[0]?.id || "mem-self");
  const [childId, setChildId] = useState<string>(children[0]?.id || "mem-son");

  const parent = members.find((m) => m.id === parentId) || parents[0] || members[0];
  const child = members.find((m) => m.id === childId) || children[0] || members[1];

  const comp = analyzeParentChildCompatibility(parent, child);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Heart className="size-6 text-rose-500" /> 24.4 Parent–Child Astrological Compatibility
        </h2>
        <p className="text-sm text-muted-foreground">
          Analyze emotional harmony, communication channels, education support, discipline, and health tendencies.
        </p>
      </div>

      {/* Selectors Bar */}
      <Card className="p-5 bg-card/60">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-semibold">
              Select Parent Profile
            </label>
            <Select value={parentId} onValueChange={(val) => setParentId(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parents.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-semibold">
              Select Child Profile
            </label>
            <Select value={childId} onValueChange={(val) => setChildId(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {children.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Overall Score & Verdict Banner */}
      <Card className="p-6 bg-gradient-to-r from-rose-500/10 via-background to-accent/10 border-rose-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-rose-500 text-white font-semibold mb-2">
              {comp.overallScore}% Harmony Score
            </Badge>
            <h3 className="font-display font-bold text-2xl text-foreground">
              {comp.parentName} & {comp.childName} Bond Analysis
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Verdict: <strong className="text-foreground">{comp.planetaryHarmonyVerdict}</strong>
            </p>
          </div>
          <Button
            className="gap-1.5 shadow-sm"
            onClick={() => alert(`Downloading Parent-Child Compatibility PDF Report...`)}
          >
            Download Parent-Child PDF
          </Button>
        </div>
      </Card>

      {/* Detailed Metric Gauges */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Emotional Bonding</span>
            <span className="text-rose-500">{comp.emotionalCompatibility}%</span>
          </div>
          <Progress value={comp.emotionalCompatibility} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Communication Harmony</span>
            <span className="text-blue-500">{comp.communication}%</span>
          </div>
          <Progress value={comp.communication} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Academic & Education Support</span>
            <span className="text-purple-500">{comp.educationSupport}%</span>
          </div>
          <Progress value={comp.educationSupport} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Discipline Alignment</span>
            <span className="text-amber-500">{comp.disciplineApproach}%</span>
          </div>
          <Progress value={comp.disciplineApproach} className="h-2" />
        </Card>
      </div>

      {/* Strengths, Challenges & Suggestions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h4 className="font-display font-bold text-base mb-3 text-emerald-600 flex items-center gap-2">
            <CheckCircle className="size-4" /> Shared Astrological Strengths
          </h4>
          <ul className="space-y-2 text-xs">
            {comp.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h4 className="font-display font-bold text-base mb-3 text-amber-600 flex items-center gap-2">
            <AlertTriangle className="size-4" /> Potential Friction Points
          </h4>
          <ul className="space-y-2 text-xs">
            {comp.challenges.map((ch, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h4 className="font-display font-bold text-base mb-3 text-purple-600 flex items-center gap-2">
            <Lightbulb className="size-4" /> Actionable Suggestions
          </h4>
          <ul className="space-y-2 text-xs">
            {comp.actionableSuggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
