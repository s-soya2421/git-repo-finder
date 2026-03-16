import { getStorageItems, setStorageItems } from "@/shared/lib/storage";
import { FAVORITES_STORAGE_KEY } from "@/shared/lib/storage-keys";
import type { StoredRepository } from "@/shared/types/stored-repository";
import type { FavoriteItem } from "../types";

export function getFavorites(): FavoriteItem[] {
  return getStorageItems<FavoriteItem>(FAVORITES_STORAGE_KEY);
}

export function addFavorite(repo: StoredRepository): void {
  const items = getFavorites();
  if (items.some((item) => item.id === repo.id)) return;
  const newItem: FavoriteItem = {
    ...repo,
    savedAt: new Date().toISOString(),
  };
  setStorageItems(FAVORITES_STORAGE_KEY, [newItem, ...items]);
}

export function removeFavorite(id: number): void {
  const items = getFavorites();
  setStorageItems(
    FAVORITES_STORAGE_KEY,
    items.filter((item) => item.id !== id),
  );
}

export function clearAllFavorites(): void {
  setStorageItems(FAVORITES_STORAGE_KEY, []);
}

export function isFavorite(id: number): boolean {
  return getFavorites().some((item) => item.id === id);
}
