import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import { formatRelativeDate } from "@/shared/lib/format-relative-date";
import type {
  CiStatus,
  PresenceStatus,
  RepositoryDetailViewModel,
  SecuritySignalsViewModel,
} from "../types";

type RepositoryMetaProps = {
  repository: RepositoryDetailViewModel;
  securitySignals: SecuritySignalsViewModel;
};

function presenceLabel(status: PresenceStatus): string {
  if (status === "present") return "あり";
  if (status === "absent") return "なし";
  return "不明";
}

function ciLabel(status: CiStatus): string {
  if (status === "success") return "成功";
  if (status === "failed") return "失敗";
  if (status === "none") return "ワークフローなし";
  return "不明";
}

function codeFreshnessLabel(status: SecuritySignalsViewModel["codeFreshness"]): string {
  if (status === "fresh") return "更新あり";
  if (status === "stale") return "要注意";
  return "不明";
}

export function RepositoryMeta({ repository, securitySignals }: RepositoryMetaProps) {
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
              <Link
                key={topic}
                href={`/?q=topic:${encodeURIComponent(topic)}`}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                  {topic}
                </Badge>
              </Link>
            ))}
          </dd>
        </div>
      )}

      <div className="flex items-baseline gap-2">
        <dt className="shrink-0 text-muted-foreground">最終更新</dt>
        <dd>{formatRelativeDate(repository.updatedAt)}</dd>
      </div>

      <div className="flex items-baseline gap-2">
        <dt className="shrink-0 text-muted-foreground">コード最終更新</dt>
        <dd className="flex items-center gap-2">
          <span>{formatRelativeDate(repository.pushedAt)}</span>
          <Badge
            variant={securitySignals.codeFreshness === "stale" ? "destructive" : "secondary"}
          >
            {codeFreshnessLabel(securitySignals.codeFreshness)}
          </Badge>
        </dd>
      </div>

      <div className="flex items-baseline gap-2">
        <dt className="shrink-0 text-muted-foreground">リポジトリ状態</dt>
        <dd className="flex flex-wrap items-center gap-1.5">
          {repository.archived && <Badge variant="destructive">Archived</Badge>}
          {repository.disabled && <Badge variant="destructive">Disabled</Badge>}
          {!repository.archived && !repository.disabled && (
            <Badge variant="secondary">Active</Badge>
          )}
        </dd>
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

      <div className="pt-2">
        <h3 className="mb-2 text-sm font-medium">Security Signals</h3>
        <dl className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 text-muted-foreground">SECURITY.md</dt>
            <dd>
              <Badge variant={securitySignals.securityPolicy === "present" ? "secondary" : "outline"}>
                {presenceLabel(securitySignals.securityPolicy)}
              </Badge>
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 text-muted-foreground">Dependabot</dt>
            <dd>
              <Badge variant={securitySignals.dependabot === "present" ? "secondary" : "outline"}>
                {presenceLabel(securitySignals.dependabot)}
              </Badge>
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 text-muted-foreground">CI</dt>
            <dd>
              <Badge
                variant={
                  securitySignals.ciStatus === "success"
                    ? "secondary"
                    : securitySignals.ciStatus === "failed"
                      ? "destructive"
                      : "outline"
                }
              >
                {ciLabel(securitySignals.ciStatus)}
              </Badge>
            </dd>
          </div>
        </dl>
      </div>
    </dl>
  );
}
