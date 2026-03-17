import { describe, expect, it } from "vitest";
import type { GitHubSearchResponse } from "@/shared/github/schemas";
import { mapSearchResponse } from "../map-search-response";

/**
 * mapSearchResponse のテスト。
 * 単純なフィールド代入は TypeScript が保証するため、
 * 変換ロジック（license の null 安全性、フィールド名の読み替え）を中心にテストする。
 */

function makeItem(
  overrides: Partial<GitHubSearchResponse["items"][number]> = {},
): GitHubSearchResponse["items"][number] {
  return {
    id: 1,
    full_name: "owner/repo",
    name: "repo",
    owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
    description: "A test repository",
    html_url: "https://github.com/owner/repo",
    homepage: "https://example.com",
    language: "TypeScript",
    license: { spdx_id: "MIT", name: "MIT License" },
    topics: ["nextjs", "react"],
    stargazers_count: 1234,
    watchers_count: 1234,
    forks_count: 56,
    open_issues_count: 7,
    updated_at: "2026-03-15T10:00:00Z",
    pushed_at: "2026-03-10T10:00:00Z",
    archived: false,
    disabled: false,
    ...overrides,
  };
}

function makeResponse(
  overrides: Partial<GitHubSearchResponse> = {},
): GitHubSearchResponse {
  return {
    total_count: 1,
    incomplete_results: false,
    items: [makeItem()],
    ...overrides,
  };
}

describe("mapSearchResponse", () => {
  describe("license の null 安全性", () => {
    it("license が null の場合 null を返す", () => {
      const result = mapSearchResponse(
        makeResponse({ items: [makeItem({ license: null })] }),
      );
      expect(result.items[0].license).toBeNull();
    });

    it("license.spdx_id が null の場合 null を返す", () => {
      const result = mapSearchResponse(
        makeResponse({
          items: [makeItem({ license: { spdx_id: null, name: "Other" } })],
        }),
      );
      expect(result.items[0].license).toBeNull();
    });

    it("license.spdx_id が存在する場合その値を返す", () => {
      const result = mapSearchResponse(
        makeResponse({
          items: [
            makeItem({ license: { spdx_id: "Apache-2.0", name: "Apache" } }),
          ],
        }),
      );
      expect(result.items[0].license).toBe("Apache-2.0");
    });
  });

  describe("フィールド名の読み替え", () => {
    it("stargazers_count を stars に変換する", () => {
      const result = mapSearchResponse(
        makeResponse({ items: [makeItem({ stargazers_count: 9999 })] }),
      );
      expect(result.items[0].stars).toBe(9999);
    });

    it("owner.login を owner に変換する", () => {
      const result = mapSearchResponse(
        makeResponse({
          items: [
            makeItem({
              owner: { login: "my-org", avatar_url: "https://example.com/a.png" },
            }),
          ],
        }),
      );
      expect(result.items[0].owner).toBe("my-org");
    });

    it("owner.avatar_url を ownerAvatarUrl に変換する", () => {
      const result = mapSearchResponse(
        makeResponse({
          items: [
            makeItem({
              owner: {
                login: "org",
                avatar_url: "https://avatars.example.com/u/123",
              },
            }),
          ],
        }),
      );
      expect(result.items[0].ownerAvatarUrl).toBe(
        "https://avatars.example.com/u/123",
      );
    });
  });

  describe("空・複数件", () => {
    it("空の items 配列を正しくマッピングする", () => {
      const result = mapSearchResponse(
        makeResponse({ total_count: 0, items: [] }),
      );
      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it("複数件の items を全件マッピングする", () => {
      const result = mapSearchResponse(
        makeResponse({
          total_count: 2,
          items: [
            makeItem({ id: 1, name: "repo-a" }),
            makeItem({ id: 2, name: "repo-b" }),
          ],
        }),
      );
      expect(result.items).toHaveLength(2);
      expect(result.items[0].name).toBe("repo-a");
      expect(result.items[1].name).toBe("repo-b");
    });

    it("incomplete_results フラグを保持する", () => {
      const result = mapSearchResponse(
        makeResponse({ incomplete_results: true }),
      );
      expect(result.incompleteResults).toBe(true);
    });
  });
});
