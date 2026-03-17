import { describe, expect, it } from "vitest";
import { presenceLabel, ciLabel, codeFreshnessLabel } from "../meta-labels";

describe("presenceLabel", () => {
  it('returns "あり" for present', () => {
    expect(presenceLabel("present")).toBe("あり");
  });

  it('returns "なし" for absent', () => {
    expect(presenceLabel("absent")).toBe("なし");
  });

  it('returns "不明" for unknown', () => {
    expect(presenceLabel("unknown")).toBe("不明");
  });
});

describe("ciLabel", () => {
  it('returns "成功" for success', () => {
    expect(ciLabel("success")).toBe("成功");
  });

  it('returns "失敗" for failed', () => {
    expect(ciLabel("failed")).toBe("失敗");
  });

  it('returns "ワークフローなし" for none', () => {
    expect(ciLabel("none")).toBe("ワークフローなし");
  });

  it('returns "不明" for unknown', () => {
    expect(ciLabel("unknown")).toBe("不明");
  });
});

describe("codeFreshnessLabel", () => {
  it('returns "更新あり" for fresh', () => {
    expect(codeFreshnessLabel("fresh")).toBe("更新あり");
  });

  it('returns "要注意" for stale', () => {
    expect(codeFreshnessLabel("stale")).toBe("要注意");
  });

  it('returns "不明" for unknown', () => {
    expect(codeFreshnessLabel("unknown")).toBe("不明");
  });
});
