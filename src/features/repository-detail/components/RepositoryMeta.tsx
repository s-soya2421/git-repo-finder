import { Badge } from "@/shared/ui/badge";
import { formatRelativeDate } from "@/shared/lib/format-relative-date";
import type { RepositoryDetailViewModel } from "../types";

type RepositoryMetaProps = {
  repository: RepositoryDetailViewModel;
};

export function RepositoryMeta({ repository }: RepositoryMetaProps) {
  return (
    <dl className="flex flex-col gap-3 text-sm">
      {repository.language && (
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 text-muted-foreground">言語</dt>
          <dd>{repository.language}</dd>
        </div>
      )}

      {repository.license && (
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 text-muted-foreground">ライセンス</dt>
          <dd>
            <Badge variant="outline">{repository.license}</Badge>
          </dd>
        </div>
      )}

      {repository.topics.length > 0 && (
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 text-muted-foreground">トピック</dt>
          <dd className="flex flex-wrap gap-1.5">
            {repository.topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </dd>
        </div>
      )}

      <div className="flex items-baseline gap-2">
        <dt className="shrink-0 text-muted-foreground">最終更新</dt>
        <dd>{formatRelativeDate(repository.updatedAt)}</dd>
      </div>

      {repository.homepage && (
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 text-muted-foreground">ホームページ</dt>
          <dd>
            <a
              href={repository.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {repository.homepage}
            </a>
          </dd>
        </div>
      )}
    </dl>
  );
}
