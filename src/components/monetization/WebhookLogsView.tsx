import React, { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WebhookLog } from "@/lib/monetization/monetization-types";
import { fetchWebhookLogs, logWebhookEvent } from "@/lib/monetization/monetization-api";
import { toast } from "sonner";

export function WebhookLogsView() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const list = await fetchWebhookLogs();
    setLogs(list);
    setLoading(false);
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  const handleSimulateWebhook = async (provider: "razorpay" | "lemonsqueezy") => {
    await logWebhookEvent({
      provider,
      event: provider === "razorpay" ? "payment.captured" : "subscription_updated",
      status: "success",
      signatureVerified: true,
      payloadSummary: `Test payload simulated for ${provider.toUpperCase()} signature validation`,
    });
    toast.success(`Simulated webhook test event logged for ${provider.toUpperCase()}`);
    void loadLogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Terminal className="size-6 text-accent" /> Payment Webhook Logs & Security
          </h2>
          <p className="text-sm text-muted-foreground">
            Audit payment event signatures, webhook payload status, and verification security.
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleSimulateWebhook("razorpay")} className="text-xs">
            Test Razorpay Webhook
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleSimulateWebhook("lemonsqueezy")} className="text-xs">
            Test LemonSqueezy Webhook
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">HMAC Signature</th>
                <th className="p-4">Payload Summary</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 text-xs font-mono text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 uppercase font-bold text-xs">{log.provider}</td>
                  <td className="p-4 font-mono text-xs text-accent">{log.event}</td>
                  <td className="p-4">
                    {log.signatureVerified ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        <ShieldCheck className="size-3 mr-1" /> VERIFIED
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        UNVERIFIED
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                    {log.payloadSummary}
                  </td>
                  <td className="p-4">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      <CheckCircle className="size-3 mr-1" /> {log.status}
                    </Badge>
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
