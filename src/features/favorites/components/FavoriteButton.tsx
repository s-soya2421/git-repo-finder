"use client";

import { useEffect, useState } from "react";
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
};

export function FavoriteButton({ repository }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(repository.id));
  }, [repository.id]);

  function handleToggle() {
    if (favorited) {
      removeFavorite(repository.id);
      setFavorited(false);
    } else {
      addFavorite(repository);
      setFavorited(true);
    }
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
