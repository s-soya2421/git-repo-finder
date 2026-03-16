import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold">
        リポジトリが見つかりませんでした
      </h2>
      <p className="text-sm text-muted-foreground">
        指定されたリポジトリは存在しないか、非公開の可能性があります
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        トップへ戻る
      </Link>
    </div>
  );
}
