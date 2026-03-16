import { RepositoryDetailSkeleton } from "@/features/repository-detail/components/RepositoryDetailSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <RepositoryDetailSkeleton />
    </div>
  );
}
