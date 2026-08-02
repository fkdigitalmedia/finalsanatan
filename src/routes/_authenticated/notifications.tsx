import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getMyNotificationPreferences,
  updateMyNotificationPreferences,
} from "@/lib/notification-preferences.functions";

export const Route = createFileRoute("/_authenticated/notifications")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Notifications — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: NotifPage,
});

function NotifPage() {
  return (
    <DashboardShell title="Notifications" description="Reminders, updates and personal messages.">
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <Inbox />
        </TabsContent>
        <TabsContent value="preferences">
          <Preferences />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function Inbox() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () =>
      (
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
      ).data ?? [],
  });
  const markAll = useMutation({
    mutationFn: async () => {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user!.id)
        .eq("read", false);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const toggle = useMutation({
    mutationFn: async (n: { id: string; read: boolean }) => {
      await supabase.from("notifications").update({ read: !n.read }).eq("id", n.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").delete().eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (!data || !data.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">You're all caught up.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => markAll.mutate()}>
          Mark all read
        </Button>
      </div>
      <div className="space-y-2">
        {data.map((n) => (
          <Card
            key={n.id}
            className={cn(
              "p-4 flex items-start gap-3",
              !n.read && "border-accent/40 bg-primary-soft/30",
            )}
          >
            <div className="size-9 rounded-lg bg-primary-soft grid place-items-center text-accent shrink-0">
              <Bell className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{n.title}</p>
              {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggle.mutate({ id: n.id, read: n.read })}
              aria-label="Toggle read"
            >
              <Check className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => del.mutate(n.id)}
              aria-label="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}

const CHANNEL_SWITCHES: [string, string][] = [
  ["in_app_enabled", "In-app notifications"],
  ["email_enabled", "Email"],
  ["browser_enabled", "Browser push"],
  ["push_enabled", "Mobile push"],
];

const CATEGORY_SWITCHES: [string, string][] = [
  ["horoscope_alerts", "Horoscope updates"],
  ["festival_alerts", "Festival & vrat reminders"],
  ["muhurat_alerts", "Muhurat alerts"],
  ["panchang_alerts", "Daily Panchang reminders"],
  ["report_alerts", "Reports & PDFs"],
  ["billing_alerts", "Billing & subscription"],
  ["ai_recommendations", "AI recommendations"],
  ["weekly_digest", "Weekly digest"],
  ["monthly_digest", "Monthly digest"],
  ["marketing_emails", "Offers & product news"],
];

function Preferences() {
  const qc = useQueryClient();
  const get = useServerFn(getMyNotificationPreferences);
  const update = useServerFn(updateMyNotificationPreferences);
  const { data, isLoading } = useQuery({ queryKey: ["notif-prefs"], queryFn: () => get({}) });

  const save = useMutation({
    mutationFn: (patch: Record<string, unknown>) => update({ data: patch }),
    onSuccess: () => {
      toast.success("Preferences saved");
      qc.invalidateQueries({ queryKey: ["notif-prefs"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save"),
  });

  if (isLoading || !data) return <Loader2 className="size-5 animate-spin" />;
  const prefs = data as any;

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <h3 className="font-serif text-lg">Channels</h3>
        {CHANNEL_SWITCHES.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key}>{label}</Label>
            <Switch
              id={key}
              checked={!!prefs[key]}
              onCheckedChange={(v) => save.mutate({ [key]: v })}
            />
          </div>
        ))}
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-serif text-lg">What you receive</h3>
        {CATEGORY_SWITCHES.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key}>{label}</Label>
            <Switch
              id={key}
              checked={!!prefs[key]}
              onCheckedChange={(v) => save.mutate({ [key]: v })}
            />
          </div>
        ))}
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-serif text-lg">Quiet hours</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="quiet">Pause non-urgent alerts at night</Label>
          <Switch
            id="quiet"
            checked={!!prefs.quiet_hours_enabled}
            onCheckedChange={(v) => save.mutate({ quiet_hours_enabled: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">From (hour)</Label>
            <Input
              type="number"
              min={0}
              max={23}
              defaultValue={prefs.quiet_hours_start}
              onBlur={(e) => save.mutate({ quiet_hours_start: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs">Until (hour)</Label>
            <Input
              type="number"
              min={0}
              max={23}
              defaultValue={prefs.quiet_hours_end}
              onBlur={(e) => save.mutate({ quiet_hours_end: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Timezone</Label>
          <Input
            defaultValue={prefs.timezone}
            onBlur={(e) => save.mutate({ timezone: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="font-medium">Unsubscribe from everything</p>
          <p className="text-sm text-muted-foreground">
            Critical billing and security messages will still reach you.
          </p>
        </div>
        <Switch
          checked={!!prefs.unsubscribed_all}
          onCheckedChange={(v) => save.mutate({ unsubscribed_all: v })}
        />
      </Card>
    </div>
  );
}
