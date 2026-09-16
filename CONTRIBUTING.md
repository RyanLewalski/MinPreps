# Contributing to MinPreps

Conventions for working in this repo. Short on purpose. Change it when the
team agrees on something better.

## Requirements

- Node 22 (see `.nvmrc`)
- npm 10+
- Docker Desktop, for the local Postgres container

## First-time setup

```bash
git clone git@github.com:RyanLewalski/MinPreps.git
cd MinPreps
npm install            # also runs `prisma generate` via postinstall
cp .env.example .env   # local database URL; adjust DB_PORT if 5432 is taken
npm run db:up          # start Postgres and wait until healthy
npm run db:check       # confirm the app can reach it
npm run dev            # http://localhost:3000
```

## Everyday commands

| Command                 | What it does                                                  |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Dev server with hot reload                                    |
| `npm run check`         | Lint, typecheck, format check, and tests. Run before pushing. |
| `npm run lint:fix`      | Auto-fix lint problems                                        |
| `npm run format`        | Format everything with Prettier                               |
| `npm test`              | Run unit tests once                                           |
| `npm run test:watch`    | Run tests on change                                           |
| `npm run test:coverage` | Tests plus a coverage report in `coverage/`                   |
| `npm run build`         | Production build                                              |
| `npm run db:up`         | Start Postgres in Docker                                      |
| `npm run db:down`       | Stop Postgres                                                 |
| `npm run db:migrate`    | Create and apply a Prisma migration                           |
| `npm run db:generate`   | Regenerate the Prisma client after schema edits               |
| `npm run db:studio`     | Browse the database in Prisma Studio                          |
| `npm run db:check`      | Verify the database connection                                |

CI runs the same `check` steps plus `build` on every push and pull request.

## Folder structure

```
.github/workflows/   CI
prisma/              schema.prisma and migrations
scripts/             one-off scripts run with tsx (db-check, seed)
public/              static assets
src/
  app/               Next.js App Router routes. One folder per URL segment.
  components/
    ui/              shadcn/ui primitives. Generated; edit sparingly.
    ...              app-specific components, grouped by feature
  lib/               small pure helpers shared everywhere (db, slug, utils)
  server/            database access: queries/ (cached reads), cache-tags.ts
  generated/         Prisma client output. Gitignored, rebuilt on install.
```

Rules of thumb:

- **Pure logic lives in `src/lib` or `src/server` and gets a unit test.**
  Standings, leaderboards, and rankings must be testable without a browser
  or database.
- **Routes stay thin.** A page fetches through a query function and renders.
  No business logic inside `page.tsx`.
- **Pages read through `@/server/queries`, never `db` directly.** Every
  query is a `"use cache"` function tagged with builders from
  `src/server/cache-tags.ts`. Mutations invalidate with the same builders.
- **Tests sit next to the code** as `name.test.ts`.
- **Imports use the `@/` alias**, never long relative paths.
- **Do not edit `src/generated`.** Change the schema and regenerate.

## Branches

One branch per milestone, named after it: `M1-work`, `M2-work`, and so
on. Work for every issue in that milestone lands on the branch, then the
branch is merged into `main` when the milestone is done. Small fixes to
`main` can use `fix/<short-description>`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <short summary in imperative mood>
```

Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `style`, `ci`.
Scope is optional and names the area: `db`, `seed`, `ui`, `auth`, `stats`,
`rankings`, `coach`, `admin`.

Examples:

```
feat(db): add School, League, and Team models
test(stats): cover three-way standings tie-breaker
chore: bump @types/node to 22 for Vitest 5
```

Keep the summary under 72 characters. Add a body when the _why_ is not
obvious from the diff.

## Pull requests

- Run `npm run check` locally first.
- Keep a PR to one issue where possible. Reference it in the description.
- CI must be green before merging.

## Code style

Prettier and ESLint decide formatting and most style questions. Beyond
that:

- TypeScript strict mode is on, including `noUncheckedIndexedAccess`.
  Handle the `undefined` instead of asserting it away.
- Prefer server components. Add `"use client"` only for interactivity.
- Validate all user input with Zod at the server boundary.
- Name things after the domain: `Team`, `Game`, `PlayerGameStat`, not
  `item` or `data`.
