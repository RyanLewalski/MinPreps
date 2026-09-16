import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

const leagueDetailInclude = {
  season: { include: { sport: true } },
  teams: {
    include: { school: true },
    orderBy: { school: { name: "asc" } },
  },
} satisfies Prisma.LeagueInclude;

/** A league (region) with its member teams and their schools. */
export type LeagueDetail = Prisma.LeagueGetPayload<{
  include: typeof leagueDetailInclude;
}>;

/** Every league in a season, grouped naturally by classification then name. */
export async function listLeagues(seasonId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.leagues(seasonId), cacheTags.season(seasonId));

  return db.league.findMany({
    where: { seasonId },
    orderBy: [{ classification: "asc" }, { name: "asc" }],
  });
}

/** One league by its slug within a season, e.g. "region-4". */
export async function getLeagueBySlug(
  seasonId: string,
  slug: string,
): Promise<LeagueDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.leagues(seasonId), cacheTags.season(seasonId));

  const league = await db.league.findUnique({
    where: { seasonId_slug: { seasonId, slug } },
    include: leagueDetailInclude,
  });
  if (league) {
    cacheTag(
      cacheTags.league(league.id),
      ...league.teams.map((team) => cacheTags.team(team.id)),
    );
  }
  return league;
}
