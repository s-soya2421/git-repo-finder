import { Tag } from "lucide-react";
import { formatRelativeDate } from "@/shared/lib/format-relative-date";
import type { LatestReleaseViewModel } from "../types";

type RepositoryActivityProps = {
  latestRelease: LatestReleaseViewModel | null;
};

export function RepositoryActivity({ latestRelease }: RepositoryActivityProps) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <h3 className="font-medium">最新リリース</h3>
      {latestRelease ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tag className="size-4 shrink-0" aria-hidden="true" />
          <a
            href={latestRelease.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {latestRelease.tagName}
          </a>
          <span>・{formatRelativeDate(latestRelease.publishedAt)}</span>
        </div>
      ) : (
        <p className="text-muted-foreground">リリースなし</p>
      )}
    </div>
  );
}
