import { QueryClient } from "@tanstack/react-query";
import { createRouter, Link } from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { routeTree } from "./routeTree.gen";
import { tStandalone } from "./i18n/standalone";

function DefaultPending() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">{tStandalone("loading.default")}</span>
      </div>
    </div>
  );
}

function DefaultError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold">
          {tStandalone("errors.boundary_title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{tStandalone("errors.boundary_body")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="size-4" /> {tStandalone("common.retry")}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Home className="size-4" /> {tStandalone("common.go_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function DefaultNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-primary">
        {tStandalone("errors.not_found_code")}
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        {tStandalone("errors.not_found_title")}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {tStandalone("errors.not_found_body")}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {tStandalone("common.go_home")}
      </Link>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: DefaultPending,
    defaultErrorComponent: DefaultError,
    defaultNotFoundComponent: DefaultNotFound,
    defaultPendingMs: 200,
    defaultPendingMinMs: 300,
  });

  return router;
};
