import { getStorageItems, setStorageItems } from "@/shared/lib/storage";
import { RECENTLY_VIEWED_STORAGE_KEY } from "@/shared/lib/storage-keys";
import type { StoredRepository } from "@/shared/types/stored-repository";
import type { RecentlyViewedItem } from "../types";

const MAX_ITEMS = 20;

export function getRecentlyViewed(): RecentlyViewedItem[] {
  return getStorageItems<RecentlyViewedItem>(RECENTLY_VIEWED_STORAGE_KEY);
}

export function addRecentlyViewed(repo: StoredRepository): void {
  const items = getRecentlyViewed().filter((item) => item.id !== repo.id);
  const newItem: RecentlyViewedItem = {
    ...repo,
    viewedAt: new Date().toISOString(),
  };
  const updated = [newItem, ...items].slice(0, MAX_ITEMS);
  setStorageItems(RECENTLY_VIEWED_STORAGE_KEY, updated);
}

export function removeRecentlyViewed(id: number): void {
  const items = getRecentlyViewed();
  setStorageItems(
    RECENTLY_VIEWED_STORAGE_KEY,
    items.filter((item) => item.id !== id),
  );
}

export function clearAllRecentlyViewed(): void {
  setStorageItems(RECENTLY_VIEWED_STORAGE_KEY, []);
}
