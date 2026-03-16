"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatNumber } from "@/shared/lib/format-number";
import type { FavoriteItem } from "../types";

type FavoriteListItemProps = {
  item: FavoriteItem;
  onRemove: (id: number) => void;
};

export function FavoriteListItem({ item, onRemove }: FavoriteListItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`/repositories/${item.owner}/${item.repo}`}
          className="truncate font-medium hover:underline"
        >
          {item.owner}/{item.repo}
        </Link>
        {item.description && (
          <p className="truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
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
        aria-label={`${item.owner}/${item.repo} をお気に入りから削除`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
