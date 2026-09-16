import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

/** All seasons of one sport, newest first. */
export async function listSeasons(sportId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.seasons(sportId));

  return db.season.findMany({
    where: { sportId },
    orderBy: { startDate: "desc" },
  });
}

/**
 * The season pages default to when the URL does not name one: the most
 * recently started season of the sport.
 */
export async function getCurrentSeason(sportId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.seasons(sportId));

  const season = await db.season.findFirst({
    where: { sportId },
    orderBy: { startDate: "desc" },
  });
  if (season) {
    cacheTag(cacheTags.season(season.id));
  }
  return season;
}

/** One season by its URL slug within a sport, e.g. "2025-26". */
export async function getSeasonBySlug(sportId: string, slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.seasons(sportId));

  const season = await db.season.findUnique({
    where: { sportId_slug: { sportId, slug } },
  });
  if (season) {
    cacheTag(cacheTags.season(season.id));
  }
  return season;
}
