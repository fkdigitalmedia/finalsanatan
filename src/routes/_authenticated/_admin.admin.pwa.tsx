import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HardDrive, Trash2, Zap, ZapOff, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  enableCache,
  disableCache,
  clearAllCaches,
  isCacheEnabled,
  registerPwa,
} from "@/lib/pwa/register";

function PwaAdminPage() {
  const [enabled, setEnabled] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ names: string[]; entries: number }>({
    names: [],
    entries: 0,
  });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setEnabled(isCacheEnabled());
    if (typeof caches === "undefined") return;
    const names = await caches.keys();
    let entries = 0;
    for (const n of names) {
      const c = await caches.open(n);
      entries += (await c.keys()).length;
    }
    setCacheInfo({ names, entries });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onEnable() {
    setBusy(true);
    try {
      await enableCache();
      await registerPwa();
      toast.success("Offline caching enabled. Service worker will activate on next visit.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDisable() {
    setBusy(true);
    try {
      await disableCache();
      toast.success("Offline caching disabled. Service worker unregistered.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onClear() {
    setBusy(true);
    try {
      await clearAllCaches();
      toast.success("All caches cleared.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const isPreview =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("id-preview--") ||
      window.location.hostname.startsWith("preview--") ||
      window.location.hostname.endsWith(".lovableproject.com"));

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">PWA & Offline Caching</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control the Progressive Web App service worker. Enable caching to make SanatanTools load
          instantly on repeat visits and work offline for previously visited pages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Cache Status
              </CardTitle>
              <CardDescription>Current state of offline caching in this browser.</CardDescription>
            </div>
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Cache buckets</div>
              <div className="mt-1 text-2xl font-semibold">{cacheInfo.names.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Cached entries</div>
              <div className="mt-1 text-2xl font-semibold">{cacheInfo.entries}</div>
            </div>
          </div>

          {cacheInfo.names.length > 0 && (
            <div className="rounded-lg border bg-muted/30 p-3 text-xs">
              <div className="mb-1 font-medium">Buckets:</div>
              <ul className="space-y-0.5 font-mono text-muted-foreground">
                {cacheInfo.names.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {enabled ? (
              <Button onClick={onDisable} disabled={busy} variant="outline">
                <ZapOff className="mr-2 h-4 w-4" />
                Disable Caching
              </Button>
            ) : (
              <Button onClick={onEnable} disabled={busy}>
                <Zap className="mr-2 h-4 w-4" />
                Enable Caching
              </Button>
            )}
            <Button onClick={onClear} disabled={busy} variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Caches
            </Button>
            <Button onClick={refresh} disabled={busy} variant="ghost">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Network-first HTML:</strong> pages always try the
            network first (4s timeout), falling back to cache — users never see stale content when
            online.
          </p>
          <p>
            <strong className="text-foreground">Cache-first assets:</strong> JS, CSS, fonts and
            images are served from cache for instant loads. Cache auto-invalidates on new builds.
          </p>
          <p>
            <strong className="text-foreground">Excluded:</strong> <code>/api/*</code>,{" "}
            <code>/admin/*</code> and <code>/~oauth</code> always hit the network.
          </p>
          <p>
            <strong className="text-foreground">Kill switch:</strong> visit any page with{" "}
            <code>?sw=off</code> to force-unregister the service worker.
          </p>
          {isPreview && (
            <p className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
              ⚠️ You're on the Lovable preview. Service workers are disabled here for safety —
              caching only activates on the published site.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/_admin/admin/pwa")({
  component: PwaAdminPage,
  head: () => ({
    meta: [{ title: "Admin — PWA & Caching" }, { name: "robots", content: "noindex" }],
  }),
});
