import React, { useState } from "react";
import {
  Users,
  PlusCircle,
  Sparkles,
  Heart,
  Crown,
  Info,
  Calendar,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExtendedFamilyMember, FamilyRelationship } from "@/lib/family-astrology/family-types";
import { FAMILY_RELATIONSHIP_LABELS } from "@/lib/family-astrology/family-types";

interface FamilyTreeViewProps {
  members: ExtendedFamilyMember[];
  onAddMemberClick: () => void;
}

export function FamilyTreeView({ members, onAddMemberClick }: FamilyTreeViewProps) {
  const [selectedMember, setSelectedMember] = useState<ExtendedFamilyMember | null>(null);

  const parents = members.filter(
    (m) => m.relationship === "father" || m.relationship === "mother",
  );
  const selfAndSpouse = members.filter(
    (m) => m.relationship === "self" || m.relationship === "spouse",
  );
  const children = members.filter(
    (m) =>
      m.relationship === "son" ||
      m.relationship === "daughter" ||
      m.relationship === "grandson" ||
      m.relationship === "granddaughter",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Users className="size-6 text-accent" /> 24.2 Generational Family Tree
          </h2>
          <p className="text-sm text-muted-foreground">
            Visual tree structure connecting Parents, Self, Spouse, Children & Grandparents with birth chart details.
          </p>
        </div>

        <Button onClick={onAddMemberClick} className="gap-2 shadow-sm">
          <PlusCircle className="size-4" /> Add Member
        </Button>
      </div>

      {/* Graphical Tree Container */}
      <Card className="p-6 md:p-8 bg-card/80 overflow-x-auto">
        <div className="min-w-[600px] space-y-12 text-center">
          {/* Generation 1: Parents */}
          {parents.length > 0 && (
            <div>
              <Badge variant="outline" className="mb-4 text-xs font-semibold uppercase tracking-widest">
                Generation 1 • Parents
              </Badge>
              <div className="flex items-center justify-center gap-8">
                {parents.map((parent) => (
                  <MemberTreeNodeCard
                    key={parent.id}
                    member={parent}
                    onClick={() => setSelectedMember(parent)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Connector Line */}
          <div className="w-0.5 h-6 bg-border mx-auto -my-6" />

          {/* Generation 2: Self & Spouse */}
          <div>
            <Badge variant="outline" className="mb-4 text-xs font-semibold uppercase tracking-widest">
              Generation 2 • Primary Couple
            </Badge>
            <div className="flex items-center justify-center gap-8">
              {selfAndSpouse.map((member) => (
                <MemberTreeNodeCard
                  key={member.id}
                  member={member}
                  onClick={() => setSelectedMember(member)}
                />
              ))}
            </div>
          </div>

          {/* Connector Line */}
          {children.length > 0 && <div className="w-0.5 h-6 bg-border mx-auto -my-6" />}

          {/* Generation 3: Children */}
          {children.length > 0 && (
            <div>
              <Badge variant="outline" className="mb-4 text-xs font-semibold uppercase tracking-widest">
                Generation 3 • Children
              </Badge>
              <div className="flex items-center justify-center gap-8">
                {children.map((child) => (
                  <MemberTreeNodeCard
                    key={child.id}
                    member={child}
                    onClick={() => setSelectedMember(child)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Member Details Popover Modal */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-3">
                <img
                  src={
                    selectedMember.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={selectedMember.name}
                  className="size-10 rounded-full object-cover border border-accent"
                />
                <div>
                  <p>{selectedMember.name}</p>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {FAMILY_RELATIONSHIP_LABELS[selectedMember.relationship]}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-sm">
              <div className="p-3 rounded-lg bg-secondary/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-accent" />
                  <span>
                    DOB: <strong>{selectedMember.dob}</strong> at {selectedMember.birthTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-accent" />
                  <span>Place: <strong>{selectedMember.birthPlace}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="size-3.5 text-accent" />
                  <span>
                    Lagna: <strong>{selectedMember.lagnaSign}</strong> • Rashi:{" "}
                    <strong>{selectedMember.rashiSign}</strong>
                  </span>
                </div>
              </div>

              {selectedMember.notes && (
                <p className="text-xs italic text-muted-foreground bg-secondary/30 p-2.5 rounded border border-border">
                  "{selectedMember.notes}"
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function MemberTreeNodeCard({
  member,
  onClick,
}: {
  member: ExtendedFamilyMember;
  onClick: () => void;
}) {
  return (
    <Card
      className="p-4 w-48 text-center cursor-pointer transition-all hover:border-accent hover:shadow-md hover:scale-105 bg-card"
      onClick={onClick}
    >
      <img
        src={
          member.photoUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        }
        alt={member.name}
        className="size-16 rounded-full object-cover border-2 border-accent mx-auto mb-2"
      />
      <h4 className="font-display font-semibold text-sm truncate">{member.name}</h4>
      <Badge variant="secondary" className="text-[10px] uppercase mt-1">
        {FAMILY_RELATIONSHIP_LABELS[member.relationship]}
      </Badge>
      <p className="text-[11px] text-muted-foreground mt-1.5">{member.dob}</p>
    </Card>
  );
}
