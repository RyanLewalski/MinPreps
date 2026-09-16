/**
 * Turn a display name into a URL-safe slug.
 *
 *   slugify("Bingham High School")   // "bingham-high-school"
 *   slugify("St. George's Academy")  // "st-georges-academy"
 *   slugify("José Álvarez")          // "jose-alvarez"
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // strip combining marks left by NFKD (accents)
    .toLowerCase()
    .replace(/['\u2019]/g, "") // drop apostrophes so "George's" -> "georges"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Like slugify, but guarantees the result is not already in `taken` by
 * appending -2, -3, ... as needed. Useful for players who share a name.
 */
export function uniqueSlug(base: string, taken: ReadonlySet<string>): string {
  const root = slugify(base) || "item";
  if (!taken.has(root)) {
    return root;
  }
  let n = 2;
  while (taken.has(`${root}-${n}`)) {
    n += 1;
  }
  return `${root}-${n}`;
}
