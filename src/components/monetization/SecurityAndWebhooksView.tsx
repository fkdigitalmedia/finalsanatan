import React from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Zap,
  Activity,
  CheckCircle,
  FileCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SecurityAndWebhooksView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-500" /> 24.16 Security, Webhooks & Anti-Abuse
        </h2>
        <p className="text-sm text-muted-foreground">
          Webhook signature verification, idempotency duplicate payment prevention, and encrypted secret storage.
        </p>
      </div>

      {/* Security Status Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">
              Webhook Signatures
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">HMAC SHA-256 Validated</p>
          <p className="text-xs text-muted-foreground mt-1">Razorpay & LemonSqueezy verified</p>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
              Duplicate Prevention
            </span>
            <KeyRound className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">Idempotency Active</p>
          <p className="text-xs text-muted-foreground mt-1">0 Duplicate Charges Logged</p>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold">
              Credit Abuse Limits
            </span>
            <Zap className="size-4 text-purple-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">Rate Limits Enforced</p>
          <p className="text-xs text-muted-foreground mt-1">Max 20 Kundli PDFs/day</p>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold">
              Secret Encryption
            </span>
            <ShieldCheck className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-lg font-bold text-foreground">AES-256-GCM Vault</p>
          <p className="text-xs text-muted-foreground mt-1">Server-only environment</p>
        </Card>
      </div>

      {/* Webhook Audit Log */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Activity className="size-5 text-accent" /> Recent Gateway Webhook Audit Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Gateway</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Event ID</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3">Received At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-secondary/20">
                <td className="p-3 font-semibold">Razorpay</td>
                <td className="p-3 text-xs font-mono">payment.authorized</td>
                <td className="p-3 text-xs text-muted-foreground">evt_rzp_123456789</td>
                <td className="p-3">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                    VERIFIED & PROCESSED
                  </Badge>
                </td>
                <td className="p-3 text-xs text-muted-foreground">Just now</td>
              </tr>
              <tr className="hover:bg-secondary/20">
                <td className="p-3 font-semibold">LemonSqueezy</td>
                <td className="p-3 text-xs font-mono">subscription_created</td>
                <td className="p-3 text-xs text-muted-foreground">evt_ls_987654321</td>
                <td className="p-3">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                    VERIFIED & PROCESSED
                  </Badge>
                </td>
                <td className="p-3 text-xs text-muted-foreground">15 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
