import { RepositoryListSkeleton } from "@/features/repository-search/components/RepositoryListSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <RepositoryListSkeleton />
      </div>
    </div>
  );
}
