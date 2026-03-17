import { test, expect } from "@playwright/test";
import { seedFavorite } from "./helpers";

test.describe("お気に入り機能", () => {
  test("詳細ページでお気に入り追加 → /favorites に表示される", async ({
    page,
  }) => {
    // 詳細ページを開く
    await page.goto("/repositories/facebook/react");
    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();

    // お気に入りに追加
    const favButton = page.getByLabel("お気に入りに追加");
    await favButton.click();

    // ボタンのテキストが変わる
    await expect(page.getByLabel("お気に入りから削除")).toBeVisible();
    await expect(page.getByText("お気に入り済み")).toBeVisible();

    // /favorites へ移動（localStorage は保持される）
    await page.goto("/favorites");
    await expect(page.getByText("facebook/react")).toBeVisible();
  });

  test("お気に入りボタンの状態トグル（追加/解除）", async ({ page }) => {
    await page.goto("/repositories/facebook/react");
    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();

    // 追加
    await page.getByLabel("お気に入りに追加").click();
    await expect(page.getByLabel("お気に入りから削除")).toBeVisible();

    // 解除
    await page.getByLabel("お気に入りから削除").click();
    await expect(page.getByLabel("お気に入りに追加")).toBeVisible();
  });

  test("/favorites で個別削除できる", async ({ page }) => {
    // /favorites を開いてから localStorage をセット
    await page.goto("/favorites");
    await seedFavorite(page);
    // リロードして反映
    await page.reload();

    await expect(page.getByText("facebook/react")).toBeVisible();

    // 個別削除
    const deleteButton = page.getByLabel("facebook/react をお気に入りから削除");
    await deleteButton.click();

    // 空状態になる
    await expect(page.getByText("お気に入りはまだありません")).toBeVisible();
  });

  test("お気に入りが空のとき EmptyState が表示される", async ({ page }) => {
    await page.goto("/favorites");

    await expect(page.getByText("お気に入りはまだありません")).toBeVisible();
    await expect(
      page.getByText("リポジトリ詳細画面からお気に入りに追加できます"),
    ).toBeVisible();
  });
});
