import { formatNumber } from "@/shared/lib/format-number";
import { PerPageSelect } from "./PerPageSelect";
import { SortSelect } from "./SortSelect";
import { LanguageInput } from "./LanguageInput";
import type { SortOption } from "../lib/parse-search-params";

type SearchResultSummaryProps = {
  query: string;
  totalCount: number;
  page: number;
  perPage: number;
  sort: SortOption;
  language: string;
  incompleteResults?: boolean;
};

export function SearchResultSummary({
  query,
  totalCount,
  page,
  perPage,
  sort,
  language,
  incompleteResults = false,
}: SearchResultSummaryProps) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          &ldquo;{query}&rdquo; の検索結果
        </h2>
        <div className="flex items-center gap-2">
          <SortSelect query={query} perPage={perPage} sort={sort} language={language} />
          <LanguageInput query={query} perPage={perPage} sort={sort} language={language} />
          <PerPageSelect query={query} perPage={perPage} sort={sort} language={language} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        上位の一致候補を表示中 ・{" "}
        <span>
          {formatNumber(totalCount)}件中 {start}–{end}件を表示
        </span>
      </p>
      {incompleteResults && (
        <p className="text-sm text-amber-600 dark:text-amber-400" role="status">
          検索結果が不完全な可能性があります。条件を絞り込むとより正確な結果が得られます。
        </p>
      )}
    </div>
  );
}
