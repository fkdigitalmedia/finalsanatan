import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/profile")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Profile — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    location: "",
    timezone: "",
    language: "en",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setForm({
            display_name: data.display_name ?? "",
            bio: data.bio ?? "",
            location: data.location ?? "",
            timezone: data.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: data.language ?? "en",
            avatar_url: data.avatar_url ?? "",
          });
        setLoading(false);
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...form });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  return (
    <DashboardShell title="Profile" description="How you appear across SanatanTools.">
      <Card className="p-6 md:p-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <form onSubmit={save} className="grid md:grid-cols-2 gap-5 max-w-3xl">
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="size-16 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground text-xl font-display">
                {(form.display_name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{form.display_name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div>
              <Label>Display name</Label>
              <Input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="https://…"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Varanasi, India"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Language</Label>
              <Input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </DashboardShell>
  );
}
