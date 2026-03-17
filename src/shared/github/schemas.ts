/** GitHub REST API: Repository owner (partial) */
export type GitHubOwner = {
  login: string;
  avatar_url: string;
};

/** GitHub REST API: Repository item from search results */
export type GitHubSearchItem = {
  id: number;
  full_name: string;
  name: string;
  owner: GitHubOwner;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  license: { spdx_id: string | null; name: string } | null;
  topics: string[];
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  updated_at: string;
};

/** GitHub REST API: Search repositories response */
export type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchItem[];
};

/** GitHub REST API: Single repository response */
export type GitHubRepositoryResponse = GitHubSearchItem & {
  subscribers_count: number;
};

/** GitHub REST API: Repository README response */
export type GitHubReadmeResponse = {
  content: string;
  encoding: string;
  name: string;
  path: string;
};

/** GitHub REST API: Latest release response */
export type GitHubReleaseResponse = {
  tag_name: string;
  published_at: string;
  html_url: string;
};
