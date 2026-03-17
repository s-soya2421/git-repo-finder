const ALLOWED_PER_PAGE = [10, 30, 50] as const;
const DEFAULT_PER_PAGE = 30;

const ALLOWED_SORT = ["", "stars", "updated"] as const;
export type SortOption = (typeof ALLOWED_SORT)[number];

export type ParsedSearchParams = {
  q: string;
  page: number;
  perPage: number;
  sort: SortOption;
};

/**
 * Parse and validate search params from URL.
 * Invalid values are normalized to safe defaults.
 */
export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): ParsedSearchParams {
  const rawQ = typeof params.q === "string" ? params.q : "";
  const q = rawQ.trim();

  const rawPage = typeof params.page === "string" ? params.page : "";
  const parsedPage = parseInt(rawPage, 10);
  const page = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const rawPerPage = typeof params.perPage === "string" ? params.perPage : "";
  const parsedPerPage = parseInt(rawPerPage, 10);
  const perPage = (ALLOWED_PER_PAGE as readonly number[]).includes(
    parsedPerPage,
  )
    ? parsedPerPage
    : DEFAULT_PER_PAGE;

  const rawSort = typeof params.sort === "string" ? params.sort : "";
  const sort = (ALLOWED_SORT as readonly string[]).includes(rawSort)
    ? (rawSort as SortOption)
    : "";

  return { q, page, perPage, sort };
}
