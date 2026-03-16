import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { parseSearchParams } from "@/features/repository-search/lib/parse-search-params";
import { SearchForm } from "@/features/repository-search/components/SearchForm";
import { EmptyState } from "@/features/repository-search/components/EmptyState";
import { RepositoryList } from "@/features/repository-search/components/RepositoryList";
import { RepositoryListSkeleton } from "@/features/repository-search/components/RepositoryListSkeleton";
import { RecentlyViewedList } from "@/features/recently-viewed/components/RecentlyViewedList";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { q } = parseSearchParams(params);

  if (q) {
    return {
      title: `"${q}" の検索結果`,
      robots: { index: false, follow: true },
    };
  }

  return {};
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { q, page, perPage } = parseSearchParams(params);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          git-repo-finder
        </Link>
      </header>
      <main className="flex flex-col gap-8">
        <SearchForm defaultValue={q} perPage={perPage} />
        {q ? (
          <Suspense
            key={`${q}-${page}-${perPage}`}
            fallback={<RepositoryListSkeleton />}
          >
            <RepositoryList query={q} page={page} perPage={perPage} />
          </Suspense>
        ) : (
          <>
            <EmptyState type="initial" />
            <RecentlyViewedList />
          </>
        )}
      </main>
    </div>
  );
}
