import { notFound } from "next/navigation";
import { getRepository, GitHubApiError } from "@/shared/github/client";
import { mapRepositoryResponse } from "@/features/repository-detail/lib/map-repository-response";
import { RepositoryDetail } from "@/features/repository-detail/components/RepositoryDetail";
import { RepositoryDetailModal } from "@/features/repository-detail/components/RepositoryDetailModal";

type PageProps = {
  params: Promise<{ owner: string; repo: string }>;
};

export default async function RepositoryDetailInterceptedPage({
  params,
}: PageProps) {
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
    <RepositoryDetailModal title={`${owner}/${repo}`}>
      <RepositoryDetail repository={repository} />
    </RepositoryDetailModal>
  );
}
