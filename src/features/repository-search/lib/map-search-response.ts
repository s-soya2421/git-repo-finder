import type { GitHubSearchResponse } from "@/shared/github/schemas";
import type {
  RepositoryListItemViewModel,
  SearchResultViewModel,
} from "../types";

function mapSearchItem(
  item: GitHubSearchResponse["items"][number],
): RepositoryListItemViewModel {
  return {
    id: item.id,
    name: item.name,
    owner: item.owner.login,
    ownerAvatarUrl: item.owner.avatar_url,
    description: item.description,
    language: item.language,
    license: item.license?.spdx_id ?? null,
    topics: item.topics,
    stars: item.stargazers_count,
    updatedAt: item.updated_at,
    htmlUrl: item.html_url,
  };
}

export function mapSearchResponse(
  response: GitHubSearchResponse,
): SearchResultViewModel {
  return {
    totalCount: response.total_count,
    incompleteResults: response.incomplete_results,
    items: response.items.map(mapSearchItem),
  };
}
