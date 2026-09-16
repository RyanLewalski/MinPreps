import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: public pages prerender a static shell and read data
  // through "use cache" functions in src/server/queries, each tagged for
  // on-demand invalidation when coaches and admins save changes.
  cacheComponents: true,
};

export default nextConfig;
