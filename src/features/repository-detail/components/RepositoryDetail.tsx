import type { RepositoryDetailViewModel } from "../types";
import { RepositoryHeader } from "./RepositoryHeader";
import { RepositoryStats } from "./RepositoryStats";
import { RepositoryMeta } from "./RepositoryMeta";
import { ExternalLinks } from "./ExternalLinks";
import { RecentlyViewedRecorder } from "@/features/recently-viewed/components/RecentlyViewedRecorder";

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
      <RepositoryStats repository={repository} />
      <hr className="border-foreground/10" />
      <RepositoryMeta repository={repository} />
      <hr className="border-foreground/10" />
      <ExternalLinks repository={repository} />
    </div>
  );
}
