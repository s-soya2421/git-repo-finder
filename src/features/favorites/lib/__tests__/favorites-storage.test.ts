import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearAllFavorites,
  isFavorite,
} from "../favorites-storage";

describe("favorites-storage", () => {
  const mockStorage = new Map<string, string>();

  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const sampleRepo = {
    id: 1,
    owner: "octocat",
    repo: "hello-world",
    description: "A test repo",
    language: "TypeScript",
    stars: 100,
  };

  it("returns empty array initially", () => {
    expect(getFavorites()).toEqual([]);
  });

  it("adds a favorite", () => {
    addFavorite(sampleRepo);
    const favorites = getFavorites();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
    expect(favorites[0].savedAt).toBeDefined();
  });

  it("does not add duplicate", () => {
    addFavorite(sampleRepo);
    addFavorite(sampleRepo);
    expect(getFavorites()).toHaveLength(1);
  });

  it("removes a favorite by id", () => {
    addFavorite(sampleRepo);
    addFavorite({ ...sampleRepo, id: 2, repo: "other" });
    removeFavorite(1);
    const favorites = getFavorites();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(2);
  });

  it("clears all favorites", () => {
    addFavorite(sampleRepo);
    addFavorite({ ...sampleRepo, id: 2, repo: "other" });
    clearAllFavorites();
    expect(getFavorites()).toEqual([]);
  });

  it("checks if a repo is favorited", () => {
    expect(isFavorite(1)).toBe(false);
    addFavorite(sampleRepo);
    expect(isFavorite(1)).toBe(true);
  });
});
