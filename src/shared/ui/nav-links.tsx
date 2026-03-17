"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home } from "lucide-react";

const links = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/favorites", label: "お気に入り", icon: Heart },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="メインナビゲーション">
      <ul className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
