import { describe, expect, it } from "vitest";

import {
  cacheTags,
  gameChangedTags,
  rosterChangedTags,
} from "@/server/cache-tags";

describe("cacheTags", () => {
  it("prefixes every keyed tag with its kind", () => {
    expect(cacheTags.school("s1")).toBe("school:s1");
    expect(cacheTags.team("t1")).toBe("team:t1");
    expect(cacheTags.teamSchedule("t1")).toBe("team-schedule:t1");
    expect(cacheTags.game("g1")).toBe("game:g1");
    expect(cacheTags.playerGameLog("p1")).toBe("player-game-log:p1");
  });

  it("keeps every builder distinct for the same id", () => {
    const id = "same";
    const produced = Object.values(cacheTags).map((build) => build(id));
    expect(new Set(produced).size).toBe(produced.length);
  });

  it("stays under the 256 character tag limit for cuid-sized ids", () => {
    const id = "c".repeat(32);
    for (const build of Object.values(cacheTags)) {
      expect(build(id).length).toBeLessThanOrEqual(256);
    }
  });
});

describe("gameChangedTags", () => {
  const change = {
    gameId: "g1",
    seasonId: "s1",
    homeTeamId: "home",
    awayTeamId: "away",
  };

  it("covers the game, both schedules, and season-wide derived data", () => {
    expect(gameChangedTags(change)).toEqual([
      "game:g1",
      "team-schedule:home",
      "team-schedule:away",
      "leaders:s1",
      "rankings:s1",
    ]);
  });

  it("adds standings for each league and a game log per player", () => {
    const tags = gameChangedTags({
      ...change,
      leagueIds: ["l1", "l2"],
      playerIds: ["p1", "p2"],
    });
    expect(tags).toContain("standings:l1");
    expect(tags).toContain("standings:l2");
    expect(tags).toContain("player-game-log:p1");
    expect(tags).toContain("player-game-log:p2");
  });

  it("skips independents with no league and dedupes shared leagues", () => {
    const tags = gameChangedTags({ ...change, leagueIds: ["l1", null, "l1"] });
    expect(tags.filter((tag) => tag.startsWith("standings:"))).toEqual([
      "standings:l1",
    ]);
  });
});

describe("rosterChangedTags", () => {
  it("touches the roster, the team, and the player", () => {
    expect(rosterChangedTags("t1", "p1")).toEqual([
      "team-roster:t1",
      "team:t1",
      "player:p1",
    ]);
  });
});
