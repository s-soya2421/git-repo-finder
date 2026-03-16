import { describe, expect, it, vi } from "vitest";
import { log } from "../logger";

describe("log", () => {
  it("outputs valid JSON with timestamp, level, and message", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    log({ level: "info", message: "test" });
    expect(spy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({ level: "info", message: "test" });
    expect(parsed.timestamp).toBeDefined();
    spy.mockRestore();
  });

  it("includes extra fields in output", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    log({ level: "warn", message: "rate limit", remaining: 5 });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed.remaining).toBe(5);
    spy.mockRestore();
  });
});
