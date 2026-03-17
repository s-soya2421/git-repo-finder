import type { GitHubRepositoryResponse } from "@/shared/github/schemas";
import type { RepositoryDetailViewModel } from "../types";

export function mapRepositoryResponse(
  response: GitHubRepositoryResponse,
): RepositoryDetailViewModel {
  return {
    id: response.id,
    name: response.name,
    owner: response.owner.login,
    ownerAvatarUrl: response.owner.avatar_url,
    description: response.description,
    language: response.language,
    license: response.license?.spdx_id ?? null,
    topics: response.topics,
    stars: response.stargazers_count,
    watchers: response.subscribers_count,
    forks: response.forks_count,
    openIssues: response.open_issues_count,
    updatedAt: response.updated_at,
    pushedAt: response.pushed_at,
    archived: response.archived,
    disabled: response.disabled,
    homepage: response.homepage,
    htmlUrl: response.html_url,
  };
}
