/**
 * Shape of `PlayerGameStat.values` (JSONB in Postgres).
 *
 * A flat object mapping a sport's COUNTING StatDefinition keys to integers.
 * Missing keys mean zero. Derived stats (percentages, totals like reb) are
 * never stored; they are computed from these at read time.
 *
 * Basketball example:
 *   { min: 28, pts: 17, fgm: 6, fga: 13, tpm: 2, tpa: 5, ftm: 3, fta: 4,
 *     oreb: 1, dreb: 5, ast: 4, stl: 2, blk: 0, tov: 3, pf: 2 }
 */
export type StatValues = Readonly<Record<string, number>>;

/** Read one counting stat, treating a missing key as zero. */
export function statValue(values: StatValues, key: string): number {
  return values[key] ?? 0;
}
