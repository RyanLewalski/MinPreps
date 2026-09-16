"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { SearchBox } from "@/components/site/search-box";
import { SiteNav } from "@/components/site/site-nav";
import { SportSwitcher } from "@/components/site/sport-switcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Hamburger menu for small screens. Opens a dialog with search, the sport
 * switcher, and the main navigation. Closes itself whenever the route
 * changes so a search submit or link tap lands on a clean page.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change (a search submit or link tap). Resetting state
  // during render, keyed on the previous pathname, avoids an effect that
  // would re-render the menu one extra time after every navigation.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </DialogTrigger>
      <DialogContent className="top-0 left-0 h-dvh max-w-[min(20rem,calc(100%-2rem))] translate-x-0 translate-y-0 content-start rounded-none rounded-r-xl sm:max-w-xs data-open:slide-in-from-left-4 data-closed:slide-out-to-left-4">
        <DialogHeader>
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription className="sr-only">
            Search and site navigation
          </DialogDescription>
        </DialogHeader>
        <SearchBox />
        <SportSwitcher className="w-full" />
        <SiteNav orientation="vertical" onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
