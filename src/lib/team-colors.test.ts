import { describe, expect, it } from "vitest";

import { teamColorStyle } from "@/lib/team-colors";

describe("teamColorStyle", () => {
  it("sets both tokens when both colors are present", () => {
    expect(teamColorStyle("#0f2d5c", "#f2a900")).toEqual({
      "--team-primary": "#0f2d5c",
      "--team-secondary": "#f2a900",
    });
  });

  it("omits tokens for missing colors so the site palette applies", () => {
    expect(teamColorStyle(null, undefined)).toEqual({});
    expect(teamColorStyle("#000000", null)).toEqual({
      "--team-primary": "#000000",
    });
  });
});
