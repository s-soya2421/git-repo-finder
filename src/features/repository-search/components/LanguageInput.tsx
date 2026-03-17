"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { buildSearchUrl } from "../lib/normalize-search-params";
import type { SortOption } from "../lib/parse-search-params";

type LanguageInputProps = {
  query: string;
  perPage: number;
  sort: SortOption;
  language: string;
};

export function LanguageInput({ query, perPage, sort, language }: LanguageInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(language);

  function applyLanguage(lang: string) {
    router.push(
      buildSearchUrl({ q: query, page: 1, perPage, sort, language: lang }),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLanguage(value.trim());
    }
  }

  function handleClear() {
    setValue("");
    applyLanguage("");
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          const trimmed = value.trim();
          if (trimmed !== language) {
            applyLanguage(trimmed);
          }
        }}
        placeholder="言語で絞り込み"
        aria-label="言語フィルター"
        className="h-7 w-32 rounded-[min(var(--radius-md),10px)] pr-7 text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="言語フィルターをクリア"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
