import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Reset password — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPwPage,
});

export default function ResetPwPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setReady(true);
    else supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-8 shadow-elegant"
      >
        <h1 className="font-display text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input
            id="pw"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !ready}>
          Update password
        </Button>
      </form>
    </div>
  );
}

// Ignore for zod
void z;
