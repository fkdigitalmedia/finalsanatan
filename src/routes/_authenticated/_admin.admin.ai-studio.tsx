import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Rocket,
  FileText,
  Calendar,
  HelpCircle,
  Search,
  Braces,
  Image as ImageIcon,
  Facebook,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  studioGenerate,
  studioPublishArticle,
  studioPublishFestival,
  STUDIO_MODES,
  type StudioMode,
} from "@/lib/ai-studio.functions";

const MODE_META: Record<StudioMode, { label: string; icon: any; hint: string }> = {
  article: {
    label: "Article",
    icon: FileText,
    hint: "Long-form Sanatan article — auto-publish to Articles.",
  },
  festival: {
    label: "Festival Page",
    icon: Calendar,
    hint: "Complete festival page — auto-publish to Festivals.",
  },
  faq: { label: "FAQ", icon: HelpCircle, hint: "8 authentic FAQs + FAQPage schema." },
  meta: { label: "Meta", icon: Search, hint: "SEO title, description, keywords, OG, Twitter." },
  schema: {
    label: "Schema",
    icon: Braces,
    hint: "schema.org JSON-LD (Article, Event, HowTo, FAQ, Place).",
  },
  pinterest: {
    label: "Pinterest Pins",
    icon: ImageIcon,
    hint: "5 pins with titles, descriptions, image prompts.",
  },
  facebook: { label: "Facebook Posts", icon: Facebook, hint: "3 warm, respectful Facebook posts." },
  twitter: { label: "Twitter Posts", icon: Twitter, hint: "5 tweets + one 4-tweet thread." },
  instagram: { label: "Instagram", icon: Instagram, hint: "3 captions with 20 hashtags each." },
  newsletter: {
    label: "Newsletter",
    icon: Mail,
    hint: "Subject, preheader, HTML body + plain text.",
  },
};

function AIStudio() {
  const [mode, setMode] = useState<StudioMode>("article");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [lang, setLang] = useState("en");
  const [autoPublish, setAutoPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"preview" | "json">("preview");

  const generate = useServerFn(studioGenerate);
  const publishArticle = useServerFn(studioPublishArticle);
  const publishFestival = useServerFn(studioPublishFestival);

  const canAutoPublish = mode === "article" || mode === "festival";

  const onGenerate = async () => {
    if (!topic.trim()) {
      setError("Enter a topic.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await generate({
        data: { mode, topic: topic.trim(), notes: notes.trim() || undefined, lang },
      });
      setResult(res);
      if (autoPublish && canAutoPublish && res.payload && !res.payload.raw) {
        setPublishing(true);
        try {
          if (mode === "article") {
            const saved = await publishArticle({
              data: { payload: res.payload, lang, publish: true },
            });
            toast.success(`Article published: /${saved.slug}`);
          } else {
            const saved = await publishFestival({ data: { payload: res.payload, publish: true } });
            toast.success(`Festival published: /${saved.slug}`);
          }
        } finally {
          setPublishing(false);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const onPublish = async (publish: boolean) => {
    if (!result?.payload || result.payload.raw) return;
    setPublishing(true);
    try {
      if (mode === "article") {
        const saved = await publishArticle({ data: { payload: result.payload, lang, publish } });
        toast.success(publish ? `Published: /${saved.slug}` : `Saved draft: ${saved.slug}`);
      } else if (mode === "festival") {
        const saved = await publishFestival({ data: { payload: result.payload, publish } });
        toast.success(publish ? `Published: /${saved.slug}` : `Saved draft: ${saved.slug}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const onCopy = async () => {
    if (!result) return;
    const txt = JSON.stringify(result.payload?.raw ? result.raw : result.payload, null, 2);
    await navigator.clipboard.writeText(txt);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const meta = MODE_META[mode];
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Content Studio</h1>
        <p className="text-sm text-muted-foreground">
          Generate articles, festival pages, FAQs, meta, schema, social posts & newsletters —
          publish in one click.
        </p>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as StudioMode)}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {STUDIO_MODES.map((m) => {
            const M = MODE_META[m];
            const I = M.icon;
            return (
              <TabsTrigger key={m} value={m} className="gap-1.5">
                <I className="size-3.5" />
                {M.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="size-4 text-primary" />
            {meta.label}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{meta.hint}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic / Title *</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === "festival"
                  ? "Diwali"
                  : mode === "article"
                    ? "The significance of Rudraksha in daily sadhana"
                    : "Ganesh Chaturthi puja vidhi"
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Regional focus, target audience, angle, must-include mantras…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="lang">Language</Label>
              <Input
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                placeholder="en, hi, mr, ta…"
              />
            </div>
            {canAutoPublish && (
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <Switch id="auto" checked={autoPublish} onCheckedChange={setAutoPublish} />
                  <Label htmlFor="auto" className="cursor-pointer">
                    Auto-publish on generate
                  </Label>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={onGenerate} disabled={loading || publishing} className="min-w-40">
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            {publishing && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="size-3 animate-spin" /> Publishing…
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3 text-sm">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 gap-3 flex-wrap">
            <CardTitle className="text-base">Output</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="preview" className="text-xs h-6">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="json" className="text-xs h-6">
                    JSON
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="sm" onClick={onCopy}>
                {copied ? <Check className="size-4 mr-2" /> : <Copy className="size-4 mr-2" />}
                Copy
              </Button>
              {canAutoPublish && !result.payload?.raw && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPublish(false)}
                    disabled={publishing}
                  >
                    Save draft
                  </Button>
                  <Button size="sm" onClick={() => onPublish(true)} disabled={publishing}>
                    <Rocket className="size-4 mr-2" />
                    Publish
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {view === "json" ? (
              <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-auto max-h-[600px] whitespace-pre-wrap break-words">
                {JSON.stringify(
                  result.payload?.raw ? { raw: result.raw } : result.payload,
                  null,
                  2,
                )}
              </pre>
            ) : result.payload?.raw ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100">
                  ⚠️ AI output could not be parsed as clean JSON (likely truncated). Showing raw
                  text below — try regenerating, or switch to the JSON tab.
                </div>
                <pre className="text-sm bg-muted/40 rounded-lg p-4 overflow-auto max-h-[600px] whitespace-pre-wrap break-words font-sans">
                  {result.raw}
                </pre>
              </div>
            ) : (
              <StudioPreview mode={mode} payload={result.payload} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/_admin/admin/ai-studio")({
  component: AIStudio,
  head: () => ({
    meta: [{ title: "Admin — AI Content Studio" }, { name: "robots", content: "noindex" }],
  }),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{text}</div>
  );
}

function StudioPreview({ mode, payload }: { mode: StudioMode; payload: any }) {
  if (!payload) return null;
  const p = payload;

  if (mode === "article") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{p.title}</h2>
          {p.excerpt && <p className="text-sm text-muted-foreground mt-1">{p.excerpt}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {p.category && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                {p.category}
              </span>
            )}
            {(p.tags ?? []).map((t: string) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-muted">
                #{t}
              </span>
            ))}
          </div>
        </div>
        {p.content_md && (
          <Section title="Content">
            <Markdown text={p.content_md} />
          </Section>
        )}
        {p.seo && (
          <Section title="SEO">
            <pre className="text-xs bg-muted/40 rounded p-2 whitespace-pre-wrap">
              {JSON.stringify(p.seo, null, 2)}
            </pre>
          </Section>
        )}
      </div>
    );
  }

  if (mode === "festival") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{p.name}</h2>
        <div className="text-xs text-muted-foreground">
          Slug: /{p.slug} {p.event_date ? `· ${p.event_date}` : ""}
        </div>
        {p.description && (
          <Section title="Description">
            <Markdown text={p.description} />
          </Section>
        )}
        {p.seo && (
          <Section title="SEO">
            <pre className="text-xs bg-muted/40 rounded p-2 whitespace-pre-wrap">
              {JSON.stringify(p.seo, null, 2)}
            </pre>
          </Section>
        )}
      </div>
    );
  }

  if (mode === "faq") {
    return (
      <div className="space-y-3">
        {(p.faqs ?? []).map((f: any, i: number) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="font-medium text-sm">Q. {f.q}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.a}</div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "meta") {
    return (
      <div className="space-y-3">
        <Section title="Title">
          <div>{p.title}</div>
        </Section>
        <Section title="Description">
          <div>{p.description}</div>
        </Section>
        {p.keywords && (
          <Section title="Keywords">
            <div className="flex flex-wrap gap-1.5">
              {p.keywords.map((k: string) => (
                <span key={k} className="text-xs px-2 py-0.5 rounded bg-muted">
                  {k}
                </span>
              ))}
            </div>
          </Section>
        )}
        {(p.og_title || p.og_description) && (
          <Section title="Open Graph">
            <div className="text-sm">
              <div className="font-medium">{p.og_title}</div>
              <div className="text-muted-foreground">{p.og_description}</div>
            </div>
          </Section>
        )}
      </div>
    );
  }

  if (mode === "pinterest") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {(p.pins ?? []).map((pin: any, i: number) => (
          <div key={i} className="border rounded-lg p-3 space-y-1.5">
            <div className="font-medium text-sm">{pin.title}</div>
            <div className="text-xs text-muted-foreground">{pin.description}</div>
            <div className="text-[11px] text-primary">{(pin.hashtags ?? []).join(" ")}</div>
            {pin.image_prompt && (
              <div className="text-[11px] italic text-muted-foreground border-t pt-1 mt-1">
                🎨 {pin.image_prompt}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (mode === "facebook") {
    return (
      <div className="space-y-3">
        {(p.posts ?? []).map((post: any, i: number) => (
          <div key={i} className="border rounded-lg p-3 space-y-1.5">
            <div className="text-sm whitespace-pre-wrap">{post.text}</div>
            <div className="text-[11px] text-primary">{(post.hashtags ?? []).join(" ")}</div>
            {post.cta && <div className="text-xs font-medium">→ {post.cta}</div>}
          </div>
        ))}
      </div>
    );
  }

  if (mode === "twitter") {
    return (
      <div className="space-y-4">
        {p.tweets && (
          <Section title="Tweets">
            <div className="space-y-2">
              {p.tweets.map((t: any, i: number) => (
                <div key={i} className="border rounded-lg p-3 text-sm">
                  <div className="whitespace-pre-wrap">{t.text}</div>
                  <div className="text-[11px] text-primary mt-1">
                    {(t.hashtags ?? []).join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
        {p.thread && (
          <Section title="Thread">
            <div className="space-y-2">
              {p.thread.map((t: string, i: number) => (
                <div key={i} className="border-l-2 border-primary pl-3 text-sm whitespace-pre-wrap">
                  {i + 1}/ {t}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    );
  }

  if (mode === "instagram") {
    return (
      <div className="space-y-3">
        {(p.captions ?? []).map((c: any, i: number) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <div className="text-sm whitespace-pre-wrap">{c.caption}</div>
            <div className="text-[11px] text-primary">{(c.hashtags ?? []).join(" ")}</div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "newsletter") {
    return (
      <div className="space-y-3">
        <Section title="Subject">
          <div className="font-medium">{p.subject}</div>
        </Section>
        {p.preheader && (
          <Section title="Preheader">
            <div className="text-muted-foreground">{p.preheader}</div>
          </Section>
        )}
        {p.html && (
          <Section title="Email preview">
            <div
              className="border rounded-lg p-4 bg-background prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: p.html }}
            />
          </Section>
        )}
      </div>
    );
  }

  // schema or fallback
  return (
    <pre className="text-xs bg-muted/40 rounded p-3 whitespace-pre-wrap overflow-auto max-h-[500px]">
      {JSON.stringify(p, null, 2)}
    </pre>
  );
}
