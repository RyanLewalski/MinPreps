import Link from "next/link";

import { NAV_LINKS } from "@/components/site/nav-links";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-2">
          <p className="font-heading text-base font-semibold text-foreground">
            MinPreps
          </p>
          <p>
            Utah high school basketball. Scores, stats, standings, and rankings
            that explain themselves. Fast, ad-free, one state done well.
          </p>
          <p className="text-xs">
            Schools and regions are real. All players, games, and statistics are
            synthetic demo data.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-foreground hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className="hover:text-foreground hover:underline"
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
