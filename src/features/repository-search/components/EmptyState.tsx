type EmptyStateProps = {
  type: "initial" | "no-results";
  query?: string;
};

export function EmptyState({ type, query }: EmptyStateProps) {
  if (type === "initial") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          GitHub リポジトリを検索・比較し、目的に合う候補を素早く見つける
        </p>
        <p className="text-sm text-muted-foreground">
          キーワードを入力して検索を開始してください
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-lg font-medium">
        該当するリポジトリが見つかりませんでした
      </p>
      {query && (
        <p className="text-sm text-muted-foreground">
          &ldquo;{query}&rdquo; に一致する結果はありません
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        キーワードを短くする、別の語に変える、条件を減らすと見つかる場合があります
      </p>
    </div>
  );
}
