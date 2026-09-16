/**
 * Cache tag names shared by the read query layer and, later, the coach and
 * admin mutations that invalidate them.
 *
 * Every "use cache" query in src/server/queries tags its entry with the
 * builders below. A mutation calls `updateTag` (server action) or
 * `revalidateTag` (route handler) with the same builders, so the two sides
 * can never drift apart on a string.
 *
 * Tags are keyed by database id, not slug, because a mutation knows the id
 * it just changed. Lookups by slug also carry a `*-slug` tag so an entity
 * created under a previously missing slug can clear the cached "not found".
 */
export const cacheTags = {
  // Reference data
  sports: () => "sports",
  seasons: (sportId: string) => `seasons:${sportId}`,
  season: (seasonId: string) => `season:${seasonId}`,
  statDefinitions: (sportId: string) => `stat-definitions:${sportId}`,

  // Schools and leagues
  schools: () => "schools",
  school: (schoolId: string) => `school:${schoolId}`,
  schoolSlug: (slug: string) => `school-slug:${slug}`,
  leagues: (seasonId: string) => `leagues:${seasonId}`,
  league: (leagueId: string) => `league:${leagueId}`,

  // Teams
  team: (teamId: string) => `team:${teamId}`,
  teamSlug: (slug: string) => `team-slug:${slug}`,
  teamSchedule: (teamId: string) => `team-schedule:${teamId}`,
  teamRoster: (teamId: string) => `team-roster:${teamId}`,

  // Games and players
  game: (gameId: string) => `game:${gameId}`,
  player: (playerId: string) => `player:${playerId}`,
  playerSlug: (slug: string) => `player-slug:${slug}`,
  playerGameLog: (playerId: string) => `player-game-log:${playerId}`,

  // Derived data (standings, leaders, rankings) computed from games.
  standings: (leagueId: string) => `standings:${leagueId}`,
  leaders: (seasonId: string) => `leaders:${seasonId}`,
  rankings: (seasonId: string) => `rankings:${seasonId}`,
} as const;

export interface GameChange {
  gameId: string;
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  /** Leagues whose standings the game can affect. Usually both teams'. */
  leagueIds?: readonly (string | null | undefined)[];
  /** Players with a stat line in the game. */
  playerIds?: readonly string[];
}

/**
 * Every tag that goes stale when a game is created, rescheduled, finalized,
 * or has its box score edited. Hand the result to `updateTag` one by one.
 */
export function gameChangedTags(change: GameChange): string[] {
  const tags = [
    cacheTags.game(change.gameId),
    cacheTags.teamSchedule(change.homeTeamId),
    cacheTags.teamSchedule(change.awayTeamId),
    cacheTags.leaders(change.seasonId),
    cacheTags.rankings(change.seasonId),
  ];
  for (const leagueId of change.leagueIds ?? []) {
    if (leagueId) {
      tags.push(cacheTags.standings(leagueId));
    }
  }
  for (const playerId of change.playerIds ?? []) {
    tags.push(cacheTags.playerGameLog(playerId));
  }
  return unique(tags);
}

/**
 * Tags that go stale when a roster entry is added, edited, or removed.
 */
export function rosterChangedTags(teamId: string, playerId: string): string[] {
  return [
    cacheTags.teamRoster(teamId),
    cacheTags.team(teamId),
    cacheTags.player(playerId),
  ];
}

function unique(tags: readonly string[]): string[] {
  return [...new Set(tags)];
}
