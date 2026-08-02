import { createFileRoute, notFound } from "@tanstack/react-router";
import { FormattedMarkdown } from "@/components/ui/FormattedMarkdown";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { getSharedReport } from "@/lib/workspace/shared.functions";

export const Route = createFileRoute("/reports/shared/$token")({
  loader: async ({ params }) => {
    const report = await getSharedReport({ data: { token: params.token } });
    if (!report) throw notFound();
    return { report };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Report unavailable — SanatanTools" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.report.title} — SanatanTools`;
    const description = `A shared astrology report from SanatanTools: ${loaderData.report.title}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: () => <SharedFallback message="This report could not be loaded." />,
  notFoundComponent: () => <SharedFallback message="This share link is no longer active." />,
  component: SharedReportPage,
});

function SharedFallback({ message }: { message: string }) {
  return (
    <SiteLayout>
      <section className="container-page py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Report unavailable</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
      </section>
    </SiteLayout>
  );
}

function SharedReportPage() {
  const { report } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="container-page py-10 md:py-16">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-widest text-accent">{report.kind}</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">{report.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Shared report · {report.language.toUpperCase()} ·{" "}
            {new Date(report.created_at).toLocaleDateString()}
          </p>
        </header>
        <Card className="p-6 md:p-8">
          <FormattedMarkdown
            content={report.content_md || "_This report has no written content._"}
          />
        </Card>
      </section>
    </SiteLayout>
  );
}
