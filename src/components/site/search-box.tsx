import Form from "next/form";
import { SearchIcon } from "lucide-react";
import { cn } from "cn";

import { Input } from "@/components/ui/input";

/**
 * Header search. A plain GET form to /search?q=... so it works before
 * hydration and with JavaScript off. next/form upgrades the submit to a
 * client-side navigation once hydrated. Autocomplete arrives with the
 * search issue (#24).
 */
export function SearchBox({ className }: { className?: string }) {
  return (
    <Form
      action="/search"
      role="search"
      className={cn("relative flex items-center", className)}
    >
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
      />
      <Input
        type="search"
        name="q"
        placeholder="Search schools, teams, players"
        aria-label="Search schools, teams, and players"
        autoComplete="off"
        required
        minLength={2}
        className="pl-8"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </Form>
  );
}
