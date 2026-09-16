import { Suspense } from "react";
import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { SearchBox } from "@/components/site/search-box";
import { SiteNav } from "@/components/site/site-nav";
import { SportSwitcher } from "@/components/site/sport-switcher";

/**
 * Sticky site header: wordmark, primary nav, search, and sport switcher.
 * On small screens the nav, search, and switcher collapse into MobileNav.
 *
 * SiteNav and SportSwitcher read search params, so each sits in its own
 * Suspense boundary and the rest of the header can prerender.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Suspense>
          <MobileNav />
        </Suspense>

        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          MinPreps
        </Link>

        <Suspense fallback={<NavFallback />}>
          <SiteNav className="hidden md:block" />
        </Suspense>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SearchBox className="w-56 lg:w-72" />
          <Suspense
            fallback={
              <div className="h-8 w-40 rounded-lg border border-input" />
            }
          >
            <SportSwitcher className="w-40" />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function NavFallback() {
  return <div aria-hidden className="hidden h-8 w-80 md:block" />;
}
