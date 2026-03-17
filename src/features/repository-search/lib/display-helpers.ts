const DESCRIPTION_TRUNCATE_LENGTH = 50;
const MAX_VISIBLE_TOPICS = 3;

export function truncateDescription(
  description: string | null,
  isExpanded: boolean,
): string | null {
  if (description === null) return null;
  const shouldTruncate = description.length > DESCRIPTION_TRUNCATE_LENGTH;
  if (shouldTruncate && !isExpanded) {
    return description.slice(0, DESCRIPTION_TRUNCATE_LENGTH) + "…";
  }
  return description;
}

export function shouldTruncateDescription(description: string | null): boolean {
  return description !== null && description.length > DESCRIPTION_TRUNCATE_LENGTH;
}

export function sliceVisibleTopics(topics: string[]): {
  visibleTopics: string[];
  hiddenTopicCount: number;
} {
  return {
    visibleTopics: topics.slice(0, MAX_VISIBLE_TOPICS),
    hiddenTopicCount: Math.max(0, topics.length - MAX_VISIBLE_TOPICS),
  };
}
