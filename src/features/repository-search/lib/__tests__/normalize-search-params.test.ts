import { describe, expect, it } from "vitest";
import {
  normalizeSearchParams,
  buildSearchUrl,
} from "../normalize-search-params";

describe("normalizeSearchParams", () => {
  it("returns null when no normalization needed", () => {
    expect(normalizeSearchParams({ q: "nextjs", page: "2" })).toBeNull();
  });

  it("returns null for empty params", () => {
    expect(normalizeSearchParams({})).toBeNull();
  });

  it("normalizes trimmed q", () => {
    const result = normalizeSearchParams({ q: "  nextjs  " });
    expect(result).not.toBeNull();
    expect(result!.q).toBe("nextjs");
  });

  it("normalizes invalid page", () => {
    const result = normalizeSearchParams({ q: "test", page: "0" });
    expect(result).not.toBeNull();
    expect(result!.page).toBe(1);
  });

  it("normalizes invalid perPage", () => {
    const result = normalizeSearchParams({ q: "test", perPage: "20" });
    expect(result).not.toBeNull();
    expect(result!.perPage).toBe(30);
  });

  it("does not normalize default values that are not provided", () => {
    expect(normalizeSearchParams({ q: "test" })).toBeNull();
  });

  it("normalizes invalid sort", () => {
    const result = normalizeSearchParams({ q: "test", sort: "invalid" });
    expect(result).not.toBeNull();
    expect(result!.sort).toBe("");
  });

  it("does not normalize valid sort", () => {
    expect(normalizeSearchParams({ q: "test", sort: "stars" })).toBeNull();
  });

  it("normalizes trimmed language", () => {
    const result = normalizeSearchParams({ q: "test", language: "  Go  " });
    expect(result).not.toBeNull();
    expect(result!.language).toBe("Go");
  });
});

describe("buildSearchUrl", () => {
  it("builds URL with all params", () => {
    expect(buildSearchUrl({ q: "nextjs", page: 2, perPage: 50, sort: "", language: "" })).toBe(
      "/?q=nextjs&page=2&perPage=50",
    );
  });

  it("omits page=1", () => {
    expect(buildSearchUrl({ q: "nextjs", page: 1, perPage: 50, sort: "", language: "" })).toBe(
      "/?q=nextjs&perPage=50",
    );
  });

  it("omits perPage=30", () => {
    expect(buildSearchUrl({ q: "nextjs", page: 2, perPage: 30, sort: "", language: "" })).toBe(
      "/?q=nextjs&page=2",
    );
  });

  it("omits both defaults", () => {
    expect(buildSearchUrl({ q: "nextjs", page: 1, perPage: 30, sort: "", language: "" })).toBe(
      "/?q=nextjs",
    );
  });

  it("returns / when q is empty", () => {
    expect(buildSearchUrl({ q: "", page: 1, perPage: 30, sort: "", language: "" })).toBe("/");
  });

  it("encodes special characters in q", () => {
    const url = buildSearchUrl({ q: "foo&bar=baz", page: 1, perPage: 30, sort: "", language: "" });
    expect(url).toBe("/?q=foo%26bar%3Dbaz");
  });

  it("encodes Japanese characters in q", () => {
    const url = buildSearchUrl({ q: "日本語", page: 1, perPage: 30, sort: "", language: "" });
    expect(url).toContain("q=");
    // URLSearchParams encodes as percent-encoded UTF-8
    const parsed = new URLSearchParams(url.replace("/?", ""));
    expect(parsed.get("q")).toBe("日本語");
  });

  it("includes sort when not default", () => {
    expect(buildSearchUrl({ q: "react", page: 1, perPage: 30, sort: "stars", language: "" })).toBe(
      "/?q=react&sort=stars",
    );
  });

  it("omits sort when default (empty string)", () => {
    expect(buildSearchUrl({ q: "react", page: 1, perPage: 30, sort: "", language: "" })).toBe(
      "/?q=react",
    );
  });

  it("includes language when set", () => {
    expect(buildSearchUrl({ q: "react", page: 1, perPage: 30, sort: "", language: "TypeScript" })).toBe(
      "/?q=react&language=TypeScript",
    );
  });

  it("includes both sort and language", () => {
    expect(buildSearchUrl({ q: "react", page: 1, perPage: 30, sort: "updated", language: "Go" })).toBe(
      "/?q=react&sort=updated&language=Go",
    );
  });
});
