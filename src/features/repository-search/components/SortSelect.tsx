"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { buildSearchUrl } from "../lib/normalize-search-params";
import type { SortOption } from "../lib/parse-search-params";

/** Sentinel for "best match" (default) since base-ui Select does not accept empty string as value */
const BEST_MATCH = "best_match";

const SORT_OPTIONS: { value: string; label: string; sortOption: SortOption }[] = [
  { value: BEST_MATCH, label: "関連度順", sortOption: "" },
  { value: "stars", label: "Star数順", sortOption: "stars" },
  { value: "updated", label: "更新日順", sortOption: "updated" },
];

type SortSelectProps = {
  query: string;
  perPage: number;
  sort: SortOption;
};

export function SortSelect({ query, perPage, sort }: SortSelectProps) {
  const router = useRouter();
  const selectValue = sort || BEST_MATCH;

  function handleChange(value: string | null) {
    if (value === null) return;
    const option = SORT_OPTIONS.find((o) => o.value === value);
    if (!option) return;
    router.push(
      buildSearchUrl({ q: query, page: 1, perPage, sort: option.sortOption }),
    );
  }

  return (
    <Select value={selectValue} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="並び順">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
