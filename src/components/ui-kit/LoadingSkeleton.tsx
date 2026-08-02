import { Skeleton } from "@/components/ui/skeleton";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Skeleton className="size-11 rounded-xl" />
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-5/6" />
    </div>
  );
}

export function ToolGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <SiteLayout>
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <SanatanLoader
          title="Page load ho raha hai"
          subtitle="Sanatan Tools taiyaar ho rahe hain…"
        />
        <div className="mt-10">
          <ToolGridSkeleton count={6} />
        </div>
      </div>
    </SiteLayout>
  );
}

export function ToolPageSkeleton() {
  return (
    <SiteLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <SanatanLoader
          title="Tool taiyaar ho raha hai"
          subtitle="Aapke liye best experience load ho raha hai…"
        />
      </div>
    </SiteLayout>
  );
}
