import type { RepositoryDetailViewModel, LatestReleaseViewModel } from "../types";
import { RepositoryHeader } from "./RepositoryHeader";
import { RepositoryStats } from "./RepositoryStats";
import { RepositoryMeta } from "./RepositoryMeta";
import { RepositoryActivity } from "./RepositoryActivity";
import { ExternalLinks } from "./ExternalLinks";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { RecentlyViewedRecorder } from "@/features/recently-viewed/components/RecentlyViewedRecorder";
import { RepositoryReadme } from "./RepositoryReadme";

type RepositoryDetailProps = {
  repository: RepositoryDetailViewModel;
  readmeContent: string | null;
  latestRelease: LatestReleaseViewModel | null;
};

export function RepositoryDetail({ repository, readmeContent, latestRelease }: RepositoryDetailProps) {
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
      <RepositoryActivity latestRelease={latestRelease} />
      <hr className="border-foreground/10" />
      <RepositoryMeta repository={repository} />
      <hr className="border-foreground/10" />
      <ExternalLinks repository={repository} />
      <hr className="border-foreground/10" />
      <RepositoryReadme content={readmeContent} />
    </div>
  );
}
