import React, { useState } from "react";
import { GitCompare, Sparkles, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";
import { generateFamilyKundliComparison } from "@/lib/family-astrology/family-api";

interface CompareFamilyKundlisViewProps {
  members: ExtendedFamilyMember[];
}

export function CompareFamilyKundlisView({ members }: CompareFamilyKundlisViewProps) {
  const [m1Id, setM1Id] = useState<string>(members[0]?.id || "mem-self");
  const [m2Id, setM2Id] = useState<string>(members[1]?.id || "mem-spouse");

  const member1 = members.find((m) => m.id === m1Id) || members[0];
  const member2 = members.find((m) => m.id === m2Id) || members[1];

  const diff = generateFamilyKundliComparison(member1, member2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <GitCompare className="size-6 text-accent" /> 24.8 Compare Family Member Kundlis
        </h2>
        <p className="text-sm text-muted-foreground">
          Compare any two family members to discover matching Yogas, Doshas, common strengths & traits.
        </p>
      </div>

      {/* Selector Bar */}
      <Card className="p-5 bg-card/60">
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-semibold">
              First Family Member
            </label>
            <Select value={m1Id} onValueChange={(val) => setM1Id(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex size-10 rounded-full bg-accent/10 text-accent items-center justify-center font-bold">
            VS
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5 font-semibold">
              Second Family Member
            </label>
            <Select value={m2Id} onValueChange={(val) => setM2Id(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Comparison Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Matching Yogas */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2 text-accent">
            <Sparkles className="size-5" /> Matching Family Yogas
          </h3>
          <ul className="space-y-2 text-xs">
            {diff.matchingYogas.map((yoga, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/20 font-semibold">
                {yoga}
              </li>
            ))}
          </ul>
        </Card>

        {/* Common Strengths */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2 text-emerald-600">
            <CheckCircle className="size-5" /> Common Household Strengths
          </h3>
          <ul className="space-y-2 text-xs">
            {diff.commonStrengths.map((str, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 font-semibold">
                {str}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
