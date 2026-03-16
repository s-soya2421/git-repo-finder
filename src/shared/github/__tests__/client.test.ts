import { describe, expect, it } from "vitest";
import { classifyGitHubError } from "../client";

function makeHeaders(
  entries: Record<string, string> = {},
): Headers {
  return new Headers(entries);
}

describe("classifyGitHubError", () => {
  it("returns not_found for 404", () => {
    expect(classifyGitHubError(404, makeHeaders())).toBe("not_found");
  });

  it("returns validation_failed for 422", () => {
    expect(classifyGitHubError(422, makeHeaders())).toBe("validation_failed");
  });

  it("returns rate_limit_primary for 403 with remaining=0", () => {
    expect(
      classifyGitHubError(403, makeHeaders({ "x-ratelimit-remaining": "0" })),
    ).toBe("rate_limit_primary");
  });

  it("returns rate_limit_secondary for 403 without remaining=0", () => {
    expect(classifyGitHubError(403, makeHeaders())).toBe(
      "rate_limit_secondary",
    );
  });

  it("returns rate_limit_primary for 429 with remaining=0", () => {
    expect(
      classifyGitHubError(429, makeHeaders({ "x-ratelimit-remaining": "0" })),
    ).toBe("rate_limit_primary");
  });

  it("returns rate_limit_secondary for 429 without remaining=0", () => {
    expect(
      classifyGitHubError(429, makeHeaders({ "x-ratelimit-remaining": "10" })),
    ).toBe("rate_limit_secondary");
  });

  it("returns server_error for 5xx", () => {
    expect(classifyGitHubError(500, makeHeaders())).toBe("server_error");
    expect(classifyGitHubError(503, makeHeaders())).toBe("server_error");
  });

  it("returns unknown for other status codes", () => {
    expect(classifyGitHubError(400, makeHeaders())).toBe("unknown");
    expect(classifyGitHubError(401, makeHeaders())).toBe("unknown");
  });
});
