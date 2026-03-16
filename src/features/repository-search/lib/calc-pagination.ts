export type PaginationResult = {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  hasPrev: boolean;
  hasNext: boolean;
};

/**
 * Calculate pagination state with GitHub API 1000-item limit guard.
 * visiblePages: current page ± 2 (max 5 pages), clamped to [1, totalPages].
 */
export function calcPagination(
  totalCount: number,
  page: number,
  perPage: number,
): PaginationResult {
  if (totalCount <= 0 || perPage <= 0) {
    return {
      currentPage: 1,
      totalPages: 0,
      visiblePages: [],
      hasPrev: false,
      hasNext: false,
    };
  }

  const maxPage = Math.min(
    Math.ceil(totalCount / perPage),
    Math.floor(1000 / perPage),
  );

  const currentPage = Math.max(1, Math.min(page, maxPage));

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(maxPage, currentPage + 2);

  const visiblePages: number[] = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  return {
    currentPage,
    totalPages: maxPage,
    visiblePages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < maxPage,
  };
}
