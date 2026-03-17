import { test, expect } from "@playwright/test";

test.describe("詳細画面遷移", () => {
  test("一覧から詳細へ遷移し、戻れる", async ({ page }) => {
    await page.goto("/?q=react");

    // 結果が表示されるまで待つ
    await expect(page.getByRole("article").first()).toBeVisible();

    // リポジトリ名リンクをクリック（href で特定）
    const repoLink = page.locator(
      'a[href="/repositories/facebook/react"]',
    ).first();
    await repoLink.click();

    // 詳細ページの URL に遷移
    await page.waitForURL(/\/repositories\/facebook\/react/, {
      timeout: 10_000,
    });

    // 詳細情報が表示される
    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();

    // 戻るナビゲーション
    await page.goBack();
    await expect(page).toHaveURL(/[?&]q=react/);
  });
});

test.describe("詳細ページ直接アクセス", () => {
  test("URL 直接アクセスで詳細ページが表示される", async ({ page }) => {
    await page.goto("/repositories/facebook/react");

    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();
  });
});

test.describe("404", () => {
  test("存在しないリポジトリで 404 が表示される", async ({ page }) => {
    await page.goto("/repositories/nonexistent/repo");

    await expect(
      page.getByText("リポジトリが見つかりませんでした"),
    ).toBeVisible();
    await expect(page.getByText("トップへ戻る")).toBeVisible();
  });
});

test.describe("詳細ページの外部リンク", () => {
  test("GitHub リポジトリへのリンクが正しい href を持つ", async ({ page }) => {
    await page.goto("/repositories/facebook/react");

    // ExternalLinks コンポーネント: aria-label="facebook/react を GitHub で開く（外部サイト）"
    const githubLink = page.getByLabel(
      "facebook/react を GitHub で開く（外部サイト）",
    );
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/facebook/react",
    );
  });
});

test.describe("詳細ページのコンテンツ表示", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/repositories/facebook/react");
    await expect(
      page.getByText("The library for web and native user interfaces").first(),
    ).toBeVisible();
  });

  test("README が表示される", async ({ page }) => {
    // README セクション
    await expect(
      page.getByRole("heading", { name: "README" }),
    ).toBeVisible();

    // README の内容（base64 デコード済み: "# React\n\nThe library for web and native user interfaces."）
    await expect(page.getByText("The library for web and native user interfaces").last()).toBeVisible();
  });

  test("スター数・フォーク数などの統計が表示される", async ({ page }) => {
    // formatNumber: 220000 → "220k", 45000 → "45k"
    await expect(page.getByText("220k").first()).toBeVisible();
    await expect(page.getByText("45k").first()).toBeVisible();
  });

  test("トピックが表示される", async ({ page }) => {
    // トピックは Badge で表示される（exact で区別）
    await expect(page.getByText("javascript", { exact: true })).toBeVisible();
    await expect(page.getByText("library", { exact: true })).toBeVisible();
  });

  test("ライセンス・言語が表示される", async ({ page }) => {
    // 言語
    await expect(page.getByText("JavaScript").first()).toBeVisible();
    // ライセンス
    await expect(page.getByText("MIT").first()).toBeVisible();
  });
});
