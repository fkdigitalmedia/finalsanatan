import React, { useState } from "react";
import {
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle,
  Globe,
  Settings,
  Percent,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { GatewayConfig } from "@/lib/monetization/monetization-types";

const INITIAL_GATEWAYS: GatewayConfig[] = [
  {
    id: "gw-rzp",
    provider: "razorpay",
    displayName: "Razorpay (India & UPI)",
    mode: "production",
    enabled: true,
    isDefault: true,
    keyId: "rzp_live_9876543210",
    keySecret: "••••••••••••••••",
    webhookSecret: "whsec_rzp_mock123",
    currencyMapping: { INR: "INR" },
    taxPercentage: 18,
  },
  {
    id: "gw-ls",
    provider: "lemonsqueezy",
    displayName: "LemonSqueezy (Global & USD)",
    mode: "production",
    enabled: true,
    isDefault: false,
    apiKey: "ls_live_mockkey999",
    webhookSecret: "whsec_ls_mock456",
    currencyMapping: { USD: "USD", EUR: "EUR" },
    taxPercentage: 0,
  },
  {
    id: "gw-stripe",
    provider: "stripe",
    displayName: "Stripe (Future Ready)",
    mode: "sandbox",
    enabled: false,
    isDefault: false,
    currencyMapping: { USD: "USD" },
    taxPercentage: 18,
  },
  {
    id: "gw-paypal",
    provider: "paypal",
    displayName: "PayPal Express",
    mode: "sandbox",
    enabled: false,
    isDefault: false,
    currencyMapping: { USD: "USD" },
    taxPercentage: 0,
  },
];

export function PaymentGatewayManagerView() {
  const [gateways, setGateways] = useState<GatewayConfig[]>(INITIAL_GATEWAYS);

  const handleToggle = (id: string, field: "enabled" | "mode") => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          if (field === "enabled") return { ...g, enabled: !g.enabled };
          if (field === "mode")
            return { ...g, mode: g.mode === "production" ? "sandbox" : "production" };
        }
        return g;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <CreditCard className="size-6 text-accent" /> 24.4 - 24.6 Payment Gateway Manager
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure Razorpay (UPI, Cards, Net Banking) & LemonSqueezy (Global USD checkouts, subscriptions & webhooks).
        </p>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {gateways.map((gw) => (
          <Card key={gw.id} className="p-6 space-y-4 border-border hover:border-accent/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                  {gw.provider.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{gw.displayName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      className={
                        gw.mode === "production"
                          ? "bg-emerald-500 text-white text-[10px]"
                          : "bg-amber-500 text-white text-[10px]"
                      }
                    >
                      {gw.mode.toUpperCase()}
                    </Badge>
                    {gw.isDefault && (
                      <Badge variant="outline" className="text-[10px] text-accent border-accent">
                        DEFAULT
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Switch
                checked={gw.enabled}
                onCheckedChange={() => handleToggle(gw.id, "enabled")}
              />
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-2 border-t border-border text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  {gw.provider === "razorpay" ? "Key ID" : "API Key / License"}
                </label>
                <Input
                  className="h-8 text-xs font-mono"
                  value={gw.keyId || gw.apiKey || "Not Configured"}
                  onChange={() => {}}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Webhook Secret</label>
                <Input
                  className="h-8 text-xs font-mono"
                  value={gw.webhookSecret || "whsec_••••••••••••"}
                  onChange={() => {}}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-medium text-muted-foreground">GST Tax Rate:</span>
                <span className="font-bold">{gw.taxPercentage}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Mode Toggle:</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => handleToggle(gw.id, "mode")}
                >
                  Switch to {gw.mode === "production" ? "Sandbox" : "Production"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
