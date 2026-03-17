import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getReadme } from "@/shared/github/client";

type RepositoryReadmeProps = {
  owner: string;
  repo: string;
};

export async function RepositoryReadme({ owner, repo }: RepositoryReadmeProps) {
  const readme = await getReadme(owner, repo);

  if (!readme) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          README が見つかりませんでした
        </p>
      </div>
    );
  }

  const content = Buffer.from(readme.content, "base64").toString("utf-8");

  return (
    <div className="rounded-lg border border-border p-6">
      <h2 className="mb-4 text-lg font-semibold">README</h2>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
