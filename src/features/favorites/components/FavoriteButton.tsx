"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { StoredRepository } from "@/shared/types/stored-repository";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../lib/favorites-storage";

type FavoriteButtonProps = {
  repository: StoredRepository;
  compact?: boolean;
};

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return false;
}

export function FavoriteButton({ repository, compact = false }: FavoriteButtonProps) {
  const getSnapshot = useCallback(
    () => isFavorite(repository.id),
    [repository.id],
  );

  const favorited = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );

  function handleToggle() {
    if (favorited) {
      removeFavorite(repository.id);
    } else {
      addFavorite(repository);
    }
    // Force re-render by dispatching a storage event
    window.dispatchEvent(new Event("storage"));
  }

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        aria-label={favorited ? "お気に入りから削除" : "お気に入りに追加"}
        aria-pressed={favorited}
        className="size-8"
      >
        <Heart
          className={`size-4 ${favorited ? "fill-current text-red-500" : ""}`}
          aria-hidden="true"
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleToggle}
      aria-label={favorited ? "お気に入りから削除" : "お気に入りに追加"}
      aria-pressed={favorited}
    >
      <Heart
        className={`size-4 ${favorited ? "fill-current text-red-500" : ""}`}
        aria-hidden="true"
      />
      {favorited ? "お気に入り済み" : "お気に入り"}
    </Button>
  );
}
