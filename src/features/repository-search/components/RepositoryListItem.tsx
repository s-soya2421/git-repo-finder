"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { formatNumber } from "@/shared/lib/format-number";
import { formatRelativeDate } from "@/shared/lib/format-relative-date";
import type { RepositoryListItemViewModel } from "../types";

const DESCRIPTION_TRUNCATE_LENGTH = 50;
const MAX_VISIBLE_TOPICS = 3;

type RepositoryListItemProps = {
  repository: RepositoryListItemViewModel;
};

export function RepositoryListItem({ repository }: RepositoryListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = repository.description;
  const shouldTruncate =
    description !== null && description.length > DESCRIPTION_TRUNCATE_LENGTH;
  const displayDescription =
    description === null
      ? null
      : shouldTruncate && !isExpanded
        ? description.slice(0, DESCRIPTION_TRUNCATE_LENGTH) + "…"
        : description;

  const visibleTopics = repository.topics.slice(0, MAX_VISIBLE_TOPICS);
  const hiddenTopicCount = repository.topics.length - MAX_VISIBLE_TOPICS;

  return (
    <article className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={repository.ownerAvatarUrl}
            alt={`${repository.owner} のアバター`}
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full"
          />
          <div className="min-w-0">
            <Link
              href={`/repositories/${repository.owner}/${repository.name}`}
              className="text-base font-semibold leading-snug hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {repository.name}
            </Link>
            <p className="text-sm text-muted-foreground">{repository.owner}</p>
          </div>
        </div>
        <a
          href={repository.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          aria-label={`${repository.name} を GitHub で開く`}
        >
          <ExternalLink className="size-3.5" />
          GitHub
        </a>
      </div>

      {displayDescription !== null && (
        <p className="text-sm text-muted-foreground">
          {displayDescription}
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {isExpanded ? "折りたたむ" : "続きを読む"}
            </button>
          )}
        </p>
      )}

      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTopics.map((topic) => (
            <Badge key={topic} variant="secondary">
              {topic}
            </Badge>
          ))}
          {hiddenTopicCount > 0 && (
            <Badge variant="outline">+{hiddenTopicCount}</Badge>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" />
          {formatNumber(repository.stars)}
        </span>
        {repository.language && <span>{repository.language}</span>}
        {repository.license && (
          <Badge variant="outline">{repository.license}</Badge>
        )}
        <span>{formatRelativeDate(repository.updatedAt)}</span>
      </div>
    </article>
  );
}
