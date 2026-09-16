import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

const playerDetailInclude = {
  school: true,
  rosterEntries: {
    include: {
      team: {
        include: {
          school: true,
          season: { include: { sport: true } },
          league: true,
        },
      },
    },
  },
} satisfies Prisma.PlayerInclude;

/** A player with their school and every team they have been rostered on. */
export type PlayerDetail = Prisma.PlayerGetPayload<{
  include: typeof playerDetailInclude;
}>;

const gameLogInclude = {
  game: {
    include: {
      homeTeam: { include: { school: true } },
      awayTeam: { include: { school: true } },
    },
  },
} satisfies Prisma.PlayerGameStatInclude;

/** One stat line plus the game it came from, for the game log table. */
export type PlayerGameLogEntry = Prisma.PlayerGameStatGetPayload<{
  include: typeof gameLogInclude;
}>;

/** The profile's bio row, by URL slug. */
export async function getPlayerBySlug(
  slug: string,
): Promise<PlayerDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.playerSlug(slug));

  const player = await db.player.findUnique({
    where: { slug },
    include: playerDetailInclude,
  });
  if (player) {
    cacheTag(
      cacheTags.player(player.id),
      ...player.rosterEntries.map((entry) => cacheTags.team(entry.teamId)),
    );
  }
  return player;
}

/**
 * Every stat line a player has recorded, newest game first. Season
 * averages and career totals aggregate from this list.
 */
export async function getPlayerGameLog(
  playerId: string,
): Promise<PlayerGameLogEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.playerGameLog(playerId), cacheTags.player(playerId));

  const lines = await db.playerGameStat.findMany({
    where: { playerId },
    include: gameLogInclude,
    orderBy: { game: { startsAt: "desc" } },
  });
  if (lines.length > 0) {
    cacheTag(...lines.map((line) => cacheTags.game(line.gameId)));
  }
  return lines;
}
