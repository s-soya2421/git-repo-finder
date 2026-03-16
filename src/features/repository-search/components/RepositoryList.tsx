import { searchRepositories } from "@/shared/github/client";
import { GitHubApiError } from "@/shared/github/client";
import { mapSearchResponse } from "../lib/map-search-response";
import type { SearchResultViewModel } from "../types";
import { EmptyState } from "./EmptyState";
import { PaginationNav } from "./PaginationNav";
import { SearchResultSummary } from "./SearchResultSummary";
import { RepositoryListItem } from "./RepositoryListItem";

type RepositoryListProps = {
  query: string;
  page: number;
  perPage: number;
};

type FetchResult =
  | { status: "success"; data: SearchResultViewModel }
  | { status: "rate_limit" }
  | { status: "validation_failed" }
  | { status: "error" };

async function fetchSearchResults(
  query: string,
  page: number,
  perPage: number,
): Promise<FetchResult> {
  try {
    const raw = await searchRepositories(query, page, perPage);
    return { status: "success", data: mapSearchResponse(raw) };
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (
        error.type === "rate_limit_primary" ||
        error.type === "rate_limit_secondary"
      ) {
        return { status: "rate_limit" };
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
}: RepositoryListProps) {
  const result = await fetchSearchResults(query, page, perPage);

  if (result.status === "rate_limit") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">アクセスが集中しています</p>
        <p className="text-sm text-muted-foreground">
          少し時間をおいて再度お試しください
        </p>
      </div>
    );
  }

  if (result.status === "validation_failed") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">検索条件を見直してください</p>
        <p className="text-sm text-muted-foreground">
          入力されたキーワードや条件では検索できませんでした。別のキーワードや条件をお試しください。
        </p>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
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
      />
    </div>
  );
}
