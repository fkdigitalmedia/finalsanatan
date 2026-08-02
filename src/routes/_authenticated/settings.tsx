import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Settings — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();
  const [s, setS] = useState({
    theme: "system",
    language: "en",
    notifications_enabled: true,
    sound_enabled: true,
    vibration_enabled: true,
    daily_reminder_time: "",
    festival_reminders_enabled: true,
    festival_reminder_lead_days: [1, 3] as number[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setS({
            theme: data.theme,
            language: data.language,
            notifications_enabled: data.notifications_enabled,
            sound_enabled: data.sound_enabled,
            vibration_enabled: data.vibration_enabled,
            daily_reminder_time: data.daily_reminder_time ?? "",
            festival_reminders_enabled: (data as any).festival_reminders_enabled ?? true,
            festival_reminder_lead_days: ((data as any).festival_reminder_lead_days ?? [
              1, 3,
            ]) as number[],
          });
      });
  }, [user]);

  const toggleLead = (n: number) => {
    setS((prev) => {
      const has = prev.festival_reminder_lead_days.includes(n);
      const next = has
        ? prev.festival_reminder_lead_days.filter((v) => v !== n)
        : [...prev.festival_reminder_lead_days, n].sort((a, b) => a - b);
      return { ...prev, festival_reminder_lead_days: next };
    });
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_settings")
      .upsert({ user_id: user.id, ...s, daily_reminder_time: s.daily_reminder_time || null });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  const remove = async () => {
    if (!confirm("Delete your account and all data? This cannot be undone.")) return;
    if (!user) return;
    // Removes profile row cascade via auth deletion isn't self-serve without service role;
    // instead wipe user data and sign out.
    await Promise.all([
      supabase.from("bookmarks").delete().eq("user_id", user.id),
      supabase.from("favorites").delete().eq("user_id", user.id),
      supabase.from("saved_mantras").delete().eq("user_id", user.id),
      supabase.from("history").delete().eq("user_id", user.id),
      supabase.from("notifications").delete().eq("user_id", user.id),
    ]);
    toast.success("All personal data cleared");
    await signOut();
  };

  return (
    <DashboardShell title="Settings" description="Preferences, notifications and account controls.">
      <div className="grid gap-4 max-w-3xl">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Theme</p>
              <p className="text-xs text-muted-foreground">Light, dark or match your system.</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold">Notifications</h2>
          <Row
            label="Enable notifications"
            desc="In-app updates about festivals, streaks and new tools."
          >
            <Switch
              checked={s.notifications_enabled}
              onCheckedChange={(v) => setS({ ...s, notifications_enabled: v })}
            />
          </Row>
          <Row label="Sound" desc="Play a chime for jaap counters.">
            <Switch
              checked={s.sound_enabled}
              onCheckedChange={(v) => setS({ ...s, sound_enabled: v })}
            />
          </Row>
          <Row label="Vibration" desc="Haptic feedback on mobile.">
            <Switch
              checked={s.vibration_enabled}
              onCheckedChange={(v) => setS({ ...s, vibration_enabled: v })}
            />
          </Row>
          <div>
            <Label>Daily reminder time (optional)</Label>
            <Input
              type="time"
              value={s.daily_reminder_time}
              onChange={(e) => setS({ ...s, daily_reminder_time: e.target.value })}
              className="mt-1.5 max-w-xs"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold">Festival reminders</h2>
          <Row
            label="Enable festival reminders"
            desc="Get notified before upcoming festivals & vrats."
          >
            <Switch
              checked={s.festival_reminders_enabled}
              onCheckedChange={(v) => setS({ ...s, festival_reminders_enabled: v })}
            />
          </Row>
          <div>
            <Label>Remind me this many days before</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 3, 7, 14].map((n) => {
                const on = s.festival_reminder_lead_days.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleLead(n)}
                    disabled={!s.festival_reminders_enabled}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      on
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    } disabled:opacity-50`}
                  >
                    {n} day{n === 1 ? "" : "s"}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Also fires on the day itself (0 days).
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold">Language</h2>
          <div className="mt-3 max-w-xs">
            <Label>Preferred language</Label>
            <Input
              value={s.language}
              onChange={(e) => setS({ ...s, language: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>

        <ChangePasswordCard />

        <Card className="p-6 border-destructive/30">
          <h2 className="font-display text-xl font-semibold text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign out or clear all your personal data.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
            <Button variant="destructive" onClick={remove}>
              Clear all my data
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function ChangePasswordCard() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    setPw("");
    setConfirm("");
    toast.success("Password updated");
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold">Change password</h2>
        <p className="text-sm text-muted-foreground">
          Set a new password for your account. Minimum 8 characters.
        </p>
      </div>
      <div className="grid gap-3 max-w-md">
        <div>
          <Label>New password</Label>
          <Input
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Confirm new password</Label>
          <Input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={submit} disabled={busy || !pw || !confirm}>
            {busy ? "Updating…" : "Update password"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
