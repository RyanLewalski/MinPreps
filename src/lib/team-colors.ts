import type { CSSProperties } from "react";

/**
 * Inline style that overrides the `--team-primary` and `--team-secondary`
 * tokens from globals.css for one subtree, so `bg-team-primary` and friends
 * pick up a school's colors. Missing colors fall through to the site palette.
 */
export function teamColorStyle(
  primary: string | null | undefined,
  secondary: string | null | undefined,
): CSSProperties {
  // Custom properties are not in CSSProperties, but a string record is
  // assignable to it, so build one and return it as the style object.
  const style: Record<string, string> = {};
  if (primary) {
    style["--team-primary"] = primary;
  }
  if (secondary) {
    style["--team-secondary"] = secondary;
  }
  return style;
}
