import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

const teamDetailInclude = {
  school: true,
  season: { include: { sport: true } },
  league: true,
} satisfies Prisma.TeamInclude;

/** A team with its school, season, sport, and league. */
export type TeamDetail = Prisma.TeamGetPayload<{
  include: typeof teamDetailInclude;
}>;

const scheduleGameInclude = {
  homeTeam: { include: { school: true } },
  awayTeam: { include: { school: true } },
} satisfies Prisma.GameInclude;

/** One game as shown on a schedule: both teams and their schools. */
export type ScheduleGame = Prisma.GameGetPayload<{
  include: typeof scheduleGameInclude;
}>;

const rosterEntryInclude = {
  player: true,
} satisfies Prisma.RosterEntryInclude;

/** One roster spot with the player who fills it. */
export type RosterEntryWithPlayer = Prisma.RosterEntryGetPayload<{
  include: typeof rosterEntryInclude;
}>;

/** The team hub's core row, by URL slug. */
export async function getTeamBySlug(slug: string): Promise<TeamDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.teamSlug(slug));

  const team = await db.team.findUnique({
    where: { slug },
    include: teamDetailInclude,
  });
  if (team) {
    cacheTag(cacheTags.team(team.id), cacheTags.school(team.schoolId));
  }
  return team;
}

/**
 * Every game a team plays, home or away, in date order. Record, next game,
 * last game, and the schedule page all derive from this one list.
 */
export async function getTeamSchedule(teamId: string): Promise<ScheduleGame[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.teamSchedule(teamId), cacheTags.team(teamId));

  const games = await db.game.findMany({
    where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
    include: scheduleGameInclude,
    orderBy: { startsAt: "asc" },
  });
  if (games.length > 0) {
    cacheTag(...games.map((game) => cacheTags.game(game.id)));
  }
  return games;
}

/** The roster, sorted by last name then first name. */
export async function getTeamRoster(
  teamId: string,
): Promise<RosterEntryWithPlayer[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.teamRoster(teamId), cacheTags.team(teamId));

  const entries = await db.rosterEntry.findMany({
    where: { teamId },
    include: rosterEntryInclude,
    orderBy: [
      { player: { lastName: "asc" } },
      { player: { firstName: "asc" } },
    ],
  });
  if (entries.length > 0) {
    cacheTag(...entries.map((entry) => cacheTags.player(entry.playerId)));
  }
  return entries;
}

/** The team's most recent computer ranking row, for the rank badge. */
export async function getLatestTeamRanking(teamId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.team(teamId));

  const ranking = await db.ranking.findFirst({
    where: { teamId },
    orderBy: { computedAt: "desc" },
  });
  if (ranking) {
    cacheTag(cacheTags.rankings(ranking.seasonId));
  }
  return ranking;
}
