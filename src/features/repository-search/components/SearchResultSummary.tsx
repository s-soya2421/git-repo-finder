import { formatNumber } from "@/shared/lib/format-number";

type SearchResultSummaryProps = {
  query: string;
  totalCount: number;
  page: number;
  perPage: number;
};

export function SearchResultSummary({
  query,
  totalCount,
  page,
  perPage,
}: SearchResultSummaryProps) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold">
        &ldquo;{query}&rdquo; の検索結果
      </h2>
      <p className="text-sm text-muted-foreground">
        上位の一致候補を表示中 ・{" "}
        <span>
          {formatNumber(totalCount)}件中 {start}–{end}件を表示
        </span>
      </p>
    </div>
  );
}
