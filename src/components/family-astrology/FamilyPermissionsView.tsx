import React from "react";
import { ShieldCheck, Lock, Users, KeyRound, UserCheck, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExtendedFamilyMember } from "@/lib/family-astrology/family-types";

interface FamilyPermissionsViewProps {
  members: ExtendedFamilyMember[];
}

export function FamilyPermissionsView({ members }: FamilyPermissionsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-500" /> 24.13 & 24.15 Family Permissions & Security
        </h2>
        <p className="text-sm text-muted-foreground">
          Each member's Kundli remains isolated with Row Level Security (RLS) and permission-based sharing.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-emerald-500/5 border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">
              Row Level Security
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-xl font-bold">RLS Active</p>
          <p className="text-xs text-muted-foreground mt-1">
            Data isolated per user account.
          </p>
        </Card>

        <Card className="p-5 bg-purple-500/5 border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold">
              Birth Detail Encryption
            </span>
            <KeyRound className="size-4 text-purple-500" />
          </div>
          <p className="font-display text-xl font-bold">AES-256 Encrypted</p>
          <p className="text-xs text-muted-foreground mt-1">Coordinates & DOB protected.</p>
        </Card>

        <Card className="p-5 bg-blue-500/5 border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
              Access Governance
            </span>
            <UserCheck className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-xl font-bold">Role-Based Sharing</p>
          <p className="text-xs text-muted-foreground mt-1">Read-Only vs Editable controls.</p>
        </Card>
      </div>

      {/* Members Sharing Table */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4">Member Access & Sharing Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Member Name</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Privacy Status</th>
                <th className="p-3">Permissions</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/20">
                  <td className="p-3 font-semibold">{m.name}</td>
                  <td className="p-3 text-xs text-muted-foreground capitalize">{m.relationship}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      {m.permission.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {m.permission === "editable" ? "Full Edit & Share" : "View Only"}
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                      <Share2 className="size-3" /> Invite / Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
