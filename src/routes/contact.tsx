import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { LegalShell, type LegalPage } from "@/components/legal/LegalShell";
import { getLegalPage, submitContactMessage } from "@/lib/legal.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const q = queryOptions({
  queryKey: ["legal-page", "contact"],
  queryFn: () => getLegalPage({ data: { slug: "contact" } }),
  staleTime: 60_000,
});

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl">Contact page not published.</h1>
        <Button asChild className="mt-6">
          <Link to="/">Home</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  head: () => {
    const url = "https://dharma-divine-tools.lovable.app/contact";
    const title = "Contact SanatanTools — Support, Feedback & Partnerships";
    const description =
      "Reach the SanatanTools team for support, bug reports, feature requests, partnerships, media, and general questions.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ContactPage,
});

const ContactForm = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().trim().max(200).optional(),
  topic: z.enum([
    "support",
    "bug",
    "feature",
    "partnership",
    "media",
    "business",
    "general",
    "privacy",
    "copyright",
  ]),
  message: z.string().trim().min(10, "Please write a bit more").max(4000),
});

function ContactPage() {
  const { data } = useSuspenseQuery(q);
  const submit = useServerFn(submitContactMessage);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    topic: "general" as const,
    message: "",
  });

  const mut = useMutation({
    mutationFn: (payload: z.infer<typeof ContactForm>) =>
      submit({
        data: {
          ...payload,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Thanks! We'll be in touch shortly.");
      setForm({ name: "", email: "", subject: "", topic: "general", message: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ContactForm.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    mut.mutate(parsed.data);
  };

  return (
    <SiteLayout>
      {data.page && <LegalShell page={data.page as LegalPage} />}
      <div className="container-page pb-16 -mt-8">
        <Card className="p-6 md:p-8 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We usually reply within 2 business days.
          </p>
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Topic</Label>
              <Select
                value={form.topic}
                onValueChange={(v) => setForm({ ...form, topic: v as typeof form.topic })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General inquiry</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="bug">Bug report</SelectItem>
                  <SelectItem value="feature">Feature request</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="media">Media / press</SelectItem>
                  <SelectItem value="business">Business inquiry</SelectItem>
                  <SelectItem value="privacy">Privacy / data</SelectItem>
                  <SelectItem value="copyright">Copyright / DMCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                By sending, you agree to our{" "}
                <Link to="/legal/$slug" params={{ slug: "privacy-policy" }} className="underline">
                  Privacy Policy
                </Link>
                .
              </span>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SiteLayout>
  );
}
