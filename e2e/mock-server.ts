import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

function loadFixture(name: string): unknown {
  const filePath = path.join(FIXTURES_DIR, name);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

type RouteHandler = (
  url: URL,
  req: http.IncomingMessage,
) => { status: number; headers?: Record<string, string>; body: unknown } | null;

const routes: RouteHandler[] = [
  // Search repositories
  (url) => {
    if (!url.pathname.startsWith("/search/repositories")) return null;

    const q = url.searchParams.get("q") || "";
    const page = url.searchParams.get("page") || "1";

    // "servererror" triggers 500
    if (q === "servererror") {
      return {
        status: 500,
        body: { message: "Internal Server Error" },
      };
    }

    // "ratelimit" triggers 429
    if (q === "ratelimit") {
      return {
        status: 429,
        headers: {
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 60),
          "retry-after": "60",
        },
        body: { message: "API rate limit exceeded" },
      };
    }

    // "noresults" triggers empty
    if (q === "noresults") {
      return {
        status: 200,
        body: loadFixture("search-results-empty.json"),
      };
    }

    // "incomplete" triggers incomplete_results
    if (q === "incomplete") {
      return {
        status: 200,
        body: loadFixture("search-results-incomplete.json"),
      };
    }

    // Page 2
    if (page === "2") {
      return {
        status: 200,
        body: loadFixture("search-results-page2.json"),
      };
    }

    // Default: normal search results
    return {
      status: 200,
      body: loadFixture("search-results.json"),
    };
  },

  // Repository detail
  (url) => {
    const repoMatch = url.pathname.match(
      /^\/repos\/([^/]+)\/([^/]+)$/,
    );
    if (!repoMatch) return null;

    const [, owner, repo] = repoMatch;

    // 404 for non-existent repos
    if (owner === "nonexistent" && repo === "repo") {
      return {
        status: 404,
        body: { message: "Not Found" },
      };
    }

    return {
      status: 200,
      body: loadFixture("repository-detail.json"),
    };
  },

  // README
  (url) => {
    const readmeMatch = url.pathname.match(
      /^\/repos\/([^/]+)\/([^/]+)\/readme$/,
    );
    if (!readmeMatch) return null;

    return {
      status: 200,
      body: loadFixture("repository-readme.json"),
    };
  },
];

function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const url = new URL(req.url || "/", `http://localhost`);

  for (const route of routes) {
    const result = route(url, req);
    if (result) {
      res.writeHead(result.status, {
        "Content-Type": "application/json",
        ...result.headers,
      });
      res.end(JSON.stringify(result.body));
      return;
    }
  }

  // Fallback: 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found" }));
}

export function createMockServer(port: number): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer(handleRequest);
    server.listen(port, () => {
      console.log(`Mock GitHub API server listening on port ${port}`);
      resolve(server);
    });
  });
}

// Allow running standalone
if (require.main === module) {
  const port = parseInt(process.env.MOCK_PORT || "3099", 10);
  createMockServer(port);
}
