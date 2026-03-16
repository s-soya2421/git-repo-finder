"use client";

import { Button } from "@/shared/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold">データの取得に失敗しました</h2>
      <p className="text-sm text-muted-foreground">
        時間をおいて再度お試しいただくか、検索条件を変更してみてください
      </p>
      <Button onClick={reset} variant="outline">
        再試行
      </Button>
    </div>
  );
}
