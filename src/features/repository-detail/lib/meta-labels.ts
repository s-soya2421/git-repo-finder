import type { CiStatus, PresenceStatus, SecuritySignalsViewModel } from "../types";

export function presenceLabel(status: PresenceStatus): string {
  if (status === "present") return "あり";
  if (status === "absent") return "なし";
  return "不明";
}

export function ciLabel(status: CiStatus): string {
  if (status === "success") return "成功";
  if (status === "failed") return "失敗";
  if (status === "none") return "ワークフローなし";
  return "不明";
}

export function codeFreshnessLabel(status: SecuritySignalsViewModel["codeFreshness"]): string {
  if (status === "fresh") return "更新あり";
  if (status === "stale") return "要注意";
  return "不明";
}
