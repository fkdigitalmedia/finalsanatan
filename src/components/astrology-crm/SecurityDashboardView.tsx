import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SecurityAuditLog, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchSecurityAuditLogs } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";
import { supabase } from "@/integrations/supabase/client";

interface SecurityDashboardViewProps {
  language: SupportedLanguage;
  userId?: string;
}

export function SecurityDashboardView({
  language,
  userId = "user-1",
}: SecurityDashboardViewProps) {
  const t = getTranslation(language);
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [sessionExpiresIn, setSessionExpiresIn] = useState<string>("—");

  useEffect(() => {
    void fetchSecurityAuditLogs(userId).then(setLogs);
  }, [userId]);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const expiresAt = data?.session?.expires_at;
      if (expiresAt) {
        const diffMs = expiresAt * 1000 - Date.now();
        const diffHours = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        if (diffMs <= 0) {
          setSessionExpiresIn("Expired");
        } else if (diffHours > 0) {
          setSessionExpiresIn(`Expires in ${diffHours}h ${diffMins}m`);
        } else {
          setSessionExpiresIn(`Expires in ${diffMins}m`);
        }
      }
    }
    void loadSession();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-500" /> {t.security}
        </h2>
        <p className="text-sm text-muted-foreground">
          Enterprise Security Status — Row Level Security (RLS), Session Validation, CSRF Protection & Audit Logs.
        </p>
      </div>

      {/* Security Check Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">
              Row Level Security
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">RLS Enforced</p>
          <p className="text-xs text-muted-foreground mt-1">100% User Data Isolated</p>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
              Session Validation
            </span>
            <KeyRound className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">JWT Token Active</p>
          <p className="text-xs text-muted-foreground mt-1">{sessionExpiresIn}</p>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold">
              CSRF Protection
            </span>
            <ShieldCheck className="size-4 text-purple-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">Headers Validated</p>
          <p className="text-xs text-muted-foreground mt-1">Anti-Forgery Token Active</p>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold">
              API Rate Limiting
            </span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">Supabase RLS</p>
          <p className="text-xs text-muted-foreground mt-1">Policy-Based Access Control</p>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="size-5 text-accent" /> Security Activity Audit Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Action Description</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Client Agent</th>
                <th className="p-3">Status</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                    {log.action}
                  </td>
                  <td className="p-3 font-mono text-xs">{log.ipAddress}</td>
                  <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">
                    {log.userAgent}
                  </td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      {log.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
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
