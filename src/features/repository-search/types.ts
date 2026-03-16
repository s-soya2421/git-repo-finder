/** ViewModel for a single repository in search results */
export type RepositoryListItemViewModel = {
  id: number;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | null;
  language: string | null;
  license: string | null;
  topics: string[];
  stars: number;
  updatedAt: string;
  htmlUrl: string;
};

/** ViewModel for the entire search result */
export type SearchResultViewModel = {
  totalCount: number;
  incompleteResults: boolean;
  items: RepositoryListItemViewModel[];
};
