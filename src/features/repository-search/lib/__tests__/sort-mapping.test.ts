import { describe, expect, it } from "vitest";
import {
  SORT_OPTIONS,
  sortOptionToSelectValue,
  selectValueToSortOption,
} from "../sort-mapping";

describe("SORT_OPTIONS", () => {
  it("contains 3 options", () => {
    expect(SORT_OPTIONS).toHaveLength(3);
  });

  it("maps best_match to empty string sortOption", () => {
    const bestMatch = SORT_OPTIONS.find((o) => o.value === "best_match");
    expect(bestMatch?.sortOption).toBe("");
  });
});

describe("sortOptionToSelectValue", () => {
  it('maps empty string to "best_match"', () => {
    expect(sortOptionToSelectValue("")).toBe("best_match");
  });

  it("passes through non-empty sort options", () => {
    expect(sortOptionToSelectValue("stars")).toBe("stars");
    expect(sortOptionToSelectValue("updated")).toBe("updated");
  });
});

describe("selectValueToSortOption", () => {
  it('maps "best_match" to empty string', () => {
    expect(selectValueToSortOption("best_match")).toBe("");
  });

  it('maps "stars" to "stars"', () => {
    expect(selectValueToSortOption("stars")).toBe("stars");
  });

  it('maps "updated" to "updated"', () => {
    expect(selectValueToSortOption("updated")).toBe("updated");
  });

  it("returns null for unknown value", () => {
    expect(selectValueToSortOption("unknown")).toBeNull();
  });
});
