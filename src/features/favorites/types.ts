import type { StoredRepository } from "@/shared/types/stored-repository";

export type FavoriteItem = StoredRepository & {
  savedAt: string;
};
