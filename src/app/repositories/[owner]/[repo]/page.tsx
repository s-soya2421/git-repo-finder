import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRepository, getReadme, getLatestRelease, GitHubApiError } from "@/shared/github/client";
import { mapRepositoryResponse } from "@/features/repository-detail/lib/map-repository-response";
import { RepositoryDetail } from "@/features/repository-detail/components/RepositoryDetail";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

type PageProps = {
  params: Promise<{ owner: string; repo: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo}`,
    robots: { index: false, follow: true },
  };
}

export default async function RepositoryDetailPage({ params }: PageProps) {
  const { owner, repo } = await params;

  let response;
  try {
    response = await getRepository(owner, repo);
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (error.type === "not_found") {
        notFound();
      }
      if (error.type === "rate_limit_primary" || error.type === "rate_limit_secondary") {
        const resetTime = error.resetAt
          ? error.resetAt.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
          : null;
        return (
          <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4">
            <ScrollToTop />
            <h2 className="text-lg font-semibold">
              GitHub API のリクエスト制限に達しました
            </h2>
            <p className="text-sm text-muted-foreground">
              {resetTime
                ? `${resetTime} 頃にリセットされます。しばらくお待ちください。`
                : "しばらく時間をおいて再度お試しください。"}
            </p>
          </div>
        );
      }
    }
    throw error;
  }

  const [repository, readme, release] = await Promise.all([
    Promise.resolve(mapRepositoryResponse(response)),
    getReadme(owner, repo),
    getLatestRelease(owner, repo),
  ]);

  const readmeContent = readme
    ? Buffer.from(readme.content, "base64").toString("utf-8")
    : null;

  const latestRelease = release
    ? {
        tagName: release.tag_name,
        publishedAt: release.published_at,
        htmlUrl: release.html_url,
      }
    : null;

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <ScrollToTop />
      <RepositoryDetail repository={repository} readmeContent={readmeContent} latestRelease={latestRelease} />
    </div>
  );
}
