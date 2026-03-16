import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  getRecentlyViewed,
  addRecentlyViewed,
  removeRecentlyViewed,
  clearAllRecentlyViewed,
} from "../recently-viewed-storage";

describe("recently-viewed-storage", () => {
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

  const makeRepo = (id: number) => ({
    id,
    owner: "owner",
    repo: `repo-${id}`,
    description: null,
    language: null,
    stars: 0,
  });

  it("returns empty array initially", () => {
    expect(getRecentlyViewed()).toEqual([]);
  });

  it("adds a recently viewed item", () => {
    addRecentlyViewed(makeRepo(1));
    const items = getRecentlyViewed();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(1);
    expect(items[0].viewedAt).toBeDefined();
  });

  it("moves duplicate to front and updates viewedAt", () => {
    addRecentlyViewed(makeRepo(1));
    addRecentlyViewed(makeRepo(2));
    addRecentlyViewed(makeRepo(1));
    const items = getRecentlyViewed();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(2);
  });

  it("limits to 20 items", () => {
    for (let i = 1; i <= 25; i++) {
      addRecentlyViewed(makeRepo(i));
    }
    const items = getRecentlyViewed();
    expect(items).toHaveLength(20);
    expect(items[0].id).toBe(25);
    expect(items[19].id).toBe(6);
  });

  it("removes a specific item", () => {
    addRecentlyViewed(makeRepo(1));
    addRecentlyViewed(makeRepo(2));
    removeRecentlyViewed(1);
    const items = getRecentlyViewed();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });

  it("clears all items", () => {
    addRecentlyViewed(makeRepo(1));
    addRecentlyViewed(makeRepo(2));
    clearAllRecentlyViewed();
    expect(getRecentlyViewed()).toEqual([]);
  });
});
