import { describe, expect, it, vi } from "vitest";

// Mock all component imports from top page to avoid loading heavy dependency trees
vi.mock("@/features/repository-search/components/SearchForm", () => ({
  SearchForm: vi.fn(),
}));
vi.mock("@/features/repository-search/components/EmptyState", () => ({
  EmptyState: vi.fn(),
}));
vi.mock("@/features/repository-search/components/RepositoryList", () => ({
  RepositoryList: vi.fn(),
}));
vi.mock("@/features/repository-search/components/RepositoryListSkeleton", () => ({
  RepositoryListSkeleton: vi.fn(),
}));
vi.mock("@/features/recently-viewed/components/RecentlyViewedList", () => ({
  RecentlyViewedList: vi.fn(),
}));

// Mock detail page dependencies
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));
vi.mock("@/shared/github/client", () => ({
  getRepository: vi.fn(),
  getReadme: vi.fn(),
  getLatestRelease: vi.fn(),
  getSecurityPolicyStatus: vi.fn(),
  getDependabotStatus: vi.fn(),
  getLatestCiStatus: vi.fn(),
  GitHubApiError: class GitHubApiError extends Error {},
}));
vi.mock("@/features/repository-detail/lib/map-repository-response", () => ({
  mapRepositoryResponse: vi.fn(),
}));
vi.mock("@/features/repository-detail/components/RepositoryDetail", () => ({
  RepositoryDetail: vi.fn(),
}));
vi.mock("@/shared/ui/scroll-to-top", () => ({
  ScrollToTop: vi.fn(),
}));

// Mock favorites page dependencies
vi.mock("@/features/favorites/components/FavoriteList", () => ({
  FavoriteList: vi.fn(),
}));

describe("top page metadata", () => {
  it("returns noindex when query is present", async () => {
    const { generateMetadata } = await import("../page");
    const result = await generateMetadata({
      searchParams: Promise.resolve({ q: "react" }),
    });
    expect(result).toEqual({
      title: '"react" の検索結果',
      robots: { index: false, follow: true },
    });
  });

  it("returns empty metadata when no query", async () => {
    const { generateMetadata } = await import("../page");
    const result = await generateMetadata({
      searchParams: Promise.resolve({}),
    });
    expect(result).toEqual({});
  });
});

describe("detail page metadata", () => {
  it("returns owner/repo as title with noindex", async () => {
    const { generateMetadata } = await import(
      "../repositories/[owner]/[repo]/page"
    );
    const result = await generateMetadata({
      params: Promise.resolve({ owner: "facebook", repo: "react" }),
    });
    expect(result).toEqual({
      title: "facebook/react",
      robots: { index: false, follow: true },
    });
  });
});

describe("favorites page metadata", () => {
  it("has noindex and correct title", async () => {
    const { metadata } = await import("../favorites/page");
    expect(metadata).toEqual({
      title: "お気に入り",
      robots: { index: false, follow: true },
    });
  });
});
