/**
 * Top-level public navigation. Shared by the desktop nav and the mobile
 * menu so the two never drift apart.
 */
export const NAV_LINKS = [
  { href: "/scores", label: "Scores" },
  { href: "/standings", label: "Standings" },
  { href: "/leaders", label: "Leaders" },
  { href: "/rankings", label: "Rankings" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** True when `pathname` is the link itself or a page beneath it. */
export function isActiveLink(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
