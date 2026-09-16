import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

/** Every sport, e.g. Boys Basketball and Girls Basketball. */
export async function listSports() {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.sports());

  return db.sport.findMany({
    orderBy: [{ name: "asc" }, { gender: "asc" }],
  });
}

/** Look up a sport by its URL slug, e.g. "boys-basketball". */
export async function getSportBySlug(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.sports());

  return db.sport.findUnique({ where: { slug } });
}
