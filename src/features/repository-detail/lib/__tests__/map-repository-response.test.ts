import { describe, expect, it } from "vitest";
import type { GitHubRepositoryResponse } from "@/shared/github/schemas";
import { mapRepositoryResponse } from "../map-repository-response";

const mockResponse: GitHubRepositoryResponse = {
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
};

describe("mapRepositoryResponse", () => {
  it("maps all fields to ViewModel", () => {
    const result = mapRepositoryResponse(mockResponse);

    expect(result.id).toBe(1);
    expect(result.name).toBe("repo");
    expect(result.owner).toBe("owner");
    expect(result.ownerAvatarUrl).toBe("https://example.com/avatar.png");
    expect(result.description).toBe("A test repository");
    expect(result.language).toBe("TypeScript");
    expect(result.license).toBe("MIT");
    expect(result.topics).toEqual(["nextjs", "react"]);
    expect(result.stars).toBe(1234);
    expect(result.watchers).toBe(89);
    expect(result.forks).toBe(56);
    expect(result.openIssues).toBe(7);
    expect(result.updatedAt).toBe("2026-03-15T10:00:00Z");
    expect(result.pushedAt).toBe("2026-03-10T10:00:00Z");
    expect(result.archived).toBe(false);
    expect(result.disabled).toBe(false);
    expect(result.homepage).toBe("https://example.com");
    expect(result.htmlUrl).toBe("https://github.com/owner/repo");
  });

  it("uses subscribers_count as watchers (not watchers_count)", () => {
    const response: GitHubRepositoryResponse = {
      ...mockResponse,
      watchers_count: 9999,
      subscribers_count: 42,
    };
    const result = mapRepositoryResponse(response);
    expect(result.watchers).toBe(42);
  });

  it("handles null optional fields", () => {
    const response: GitHubRepositoryResponse = {
      ...mockResponse,
      description: null,
      language: null,
      license: null,
      homepage: null,
    };
    const result = mapRepositoryResponse(response);
    expect(result.description).toBeNull();
    expect(result.language).toBeNull();
    expect(result.license).toBeNull();
    expect(result.homepage).toBeNull();
  });
});
