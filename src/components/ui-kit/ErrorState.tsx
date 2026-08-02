import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  wrap?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this section. Please try again in a moment.",
  onRetry,
  showHome = true,
  wrap = true,
}: Props) {
  const body = (
    <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-card">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/15 text-destructive">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button onClick={onRetry} size="sm">
            <RefreshCw className="mr-1.5 size-4" /> Try again
          </Button>
        )}
        {showHome && (
          <Button asChild size="sm" variant="outline">
            <a href="/">
              <Home className="mr-1.5 size-4" /> Go home
            </a>
          </Button>
        )}
      </div>
    </div>
  );
  if (!wrap) return body;
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">{body}</div>
    </SiteLayout>
  );
}
