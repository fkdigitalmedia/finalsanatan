import React, { useEffect, useState } from "react";
import { Zap, Plus, Edit2, CheckCircle, Star, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreditPackageConfig } from "@/lib/admin-credits/admin-credits-types";
import { fetchCreditPackages, saveCreditPackage } from "@/lib/admin-credits/admin-credits-api";

export function CreditPackagesConfigView() {
  const [packages, setPackages] = useState<CreditPackageConfig[]>([]);
  const [editingPack, setEditingPack] = useState<CreditPackageConfig | null>(null);

  const loadData = async () => {
    const list = await fetchCreditPackages();
    setPackages(list);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleToggleActive = async (pkg: CreditPackageConfig) => {
    const updated = { ...pkg, isActive: !pkg.isActive };
    await saveCreditPackage(updated);
    void loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Zap className="size-6 text-amber-500" /> 24.4 Credit Packages Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Create & manage credit top-up packages, bonus credits, pricing tiers & popular badges.
          </p>
        </div>

        <Button
          onClick={() =>
            setEditingPack({
              id: `pack-${Date.now()}`,
              name: "New Credit Pack",
              creditAmount: 100,
              bonusCredits: 20,
              priceCents: 99900,
              currency: "INR",
              badgeText: "NEW",
              isPopular: false,
              isActive: true,
              displayOrder: packages.length + 1,
            })
          }
          className="gap-2 shadow-sm"
        >
          <Plus className="size-4" /> Create Credit Pack
        </Button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-5 relative space-y-3 transition-all ${
              pkg.isPopular ? "border-accent ring-1 ring-accent bg-accent/5" : "bg-card"
            }`}
          >
            {pkg.isPopular && (
              <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground font-bold text-[10px]">
                MOST POPULAR
              </Badge>
            )}

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                {pkg.badgeText || "STANDARD"}
              </Badge>
              <Switch
                checked={pkg.isActive}
                onCheckedChange={() => handleToggleActive(pkg)}
              />
            </div>

            <h3 className="font-display font-bold text-xl">{pkg.name}</h3>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-foreground">
                {pkg.creditAmount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">Credits</span>
              {pkg.bonusCredits > 0 && (
                <Badge className="ml-2 bg-emerald-500 text-white text-[10px]">
                  +{pkg.bonusCredits} Bonus
                </Badge>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="font-display font-bold text-lg text-accent">
                ₹{(pkg.priceCents / 100).toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setEditingPack(pkg)}
              >
                <Edit2 className="size-3.5" /> Edit Pack
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Package Modal */}
      {editingPack && (
        <EditPackageModal
          pack={editingPack}
          isOpen={!!editingPack}
          onClose={() => setEditingPack(null)}
          onSuccess={() => void loadData()}
        />
      )}
    </div>
  );
}

function EditPackageModal({
  pack,
  isOpen,
  onClose,
  onSuccess,
}: {
  pack: CreditPackageConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(pack.name);
  const [credits, setCredits] = useState(pack.creditAmount);
  const [bonus, setBonus] = useState(pack.bonusCredits);
  const [priceCents, setPriceCents] = useState(pack.priceCents);
  const [badge, setBadge] = useState(pack.badgeText || "");
  const [isPopular, setIsPopular] = useState(pack.isPopular || false);

  const handleSave = async () => {
    await saveCreditPackage({
      ...pack,
      name,
      creditAmount: credits,
      bonusCredits: bonus,
      priceCents,
      badgeText: badge,
      isPopular,
    });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Credit Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          <div>
            <label className="text-xs font-semibold block mb-1">Package Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1">Base Credits</label>
              <Input
                type="number"
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Bonus Credits</label>
              <Input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Price (in paise / cents)</label>
            <Input
              type="number"
              value={priceCents}
              onChange={(e) => setPriceCents(parseInt(e.target.value) || 0)}
            />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ₹{(priceCents / 100).toLocaleString()} INR
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Badge Text</label>
            <Input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. BEST VALUE"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold">Mark as Most Popular</span>
            <Switch checked={isPopular} onCheckedChange={setIsPopular} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Package</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
