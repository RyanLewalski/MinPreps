import { describe, expect, it } from "vitest";

import { isActiveLink } from "@/components/site/nav-links";

describe("isActiveLink", () => {
  it("matches the exact path", () => {
    expect(isActiveLink("/standings", "/standings")).toBe(true);
  });

  it("matches nested pages", () => {
    expect(isActiveLink("/standings/2025-26/region-4", "/standings")).toBe(
      true,
    );
  });

  it("does not match a sibling that shares a prefix", () => {
    expect(isActiveLink("/scoresheet", "/scores")).toBe(false);
    expect(isActiveLink("/", "/scores")).toBe(false);
  });
});
