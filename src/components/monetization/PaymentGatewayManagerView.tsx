import React, { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Key, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { GatewayConfig } from "@/lib/monetization/monetization-types";
import { fetchGatewayConfigs, saveGatewayConfig } from "@/lib/monetization/monetization-api";

export function PaymentGatewayManagerView() {
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await fetchGatewayConfigs();
      setGateways(list);
      setLoading(false);
    }
    void load();
  }, []);

  const handleUpdate = async (gw: GatewayConfig) => {
    await saveGatewayConfig(gw);
    setGateways((prev) => prev.map((g) => (g.id === gw.id ? gw : g)));
    toast.success(`${gw.provider.toUpperCase()} settings saved!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <CreditCard className="size-6 text-accent" /> Payment Gateway Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure API credentials, test modes, and webhook secrets for Razorpay & LemonSqueezy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Razorpay Gateway Card */}
        {gateways.map((gw) => (
          <Card key={gw.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm uppercase">
                  {gw.provider.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg capitalize">{gw.provider}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {gw.testMode ? "Test / Sandbox Mode" : "Live Production"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Enabled</span>
                <Switch
                  checked={gw.enabled}
                  onCheckedChange={(checked) => handleUpdate({ ...gw, enabled: checked })}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  {gw.provider === "razorpay" ? "Key ID / App Key" : "Store ID"}
                </label>
                <Input
                  value={gw.keyId || gw.storeId || ""}
                  onChange={(e) =>
                    handleUpdate({
                      ...gw,
                      [gw.provider === "razorpay" ? "keyId" : "storeId"]: e.target.value,
                    })
                  }
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Key Secret / API Secret</label>
                <Input
                  type="password"
                  value={gw.keySecret || "••••••••••••••••"}
                  onChange={(e) => handleUpdate({ ...gw, keySecret: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Webhook Secret Signature</label>
                <Input
                  type="password"
                  value={gw.webhookSecret || "whsec_sanatan_998877"}
                  onChange={(e) => handleUpdate({ ...gw, webhookSecret: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sandbox Mode</span>
                  <Switch
                    checked={gw.testMode}
                    onCheckedChange={(checked) => handleUpdate({ ...gw, testMode: checked })}
                  />
                </div>
                <Button size="sm" onClick={() => handleUpdate(gw)} className="gap-1 text-xs">
                  <CheckCircle2 className="size-3.5" /> Save Configuration
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
