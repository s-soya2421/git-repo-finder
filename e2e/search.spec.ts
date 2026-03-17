import { test, expect } from "@playwright/test";

test.describe("検索 - 基本操作", () => {
  test("検索フォームと初期メッセージが表示される", async ({ page }) => {
    await page.goto("/");

    // 検索フォームが表示される
    await expect(page.getByRole("search")).toBeVisible();
    await expect(page.locator("#search-input")).toBeVisible();

    // 初期メッセージが表示される
    await expect(
      page.getByText("キーワードを入力して検索を開始してください"),
    ).toBeVisible();

    // 検索結果は表示されない
    await expect(page.getByRole("article")).toHaveCount(0);
  });

  test("キーワードを入力して検索すると結果が表示される", async ({ page }) => {
    await page.goto("/?q=react");

    // 検索結果が表示される
    await expect(page.getByRole("heading", { name: /の検索結果/ })).toBeVisible();
    await expect(page.getByRole("article").first()).toBeVisible();

    // 検索フォームに入力した値が反映されている
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toHaveValue("react");

    // 結果が表示される
    await expect(page.getByText("react").first()).toBeVisible();
    await expect(page.getByText("vue").first()).toBeVisible();
    await expect(page.getByText("angular").first()).toBeVisible();
  });

  test("フォームから検索を実行できる", async ({ page }) => {
    // まず検索結果ページを開く（/ はブラウザで初回コンパイル中にエラーになることがある）
    await page.goto("/?q=test");
    await expect(page.getByRole("article").first()).toBeVisible();

    // 検索フォームに新しいキーワードを入力
    const searchInput = page.locator("#search-input");
    await searchInput.fill("react");
    await searchInput.press("Enter");

    // URL に q=react が含まれる
    await expect(page).toHaveURL(/[?&]q=react/);
    await expect(page.getByRole("heading", { name: /の検索結果/ })).toBeVisible();
  });
});

test.describe("検索 - エラー・警告", () => {
  test("不完全な検索結果の警告メッセージが表示される", async ({ page }) => {
    await page.goto("/?q=incomplete");

    // 警告メッセージが表示される
    await expect(
      page.getByText("検索結果が不完全な可能性があります"),
    ).toBeVisible();
  });

  test("検索結果が0件のとき EmptyState が表示される", async ({ page }) => {
    await page.goto("/?q=noresults");

    await expect(
      page.getByText("該当するリポジトリが見つかりませんでした"),
    ).toBeVisible();
    await expect(page.getByText("キーワードを短くする")).toBeVisible();
  });

  test("429 レスポンス時にエラーメッセージが表示される", async ({ page }) => {
    await page.goto("/?q=ratelimit");

    await expect(page.getByText("アクセスが集中しています")).toBeVisible();
  });

  test("500 レスポンス時にエラーメッセージが表示される", async ({ page }) => {
    await page.goto("/?q=servererror");

    await expect(page.getByText("データの取得に失敗しました")).toBeVisible();
  });
});

test.describe("検索 - ページネーション・表示件数", () => {
  test("2ページ目に遷移できる", async ({ page }) => {
    await page.goto("/?q=react");

    // 結果が表示されるまで待つ
    await expect(page.getByRole("article").first()).toBeVisible();

    // 「次へ」ボタンをクリック
    const nextButton = page.getByRole("link", { name: /次/ });
    await nextButton.click();

    // URL が page=2 になる
    await expect(page).toHaveURL(/[?&]page=2/);

    // 2ページ目のコンテンツが表示される
    await expect(page.getByText("svelte").first()).toBeVisible();
  });

  test("perPage を変更すると page=1 にリセットされる", async ({ page }) => {
    // 2ページ目からスタート
    await page.goto("/?q=react&page=2");
    await expect(page.getByText("svelte").first()).toBeVisible();

    // Base UI Select: クリックしてドロップダウンを開き、オプションを選択
    const trigger = page.getByRole("combobox", { name: /表示件数/ });
    await trigger.click();

    // ドロップダウン内の「10件」オプションをクリック
    await page.getByRole("option", { name: "10件" }).click();

    // page パラメータがリセットされる
    await expect(page).toHaveURL(/perPage=10/);
    // page=2 が消えている
    const url = page.url();
    expect(url).not.toContain("page=2");
  });
});

test.describe("検索 - UI操作", () => {
  test("GitHub リポジトリへの外部リンクが正しい href を持つ", async ({
    page,
  }) => {
    await page.goto("/?q=react");

    await expect(page.getByRole("article").first()).toBeVisible();

    // aria-label="react を GitHub で開く" を持つリンク
    const githubLink = page.getByLabel("react を GitHub で開く");
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/facebook/react",
    );
  });

  test("長い説明文の「続きを読む」→ 展開 →「折りたたむ」→ 折りたたみ", async ({
    page,
  }) => {
    await page.goto("/?q=react");
    await expect(page.getByRole("article").first()).toBeVisible();

    // 「続きを読む」ボタンが表示される（vue の説明文が50文字以上）
    const expandButton = page.getByRole("button", { name: "続きを読む" });
    await expect(expandButton).toBeVisible();
    await expect(expandButton).toHaveAttribute("aria-expanded", "false");

    // 展開
    await expandButton.click();

    // 「折りたたむ」に変わる
    const collapseButton = page.getByRole("button", { name: "折りたたむ" });
    await expect(collapseButton).toBeVisible();
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    // 全文が表示される
    await expect(
      page.getByText(
        "This is the repo for Vue 2. Vue is a progressive JavaScript framework for building user interfaces.",
      ),
    ).toBeVisible();

    // 折りたたむ
    await collapseButton.click();
    await expect(
      page.getByRole("button", { name: "続きを読む" }),
    ).toBeVisible();
  });
});
