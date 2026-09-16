import type { Gender, Level } from "@/generated/prisma/enums";

/**
 * The fields a team needs for grouping. Structural, so the school page can
 * pass Prisma rows and the tests can pass literals.
 */
export interface GroupableTeam {
  level: Level;
  season: {
    id: string;
    label: string;
    startDate: Date;
    sport: { name: string; gender: Gender };
  };
}

export interface SeasonGroup<T> {
  seasonId: string;
  label: string;
  startDate: Date;
  /** Varsity first, then JV, then freshman. */
  teams: T[];
}

export interface GenderGroup<T> {
  gender: Gender;
  /** Newest season first. */
  seasons: SeasonGroup<T>[];
}

export interface SportGroup<T> {
  sportName: string;
  /** Boys before girls. */
  genders: GenderGroup<T>[];
}

const GENDER_ORDER: Record<Gender, number> = { BOYS: 0, GIRLS: 1 };
const LEVEL_ORDER: Record<Level, number> = { VARSITY: 0, JV: 1, FRESHMAN: 2 };

/**
 * Group a school's teams by sport, then gender, then season, in the order
 * the school page shows them: sports alphabetically, boys before girls,
 * newest season first, varsity before JV before freshman.
 */
export function groupTeamsBySport<T extends GroupableTeam>(
  teams: readonly T[],
): SportGroup<T>[] {
  const sports = new Map<string, Map<Gender, Map<string, SeasonGroup<T>>>>();

  for (const team of teams) {
    const { season } = team;
    const { sport } = season;

    let genders = sports.get(sport.name);
    if (!genders) {
      genders = new Map();
      sports.set(sport.name, genders);
    }

    let seasons = genders.get(sport.gender);
    if (!seasons) {
      seasons = new Map();
      genders.set(sport.gender, seasons);
    }

    let group = seasons.get(season.id);
    if (!group) {
      group = {
        seasonId: season.id,
        label: season.label,
        startDate: season.startDate,
        teams: [],
      };
      seasons.set(season.id, group);
    }
    group.teams.push(team);
  }

  return [...sports.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sportName, genders]) => ({
      sportName,
      genders: [...genders.entries()]
        .sort(([a], [b]) => GENDER_ORDER[a] - GENDER_ORDER[b])
        .map(([gender, seasons]) => ({
          gender,
          seasons: [...seasons.values()]
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
            .map((season) => ({
              ...season,
              teams: [...season.teams].sort(
                (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
              ),
            })),
        })),
    }));
}
