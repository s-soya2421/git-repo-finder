import { describe, expect, it } from "vitest";
import { presenceLabel, ciLabel, codeFreshnessLabel } from "../meta-labels";
import type { CiStatus, PresenceStatus, SecuritySignalsViewModel } from "../../types";

/**
 * ラベル関数のテスト。
 * 各値に対する日本語マッピングは自明なので、ここでは
 * 「全パターン網羅」と「フォールバック "不明" が正しく機能すること」に焦点を当てる。
 */

describe("presenceLabel", () => {
  it("全ての PresenceStatus 値に対して非空文字列を返す", () => {
    const allStatuses: PresenceStatus[] = ["present", "absent", "unknown"];
    for (const status of allStatuses) {
      const label = presenceLabel(status);
      expect(label).toBeTruthy();
      expect(typeof label).toBe("string");
    }
  });

  it("既知のステータスはそれぞれ異なるラベルを返す", () => {
    const labels = new Set([
      presenceLabel("present"),
      presenceLabel("absent"),
      presenceLabel("unknown"),
    ]);
    expect(labels.size).toBe(3);
  });

  it("unknown のフォールバックは '不明' を返す", () => {
    expect(presenceLabel("unknown")).toBe("不明");
  });
});

describe("ciLabel", () => {
  it("全ての CiStatus 値に対して非空文字列を返す", () => {
    const allStatuses: CiStatus[] = ["success", "failed", "none", "unknown"];
    for (const status of allStatuses) {
      const label = ciLabel(status);
      expect(label).toBeTruthy();
      expect(typeof label).toBe("string");
    }
  });

  it("既知のステータスはそれぞれ異なるラベルを返す", () => {
    const labels = new Set([
      ciLabel("success"),
      ciLabel("failed"),
      ciLabel("none"),
      ciLabel("unknown"),
    ]);
    expect(labels.size).toBe(4);
  });

  it("unknown のフォールバックは '不明' を返す", () => {
    expect(ciLabel("unknown")).toBe("不明");
  });
});

describe("codeFreshnessLabel", () => {
  it("全ての codeFreshness 値に対して非空文字列を返す", () => {
    const allStatuses: SecuritySignalsViewModel["codeFreshness"][] = [
      "fresh",
      "stale",
      "unknown",
    ];
    for (const status of allStatuses) {
      const label = codeFreshnessLabel(status);
      expect(label).toBeTruthy();
      expect(typeof label).toBe("string");
    }
  });

  it("既知のステータスはそれぞれ異なるラベルを返す", () => {
    const labels = new Set([
      codeFreshnessLabel("fresh"),
      codeFreshnessLabel("stale"),
      codeFreshnessLabel("unknown"),
    ]);
    expect(labels.size).toBe(3);
  });

  it("unknown のフォールバックは '不明' を返す", () => {
    expect(codeFreshnessLabel("unknown")).toBe("不明");
  });
});
