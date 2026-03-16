import Image from "next/image";
import type { RepositoryDetailViewModel } from "../types";

type RepositoryHeaderProps = {
  repository: RepositoryDetailViewModel;
};

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <Image
        src={repository.ownerAvatarUrl}
        alt={`${repository.owner} のアバター`}
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full"
      />
      <div className="min-w-0">
        <h1 className="text-xl font-bold leading-snug">{repository.name}</h1>
        <p className="text-sm text-muted-foreground">{repository.owner}</p>
        {repository.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {repository.description}
          </p>
        )}
      </div>
    </div>
  );
}
