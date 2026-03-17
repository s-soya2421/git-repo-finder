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
  pushedAt: string;
  archived: boolean;
  disabled: boolean;
  homepage: string | null;
  htmlUrl: string;
};

export type PresenceStatus = "present" | "absent" | "unknown";
export type CiStatus = "success" | "failed" | "none" | "unknown";

export type SecuritySignalsViewModel = {
  securityPolicy: PresenceStatus;
  dependabot: PresenceStatus;
  ciStatus: CiStatus;
  codeFreshness: "fresh" | "stale" | "unknown";
};

/** ViewModel for latest release info */
export type LatestReleaseViewModel = {
  tagName: string;
  publishedAt: string;
  htmlUrl: string;
};
