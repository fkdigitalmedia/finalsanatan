/**
 * Website Sections editor — friendly forms over `site_settings` key/value rows.
 * Every section maps to one key (JSON value) so admins never touch raw JSON.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminList, adminUpsert } from "@/lib/admin.functions";

type FieldType = "text" | "textarea" | "url" | "email" | "boolean" | "color";

interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  help?: string;
}

interface SectionDef {
  key: string;
  title: string;
  description: string;
  isPublic: boolean;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    key: "site.brand",
    title: "Brand",
    description: "Site name, tagline and logo shown across header, footer and SEO.",
    isPublic: true,
    fields: [
      { name: "name", label: "Site name", placeholder: "SanatanTools" },
      { name: "tagline", label: "Tagline", placeholder: "Ancient wisdom, modern tools" },
      { name: "logo_url", label: "Logo URL", type: "url", placeholder: "https://…/logo.svg" },
      { name: "favicon_url", label: "Favicon URL", type: "url" },
      { name: "primary_color", label: "Primary color", type: "color" },
    ],
  },
  {
    key: "site.contact",
    title: "Contact Information",
    description: "Public contact details shown on Contact, Footer and legal pages.",
    isPublic: true,
    fields: [
      { name: "email", label: "Email", type: "email", placeholder: "hello@sanatantools.com" },
      { name: "phone", label: "Phone", placeholder: "+91 …" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "support_hours", label: "Support hours", placeholder: "Mon–Sat, 9am–6pm IST" },
    ],
  },
  {
    key: "site.social",
    title: "Social Links",
    description: "Social profile URLs shown in footer and share cards.",
    isPublic: true,
    fields: [
      { name: "twitter", label: "Twitter / X", type: "url" },
      { name: "instagram", label: "Instagram", type: "url" },
      { name: "facebook", label: "Facebook", type: "url" },
      { name: "youtube", label: "YouTube", type: "url" },
      { name: "whatsapp", label: "WhatsApp channel", type: "url" },
      { name: "telegram", label: "Telegram", type: "url" },
    ],
  },
  {
    key: "site.seo",
    title: "SEO Defaults",
    description: "Fallback meta title, description and OG image for pages without their own.",
    isPublic: true,
    fields: [
      {
        name: "default_title",
        label: "Default title",
        placeholder: "SanatanTools — Panchang, Kundli, Festivals",
      },
      { name: "title_suffix", label: "Title suffix", placeholder: " | SanatanTools" },
      { name: "default_description", label: "Default description", type: "textarea" },
      { name: "default_og_image", label: "Default OG image URL", type: "url" },
      { name: "keywords", label: "Keywords (comma separated)", type: "textarea" },
    ],
  },
  {
    key: "site.homepage_hero",
    title: "Homepage Hero",
    description: "Main hero block on the landing page.",
    isPublic: true,
    fields: [
      { name: "eyebrow", label: "Eyebrow text", placeholder: "Sanatan Dharma toolkit" },
      { name: "heading", label: "Heading" },
      { name: "subheading", label: "Sub-heading", type: "textarea" },
      { name: "cta_primary_label", label: "Primary CTA label", placeholder: "Explore tools" },
      { name: "cta_primary_href", label: "Primary CTA link", placeholder: "/tools" },
      { name: "cta_secondary_label", label: "Secondary CTA label" },
      { name: "cta_secondary_href", label: "Secondary CTA link" },
      { name: "background_image", label: "Background image URL", type: "url" },
    ],
  },
  {
    key: "site.announcement",
    title: "Announcement Bar",
    description: "Thin bar at the top of every page (e.g. festival greetings, sales).",
    isPublic: true,
    fields: [
      { name: "enabled", label: "Show announcement bar", type: "boolean" },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "🎉 Diwali special — 30% off Premium",
      },
      { name: "link_label", label: "Link label" },
      { name: "link_href", label: "Link URL", type: "url" },
      { name: "background_color", label: "Background color", type: "color" },
      { name: "text_color", label: "Text color", type: "color" },
    ],
  },
  {
    key: "site.footer",
    title: "Footer",
    description: "Footer copy, tagline and legal line.",
    isPublic: true,
    fields: [
      { name: "tagline", label: "Footer tagline", type: "textarea" },
      {
        name: "copyright",
        label: "Copyright line",
        placeholder: "© 2026 SanatanTools. All rights reserved.",
      },
      {
        name: "made_with",
        label: "Made-with line",
        placeholder: "Built with devotion in Bharat 🇮🇳",
      },
      { name: "show_newsletter", label: "Show newsletter signup", type: "boolean" },
    ],
  },
  {
    key: "site.newsletter_cta",
    title: "Newsletter CTA",
    description: "Signup card shown on tools, festivals and article pages.",
    isPublic: true,
    fields: [
      { name: "heading", label: "Heading", placeholder: "Daily Panchang in your inbox" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "button_label", label: "Button label", placeholder: "Subscribe free" },
    ],
  },
  {
    key: "site.about",
    title: "About Section",
    description: "Short about blurb used on homepage and About page hero.",
    isPublic: true,
    fields: [
      { name: "heading", label: "Heading", placeholder: "About SanatanTools" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "mission", label: "Mission statement", type: "textarea" },
      { name: "founder_note", label: "Founder note", type: "textarea" },
    ],
  },
  {
    key: "kundli.report",
    title: "Kundli Report (Free / Paid)",
    description:
      "Control whether the full Kundli PDF (with AI interpretation & all 14+ pages) is free for everyone or gated behind a payment. Turn ON to give away the full report for free; turn OFF to keep it as a paid premium download.",
    isPublic: true,
    fields: [
      {
        name: "free_full_report",
        label: "Give full Kundli report for FREE (skip paywall)",
        type: "boolean",
        help: "When ON, every user downloads the full premium PDF for free. When OFF, non-premium users see the payment popup.",
      },
    ],
  },
];

export function WebsiteSections() {
  const list = useServerFn(adminList);
  const q = useQuery({
    queryKey: ["admin", "site_settings", "all"],
    queryFn: () =>
      list({ data: { table: "site_settings", limit: 1000, order: "key", ascending: true } }),
  });

  const rowByKey: Record<string, any> = {};
  for (const row of (q.data?.rows ?? []) as any[]) rowByKey[row.key] = row;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-semibold">Website Sections</h1>
        <p className="text-sm text-muted-foreground">
          Edit the content shown across the public site. Each card saves to one key in{" "}
          <code className="rounded bg-muted px-1">site_settings</code>.
        </p>
      </header>

      {q.isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading current values…
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            initial={rowByKey[section.key]?.value ?? {}}
            existingIsPublic={rowByKey[section.key]?.is_public}
          />
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  initial,
  existingIsPublic,
}: {
  section: SectionDef;
  initial: Record<string, any>;
  existingIsPublic?: boolean;
}) {
  const [values, setValues] = useState<Record<string, any>>(initial ?? {});
  const [dirty, setDirty] = useState(false);
  const qc = useQueryClient();
  const upsertFn = useServerFn(adminUpsert);

  useEffect(() => {
    setValues(initial ?? {});
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const save = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          table: "site_settings",
          onConflict: "key",
          values: {
            key: section.key,
            value: values,
            is_public: existingIsPublic ?? section.isPublic,
          },
        },
      }),
    onSuccess: () => {
      toast.success(`${section.title} saved`);
      setDirty(false);
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to save"),
  });

  function update(name: string, val: any) {
    setValues((prev) => ({ ...prev, [name]: val }));
    setDirty(true);
  }

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{section.title}</h2>
        <p className="text-xs text-muted-foreground">{section.description}</p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">{section.key}</p>
      </div>

      <div className="grid gap-4">
        {section.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={values[f.name]}
            onChange={(v) => update(f.name, v)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        <Button
          size="sm"
          onClick={() => save.mutate()}
          disabled={save.isPending || !dirty}
          className="gap-2"
        >
          {save.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save
        </Button>
      </div>
    </section>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const type = field.type ?? "text";

  if (type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm">{field.label}</Label>
          {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
        </div>
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm">{field.label}</Label>
        <Textarea
          rows={3}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </div>
    );
  }

  if (type === "color") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm">{field.label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            className="h-10 w-16 p-1"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
          />
          <Input
            type="text"
            value={value ?? ""}
            placeholder="#RRGGBB"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{field.label}</Label>
      <Input
        type={type === "email" ? "email" : type === "url" ? "url" : "text"}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
