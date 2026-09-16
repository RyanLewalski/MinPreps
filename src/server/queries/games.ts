import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

const gameBoxScoreInclude = {
  season: { include: { sport: true } },
  homeTeam: { include: { school: true } },
  awayTeam: { include: { school: true } },
  stats: {
    include: { player: true },
    orderBy: [{ started: "desc" }, { player: { lastName: "asc" } }],
  },
} satisfies Prisma.GameInclude;

/**
 * A game with both teams and every player stat line. The box score page
 * splits `stats` by `teamId` and sums each side for team totals.
 */
export type GameBoxScore = Prisma.GameGetPayload<{
  include: typeof gameBoxScoreInclude;
}>;

/** One game with its full box score. */
export async function getGameById(id: string): Promise<GameBoxScore | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.game(id));

  const game = await db.game.findUnique({
    where: { id },
    include: gameBoxScoreInclude,
  });
  if (game) {
    cacheTag(
      cacheTags.team(game.homeTeamId),
      cacheTags.team(game.awayTeamId),
      ...game.stats.map((line) => cacheTags.player(line.playerId)),
    );
  }
  return game;
}
