import { describe, expect, it } from "vitest";
import { formatNumber } from "../format-number";

describe("formatNumber", () => {
  it("returns plain number below 1000", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1)).toBe("1");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with k suffix", () => {
    expect(formatNumber(1000)).toBe("1k");
    expect(formatNumber(1234)).toBe("1.2k");
    expect(formatNumber(1250)).toBe("1.3k");
    expect(formatNumber(9999)).toBe("10k");
    expect(formatNumber(12345)).toBe("12.3k");
    expect(formatNumber(100000)).toBe("100k");
    expect(formatNumber(999999)).toBe("1000k");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(1000000)).toBe("1M");
    expect(formatNumber(1234567)).toBe("1.2M");
    expect(formatNumber(12345678)).toBe("12.3M");
  });
});
