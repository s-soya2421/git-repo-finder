import type { StoredRepository } from "@/shared/types/stored-repository";

export type RecentlyViewedItem = StoredRepository & {
  viewedAt: string;
};
