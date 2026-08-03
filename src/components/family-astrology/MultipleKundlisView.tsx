import React, { useState } from "react";
import {
  Star,
  FileText,
  Zap,
  Sparkles,
  History,
  Download,
  Calendar,
  User,
  PlusCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";

interface MultipleKundlisViewProps {
  members: ExtendedFamilyMember[];
  onAddMemberClick: () => void;
}

export function MultipleKundlisView({ members, onAddMemberClick }: MultipleKundlisViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || "mem-self");
  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];

  return (
    <div className="space-y-6">
      {/* Header & Member Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Star className="size-6 text-accent" /> 24.3 Multiple Isolated Family Kundlis
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch between family member profiles to access separate birth charts, predictions, remedies & PDF versions.
          </p>
        </div>

        <Button onClick={onAddMemberClick} className="gap-2 shadow-sm">
          <PlusCircle className="size-4" /> Add Profile
        </Button>
      </div>

      {/* Profile Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {members.map((m) => {
          const isSelected = m.id === selectedMemberId;
          return (
            <Button
              key={m.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`rounded-xl gap-2 text-xs font-semibold ${
                isSelected ? "bg-accent text-accent-foreground shadow-sm" : ""
              }`}
              onClick={() => setSelectedMemberId(m.id)}
            >
              <img
                src={
                  m.photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt={m.name}
                className="size-5 rounded-full object-cover"
              />
              {m.name} ({m.relationship})
            </Button>
          );
        })}
      </div>

      {/* Selected Member Kundli Dashboard */}
      {selectedMember && (
        <div className="space-y-6">
          {/* Member Banner Card */}
          <Card className="p-6 bg-card/80 border-accent/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedMember.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={selectedMember.name}
                  className="size-16 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-2xl">{selectedMember.name}</h3>
                    <Badge variant="outline" className="text-xs uppercase font-semibold">
                      {selectedMember.relationship}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Born {selectedMember.dob} at {selectedMember.birthTime} in {selectedMember.birthPlace}
                  </p>
                </div>
              </div>

              <Button
                className="gap-1.5"
                onClick={() => alert(`Downloading Janam Kundli PDF for ${selectedMember.name}...`)}
              >
                <Download className="size-4" /> Download Kundli PDF
              </Button>
            </div>
          </Card>

          {/* Member Isolated Data Tabs Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-accent mb-3">
                <Sparkles className="size-5" />
                <h4 className="font-display font-bold text-base">Planetary Chart Specs</h4>
              </div>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Lagna Sign:</span>
                  <span className="font-semibold">{selectedMember.lagnaSign}</span>
                </li>
                <li className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Moon Rashi:</span>
                  <span className="font-semibold">{selectedMember.rashiSign}</span>
                </li>
                <li className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Nakshatra:</span>
                  <span className="font-semibold">{selectedMember.nakshatra}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Current Dasha:</span>
                  <span className="font-semibold text-accent">{selectedMember.currentMahadasha}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-purple-500 mb-3">
                <FileText className="size-5" />
                <h4 className="font-display font-bold text-base">Isolated Reports</h4>
              </div>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between border-b border-border pb-1">
                  <span>Life Janam Kundli 2026</span>
                  <Badge variant="outline" className="text-[9px]">v2.1 PDF</Badge>
                </li>
                <li className="flex justify-between border-b border-border pb-1">
                  <span>Career & Money Report</span>
                  <Badge variant="outline" className="text-[9px]">v1.8 PDF</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Annual Varshphal 2026</span>
                  <Badge variant="outline" className="text-[9px]">v1.5 PDF</Badge>
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-amber-500 mb-3">
                <Zap className="size-5" />
                <h4 className="font-display font-bold text-base">Personal Remedies</h4>
              </div>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between border-b border-border pb-1">
                  <span>Mahamrityunjaya Mantra</span>
                  <Badge className="bg-emerald-500 text-white text-[9px]">Active</Badge>
                </li>
                <li className="flex justify-between border-b border-border pb-1">
                  <span>Yellow Sapphire Wear</span>
                  <Badge variant="secondary" className="text-[9px]">Pending</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Tuesday Fasting (Vrat)</span>
                  <Badge className="bg-emerald-500 text-white text-[9px]">Active</Badge>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
