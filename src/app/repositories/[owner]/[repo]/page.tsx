import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRepository, GitHubApiError } from "@/shared/github/client";
import { mapRepositoryResponse } from "@/features/repository-detail/lib/map-repository-response";
import { RepositoryDetail } from "@/features/repository-detail/components/RepositoryDetail";

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
    if (error instanceof GitHubApiError && error.type === "not_found") {
      notFound();
    }
    throw error;
  }

  const repository = mapRepositoryResponse(response);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <RepositoryDetail repository={repository} />
    </div>
  );
}
