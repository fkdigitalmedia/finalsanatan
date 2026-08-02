import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_admin/admin/payment-gateways")({
  component: PaymentGatewaysPage,
  head: () => ({
    meta: [{ title: "Admin — Payment Gateways" }, { name: "robots", content: "noindex" }],
  }),
});

// ─── Provider credential field specs ───────────────────────────
type CredField = {
  key: string;
  label: string;
  placeholder?: string;
  secret?: boolean;
  hint?: string;
};

const PROVIDER_LABELS: Record<string, string> = {
  razorpay: "Razorpay",
  stripe: "Stripe",
  paypal: "PayPal",
  cashfree: "Cashfree",
  phonepe: "PhonePe",
  paytm: "Paytm",
  lemonsqueezy: "Lemon Squeezy",
  custom: "Custom",
};

const PROVIDER_FIELDS: Record<string, CredField[]> = {
  razorpay: [
    { key: "key_id", label: "Key ID", placeholder: "rzp_test_XXXXXXXX" },
    { key: "key_secret", label: "Key Secret", secret: true },
    {
      key: "webhook_secret",
      label: "Webhook Secret",
      secret: true,
      hint: "Optional — required only if using Razorpay webhooks.",
    },
  ],
  stripe: [
    { key: "publishable_key", label: "Publishable Key", placeholder: "pk_test_XXXX" },
    { key: "secret_key", label: "Secret Key", placeholder: "sk_test_XXXX", secret: true },
    {
      key: "webhook_secret",
      label: "Webhook Secret",
      placeholder: "whsec_XXXX",
      secret: true,
      hint: "Optional.",
    },
  ],
  paypal: [
    { key: "client_id", label: "Client ID" },
    { key: "client_secret", label: "Client Secret", secret: true },
  ],
  cashfree: [
    { key: "app_id", label: "App ID" },
    { key: "secret_key", label: "Secret Key", secret: true },
  ],
  phonepe: [
    { key: "merchant_id", label: "Merchant ID" },
    { key: "salt_key", label: "Salt Key", secret: true },
    { key: "salt_index", label: "Salt Index", placeholder: "1" },
  ],
  paytm: [
    { key: "merchant_id", label: "Merchant ID" },
    { key: "merchant_key", label: "Merchant Key", secret: true },
  ],
  lemonsqueezy: [
    { key: "api_key", label: "API Key", secret: true, placeholder: "eyJ0eXAiOiJKV1Qi..." },
    { key: "store_id", label: "Store ID", placeholder: "12345" },
    { key: "webhook_secret", label: "Webhook Secret", secret: true, hint: "Optional." },
  ],
  custom: [],
};

// ─── Types ─────────────────────────────────────────────────────
type Gateway = {
  id?: string;
  provider: string;
  display_name: string;
  mode: "test" | "live";
  active: boolean;
  is_default: boolean;
  sort_order: number;
  credentials: Record<string, string>;
  public_config: Record<string, unknown> | null;
  supported_currencies: string[] | null;
  notes: string | null;
};

const EMPTY: Gateway = {
  provider: "razorpay",
  display_name: "",
  mode: "test",
  active: true,
  is_default: false,
  sort_order: 0,
  credentials: {},
  public_config: null,
  supported_currencies: ["INR"],
  notes: "",
};

// ─── Page ──────────────────────────────────────────────────────
function PaymentGatewaysPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payment_gateways"],
    queryFn: () =>
      list({
        data: {
          table: "payment_gateways",
          order: "sort_order",
          ascending: true,
        },
      }),
  });

  const [editing, setEditing] = useState<Gateway | null>(null);

  const saveMut = useMutation({
    mutationFn: (values: Gateway) => upsert({ data: { table: "payment_gateways", values } }),
    onSuccess: () => {
      toast.success("Gateway saved");
      qc.invalidateQueries({ queryKey: ["admin", "payment_gateways"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) =>
      del({ data: { table: "payment_gateways", column: "id", value: id } }),
    onSuccess: () => {
      toast.success("Gateway deleted");
      qc.invalidateQueries({ queryKey: ["admin", "payment_gateways"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows: Gateway[] = (data?.rows ?? []) as Gateway[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-4 text-sm">
        <strong>How it works —</strong> Har provider ke liye ek row banao (test/live alag-alag).
        Sirf <em>Active</em> rows checkout page pe dikhenge. Ab credentials ke liye JSON likhne ki
        zaroorat nahi — bas Edit dabao aur har API key alag input me paste kar do.
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payment Gateways</h1>
        <Button onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="mr-2 h-4 w-4" /> Add gateway
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30 text-left">
            <tr>
              <th className="px-4 py-3">Display name</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Default</th>
              <th className="px-4 py-3">Currencies</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No gateways yet. Click "Add gateway" to create your first one.
                </td>
              </tr>
            )}
            {rows.map((g) => (
              <tr key={g.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{g.display_name}</td>
                <td className="px-4 py-3">{PROVIDER_LABELS[g.provider] ?? g.provider}</td>
                <td className="px-4 py-3">
                  <Badge variant={g.mode === "live" ? "default" : "secondary"}>{g.mode}</Badge>
                </td>
                <td className="px-4 py-3">
                  {g.active ? (
                    <Badge className="bg-green-600 hover:bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Off</Badge>
                  )}
                </td>
                <td className="px-4 py-3">{g.is_default ? "★" : ""}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(g.supported_currencies ?? []).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing({ ...EMPTY, ...g, credentials: g.credentials ?? {} })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (!g.id) return;
                      if (confirm(`Delete "${g.display_name}"?`)) deleteMut.mutate(g.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GatewayDialog
        value={editing}
        onClose={() => setEditing(null)}
        onSave={(v) => saveMut.mutate(v)}
        saving={saveMut.isPending}
      />
    </div>
  );
}

// ─── Edit dialog ───────────────────────────────────────────────
function GatewayDialog({
  value,
  onClose,
  onSave,
  saving,
}: {
  value: Gateway | null;
  onClose: () => void;
  onSave: (v: Gateway) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Gateway | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [customJson, setCustomJson] = useState("");

  // Sync when opening
  useEffect(() => {
    if (value) {
      setForm({ ...value });
      setCustomJson(
        value.provider === "custom" ? JSON.stringify(value.credentials ?? {}, null, 2) : "",
      );
      setShowSecrets(false);
    }
  }, [value]);

  if (!form) return null;

  const fields = PROVIDER_FIELDS[form.provider] ?? [];
  const currenciesStr = (form.supported_currencies ?? []).join(", ");

  function updateCred(key: string, val: string) {
    setForm((f) => (f ? { ...f, credentials: { ...f.credentials, [key]: val } } : f));
  }

  function handleSave() {
    if (!form) return;
    if (!form.display_name.trim()) {
      toast.error("Display name is required");
      return;
    }
    let credentials = form.credentials ?? {};
    if (form.provider === "custom") {
      try {
        credentials = customJson.trim() ? JSON.parse(customJson) : {};
      } catch {
        toast.error("Custom credentials must be valid JSON");
        return;
      }
    } else {
      // Warn if required-looking fields are empty for a live gateway
      const missing = fields
        .filter((f) => !f.hint?.toLowerCase().includes("optional"))
        .filter((f) => !(credentials[f.key] ?? "").trim());
      if (missing.length && form.active) {
        const proceed = confirm(
          `These fields look empty: ${missing.map((m) => m.label).join(", ")}.\nSave anyway?`,
        );
        if (!proceed) return;
      }
    }
    onSave({ ...form, credentials });
  }

  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit gateway" : "Add gateway"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Display name</Label>
              <Input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="e.g. Razorpay (Live)"
              />
            </div>
            <div>
              <Label>Provider</Label>
              <Select
                value={form.provider}
                onValueChange={(v) => setForm({ ...form, provider: v, credentials: {} })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROVIDER_LABELS).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Mode</Label>
              <Select
                value={form.mode}
                onValueChange={(v: "test" | "live") => setForm({ ...form, mode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Currencies (comma sep)</Label>
              <Input
                value={currenciesStr}
                onChange={(e) =>
                  setForm({
                    ...form,
                    supported_currencies: e.target.value
                      .split(",")
                      .map((s) => s.trim().toUpperCase())
                      .filter(Boolean),
                  })
                }
                placeholder="INR, USD"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_default}
                onCheckedChange={(v) => setForm({ ...form, is_default: v })}
              />
              Default
            </label>
          </div>

          {/* Credentials */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Credentials — {PROVIDER_LABELS[form.provider]}</h3>
              {form.provider !== "custom" && fields.some((f) => f.secret) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecrets((s) => !s)}
                >
                  {showSecrets ? (
                    <EyeOff className="mr-1 h-4 w-4" />
                  ) : (
                    <Eye className="mr-1 h-4 w-4" />
                  )}
                  {showSecrets ? "Hide" : "Show"} secrets
                </Button>
              )}
            </div>

            {form.provider === "custom" ? (
              <div>
                <Label>Credentials (JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-xs"
                  value={customJson}
                  onChange={(e) => setCustomJson(e.target.value)}
                  placeholder='{"api_key": "..."}'
                />
              </div>
            ) : (
              <div className="grid gap-3">
                {fields.map((f) => (
                  <div key={f.key}>
                    <Label>
                      {f.label}
                      {f.hint?.toLowerCase().includes("optional") && (
                        <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
                      )}
                    </Label>
                    <Input
                      type={f.secret && !showSecrets ? "password" : "text"}
                      autoComplete="off"
                      value={form.credentials?.[f.key] ?? ""}
                      onChange={(e) => updateCred(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                    {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              🔒 Keys are stored server-side and never sent to the browser.
            </p>
          </div>

          <div>
            <Label>Notes (internal)</Label>
            <Textarea
              rows={2}
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save gateway"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
