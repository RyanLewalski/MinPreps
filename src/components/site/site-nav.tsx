"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "cn";

import { isActiveLink, NAV_LINKS } from "@/components/site/nav-links";
import { parseSport, SPORT_PARAM, withSport } from "@/lib/sport";

interface SiteNavProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  /** Called after a link is clicked, e.g. to close the mobile menu. */
  onNavigate?: () => void;
}

/**
 * Primary navigation. Highlights the current section and carries the
 * fan's sport choice from one page to the next.
 */
export function SiteNav({
  orientation = "horizontal",
  className,
  onNavigate,
}: SiteNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sport = parseSport(searchParams.get(SPORT_PARAM));

  return (
    <nav aria-label="Main" className={className}>
      <ul
        className={cn("flex gap-1", orientation === "vertical" && "flex-col")}
      >
        {NAV_LINKS.map((link) => {
          const active = isActiveLink(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={withSport(link.href, sport)}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  active ? "bg-muted text-foreground" : "text-muted-foreground",
                  orientation === "vertical" && "px-3 py-2 text-base",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
