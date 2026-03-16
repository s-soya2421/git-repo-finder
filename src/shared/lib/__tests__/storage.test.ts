import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getStorageItems, setStorageItems } from "../storage";

describe("storage", () => {
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

  describe("getStorageItems", () => {
    it("returns empty array when key does not exist", () => {
      expect(getStorageItems("missing")).toEqual([]);
    });

    it("returns parsed items when key exists", () => {
      mockStorage.set("test", JSON.stringify([{ id: 1 }, { id: 2 }]));
      expect(getStorageItems("test")).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("returns empty array for invalid JSON", () => {
      mockStorage.set("test", "not-json");
      expect(getStorageItems("test")).toEqual([]);
    });
  });

  describe("setStorageItems", () => {
    it("stores items as JSON", () => {
      setStorageItems("test", [{ id: 1 }]);
      expect(JSON.parse(mockStorage.get("test")!)).toEqual([{ id: 1 }]);
    });
  });
});
