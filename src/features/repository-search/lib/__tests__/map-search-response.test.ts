import { describe, expect, it } from "vitest";
import type { GitHubSearchResponse } from "@/shared/github/schemas";
import { mapSearchResponse } from "../map-search-response";

const mockResponse: GitHubSearchResponse = {
  total_count: 42,
  incomplete_results: false,
  items: [
    {
      id: 1,
      full_name: "owner/repo",
      name: "repo",
      owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
      description: "A test repository",
      html_url: "https://github.com/owner/repo",
      homepage: "https://example.com",
      language: "TypeScript",
      license: { spdx_id: "MIT", name: "MIT License" },
      topics: ["nextjs", "react", "typescript"],
      stargazers_count: 1234,
      watchers_count: 1234,
      forks_count: 56,
      open_issues_count: 7,
      updated_at: "2026-03-15T10:00:00Z",
      pushed_at: "2026-03-10T10:00:00Z",
      archived: false,
      disabled: false,
    },
  ],
};

describe("mapSearchResponse", () => {
  it("maps total count and incomplete flag", () => {
    const result = mapSearchResponse(mockResponse);
    expect(result.totalCount).toBe(42);
    expect(result.incompleteResults).toBe(false);
  });

  it("maps repository items to ViewModel", () => {
    const result = mapSearchResponse(mockResponse);
    expect(result.items).toHaveLength(1);

    const item = result.items[0];
    expect(item.id).toBe(1);
    expect(item.name).toBe("repo");
    expect(item.owner).toBe("owner");
    expect(item.ownerAvatarUrl).toBe("https://example.com/avatar.png");
    expect(item.description).toBe("A test repository");
    expect(item.language).toBe("TypeScript");
    expect(item.license).toBe("MIT");
    expect(item.topics).toEqual(["nextjs", "react", "typescript"]);
    expect(item.stars).toBe(1234);
    expect(item.updatedAt).toBe("2026-03-15T10:00:00Z");
    expect(item.pushedAt).toBe("2026-03-10T10:00:00Z");
    expect(item.archived).toBe(false);
    expect(item.disabled).toBe(false);
    expect(item.htmlUrl).toBe("https://github.com/owner/repo");
  });

  it("handles null license", () => {
    const response: GitHubSearchResponse = {
      ...mockResponse,
      items: [{ ...mockResponse.items[0], license: null }],
    };
    const result = mapSearchResponse(response);
    expect(result.items[0].license).toBeNull();
  });

  it("handles license with null spdx_id", () => {
    const response: GitHubSearchResponse = {
      ...mockResponse,
      items: [
        {
          ...mockResponse.items[0],
          license: { spdx_id: null, name: "Other" },
        },
      ],
    };
    const result = mapSearchResponse(response);
    expect(result.items[0].license).toBeNull();
  });

  it("handles empty items array", () => {
    const response: GitHubSearchResponse = {
      total_count: 0,
      incomplete_results: false,
      items: [],
    };
    const result = mapSearchResponse(response);
    expect(result.items).toEqual([]);
    expect(result.totalCount).toBe(0);
  });
});
