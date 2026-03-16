import { describe, expect, it } from "vitest";
import { formatRelativeDate } from "../format-relative-date";

const now = new Date("2026-03-16T12:00:00Z");

describe("formatRelativeDate", () => {
  it("returns 'just now' for very recent dates", () => {
    expect(formatRelativeDate("2026-03-16T11:59:50Z", now)).toBe("just now");
  });

  it("returns minutes ago", () => {
    expect(formatRelativeDate("2026-03-16T11:55:00Z", now)).toBe(
      "5 minutes ago",
    );
    expect(formatRelativeDate("2026-03-16T11:59:00Z", now)).toBe(
      "1 minute ago",
    );
  });

  it("returns hours ago", () => {
    expect(formatRelativeDate("2026-03-16T09:00:00Z", now)).toBe(
      "3 hours ago",
    );
    expect(formatRelativeDate("2026-03-16T11:00:00Z", now)).toBe(
      "1 hour ago",
    );
  });

  it("returns days ago", () => {
    expect(formatRelativeDate("2026-03-13T12:00:00Z", now)).toBe(
      "3 days ago",
    );
    expect(formatRelativeDate("2026-03-15T12:00:00Z", now)).toBe("1 day ago");
  });

  it("returns months ago", () => {
    expect(formatRelativeDate("2026-01-15T12:00:00Z", now)).toBe(
      "2 months ago",
    );
    expect(formatRelativeDate("2025-12-15T12:00:00Z", now)).toBe(
      "3 months ago",
    );
  });

  it("returns years ago", () => {
    expect(formatRelativeDate("2025-03-16T12:00:00Z", now)).toBe(
      "1 year ago",
    );
    expect(formatRelativeDate("2024-03-16T12:00:00Z", now)).toBe(
      "2 years ago",
    );
  });

  it("returns 'just now' for future dates", () => {
    expect(formatRelativeDate("2026-03-17T12:00:00Z", now)).toBe("just now");
  });
});
