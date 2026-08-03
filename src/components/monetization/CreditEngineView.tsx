import React from "react";
import {
  Zap,
  FileText,
  Sparkles,
  Bot,
  Calendar,
  Layers,
  CheckCircle,
  PlusCircle,
  HardDrive,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CREDIT_RULES } from "@/lib/monetization/monetization-api";

interface CreditEngineViewProps {
  creditBalance?: number;
  onTopUpClick?: () => void;
}

export function CreditEngineView({
  creditBalance = 45,
  onTopUpClick,
}: CreditEngineViewProps) {
  return (
    <div className="space-y-6">
      {/* Header & Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-background to-amber-500/10 border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Universal Credit Engine Balance
            </span>
            <h2 className="font-display text-3xl font-bold text-accent mt-1">
              {creditBalance} Available Credits
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Credits are consumed when generating premium Kundli PDFs, Matching Reports & AI forecasts.
            </p>
          </div>

          <Button size="lg" className="gap-2 shadow-md" onClick={onTopUpClick}>
            <PlusCircle className="size-5" /> Buy Credit Pack
          </Button>
        </div>
      </Card>

      {/* 24.3 Usage Limits Progress Bars */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
          24.3 Monthly Quota & Usage Limits
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 font-medium">
              <span>PDF Downloads</span>
              <span>14 / 50</span>
            </div>
            <Progress value={28} className="h-2" />
            <span className="text-[10px] text-muted-foreground mt-1 block">28% Consumed</span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 font-medium">
              <span>AI Chat Requests</span>
              <span>120 / 500</span>
            </div>
            <Progress value={24} className="h-2" />
            <span className="text-[10px] text-muted-foreground mt-1 block">24% Consumed</span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 font-medium">
              <span>Saved Birth Charts</span>
              <span>3 / 50</span>
            </div>
            <Progress value={6} className="h-2" />
            <span className="text-[10px] text-muted-foreground mt-1 block">6% Consumed</span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 font-medium">
              <span>Storage Allocated</span>
              <span>512 / 2048 MB</span>
            </div>
            <Progress value={25} className="h-2" />
            <span className="text-[10px] text-muted-foreground mt-1 block">25% Consumed</span>
          </Card>
        </div>
      </div>

      {/* 24.2 Credit Cost Breakdown Table */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="size-5 text-amber-500" /> Credit Cost Per Feature
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Feature Name</th>
                <th className="p-3">Cost (Credits)</th>
                <th className="p-3">Daily Limit</th>
                <th className="p-3">Monthly Limit</th>
                <th className="p-3">Unlimited In Plans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEFAULT_CREDIT_RULES.map((rule) => (
                <tr key={rule.featureKey} className="hover:bg-secondary/20">
                  <td className="p-3 font-semibold flex items-center gap-2">
                    <span className="size-2 rounded-full bg-accent inline-block" />
                    {rule.featureName}
                  </td>

                  <td className="p-3 font-bold text-amber-500">
                    {rule.creditsRequired} Credits
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    {rule.dailyLimit === -1 ? "Unlimited" : `${rule.dailyLimit} /day`}
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    {rule.monthlyLimit === -1 ? "Unlimited" : `${rule.monthlyLimit} /mo`}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {rule.unlimitedInPlans.map((p) => (
                        <Badge key={p} variant="outline" className="text-[10px] uppercase">
                          {p}
                        </Badge>
                      ))}
                    </div>
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
