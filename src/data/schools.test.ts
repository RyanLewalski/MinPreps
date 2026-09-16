import { describe, expect, it } from "vitest";

import { UTAH_SCHOOLS } from "@/data/schools";

describe("Utah school dataset", () => {
  it("covers the 2025-27 6A and 5A alignment", () => {
    expect(UTAH_SCHOOLS).toHaveLength(46);
    expect(UTAH_SCHOOLS.filter((s) => s.classification === "6A")).toHaveLength(
      17,
    );
    expect(UTAH_SCHOOLS.filter((s) => s.classification === "5A")).toHaveLength(
      29,
    );
  });

  it("has unique slugs and names", () => {
    const slugs = new Set(UTAH_SCHOOLS.map((s) => s.slug));
    const names = new Set(UTAH_SCHOOLS.map((s) => s.name));
    expect(slugs.size).toBe(UTAH_SCHOOLS.length);
    expect(names.size).toBe(UTAH_SCHOOLS.length);
  });

  it("keeps every region inside one classification", () => {
    const byRegion = new Map<number, Set<string>>();
    for (const s of UTAH_SCHOOLS) {
      const set = byRegion.get(s.region) ?? new Set<string>();
      set.add(s.classification);
      byRegion.set(s.region, set);
    }
    expect([...byRegion.keys()].sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    for (const [region, classes] of byRegion) {
      expect(classes.size, `region ${region} spans classifications`).toBe(1);
    }
    expect(byRegion.get(1)?.has("6A")).toBe(true);
    expect(byRegion.get(4)?.has("5A")).toBe(true);
  });

  it("has region sizes matching the official alignment", () => {
    const size = (r: number) =>
      UTAH_SCHOOLS.filter((s) => s.region === r).length;
    expect([1, 2, 3, 4, 5, 6, 7].map(size)).toEqual([5, 7, 5, 8, 7, 7, 7]);
  });

  it("has complete records with valid hex colors", () => {
    const hex = /^#[0-9a-f]{6}$/;
    for (const s of UTAH_SCHOOLS) {
      expect(s.city.length, s.name).toBeGreaterThan(0);
      expect(s.mascot.length, s.name).toBeGreaterThan(0);
      expect(s.primaryColor, s.name).toMatch(hex);
      expect(s.secondaryColor, s.name).toMatch(hex);
    }
  });
});
