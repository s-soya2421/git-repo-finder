import { describe, expect, it } from "vitest";
import {
  truncateDescription,
  shouldTruncateDescription,
  sliceVisibleTopics,
} from "../display-helpers";

describe("truncateDescription", () => {
  it("returns null when description is null", () => {
    expect(truncateDescription(null, false)).toBeNull();
    expect(truncateDescription(null, true)).toBeNull();
  });

  it("returns full text when within limit", () => {
    const short = "a".repeat(50);
    expect(truncateDescription(short, false)).toBe(short);
  });

  it("truncates at 50 chars with ellipsis when not expanded", () => {
    const long = "a".repeat(51);
    expect(truncateDescription(long, false)).toBe("a".repeat(50) + "…");
  });

  it("returns full text when expanded even if over limit", () => {
    const long = "a".repeat(100);
    expect(truncateDescription(long, true)).toBe(long);
  });
});

describe("shouldTruncateDescription", () => {
  it("returns false for null", () => {
    expect(shouldTruncateDescription(null)).toBe(false);
  });

  it("returns false for exactly 50 chars", () => {
    expect(shouldTruncateDescription("a".repeat(50))).toBe(false);
  });

  it("returns true for 51 chars", () => {
    expect(shouldTruncateDescription("a".repeat(51))).toBe(true);
  });
});

describe("sliceVisibleTopics", () => {
  it("returns all topics when 3 or fewer", () => {
    const result = sliceVisibleTopics(["a", "b", "c"]);
    expect(result.visibleTopics).toEqual(["a", "b", "c"]);
    expect(result.hiddenTopicCount).toBe(0);
  });

  it("returns first 3 topics and count of hidden ones", () => {
    const result = sliceVisibleTopics(["a", "b", "c", "d", "e"]);
    expect(result.visibleTopics).toEqual(["a", "b", "c"]);
    expect(result.hiddenTopicCount).toBe(2);
  });

  it("handles empty array", () => {
    const result = sliceVisibleTopics([]);
    expect(result.visibleTopics).toEqual([]);
    expect(result.hiddenTopicCount).toBe(0);
  });
});
