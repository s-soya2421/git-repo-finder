export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">git-repo-finder</h1>
        <p className="text-muted-foreground">
          GitHub リポジトリを検索・比較し、目的に合う候補を素早く見つける
        </p>
      </main>
    </div>
  );
}
