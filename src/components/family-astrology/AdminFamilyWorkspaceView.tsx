import React from "react";
import { Users, FileText, Heart, HardDrive, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminFamilyWorkspaceView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="size-6 text-accent" /> 24.14 Admin Family Workspace Control
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage family accounts, combined PDF reports, compatibility processing requests, and storage hierarchy.
        </p>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Total Family Accounts
          </span>
          <p className="font-display text-2xl font-bold mt-2">1,240</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Combined Reports Built
          </span>
          <p className="font-display text-2xl font-bold text-accent mt-2">4,820</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Compatibility Checks
          </span>
          <p className="font-display text-2xl font-bold text-purple-600 mt-2">8,950</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Family Storage Used
          </span>
          <p className="font-display text-2xl font-bold text-emerald-600 mt-2">1.8 GB</p>
        </Card>
      </div>
    </div>
  );
}
