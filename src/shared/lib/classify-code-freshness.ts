export const CODE_STALE_THRESHOLD_DAYS = 180;

export type CodeFreshnessStatus = "fresh" | "stale" | "unknown";

export function classifyCodeFreshness(
  pushedAt: string,
  now: Date = new Date(),
  staleThresholdDays: number = CODE_STALE_THRESHOLD_DAYS,
): CodeFreshnessStatus {
  const pushedAtDate = new Date(pushedAt);
  if (Number.isNaN(pushedAtDate.getTime())) {
    return "unknown";
  }

  const thresholdMs = staleThresholdDays * 24 * 60 * 60 * 1000;
  const ageMs = now.getTime() - pushedAtDate.getTime();
  return ageMs >= thresholdMs ? "stale" : "fresh";
}
