export function RepositoryDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-start gap-4">
        <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-24 animate-pulse rounded bg-muted" />
        ))}
      </div>

      <hr className="border-foreground/10" />

      {/* Meta skeleton */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-40 animate-pulse rounded bg-muted" />
        ))}
      </div>

      <hr className="border-foreground/10" />

      {/* Links skeleton */}
      <div className="flex gap-3">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
