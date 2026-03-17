import { describe, expect, it } from "vitest";
import { classifyCodeFreshness } from "../classify-code-freshness";

describe("classifyCodeFreshness", () => {
  const now = new Date("2026-03-18T00:00:00Z");

  it("returns stale when pushed_at is 180 days old or more", () => {
    expect(classifyCodeFreshness("2025-09-19T00:00:00Z", now)).toBe("stale");
    expect(classifyCodeFreshness("2025-09-18T00:00:00Z", now)).toBe("stale");
  });

  it("returns fresh when pushed_at is newer than 180 days", () => {
    expect(classifyCodeFreshness("2025-09-20T00:00:00Z", now)).toBe("fresh");
  });

  it("returns unknown for invalid date", () => {
    expect(classifyCodeFreshness("invalid-date", now)).toBe("unknown");
  });
});
