import React, { useState, useEffect } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  Award,
  Zap,
  IndianRupee,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ReferralAccount } from "@/lib/monetization/monetization-types";
import { fetchUserReferral } from "@/lib/monetization/monetization-api";

interface ReferralSystemViewProps {
  userId?: string;
}

export function ReferralSystemView({ userId = "user-1" }: ReferralSystemViewProps) {
  const [referral, setReferral] = useState<ReferralAccount | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void fetchUserReferral(userId).then(setReferral);
  }, [userId]);

  if (!referral) return <div className="p-8 text-center text-sm text-muted-foreground">Loading referral program...</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(referral.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Gift className="size-6 text-purple-500" /> 24.8 Referral System & Rewards
        </h2>
        <p className="text-sm text-muted-foreground">
          Invite friends to SanatanTools. Earn 25 credits & cash rewards for every successful signup.
        </p>
      </div>

      {/* Referral Link & Code Box */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-background to-accent/10 border-purple-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 w-full">
            <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold">
              Your Unique Referral Link
            </span>

            <div className="flex items-center gap-2">
              <Input value={referral.referralLink} readOnly className="font-mono text-sm h-11 bg-card" />
              <Button onClick={handleCopy} className="gap-1.5 h-11 px-5 shadow-sm">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Referral Code: <strong className="text-foreground font-mono">{referral.referralCode}</strong>
            </p>
          </div>
        </div>
      </Card>

      {/* Metrics Counter */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider">Friends Invited</span>
            <Users className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-2xl font-bold">{referral.totalInvitedCount}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider">Successful Signups</span>
            <Award className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-2xl font-bold">{referral.successfulReferralsCount}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider">Credits Earned</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-500">
            +{referral.totalCreditsEarned}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider">Cash Rewards</span>
            <IndianRupee className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-2xl font-bold text-emerald-600">
            ₹{(referral.totalCashRewardsEarnedCents / 100).toLocaleString()}
          </p>
        </Card>
      </div>
    </div>
  );
}
