import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

export function NewsletterCTA({ source = "tool-page" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      await subscribeNewsletter({ data: { email, source } });
      setState("done");
      toast.success("Subscribed — check your inbox to confirm.");
    } catch (err) {
      setState("idle");
      toast.error(err instanceof Error ? err.message : "Could not subscribe.");
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-6 md:p-8 shadow-elegant">
      <div className="flex items-center gap-2 text-accent">
        <Mail className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">
          Weekly Dharma Digest
        </span>
      </div>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
        Panchang, festivals & shastra — every Sunday
      </h2>
      <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
        Curated by our editors. One email a week. Unsubscribe anytime.
      </p>
      <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 bg-background"
          disabled={state !== "idle"}
        />
        <Button type="submit" className="h-11 shadow-glow" disabled={state !== "idle"}>
          {state === "loading" && <Loader2 className="size-4 animate-spin" />}
          {state === "done" && <Check className="size-4" />}
          {state === "idle" && "Subscribe"}
          {state === "loading" && "Subscribing…"}
          {state === "done" && "Subscribed"}
        </Button>
      </form>
    </div>
  );
}
