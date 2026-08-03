import React, { useState, useEffect } from "react";
import {
  Wallet,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  PlusCircle,
  History,
  Gift,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreditTransaction, UserWallet } from "@/lib/monetization/monetization-types";
import { fetchCreditTransactions, fetchUserWallet } from "@/lib/monetization/monetization-api";

interface UserWalletViewProps {
  userId?: string;
  onTopUpClick?: () => void;
}

export function UserWalletView({ userId = "user-1", onTopUpClick }: UserWalletViewProps) {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    void fetchUserWallet(userId).then(setWallet);
    void fetchCreditTransactions(userId).then(setTransactions);
  }, [userId]);

  if (!wallet) return <div className="p-8 text-center text-sm text-muted-foreground">Loading wallet...</div>;

  return (
    <div className="space-y-6">
      {/* Header & Main Balance */}
      <Card className="p-6 bg-gradient-to-r from-amber-500/10 via-background to-purple-500/10 border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Wallet className="size-8" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                User Credit Wallet Balance
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground">
                {wallet.creditBalance} Credits
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated {new Date(wallet.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <Button size="lg" className="gap-2 shadow-md" onClick={onTopUpClick}>
            <PlusCircle className="size-5" /> Buy Credit Pack
          </Button>
        </div>
      </Card>

      {/* Credit Categories Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Purchased Credits
          </span>
          <p className="font-display text-xl font-bold text-foreground">{wallet.purchasedCredits}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Referral Credits
          </span>
          <p className="font-display text-xl font-bold text-purple-600">+{wallet.referralCredits}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Bonus Credits
          </span>
          <p className="font-display text-xl font-bold text-emerald-600">+{wallet.bonusCredits}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Expired Credits
          </span>
          <p className="font-display text-xl font-bold text-muted-foreground">
            {wallet.expiredCredits}
          </p>
        </Card>
      </div>

      {/* Credit Transaction History */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <History className="size-5 text-accent" /> Transaction Audit Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Balance After</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/20">
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {tx.type.replace("_", " ")}
                    </Badge>
                  </td>

                  <td className="p-3 font-medium text-foreground">{tx.description}</td>

                  <td className="p-3 font-bold">
                    {tx.amount > 0 ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <ArrowUpRight className="size-4" /> +{tx.amount}
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <ArrowDownRight className="size-4" /> {tx.amount}
                      </span>
                    )}
                  </td>

                  <td className="p-3 font-semibold text-accent">{tx.balanceAfter}</td>

                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString()}
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
