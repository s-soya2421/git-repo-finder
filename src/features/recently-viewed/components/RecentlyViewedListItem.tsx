"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatNumber } from "@/shared/lib/format-number";
import type { RecentlyViewedItem } from "../types";

type RecentlyViewedListItemProps = {
  item: RecentlyViewedItem;
  onRemove: (id: number) => void;
};

export function RecentlyViewedListItem({
  item,
  onRemove,
}: RecentlyViewedListItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`/repositories/${item.owner}/${item.repo}`}
          className="truncate font-medium hover:underline"
        >
          {item.owner}/{item.repo}
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {item.language && <span>{item.language}</span>}
          <span className="inline-flex items-center gap-1">
            <Star className="size-3" aria-hidden="true" />
            {formatNumber(item.stars)}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        aria-label={`${item.owner}/${item.repo} を履歴から削除`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
