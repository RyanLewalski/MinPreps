import { describe, expect, it } from "vitest";

import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Bingham High School")).toBe("bingham-high-school");
  });

  it("drops apostrophes instead of splitting on them", () => {
    expect(slugify("St. George's Academy")).toBe("st-georges-academy");
    expect(slugify("Jordan\u2019s Landing")).toBe("jordans-landing");
  });

  it("strips accents", () => {
    expect(slugify("José Álvarez")).toBe("jose-alvarez");
  });

  it("collapses runs of separators and trims the ends", () => {
    expect(slugify("  Region   4 -- Boys  ")).toBe("region-4-boys");
    expect(slugify("---")).toBe("");
  });

  it("keeps digits", () => {
    expect(slugify("2025-26 Season")).toBe("2025-26-season");
  });
});

describe("uniqueSlug", () => {
  it("returns the plain slug when it is free", () => {
    expect(uniqueSlug("Jack Smith", new Set())).toBe("jack-smith");
  });

  it("appends an increasing suffix until the slug is free", () => {
    const taken = new Set(["jack-smith", "jack-smith-2"]);
    expect(uniqueSlug("Jack Smith", taken)).toBe("jack-smith-3");
  });

  it("falls back to a placeholder for empty input", () => {
    expect(uniqueSlug("!!!", new Set())).toBe("item");
    expect(uniqueSlug("!!!", new Set(["item"]))).toBe("item-2");
  });
});
