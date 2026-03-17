import { test, expect } from "@playwright/test";
import { seedRecentlyViewed } from "./helpers";

test.describe("最近見たリポジトリ", () => {
  test("詳細ページ訪問 → トップページに「最近見たリポジトリ」が表示される", async ({
    page,
  }) => {
    // 詳細ページを訪問して記録させる
    await page.goto("/repositories/facebook/react");
    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();

    // トップページに戻る
    await page.goto("/");

    // 最近見たリポジトリが表示される
    await expect(page.getByText("最近見たリポジトリ")).toBeVisible();
    await expect(page.getByText("facebook/react")).toBeVisible();
  });

  test("個別削除できる", async ({ page }) => {
    // トップページを開いてから localStorage をセット
    await page.goto("/");
    await seedRecentlyViewed(page);
    await page.reload();

    await expect(page.getByText("最近見たリポジトリ")).toBeVisible();

    // 個別削除
    const deleteButton = page.getByLabel("facebook/react を履歴から削除");
    await deleteButton.click();

    // 最近見たリポジトリセクションが消える（空の場合は非表示）
    await expect(page.getByText("最近見たリポジトリ")).not.toBeVisible();
  });

  test("すべて削除できる", async ({ page }) => {
    // トップページを開いてから localStorage をセット
    await page.goto("/");
    await seedRecentlyViewed(page);
    await page.reload();

    await expect(page.getByText("最近見たリポジトリ")).toBeVisible();

    // すべて削除
    const clearAllButton = page.getByLabel(
      "最近見たリポジトリをすべて削除",
    );
    await clearAllButton.click();

    // セクションが消える
    await expect(page.getByText("最近見たリポジトリ")).not.toBeVisible();
  });

  test("最近見たリポジトリがない場合は非表示", async ({ page }) => {
    await page.goto("/");

    // セクションが表示されない
    await expect(page.getByText("最近見たリポジトリ")).not.toBeVisible();
  });
});
