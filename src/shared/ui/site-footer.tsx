import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[oklch(0.2_0.02_260)] text-white/70 mt-auto">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 text-xs">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="hover:text-white hover:underline">
            git-repo-finder
          </Link>
        </p>
        <a
          href="https://github.com/s-soya2421/git-repo-finder"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
