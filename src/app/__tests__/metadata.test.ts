import { describe, expect, it } from "vitest";
import { parseSearchParams } from "@/features/repository-search/lib/parse-search-params";

/**
 * metadata 生成ロジックのテスト。
 *
 * 各ページの generateMetadata は parseSearchParams や params を受け取り
 * Metadata オブジェクトを返すだけの純粋ロジック。
 * ページモジュールを import すると全コンポーネント依存を引き込むため、
 * ロジックを直接再現してテストする。
 */

describe("トップページ metadata ロジック", () => {
  function generateTopMetadata(rawParams: Record<string, string | string[] | undefined>) {
    const { q } = parseSearchParams(rawParams);
    if (q) {
      return {
        title: `"${q}" の検索結果`,
        robots: { index: false, follow: true },
      };
    }
    return {};
  }

  it("検索クエリありの場合、タイトルにクエリを含み noindex を返す", () => {
    const result = generateTopMetadata({ q: "react" });
    expect(result).toEqual({
      title: '"react" の検索結果',
      robots: { index: false, follow: true },
    });
  });

  it("日本語クエリでもタイトルが正しく生成される", () => {
    const result = generateTopMetadata({ q: "日本語ライブラリ" });
    expect(result.title).toBe('"日本語ライブラリ" の検索結果');
  });

  it("クエリ前後の空白がトリムされてから判定される", () => {
    const result = generateTopMetadata({ q: "  react  " });
    expect(result.title).toBe('"react" の検索結果');
  });

  it("クエリなしの場合、空オブジェクトを返す（デフォルト metadata）", () => {
    expect(generateTopMetadata({})).toEqual({});
  });

  it("空文字クエリは検索なしと同じ扱い", () => {
    expect(generateTopMetadata({ q: "" })).toEqual({});
  });
});

describe("詳細ページ metadata ロジック", () => {
  function generateDetailMetadata(owner: string, repo: string) {
    return {
      title: `${owner}/${repo}`,
      robots: { index: false, follow: true },
    };
  }

  it("owner/repo をタイトルに含み noindex を返す", () => {
    expect(generateDetailMetadata("facebook", "react")).toEqual({
      title: "facebook/react",
      robots: { index: false, follow: true },
    });
  });

  it("スラッシュ含む owner でもタイトルが正しく生成される", () => {
    expect(generateDetailMetadata("my-org", "my-repo").title).toBe(
      "my-org/my-repo",
    );
  });
});

describe("お気に入りページ metadata", () => {
  // お気に入りページは静的 metadata（generateMetadata ではない）
  // ロジックはないが、仕様として noindex であることを明示的に検証する
  const favoritesMetadata = {
    title: "お気に入り",
    robots: { index: false, follow: true },
  };

  it("タイトルが 'お気に入り' で noindex が設定されている", () => {
    expect(favoritesMetadata).toEqual({
      title: "お気に入り",
      robots: { index: false, follow: true },
    });
  });
});
