import { describe, expect, it } from "vitest";
import { parseSearchParams } from "../parse-search-params";

describe("parseSearchParams", () => {
  it("parses valid params", () => {
    const result = parseSearchParams({ q: "nextjs", page: "2", perPage: "50" });
    expect(result).toEqual({ q: "nextjs", page: 2, perPage: 50, sort: "", language: "" });
  });

  it("trims q", () => {
    expect(parseSearchParams({ q: "  nextjs  " }).q).toBe("nextjs");
  });

  it("defaults q to empty string when missing", () => {
    expect(parseSearchParams({}).q).toBe("");
  });

  it("defaults page to 1 when missing", () => {
    expect(parseSearchParams({}).page).toBe(1);
  });

  it("clamps page < 1 to 1", () => {
    expect(parseSearchParams({ page: "0" }).page).toBe(1);
    expect(parseSearchParams({ page: "-5" }).page).toBe(1);
  });

  it("defaults page to 1 for non-numeric", () => {
    expect(parseSearchParams({ page: "abc" }).page).toBe(1);
  });

  it("defaults perPage to 30 when missing", () => {
    expect(parseSearchParams({}).perPage).toBe(30);
  });

  it("accepts allowed perPage values", () => {
    expect(parseSearchParams({ perPage: "10" }).perPage).toBe(10);
    expect(parseSearchParams({ perPage: "30" }).perPage).toBe(30);
    expect(parseSearchParams({ perPage: "50" }).perPage).toBe(50);
  });

  it("defaults perPage to 30 for disallowed values", () => {
    expect(parseSearchParams({ perPage: "20" }).perPage).toBe(30);
    expect(parseSearchParams({ perPage: "100" }).perPage).toBe(30);
    expect(parseSearchParams({ perPage: "abc" }).perPage).toBe(30);
  });

  it("handles array values by ignoring them", () => {
    expect(parseSearchParams({ q: ["a", "b"] }).q).toBe("");
  });

  it("defaults sort to empty string when missing", () => {
    expect(parseSearchParams({}).sort).toBe("");
  });

  it("accepts allowed sort values", () => {
    expect(parseSearchParams({ sort: "stars" }).sort).toBe("stars");
    expect(parseSearchParams({ sort: "updated" }).sort).toBe("updated");
    expect(parseSearchParams({ sort: "" }).sort).toBe("");
  });

  it("defaults sort to empty string for disallowed values", () => {
    expect(parseSearchParams({ sort: "forks" }).sort).toBe("");
    expect(parseSearchParams({ sort: "invalid" }).sort).toBe("");
  });

  it("defaults language to empty string when missing", () => {
    expect(parseSearchParams({}).language).toBe("");
  });

  it("parses language value", () => {
    expect(parseSearchParams({ language: "TypeScript" }).language).toBe("TypeScript");
  });

  it("trims language value", () => {
    expect(parseSearchParams({ language: "  Go  " }).language).toBe("Go");
  });
});
