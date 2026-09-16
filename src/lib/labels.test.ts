import { describe, expect, it } from "vitest";

import {
  classificationFromCode,
  classificationLabel,
  genderLabel,
  levelLabel,
  sportLabel,
} from "@/lib/labels";

describe("classification labels", () => {
  it("maps enum members to UHSAA codes", () => {
    expect(classificationLabel("SIX_A")).toBe("6A");
    expect(classificationLabel("ONE_A")).toBe("1A");
  });

  it("round-trips every code", () => {
    for (const code of ["6A", "5A", "4A", "3A", "2A", "1A"] as const) {
      expect(classificationLabel(classificationFromCode(code))).toBe(code);
    }
  });
});

describe("gender, level, and sport labels", () => {
  it("title-cases genders and levels", () => {
    expect(genderLabel("BOYS")).toBe("Boys");
    expect(genderLabel("GIRLS")).toBe("Girls");
    expect(levelLabel("VARSITY")).toBe("Varsity");
    expect(levelLabel("JV")).toBe("JV");
    expect(levelLabel("FRESHMAN")).toBe("Freshman");
  });

  it("combines gender and sport name", () => {
    expect(sportLabel({ name: "Basketball", gender: "GIRLS" })).toBe(
      "Girls Basketball",
    );
  });
});
