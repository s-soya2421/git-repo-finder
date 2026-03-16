/**
 * Format a number into a compact human-readable string.
 * Examples: 0 → "0", 999 → "999", 1234 → "1.2k", 12345 → "12.3k", 1234567 → "1.2M"
 */
export function formatNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    const formatted = k.toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  const m = n / 1_000_000;
  const formatted = m.toFixed(1);
  return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}M`;
}
