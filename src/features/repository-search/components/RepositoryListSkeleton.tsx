import { cn } from "@/shared/lib/cn";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted", className)}
      aria-hidden="true"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-3">
        <SkeletonLine className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>
      <SkeletonLine className="h-3.5 w-full max-w-md" />
      <div className="flex flex-wrap gap-2">
        <SkeletonLine className="h-5 w-16 rounded-full" />
        <SkeletonLine className="h-5 w-20 rounded-full" />
        <SkeletonLine className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonLine className="h-3 w-12" />
        <SkeletonLine className="h-3 w-16" />
        <SkeletonLine className="h-3 w-20" />
      </div>
    </div>
  );
}

export function RepositoryListSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="読み込み中">
      <SkeletonLine className="h-5 w-48" />
      <SkeletonLine className="h-3.5 w-32" />
      <div className="mt-2 flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
