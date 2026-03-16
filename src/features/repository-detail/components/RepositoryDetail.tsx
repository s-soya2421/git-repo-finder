import { Suspense } from "react";
import type { RepositoryDetailViewModel } from "../types";
import { RepositoryHeader } from "./RepositoryHeader";
import { RepositoryStats } from "./RepositoryStats";
import { RepositoryMeta } from "./RepositoryMeta";
import { ExternalLinks } from "./ExternalLinks";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { RecentlyViewedRecorder } from "@/features/recently-viewed/components/RecentlyViewedRecorder";
import { RepositoryReadme } from "./RepositoryReadme";

type RepositoryDetailProps = {
  repository: RepositoryDetailViewModel;
};

export function RepositoryDetail({ repository }: RepositoryDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <RecentlyViewedRecorder
        repository={{
          id: repository.id,
          owner: repository.owner,
          repo: repository.name,
          description: repository.description,
          language: repository.language,
          stars: repository.stars,
        }}
      />
      <RepositoryHeader repository={repository} />
      <FavoriteButton
        repository={{
          id: repository.id,
          owner: repository.owner,
          repo: repository.name,
          description: repository.description,
          language: repository.language,
          stars: repository.stars,
        }}
      />
      <RepositoryStats repository={repository} />
      <hr className="border-foreground/10" />
      <RepositoryMeta repository={repository} />
      <hr className="border-foreground/10" />
      <ExternalLinks repository={repository} />
      <hr className="border-foreground/10" />
      <Suspense
        fallback={
          <div className="rounded-lg border border-border p-6">
            <div className="mb-4 h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>
          </div>
        }
      >
        <RepositoryReadme owner={repository.owner} repo={repository.name} />
      </Suspense>
    </div>
  );
}
