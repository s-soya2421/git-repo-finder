import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock react cache as pass-through
vi.mock("react", () => ({
  cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

// Suppress log output during tests
vi.mock("@/shared/lib/logger", () => ({
  log: vi.fn(),
}));

import {
  GitHubApiError,
  searchRepositories,
  getRepository,
  getReadme,
  getLatestRelease,
  getSecurityPolicyStatus,
  getDependabotStatus,
  getLatestCiStatus,
} from "../client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetchResponse(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
) {
  const { status = 200, headers = {} } = init;
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
    }),
  );
}

function mockFetchError() {
  return vi.fn().mockRejectedValue(new TypeError("fetch failed"));
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.stubEnv("GITHUB_TOKEN", "test-token");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

// ---------------------------------------------------------------------------
// githubFetch (tested via public API functions)
// ---------------------------------------------------------------------------

describe("githubFetch via searchRepositories", () => {
  it("returns parsed JSON on success", async () => {
    const data = { total_count: 1, incomplete_results: false, items: [] };
    globalThis.fetch = mockFetchResponse(data);

    const result = await searchRepositories("react", 1, 10);
    expect(result).toEqual(data);
  });

  it("sends Authorization header when GITHUB_TOKEN is set", async () => {
    globalThis.fetch = mockFetchResponse({ total_count: 0, incomplete_results: false, items: [] });

    await searchRepositories("test", 1, 10);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/search/repositories"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("omits Authorization header when GITHUB_TOKEN is not set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    globalThis.fetch = mockFetchResponse({ total_count: 0, incomplete_results: false, items: [] });

    await searchRepositories("test", 1, 10);

    const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers;
    expect(callHeaders).not.toHaveProperty("Authorization");
  });

  it("includes sort and order params when provided", async () => {
    globalThis.fetch = mockFetchResponse({ total_count: 0, incomplete_results: false, items: [] });

    await searchRepositories("test", 1, 10, "stars", "desc");

    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).toContain("sort=stars");
    expect(url).toContain("order=desc");
  });

  it("throws GitHubApiError with network_error on fetch failure", async () => {
    globalThis.fetch = mockFetchError();

    await expect(searchRepositories("test", 1, 10)).rejects.toThrow(GitHubApiError);
    await expect(searchRepositories("test", 1, 10)).rejects.toMatchObject({
      type: "network_error",
      status: null,
    });
  });

  it("throws GitHubApiError with not_found for 404", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Not Found" },
      { status: 404 },
    );

    await expect(searchRepositories("test", 1, 10)).rejects.toMatchObject({
      type: "not_found",
      status: 404,
    });
  });

  it("throws GitHubApiError with rate_limit_primary for 403 + remaining=0", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "rate limit" },
      {
        status: 403,
        headers: {
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": "1742299200",
        },
      },
    );

    try {
      await searchRepositories("test", 1, 10);
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(GitHubApiError);
      const apiError = error as GitHubApiError;
      expect(apiError.type).toBe("rate_limit_primary");
      expect(apiError.resetAt).toBeInstanceOf(Date);
    }
  });

  it("throws GitHubApiError with rate_limit_secondary for 429", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "secondary rate limit" },
      {
        status: 429,
        headers: { "retry-after": "60" },
      },
    );

    try {
      await searchRepositories("test", 1, 10);
      expect.unreachable("should have thrown");
    } catch (error) {
      const apiError = error as GitHubApiError;
      expect(apiError.type).toBe("rate_limit_secondary");
      expect(apiError.retryAfter).toBe("60");
    }
  });

  it("throws GitHubApiError with server_error for 500", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Internal Server Error" },
      { status: 500 },
    );

    await expect(searchRepositories("test", 1, 10)).rejects.toMatchObject({
      type: "server_error",
      status: 500,
    });
  });
});

// ---------------------------------------------------------------------------
// getRepository
// ---------------------------------------------------------------------------

describe("getRepository", () => {
  it("fetches the correct URL", async () => {
    globalThis.fetch = mockFetchResponse({ id: 1 });

    await getRepository("facebook", "react");

    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).toContain("/repos/facebook/react");
  });

  it("encodes owner and repo in URL", async () => {
    globalThis.fetch = mockFetchResponse({ id: 1 });

    await getRepository("user/name", "repo/name");

    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).toContain("/repos/user%2Fname/repo%2Fname");
  });
});

// ---------------------------------------------------------------------------
// getReadme
// ---------------------------------------------------------------------------

describe("getReadme", () => {
  it("returns readme data on success", async () => {
    const readme = { content: "dGVzdA==", encoding: "base64", name: "README.md", path: "README.md" };
    globalThis.fetch = mockFetchResponse(readme);

    const result = await getReadme("owner", "repo");
    expect(result).toEqual(readme);
  });

  it("returns null when not found", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Not Found" },
      { status: 404 },
    );

    const result = await getReadme("owner", "repo");
    expect(result).toBeNull();
  });

  it("throws for non-404 errors", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Server Error" },
      { status: 500 },
    );

    await expect(getReadme("owner", "repo")).rejects.toThrow(GitHubApiError);
  });
});

// ---------------------------------------------------------------------------
// getLatestRelease
// ---------------------------------------------------------------------------

describe("getLatestRelease", () => {
  it("returns release data on success", async () => {
    const release = { tag_name: "v1.0.0", published_at: "2026-01-01", html_url: "https://example.com" };
    globalThis.fetch = mockFetchResponse(release);

    const result = await getLatestRelease("owner", "repo");
    expect(result).toEqual(release);
  });

  it("returns null when not found", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Not Found" },
      { status: 404 },
    );

    const result = await getLatestRelease("owner", "repo");
    expect(result).toBeNull();
  });

  it("throws for non-404 errors", async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "rate limit" },
      { status: 403, headers: { "x-ratelimit-remaining": "0" } },
    );

    await expect(getLatestRelease("owner", "repo")).rejects.toThrow(GitHubApiError);
  });
});

// ---------------------------------------------------------------------------
// getSecurityPolicyStatus
// ---------------------------------------------------------------------------

describe("getSecurityPolicyStatus", () => {
  it('returns "present" if first candidate path exists', async () => {
    globalThis.fetch = mockFetchResponse({});

    const result = await getSecurityPolicyStatus("owner", "repo");
    expect(result).toBe("present");
  });

  it('returns "absent" if all candidate paths return 404', async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Not Found" },
      { status: 404 },
    );

    const result = await getSecurityPolicyStatus("owner", "repo");
    expect(result).toBe("absent");
  });

  it('returns "unknown" if any path errors with non-404', async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Server Error" },
      { status: 500 },
    );

    const result = await getSecurityPolicyStatus("owner", "repo");
    expect(result).toBe("unknown");
  });
});

// ---------------------------------------------------------------------------
// getDependabotStatus
// ---------------------------------------------------------------------------

describe("getDependabotStatus", () => {
  it('returns "present" when file exists', async () => {
    globalThis.fetch = mockFetchResponse({});

    const result = await getDependabotStatus("owner", "repo");
    expect(result).toBe("present");
  });

  it('returns "absent" when file not found', async () => {
    globalThis.fetch = mockFetchResponse(
      { message: "Not Found" },
      { status: 404 },
    );

    const result = await getDependabotStatus("owner", "repo");
    expect(result).toBe("absent");
  });
});

// ---------------------------------------------------------------------------
// getLatestCiStatus
// ---------------------------------------------------------------------------

describe("getLatestCiStatus", () => {
  it('returns "success" when latest run succeeded', async () => {
    globalThis.fetch = mockFetchResponse({
      total_count: 1,
      workflow_runs: [{ id: 1, conclusion: "success" }],
    });

    const result = await getLatestCiStatus("owner", "repo");
    expect(result).toBe("success");
  });

  it('returns "failed" when latest run failed', async () => {
    globalThis.fetch = mockFetchResponse({
      total_count: 1,
      workflow_runs: [{ id: 1, conclusion: "failure" }],
    });

    const result = await getLatestCiStatus("owner", "repo");
    expect(result).toBe("failed");
  });

  it('returns "none" when no workflow runs exist', async () => {
    globalThis.fetch = mockFetchResponse({
      total_count: 0,
      workflow_runs: [],
    });

    const result = await getLatestCiStatus("owner", "repo");
    expect(result).toBe("none");
  });

  it('returns "unknown" on fetch error', async () => {
    globalThis.fetch = mockFetchError();

    const result = await getLatestCiStatus("owner", "repo");
    expect(result).toBe("unknown");
  });
});
