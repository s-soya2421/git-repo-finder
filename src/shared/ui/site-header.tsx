import Link from "next/link";
import { NavLinks } from "./nav-links";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold hover:opacity-80">
            git-repo-finder
          </Link>
          <NavLinks />
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
