import React, { useEffect, useState } from "react";
import { Users, Search, Zap, Lock, Unlock, RotateCcw, PlusCircle, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { UserCreditAccount } from "@/lib/admin-credits/admin-credits-types";
import { fetchUserCreditAccounts, updateUserAccountStatus } from "@/lib/admin-credits/admin-credits-api";
import { ManualTopUpModal } from "./ManualTopUpModal";

export function UserCreditManagementView() {
  const [accounts, setAccounts] = useState<UserCreditAccount[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUserForTopUp, setSelectedUserForTopUp] = useState<UserCreditAccount | null>(null);

  const loadData = async () => {
    const list = await fetchUserCreditAccounts();
    setAccounts(list);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = accounts.filter(
    (a) =>
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleFreeze = async (user: UserCreditAccount) => {
    const nextStatus = user.status === "frozen" ? "active" : "frozen";
    await updateUserAccountStatus(user.userId, nextStatus);
    void loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Users className="size-6 text-accent" /> 24.2 User Credit Accounts Directory & Wallet
          </h2>
          <p className="text-sm text-muted-foreground">
            Search users, adjust balances, freeze/unfreeze credit wallets, and review lifetime ledgers.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* User Accounts Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">User</th>
                <th className="p-3">Current Balance</th>
                <th className="p-3">Purchased / Bonus / Referral</th>
                <th className="p-3">Lifetime Credits</th>
                <th className="p-3">Wallet Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.userId} className="hover:bg-secondary/20">
                  <td className="p-3 font-semibold">
                    <p className="text-foreground">{user.userName}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.userEmail}</p>
                  </td>

                  <td className="p-3 font-display font-bold text-base text-accent">
                    {user.currentBalance} Cr
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{user.purchasedCredits}</span> P •{" "}
                    <span className="text-purple-600 font-medium">{user.bonusCredits}</span> B •{" "}
                    <span className="text-emerald-600 font-medium">{user.referralCredits}</span> R
                  </td>

                  <td className="p-3 font-semibold text-xs">{user.lifetimeCredits} Cr</td>

                  <td className="p-3">
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-emerald-500 text-white text-[10px]"
                          : "bg-rose-500 text-white text-[10px]"
                      }
                    >
                      {user.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setSelectedUserForTopUp(user)}
                      >
                        <PlusCircle className="size-3.5" /> + Credits
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleToggleFreeze(user)}
                      >
                        {user.status === "frozen" ? (
                          <>
                            <Unlock className="size-3 text-emerald-500" /> Unfreeze
                          </>
                        ) : (
                          <>
                            <Lock className="size-3 text-rose-500" /> Freeze
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Top-up Modal */}
      {selectedUserForTopUp && (
        <ManualTopUpModal
          user={selectedUserForTopUp}
          isOpen={!!selectedUserForTopUp}
          onClose={() => setSelectedUserForTopUp(null)}
          onSuccess={() => void loadData()}
        />
      )}
    </div>
  );
}
