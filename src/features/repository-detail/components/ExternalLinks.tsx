import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import type { RepositoryDetailViewModel } from "../types";

type ExternalLinksProps = {
  repository: RepositoryDetailViewModel;
};

export function ExternalLinks({ repository }: ExternalLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={repository.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        GitHub で開く
      </a>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        一覧に戻る
      </Link>
    </div>
  );
}
