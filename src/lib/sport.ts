/**
 * The sports a fan can switch between in the site header.
 *
 * MinPreps launches with basketball only, boys and girls. Each entry is a
 * (sport, gender) pair, matching the Sport model in the data model. The
 * slug travels in the `?sport=` search param so any public page can read
 * the fan's choice without a cookie or client state.
 */
export const SPORTS = [
  { slug: "boys-basketball", label: "Boys Basketball", short: "Boys" },
  { slug: "girls-basketball", label: "Girls Basketball", short: "Girls" },
] as const;

export type SportSlug = (typeof SPORTS)[number]["slug"];

export const DEFAULT_SPORT: SportSlug = "boys-basketball";

/** Name of the search param that carries the selected sport. */
export const SPORT_PARAM = "sport";

export function isSportSlug(value: unknown): value is SportSlug {
  return SPORTS.some((sport) => sport.slug === value);
}

/**
 * Read a sport slug from untrusted input (a search param, a form field) and
 * fall back to the default when it is missing or unknown.
 */
export function parseSport(value: unknown): SportSlug {
  return isSportSlug(value) ? value : DEFAULT_SPORT;
}

/**
 * Build an href that keeps the fan's sport choice. The default sport is
 * omitted so the common case stays a clean URL.
 */
export function withSport(pathname: string, sport: SportSlug): string {
  if (sport === DEFAULT_SPORT) {
    return pathname;
  }
  const joiner = pathname.includes("?") ? "&" : "?";
  return `${pathname}${joiner}${SPORT_PARAM}=${sport}`;
}
