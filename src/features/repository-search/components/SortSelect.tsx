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
import {
  SORT_OPTIONS,
  sortOptionToSelectValue,
  selectValueToSortOption,
} from "../lib/sort-mapping";
import type { SortOption } from "../lib/parse-search-params";

type SortSelectProps = {
  query: string;
  perPage: number;
  sort: SortOption;
};

export function SortSelect({ query, perPage, sort }: SortSelectProps) {
  const router = useRouter();
  const selectValue = sortOptionToSelectValue(sort);

  function handleChange(value: string | null) {
    if (value === null) return;
    const sortOption = selectValueToSortOption(value);
    if (sortOption === null) return;
    router.push(
      buildSearchUrl({ q: query, page: 1, perPage, sort: sortOption }),
    );
  }

  return (
    <Select value={selectValue} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="並び順">
        <SelectValue>
          {SORT_OPTIONS.find((o) => o.value === selectValue)?.label}
        </SelectValue>
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
