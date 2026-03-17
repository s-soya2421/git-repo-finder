import type { Metadata } from "next";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";

export const metadata: Metadata = {
  title: "お気に入り",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <main>
        <FavoriteList />
      </main>
    </div>
  );
}
