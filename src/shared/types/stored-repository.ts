export type StoredRepository = {
  id: number;
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
};
