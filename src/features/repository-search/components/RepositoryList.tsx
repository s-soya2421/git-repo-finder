import { searchRepositories } from "@/shared/github/client";
import { GitHubApiError } from "@/shared/github/client";
import { mapSearchResponse } from "../lib/map-search-response";
import type { SearchResultViewModel } from "../types";
import type { SortOption } from "../lib/parse-search-params";
import { EmptyState } from "./EmptyState";
import { PaginationNav } from "./PaginationNav";
import { SearchResultSummary } from "./SearchResultSummary";
import { RepositoryListItem } from "./RepositoryListItem";

type RepositoryListProps = {
  query: string;
  page: number;
  perPage: number;
  sort: SortOption;
  language: string;
};

type FetchResult =
  | { status: "success"; data: SearchResultViewModel }
  | { status: "rate_limit"; retryAfter: string | null; resetAt: Date | null }
  | { status: "validation_failed" }
  | { status: "error" };

async function fetchSearchResults(
  query: string,
  page: number,
  perPage: number,
  sort?: string,
  order?: string,
): Promise<FetchResult> {
  try {
    const raw = await searchRepositories(query, page, perPage, sort, order);
    return { status: "success", data: mapSearchResponse(raw) };
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (
        error.type === "rate_limit_primary" ||
        error.type === "rate_limit_secondary"
      ) {
        return { status: "rate_limit", retryAfter: error.retryAfter, resetAt: error.resetAt };
      }
      if (error.type === "validation_failed") {
        return { status: "validation_failed" };
      }
    }
    return { status: "error" };
  }
}

export async function RepositoryList({
  query,
  page,
  perPage,
  sort,
  language,
}: RepositoryListProps) {
  const apiQuery = language ? `${query} language:${language}` : query;
  const apiSort = sort || undefined;
  const apiOrder = sort === "stars" ? "desc" : sort === "updated" ? "desc" : undefined;
  const result = await fetchSearchResults(apiQuery, page, perPage, apiSort, apiOrder);

  if (result.status === "rate_limit") {
    const retrySeconds = result.retryAfter
      ? parseInt(result.retryAfter, 10)
      : null;
    const resetTime = result.resetAt
      ? result.resetAt.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
      : null;
    return (
      <div
        className="flex flex-col items-center gap-3 py-16 text-center"
        role="alert"
      >
        <p className="text-lg font-medium">
          GitHub API のリクエスト制限に達しました
        </p>
        <p className="text-sm text-muted-foreground">
          {resetTime
            ? `${resetTime} 頃にリセットされます。しばらくお待ちください。`
            : retrySeconds && retrySeconds > 0
              ? `約${retrySeconds}秒後に再度お試しください。`
              : "しばらく時間をおいて再度お試しください。"}
        </p>
      </div>
    );
  }

  if (result.status === "validation_failed") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center" role="alert">
        <p className="text-lg font-medium">検索条件を見直してください</p>
        <p className="text-sm text-muted-foreground">
          入力されたキーワードや条件では検索できませんでした。別のキーワードや条件をお試しください。
        </p>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center" role="alert">
        <p className="text-lg font-medium">データの取得に失敗しました</p>
        <p className="text-sm text-muted-foreground">
          時間をおいて再度お試しいただくか、検索条件を変更してみてください
        </p>
      </div>
    );
  }

  if (result.data.items.length === 0) {
    return <EmptyState type="no-results" query={query} />;
  }

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <SearchResultSummary
        query={query}
        totalCount={result.data.totalCount}
        page={page}
        perPage={perPage}
        sort={sort}
        language={language}
        incompleteResults={result.data.incompleteResults}
      />
      <div className="flex flex-col gap-4">
        {result.data.items.map((repo) => (
          <RepositoryListItem key={repo.id} repository={repo} />
        ))}
      </div>
      <PaginationNav
        query={query}
        page={page}
        perPage={perPage}
        totalCount={result.data.totalCount}
        sort={sort}
        language={language}
      />
    </div>
  );
}
