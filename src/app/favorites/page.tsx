import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";

export const metadata: Metadata = {
  title: "お気に入り",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          git-repo-finder
        </Link>
      </header>
      <main>
        <FavoriteList />
      </main>
    </div>
  );
}
