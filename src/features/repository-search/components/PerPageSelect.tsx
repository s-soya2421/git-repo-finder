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

const PER_PAGE_OPTIONS = [10, 30, 50] as const;

type PerPageSelectProps = {
  query: string;
  perPage: number;
};

export function PerPageSelect({ query, perPage }: PerPageSelectProps) {
  const router = useRouter();

  function handleChange(value: number | null) {
    if (value === null) return;
    router.push(buildSearchUrl({ q: query, page: 1, perPage: value }));
  }

  return (
    <Select value={perPage} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="表示件数">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PER_PAGE_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option}件
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
