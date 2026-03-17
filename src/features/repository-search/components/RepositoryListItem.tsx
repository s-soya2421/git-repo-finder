"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { formatNumber } from "@/shared/lib/format-number";
import { formatRelativeDate } from "@/shared/lib/format-relative-date";
import { classifyCodeFreshness } from "@/shared/lib/classify-code-freshness";
import { Badge } from "@/shared/ui/badge";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import {
  truncateDescription,
  shouldTruncateDescription,
  sliceVisibleTopics,
} from "../lib/display-helpers";
import type { RepositoryListItemViewModel } from "../types";

type RepositoryListItemProps = {
  repository: RepositoryListItemViewModel;
};

export function RepositoryListItem({ repository }: RepositoryListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const codeFreshness = classifyCodeFreshness(repository.pushedAt);

  const displayDescription = truncateDescription(repository.description, isExpanded);
  const shouldTruncate = shouldTruncateDescription(repository.description);

  const { visibleTopics, hiddenTopicCount } = sliceVisibleTopics(repository.topics);

  return (
    <article className="flex flex-col gap-2 border-b border-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={repository.ownerAvatarUrl}
            alt={`${repository.owner} のアバター`}
            width={24}
            height={24}
            className="size-6 shrink-0 rounded-full"
          />
          <Link
            href={`/repositories/${repository.owner}/${repository.name}`}
            className="group/repo text-base font-semibold leading-snug text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <span className="font-semibold text-muted-foreground group-hover/repo:text-inherit">{repository.owner}</span>
            <span className="text-muted-foreground/60 group-hover/repo:text-inherit">/</span>
            {repository.name}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <FavoriteButton
            repository={{
              id: repository.id,
              owner: repository.owner,
              repo: repository.name,
              description: repository.description,
              language: repository.language,
              stars: repository.stars,
            }}
            compact
          />
          <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={`${repository.name} を GitHub で開く`}
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>

      {displayDescription !== null && (
        <div className="text-sm text-muted-foreground pl-[34px]">
          <p>{displayDescription}</p>
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="mt-1 text-xs font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {isExpanded ? "折りたたむ" : "続きを読む"}
            </button>
          )}
        </div>
      )}

      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-[34px]">
          {visibleTopics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {topic}
            </span>
          ))}
          {hiddenTopicCount > 0 && (
            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              +{hiddenTopicCount}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 pl-[34px]">
        {repository.archived && <Badge variant="destructive">Archived</Badge>}
        {repository.disabled && <Badge variant="destructive">Disabled</Badge>}
        <Badge variant={codeFreshness === "stale" ? "destructive" : "outline"}>
          コード更新: {formatRelativeDate(repository.pushedAt)}
          {codeFreshness === "stale" ? "（要注意）" : ""}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-[34px] text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Star数</span>
          {formatNumber(repository.stars)}
        </span>
        {repository.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
            {repository.language}
          </span>
        )}
        {repository.license && (
          <span>{repository.license}</span>
        )}
        <span>{formatRelativeDate(repository.updatedAt)}</span>
      </div>
    </article>
  );
}
