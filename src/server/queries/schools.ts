import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cacheTags } from "@/server/cache-tags";

const schoolDetailInclude = {
  teams: {
    include: {
      season: { include: { sport: true } },
      league: true,
    },
    orderBy: [{ season: { startDate: "desc" } }, { level: "asc" }],
  },
} satisfies Prisma.SchoolInclude;

/** A school with every team it has fielded, newest season first. */
export type SchoolDetail = Prisma.SchoolGetPayload<{
  include: typeof schoolDetailInclude;
}>;

/** Every school, alphabetical. Drives the schools index and search. */
export async function listSchools() {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.schools());

  return db.school.findMany({ orderBy: { name: "asc" } });
}

/**
 * One school with its teams. The school page groups the teams by sport,
 * gender, and season from the included season and sport rows.
 */
export async function getSchoolBySlug(
  slug: string,
): Promise<SchoolDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.schoolSlug(slug));

  const school = await db.school.findUnique({
    where: { slug },
    include: schoolDetailInclude,
  });
  if (school) {
    cacheTag(
      cacheTags.school(school.id),
      ...school.teams.map((team) => cacheTags.team(team.id)),
    );
  }
  return school;
}
