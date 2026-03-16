"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import type { RecentlyViewedItem } from "../types";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearAllRecentlyViewed,
} from "../lib/recently-viewed-storage";
import { RecentlyViewedListItem } from "./RecentlyViewedListItem";

export function RecentlyViewedList() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  function handleRemove(id: number) {
    removeRecentlyViewed(id);
    setItems(getRecentlyViewed());
  }

  function handleClearAll() {
    clearAllRecentlyViewed();
    setItems([]);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">最近見たリポジトリ</h2>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          すべて削除
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <RecentlyViewedListItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
