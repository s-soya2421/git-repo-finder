import type { SortOption } from "./parse-search-params";

/** Sentinel for "best match" (default) since base-ui Select does not accept empty string as value */
const BEST_MATCH = "best_match";

type SortOptionEntry = {
  value: string;
  label: string;
  sortOption: SortOption;
};

export const SORT_OPTIONS: SortOptionEntry[] = [
  { value: BEST_MATCH, label: "関連度順", sortOption: "" },
  { value: "stars", label: "Star数順", sortOption: "stars" },
  { value: "updated", label: "更新日順", sortOption: "updated" },
];

export function sortOptionToSelectValue(sort: SortOption): string {
  return sort || BEST_MATCH;
}

export function selectValueToSortOption(value: string): SortOption | null {
  const option = SORT_OPTIONS.find((o) => o.value === value);
  return option ? option.sortOption : null;
}
