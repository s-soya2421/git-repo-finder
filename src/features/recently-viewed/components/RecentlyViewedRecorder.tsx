"use client";

import { useEffect } from "react";
import type { StoredRepository } from "@/shared/types/stored-repository";
import { addRecentlyViewed } from "../lib/recently-viewed-storage";

type RecentlyViewedRecorderProps = {
  repository: StoredRepository;
};

export function RecentlyViewedRecorder({
  repository,
}: RecentlyViewedRecorderProps) {
  useEffect(() => {
    addRecentlyViewed(repository);
  }, [repository]);

  return null;
}
