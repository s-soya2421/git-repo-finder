"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/shared/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold">リポジトリ情報の取得に失敗しました</h2>
      <p className="text-sm text-muted-foreground">
        一時的なエラーの可能性があります。再試行するか、URLが正しいことを確認してください。
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          再試行
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          トップページへ
        </Link>
      </div>
    </div>
  );
}
