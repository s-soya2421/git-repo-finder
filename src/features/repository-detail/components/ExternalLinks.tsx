import { ExternalLink, CircleDot, GitPullRequest, Tag } from "lucide-react";
import type { RepositoryDetailViewModel } from "../types";
import { BackToListButton } from "./BackToListButton";

type ExternalLinksProps = {
  repository: RepositoryDetailViewModel;
};

const SUB_LINKS = [
  { label: "Issues", icon: CircleDot, path: "/issues" },
  { label: "Pull Requests", icon: GitPullRequest, path: "/pulls" },
  { label: "Releases", icon: Tag, path: "/releases" },
] as const;

export function ExternalLinks({ repository }: ExternalLinksProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={repository.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${repository.owner}/${repository.name} を GitHub で開く（外部サイト）`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          GitHub で開く
        </a>
        <BackToListButton />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {SUB_LINKS.map(({ label, icon: Icon, path }) => (
          <a
            key={path}
            href={`${repository.htmlUrl}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
