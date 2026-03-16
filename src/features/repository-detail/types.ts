/** ViewModel for repository detail page */
export type RepositoryDetailViewModel = {
  id: number;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | null;
  language: string | null;
  license: string | null;
  topics: string[];
  stars: number;
  watchers: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  homepage: string | null;
  htmlUrl: string;
};
