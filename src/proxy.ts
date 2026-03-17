import { NextRequest, NextResponse } from "next/server";
import { normalizeSearchParams, buildSearchUrl } from "@/features/repository-search/lib/normalize-search-params";

export function proxy(request: NextRequest) {
  // Only normalize the top page search params
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const normalized = normalizeSearchParams(params);
  if (normalized) {
    const url = request.nextUrl.clone();
    const searchUrl = buildSearchUrl(normalized);
    url.pathname = "/";
    url.search = searchUrl === "/" ? "" : searchUrl.slice(1);

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
