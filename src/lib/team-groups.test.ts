import { describe, expect, it } from "vitest";

import type { Gender, Level } from "@/generated/prisma/enums";
import { groupTeamsBySport } from "@/lib/team-groups";

interface FixtureTeam {
  slug: string;
  level: Level;
  season: {
    id: string;
    label: string;
    startDate: Date;
    sport: { name: string; gender: Gender };
  };
}

function team(
  slug: string,
  sportName: string,
  gender: Gender,
  seasonLabel: string,
  level: Level = "VARSITY",
): FixtureTeam {
  const year = Number(seasonLabel.slice(0, 4));
  return {
    slug,
    level,
    season: {
      id: `${sportName}-${gender}-${seasonLabel}`,
      label: seasonLabel,
      startDate: new Date(Date.UTC(year, 10, 15)),
      sport: { name: sportName, gender },
    },
  };
}

describe("groupTeamsBySport", () => {
  it("returns nothing for a school with no teams", () => {
    expect(groupTeamsBySport([])).toEqual([]);
  });

  it("orders sports alphabetically and boys before girls", () => {
    const groups = groupTeamsBySport([
      team("g-soccer", "Soccer", "GIRLS", "2025-26"),
      team("g-bball", "Basketball", "GIRLS", "2025-26"),
      team("b-bball", "Basketball", "BOYS", "2025-26"),
    ]);

    expect(groups.map((g) => g.sportName)).toEqual(["Basketball", "Soccer"]);
    expect(groups[0]?.genders.map((g) => g.gender)).toEqual(["BOYS", "GIRLS"]);
  });

  it("puts the newest season first within a gender", () => {
    const [basketball] = groupTeamsBySport([
      team("old", "Basketball", "BOYS", "2023-24"),
      team("new", "Basketball", "BOYS", "2025-26"),
      team("mid", "Basketball", "BOYS", "2024-25"),
    ]);

    const seasons = basketball?.genders[0]?.seasons ?? [];
    expect(seasons.map((s) => s.label)).toEqual([
      "2025-26",
      "2024-25",
      "2023-24",
    ]);
  });

  it("orders varsity, JV, then freshman within a season", () => {
    const [basketball] = groupTeamsBySport([
      team("fr", "Basketball", "BOYS", "2025-26", "FRESHMAN"),
      team("jv", "Basketball", "BOYS", "2025-26", "JV"),
      team("var", "Basketball", "BOYS", "2025-26", "VARSITY"),
    ]);

    const teams = basketball?.genders[0]?.seasons[0]?.teams ?? [];
    expect(teams.map((t) => t.slug)).toEqual(["var", "jv", "fr"]);
  });

  it("keeps the original team objects so callers keep their types", () => {
    const original = team("keep", "Basketball", "BOYS", "2025-26");
    const [group] = groupTeamsBySport([original]);
    expect(group?.genders[0]?.seasons[0]?.teams[0]).toBe(original);
  });
});
