import { describe, expect, it } from "vitest";

import {
  DEFAULT_SPORT,
  isSportSlug,
  parseSport,
  SPORTS,
  withSport,
} from "@/lib/sport";

describe("isSportSlug", () => {
  it("accepts every configured slug", () => {
    for (const sport of SPORTS) {
      expect(isSportSlug(sport.slug)).toBe(true);
    }
  });

  it("rejects unknown and non-string input", () => {
    expect(isSportSlug("football")).toBe(false);
    expect(isSportSlug("")).toBe(false);
    expect(isSportSlug(undefined)).toBe(false);
    expect(isSportSlug(["boys-basketball"])).toBe(false);
  });
});

describe("parseSport", () => {
  it("returns a valid slug unchanged", () => {
    expect(parseSport("girls-basketball")).toBe("girls-basketball");
  });

  it("falls back to the default for anything else", () => {
    expect(parseSport(undefined)).toBe(DEFAULT_SPORT);
    expect(parseSport("hockey")).toBe(DEFAULT_SPORT);
    expect(parseSport(42)).toBe(DEFAULT_SPORT);
  });
});

describe("withSport", () => {
  it("leaves the path alone for the default sport", () => {
    expect(withSport("/standings", DEFAULT_SPORT)).toBe("/standings");
  });

  it("appends the sport param for a non-default sport", () => {
    expect(withSport("/standings", "girls-basketball")).toBe(
      "/standings?sport=girls-basketball",
    );
  });

  it("uses & when the path already has a query string", () => {
    expect(withSport("/leaders?stat=pts", "girls-basketball")).toBe(
      "/leaders?stat=pts&sport=girls-basketball",
    );
  });
});
