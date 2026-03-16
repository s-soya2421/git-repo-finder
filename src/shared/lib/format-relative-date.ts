/**
 * Format a date string into a relative time description.
 * Examples: "3 days ago", "2 months ago", "1 year ago"
 *
 * @param dateString - ISO 8601 date string
 * @param now - Reference date for comparison (defaults to current time)
 */
export function formatRelativeDate(
  dateString: string,
  now: Date = new Date(),
): string {
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return `${years} year${years === 1 ? "" : "s"} ago`;
  if (months >= 1) return `${months} month${months === 1 ? "" : "s"} ago`;
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes >= 1) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  return "just now";
}
