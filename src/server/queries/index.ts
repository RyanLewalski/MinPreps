/**
 * The public read query layer.
 *
 * Every function here is a "use cache" server function over Prisma. Pages
 * import from "@/server/queries" and never touch `db` directly, so caching
 * and tagging live in one place. Each entry carries the tags from
 * src/server/cache-tags.ts; mutations invalidate through the same builders.
 *
 * Lifetimes: reference data (sports, seasons, schools, stat definitions)
 * uses the "days" profile; anything a coach can change in-season uses
 * "hours". Both are backstops. On-demand invalidation is the primary path.
 */
export * from "./games";
export * from "./leagues";
export * from "./players";
export * from "./schools";
export * from "./seasons";
export * from "./sports";
export * from "./stat-definitions";
export * from "./teams";
