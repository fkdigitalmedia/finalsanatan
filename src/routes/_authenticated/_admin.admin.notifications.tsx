import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListNotifications,
  adminBroadcastNotification,
  adminDeleteNotification,
  notificationCategories,
} from "@/lib/admin-notifications.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Send, Loader2, ExternalLink } from "lucide-react";
import {
  NotificationAnalytics,
  DispatchPanel,
  TemplateManager,
  ChannelSettings,
  QueueMonitor,
  ScheduleManager,
  DeliveryLog,
} from "@/components/admin/NotificationEngine";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/_admin/admin/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [{ title: "Admin — Notifications" }, { name: "robots", content: "noindex" }],
  }),
});

const STAFF_ROLES = [
  "user",
  "moderator",
  "content_manager",
  "editor",
  "admin",
  "super_admin",
] as const;

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Send in-app notifications to users and review the recent inbox across the platform.
        </p>
      </header>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compose">Broadcast</TabsTrigger>
          <TabsTrigger value="dispatch">Trigger</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery log</TabsTrigger>
          <TabsTrigger value="inbox">Inbox viewer</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <NotificationAnalytics />
        </TabsContent>
        <TabsContent value="compose">
          <BroadcastComposer />
        </TabsContent>
        <TabsContent value="dispatch">
          <DispatchPanel />
        </TabsContent>
        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>
        <TabsContent value="channels">
          <ChannelSettings />
        </TabsContent>
        <TabsContent value="queue">
          <QueueMonitor />
        </TabsContent>
        <TabsContent value="schedules">
          <ScheduleManager />
        </TabsContent>
        <TabsContent value="deliveries">
          <DeliveryLog />
        </TabsContent>
        <TabsContent value="inbox">
          <InboxViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Composer ----------

function BroadcastComposer() {
  const qc = useQueryClient();
  const broadcast = useServerFn(adminBroadcastNotification);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [targetKind, setTargetKind] = useState<"all" | "role" | "user">("all");
  const [role, setRole] = useState<string>("user");
  const [userId, setUserId] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      broadcast({
        data: {
          title,
          body: body || undefined,
          link: link || undefined,
          category,
          target:
            targetKind === "all"
              ? { kind: "all" }
              : targetKind === "role"
                ? { kind: "role", role }
                : { kind: "user", userId },
        },
      }),
    onSuccess: (res) => {
      toast.success(`Notification sent to ${res.sent} user${res.sent === 1 ? "" : "s"}`);
      setTitle("");
      setBody("");
      setLink("");
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to send"),
  });

  const canSubmit =
    title.trim().length > 0 &&
    (targetKind !== "user" || userId.trim().length > 0) &&
    !mutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose broadcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="n-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="n-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={160}
            placeholder="Diwali offer: 30% off Pro this week"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="n-body">Body</Label>
          <Textarea
            id="n-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Optional. Rendered under the title in the user's dashboard."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="n-link">Link (optional)</Label>
            <Input
              id="n-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/tools/kundli or https://…"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <Label className="text-sm font-semibold">Audience</Label>
          <div className="flex flex-wrap gap-2">
            {(["all", "role", "user"] as const).map((k) => (
              <Button
                key={k}
                type="button"
                size="sm"
                variant={targetKind === k ? "default" : "outline"}
                onClick={() => setTargetKind(k)}
              >
                {k === "all" ? "All users" : k === "role" ? "By role" : "Specific user"}
              </Button>
            ))}
          </div>
          {targetKind === "role" && (
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {targetKind === "user" && (
            <div className="space-y-2">
              <Label>User ID (UUID)</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="max-w-md font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Find the UUID in the Users admin page.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => mutation.mutate()} disabled={!canSubmit}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send notification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Inbox viewer ----------

function InboxViewer() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListNotifications);
  const deleteFn = useServerFn(adminDeleteNotification);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const params = useMemo(
    () => ({
      search,
      category: category === "all" ? "" : category,
      unreadOnly,
      limit: 200,
    }),
    [search, category, unreadOnly],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications", params],
    queryFn: () => listFn({ data: params }),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete"),
  });

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Recent notifications</CardTitle>
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary">Total: {data?.totalCount ?? "…"}</Badge>
            <Badge variant="outline">Unread: {data?.unreadCount ?? "…"}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] space-y-1">
            <Label className="text-xs">Search title</Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Welcome"
            />
          </div>
          <div className="w-40 space-y-1">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {notificationCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <Switch id="unread" checked={unreadOnly} onCheckedChange={setUnreadOnly} />
            <Label htmlFor="unread" className="text-xs">
              Unread only
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (data?.rows?.length ?? 0) === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No notifications match.</p>
        ) : (
          <ul className="divide-y">
            {data!.rows.map((n: any) => (
              <li
                key={n.id}
                className="flex flex-col gap-2 py-3 md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" aria-label="unread" />
                    )}
                    <span className="font-medium truncate">{n.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {n.category ?? "general"}
                    </Badge>
                  </div>
                  {n.body && <p className="text-sm text-muted-foreground line-clamp-2">{n.body}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      To:{" "}
                      {n.profile?.display_name ?? (
                        <span className="font-mono">{n.user_id.slice(0, 8)}…</span>
                      )}
                    </span>
                    <span>{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Link <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => del.mutate(n.id)}
                  disabled={del.isPending}
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
