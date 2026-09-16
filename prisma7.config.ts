// Prisma CLI configuration (Prisma 7). The CLI does not load .env on its
// own, so dotenv is imported here. The app itself relies on Next.js env
// loading and never imports this file.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
