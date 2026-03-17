import { describe, expect, it } from "vitest";
import type { GitHubRepositoryResponse } from "@/shared/github/schemas";
import { mapRepositoryResponse } from "../map-repository-response";

/**
 * mapRepositoryResponse のテスト。
 * 単純なフィールド代入は TypeScript が保証するため、
 * 変換ロジック（license null 安全性、watchers の読み替え、null フィールド）を中心にテストする。
 */

function makeResponse(
  overrides: Partial<GitHubRepositoryResponse> = {},
): GitHubRepositoryResponse {
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
    subscribers_count: 89,
    updated_at: "2026-03-15T10:00:00Z",
    pushed_at: "2026-03-10T10:00:00Z",
    archived: false,
    disabled: false,
    ...overrides,
  };
}

describe("mapRepositoryResponse", () => {
  describe("watchers の読み替え", () => {
    it("subscribers_count を watchers として使う（watchers_count ではない）", () => {
      const result = mapRepositoryResponse(
        makeResponse({ watchers_count: 9999, subscribers_count: 42 }),
      );
      expect(result.watchers).toBe(42);
    });
  });

  describe("license の null 安全性", () => {
    it("license が null の場合 null を返す", () => {
      const result = mapRepositoryResponse(makeResponse({ license: null }));
      expect(result.license).toBeNull();
    });

    it("license.spdx_id が null の場合 null を返す", () => {
      const result = mapRepositoryResponse(
        makeResponse({ license: { spdx_id: null, name: "Other" } }),
      );
      expect(result.license).toBeNull();
    });

    it("license.spdx_id が存在する場合その値を返す", () => {
      const result = mapRepositoryResponse(
        makeResponse({ license: { spdx_id: "Apache-2.0", name: "Apache" } }),
      );
      expect(result.license).toBe("Apache-2.0");
    });
  });

  describe("null 許容フィールドの伝搬", () => {
    it("description, language, license, homepage が全て null でも変換できる", () => {
      const result = mapRepositoryResponse(
        makeResponse({
          description: null,
          language: null,
          license: null,
          homepage: null,
        }),
      );
      expect(result.description).toBeNull();
      expect(result.language).toBeNull();
      expect(result.license).toBeNull();
      expect(result.homepage).toBeNull();
    });
  });

  describe("フィールド名の読み替え", () => {
    it("stargazers_count を stars に変換する", () => {
      const result = mapRepositoryResponse(
        makeResponse({ stargazers_count: 5000 }),
      );
      expect(result.stars).toBe(5000);
    });

    it("forks_count を forks に変換する", () => {
      const result = mapRepositoryResponse(
        makeResponse({ forks_count: 100 }),
      );
      expect(result.forks).toBe(100);
    });

    it("open_issues_count を openIssues に変換する", () => {
      const result = mapRepositoryResponse(
        makeResponse({ open_issues_count: 15 }),
      );
      expect(result.openIssues).toBe(15);
    });
  });

  describe("topics", () => {
    it("空の topics 配列をそのまま渡す", () => {
      const result = mapRepositoryResponse(makeResponse({ topics: [] }));
      expect(result.topics).toEqual([]);
    });

    it("複数の topics をそのまま渡す", () => {
      const topics = ["react", "typescript", "next"];
      const result = mapRepositoryResponse(makeResponse({ topics }));
      expect(result.topics).toEqual(topics);
    });
  });
});
