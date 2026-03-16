"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/shared/ui/button";
import type { RecentlyViewedItem } from "../types";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearAllRecentlyViewed,
} from "../lib/recently-viewed-storage";
import { RecentlyViewedListItem } from "./RecentlyViewedListItem";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const emptyArray: RecentlyViewedItem[] = [];

function getServerSnapshot() {
  return emptyArray;
}

export function RecentlyViewedList() {
  const getSnapshot = useCallback(() => getRecentlyViewed(), []);

  const items = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );

  function handleRemove(id: number) {
    removeRecentlyViewed(id);
    window.dispatchEvent(new Event("storage"));
  }

  function handleClearAll() {
    clearAllRecentlyViewed();
    window.dispatchEvent(new Event("storage"));
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">最近見たリポジトリ</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          aria-label="最近見たリポジトリをすべて削除"
        >
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
