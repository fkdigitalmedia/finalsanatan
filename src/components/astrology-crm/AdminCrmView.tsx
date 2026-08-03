import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  IndianRupee,
  FileText,
  Download,
  Crown,
  Globe,
  Zap,
  PlusCircle,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { AdminCRMUser, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchAdminCRMUsers } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface AdminCrmViewProps {
  language: SupportedLanguage;
}

export function AdminCrmView({ language }: AdminCrmViewProps) {
  const t = getTranslation(language);
  const [users, setUsers] = useState<AdminCRMUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void fetchAdminCRMUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalRevenue = users.reduce((acc, u) => acc + u.revenueGenerated, 0);
  const totalReports = users.reduce((acc, u) => acc + u.totalReports, 0);
  const totalDownloads = users.reduce((acc, u) => acc + u.totalDownloads, 0);

  const handleGrantCredits = (userId: string) => {
    const amountStr = prompt("Enter credits amount to grant:", "10");
    const amount = parseInt(amountStr || "0");
    if (amount > 0) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, credits: u.credits + amount } : u)),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="size-6 text-accent" /> {t.adminPanel}
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage astrology client accounts, revenue, credits, report downloads, and popular remedy usage.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <IndianRupee className="size-4" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">From Pro & Premium Subscriptions</p>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Reports</span>
            <FileText className="size-4" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{totalReports}</p>
          <p className="text-xs text-muted-foreground mt-1">Generated across all clients</p>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">PDF Downloads</span>
            <Download className="size-4" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{totalDownloads}</p>
          <p className="text-xs text-muted-foreground mt-1">High-definition PDFs served</p>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Clients</span>
            <Crown className="size-4" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Registered CRM profiles</p>
        </Card>
      </div>

      {/* User Search & Management Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-display font-bold text-lg">Client CRM Directory</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or email..."
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">User Client</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Reports / Downloads</th>
                <th className="p-3">Language</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/20">
                  <td className="p-3">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>

                  <td className="p-3">
                    <Badge
                      className={
                        user.plan === "Premium"
                          ? "bg-purple-500 text-white text-[10px]"
                          : user.plan === "Pro"
                          ? "bg-accent text-white text-[10px]"
                          : "bg-secondary text-foreground text-[10px]"
                      }
                    >
                      {user.plan}
                    </Badge>
                  </td>

                  <td className="p-3 font-semibold text-accent">{user.credits}</td>

                  <td className="p-3 text-xs">
                    {user.totalReports} Rep / {user.totalDownloads} DL
                  </td>

                  <td className="p-3 text-xs font-mono">{user.preferredLanguage.toUpperCase()}</td>

                  <td className="p-3 font-semibold text-emerald-600">
                    ₹{user.revenueGenerated}
                  </td>

                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1 h-8"
                      onClick={() => handleGrantCredits(user.id)}
                    >
                      <PlusCircle className="size-3.5" /> + Credits
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
