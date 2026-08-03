import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CreditAuditLogItem } from "@/lib/admin-credits/admin-credits-types";
import { fetchCreditAuditLogs } from "@/lib/admin-credits/admin-credits-api";

export function CreditLogsAuditView() {
  const [logs, setLogs] = useState<CreditAuditLogItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchCreditAuditLogs().then(setLogs);
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Activity className="size-6 text-accent" /> 24.7 & 24.13 Credit Audit Logs & Security
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete immutable transaction audit stream tracking every credit addition, removal, AI/PDF usage, and actor.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs by user or reason..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">User</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Delta</th>
                <th className="p-3">Balance After</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Reason / Details</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => {
                const isPositive = log.delta >= 0;
                return (
                  <tr key={log.id} className="hover:bg-secondary/20">
                    <td className="p-3 font-semibold">{log.userName}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {log.actionType.replace("_", " ")}
                      </Badge>
                    </td>

                    <td className="p-3 font-mono font-bold">
                      <span
                        className={
                          isPositive
                            ? "text-emerald-600 flex items-center gap-0.5"
                            : "text-rose-500 flex items-center gap-0.5"
                        }
                      >
                        {isPositive ? (
                          <ArrowUpRight className="size-3.5" />
                        ) : (
                          <ArrowDownRight className="size-3.5" />
                        )}
                        {isPositive ? `+${log.delta}` : log.delta} Cr
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-xs">{log.balanceAfter} Cr</td>

                    <td className="p-3 text-xs text-muted-foreground">
                      <Badge className="bg-secondary text-foreground text-[10px]">
                        {log.actorName} ({log.actor})
                      </Badge>
                    </td>

                    <td className="p-3 text-xs">{log.reason}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
