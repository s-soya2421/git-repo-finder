import type { RepositoryDetailViewModel } from "../types";
import { RepositoryHeader } from "./RepositoryHeader";
import { RepositoryStats } from "./RepositoryStats";
import { RepositoryMeta } from "./RepositoryMeta";
import { ExternalLinks } from "./ExternalLinks";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";

type RepositoryDetailProps = {
  repository: RepositoryDetailViewModel;
};

export function RepositoryDetail({ repository }: RepositoryDetailProps) {
  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
}
