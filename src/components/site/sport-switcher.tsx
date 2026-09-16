"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_SPORT,
  isSportSlug,
  parseSport,
  SPORT_PARAM,
  SPORTS,
} from "@/lib/sport";

const items = SPORTS.map((sport) => ({
  value: sport.slug,
  label: sport.label,
}));

/**
 * Header control that switches between boys and girls basketball. The
 * choice lives in the `?sport=` search param so it survives navigation
 * and can be shared as a link. The default sport is written as no param
 * at all, keeping the common URL clean.
 */
export function SportSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sport = parseSport(searchParams.get(SPORT_PARAM));

  function handleChange(next: string | null) {
    if (!isSportSlug(next) || next === sport) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (next === DEFAULT_SPORT) {
      params.delete(SPORT_PARAM);
    } else {
      params.set(SPORT_PARAM, next);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Select items={items} value={sport} onValueChange={handleChange}>
      <SelectTrigger aria-label="Sport" className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
