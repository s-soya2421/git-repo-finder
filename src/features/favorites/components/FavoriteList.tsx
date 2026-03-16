"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/shared/ui/button";
import type { FavoriteItem } from "../types";
import {
  getFavorites,
  removeFavorite,
  clearAllFavorites,
} from "../lib/favorites-storage";
import { FavoriteListItem } from "./FavoriteListItem";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const emptyArray: FavoriteItem[] = [];

function getServerSnapshot() {
  return emptyArray;
}

export function FavoriteList() {
  const getSnapshot = useCallback(() => getFavorites(), []);

  const items = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );

  function handleRemove(id: number) {
    removeFavorite(id);
    window.dispatchEvent(new Event("storage"));
  }

  function handleClearAll() {
    clearAllFavorites();
    window.dispatchEvent(new Event("storage"));
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          お気に入りはまだありません
        </p>
        <p className="text-sm text-muted-foreground">
          リポジトリ詳細画面からお気に入りに追加できます
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          お気に入り（{items.length}件）
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          aria-label="お気に入りをすべて削除"
        >
          すべて削除
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <FavoriteListItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
