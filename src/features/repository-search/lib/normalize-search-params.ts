import { parseSearchParams, type ParsedSearchParams } from "./parse-search-params";

/**
 * Check if URL params need normalization (redirect).
 * Returns the normalized params if redirect is needed, null otherwise.
 */
export function normalizeSearchParams(
  params: Record<string, string | string[] | undefined>,
): ParsedSearchParams | null {
  const parsed = parseSearchParams(params);

  const rawQ = typeof params.q === "string" ? params.q : "";
  const rawPage = typeof params.page === "string" ? params.page : "";
  const rawPerPage = typeof params.perPage === "string" ? params.perPage : "";
  const rawSort = typeof params.sort === "string" ? params.sort : "";

  // Check if any value was normalized
  const qNormalized = rawQ !== parsed.q;
  const pageNormalized =
    rawPage !== "" && String(parsed.page) !== rawPage;
  const perPageNormalized =
    rawPerPage !== "" && String(parsed.perPage) !== rawPerPage;
  const sortNormalized =
    rawSort !== "" && rawSort !== parsed.sort;

  if (qNormalized || pageNormalized || perPageNormalized || sortNormalized) {
    return parsed;
  }

  return null;
}

/**
 * Build a URL search string from parsed params.
 * Omits defaults: page=1, perPage=30, sort="" are dropped.
 */
export function buildSearchUrl(params: ParsedSearchParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }
  if (params.page > 1) {
    searchParams.set("page", String(params.page));
  }
  if (params.perPage !== 30) {
    searchParams.set("perPage", String(params.perPage));
  }
  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  const qs = searchParams.toString();
  return qs ? `/?${qs}` : "/";
}
