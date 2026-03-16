"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { buildSearchUrl } from "../lib/normalize-search-params";

type SearchFormProps = {
  defaultValue?: string;
};

export function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(buildSearchUrl({ q: trimmed, page: 1, perPage: 30 }));
  }

  function handleClear() {
    setQuery("");
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="search-input" className="text-sm font-medium">
        リポジトリを検索
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: nextjs auth"
            className="pr-8"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="検索条件をクリア"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="default">
          <Search className="size-4" />
          検索
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        例: <code className="rounded bg-muted px-1 py-0.5">nextjs auth</code>
        {" "}
        <code className="rounded bg-muted px-1 py-0.5">
          nextjs stars:&gt;500 language:typescript
        </code>
      </p>
    </form>
  );
}
