import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { calcPagination } from "../lib/calc-pagination";
import { buildSearchUrl } from "../lib/normalize-search-params";
import type { SortOption } from "../lib/parse-search-params";

type PaginationNavProps = {
  query: string;
  page: number;
  perPage: number;
  totalCount: number;
  sort: SortOption;
  language: string;
};

export function PaginationNav({
  query,
  page,
  perPage,
  totalCount,
  sort,
  language,
}: PaginationNavProps) {
  const pagination = calcPagination(totalCount, page, perPage);

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="ページネーション" className="flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          {pagination.hasPrev ? (
            <Link
              href={buildSearchUrl({
                q: query,
                page: pagination.currentPage - 1,
                perPage,
                sort,
                language,
              })}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
                "hover:bg-muted",
              )}
              aria-label="前のページ"
            >
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg text-sm text-muted-foreground opacity-50"
              aria-disabled="true"
            >
              <ChevronLeft className="size-4" />
            </span>
          )}
        </li>

        {pagination.visiblePages.map((p) => (
          <li key={p}>
            {p === pagination.currentPage ? (
              <span
                className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
                aria-current="page"
              >
                {p}
              </span>
            ) : (
              <Link
                href={buildSearchUrl({ q: query, page: p, perPage, sort, language })}
                className="inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors hover:bg-muted"
              >
                {p}
              </Link>
            )}
          </li>
        ))}

        <li>
          {pagination.hasNext ? (
            <Link
              href={buildSearchUrl({
                q: query,
                page: pagination.currentPage + 1,
                perPage,
                sort,
                language,
              })}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
                "hover:bg-muted",
              )}
              aria-label="次のページ"
            >
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg text-sm text-muted-foreground opacity-50"
              aria-disabled="true"
            >
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
