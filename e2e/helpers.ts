import type { Page } from "@playwright/test";

const FAVORITES_STORAGE_KEY = "git-repo-finder:favorites";
const RECENTLY_VIEWED_STORAGE_KEY = "git-repo-finder:recently-viewed";

async function seedLocalStorage(
  page: Page,
  key: string,
  data: unknown[],
): Promise<void> {
  await page.evaluate(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key, data },
  );
}

/** localStorage にお気に入りデータを直接セットする */
export async function seedFavorite(page: Page): Promise<void> {
  await seedLocalStorage(page, FAVORITES_STORAGE_KEY, [
    {
      id: 1,
      owner: "facebook",
      repo: "react",
      description: "The library for web and native user interfaces.",
      language: "JavaScript",
      stars: 220000,
      savedAt: new Date().toISOString(),
    },
  ]);
}

/** localStorage に最近見たデータを直接セットする */
export async function seedRecentlyViewed(page: Page): Promise<void> {
  await seedLocalStorage(page, RECENTLY_VIEWED_STORAGE_KEY, [
    {
      id: 1,
      owner: "facebook",
      repo: "react",
      description: "The library for web and native user interfaces.",
      language: "JavaScript",
      stars: 220000,
      viewedAt: new Date().toISOString(),
    },
  ]);
}
