import { cache } from "react";
import {
  GITHUB_ACCEPT_HEADER,
  GITHUB_API_BASE_URL,
  GITHUB_API_VERSION,
} from "./constants";
import type {
  GitHubReadmeResponse,
  GitHubRepositoryResponse,
  GitHubSearchResponse,
} from "./schemas";

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

export type GitHubErrorType =
  | "not_found"
  | "rate_limit_primary"
  | "rate_limit_secondary"
  | "validation_failed"
  | "server_error"
  | "network_error"
  | "unknown";

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly type: GitHubErrorType,
    public readonly status: number | null,
    public readonly retryAfter: string | null = null,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export function classifyGitHubError(
  status: number,
  headers: Headers,
): GitHubErrorType {
  if (status === 404) return "not_found";
  if (status === 422) return "validation_failed";

  if (status === 403 || status === 429) {
    const remaining = headers.get("x-ratelimit-remaining");
    if (remaining === "0") return "rate_limit_primary";
    return "rate_limit_secondary";
  }

  if (status >= 500) return "server_error";

  return "unknown";
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function githubFetch<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: GITHUB_ACCEPT_HEADER,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      headers,
      next: { revalidate: 0 },
    });
  } catch {
    throw new GitHubApiError(
      "GitHub API へのネットワーク接続に失敗しました",
      "network_error",
      null,
    );
  }

  if (!response.ok) {
    const errorType = classifyGitHubError(response.status, response.headers);
    const retryAfter = response.headers.get("retry-after");
    throw new GitHubApiError(
      `GitHub API error: ${response.status}`,
      errorType,
      response.status,
      retryAfter,
    );
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API (cached per request)
// ---------------------------------------------------------------------------

export const searchRepositories = cache(
  async (query: string, page: number, perPage: number) => {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      per_page: String(perPage),
    });
    return githubFetch<GitHubSearchResponse>(
      `/search/repositories?${params.toString()}`,
    );
  },
);

export const getRepository = cache(async (owner: string, repo: string) => {
  return githubFetch<GitHubRepositoryResponse>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  );
});

export const getReadme = cache(
  async (owner: string, repo: string): Promise<GitHubReadmeResponse | null> => {
    try {
      return await githubFetch<GitHubReadmeResponse>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
      );
    } catch (error) {
      if (error instanceof GitHubApiError && error.type === "not_found") {
        return null;
      }
      throw error;
    }
  },
);
