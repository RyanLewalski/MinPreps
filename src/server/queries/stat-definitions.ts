import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

/**
 * The stat columns for a sport in display order. Box score tables,
 * season averages, and leaderboards all read their column list from here.
 */
export async function listStatDefinitions(sportId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.statDefinitions(sportId));

  return db.statDefinition.findMany({
    where: { sportId },
    orderBy: { sortOrder: "asc" },
  });
}
