# MinPreps

[![CI](https://github.com/RyanLewalski/MinPreps/actions/workflows/ci.yml/badge.svg)](https://github.com/RyanLewalski/MinPreps/actions/workflows/ci.yml)

Similar to MaxPreps but better!

MinPreps is a small, fast, ad-free high school sports site for Utah. Coaches
enter game results and box scores. Fans get schedules, standings, stat
leaders, player pages, and computer rankings that explain themselves.

> **Status:** planning. Nothing is scaffolded yet. See [Roadmap](#roadmap).

## Why

MaxPreps covers the whole country. MinPreps covers one state and tries to do
it better:

- **Fast and clean.** No ads, no popups. Pages render in under a second.
- **Transparent rankings.** Every team's rating shows the components behind it.
- **Low-friction entry.** A coach can finalize a game with a full box score in
  under two minutes.
- **One region done well** instead of the whole country done shallowly.

## Scope

- **Region:** Utah. Real school names, real UHSAA classifications (6A to 1A),
  real regions used as the league grouping.
- **Data:** All players, games, and stats are synthetic and labeled as demo
  data. Nothing is imported from MaxPreps or any other site.
- **Sport:** Basketball first, boys and girls. The stat model is designed so a
  second sport (football) can be added without a schema migration.
- **Season:** One seeded season, 2025-26. The model supports many.
- **Scale target:** About 40 schools, 80 teams, 1,000 games, 15,000 player
  stat lines.

## Who uses it

| Role  | Login    | Can do                                                                          |
| ----- | -------- | ------------------------------------------------------------------------------- |
| Fan   | Optional | Browse everything. With an account: follow teams, see a My Teams page.          |
| Coach | Required | Edit roster and schedule for assigned teams. Enter final scores and box scores. |
| Admin | Required | Create schools, leagues, seasons, teams. Assign coaches. Edit anything.         |

## Features (MVP)

1. **Schools and teams.** School page lists teams by sport and gender. Team
   page is the hub: record, schedule, roster, stats, rank.
2. **Schedule and results.** Date, home/away, venue, status (scheduled, final,
   postponed), final score.
3. **Box scores.** Per-player lines: MIN, PTS, FGM/FGA, 3PM/3PA, FTM/FTA,
   OREB, DREB, AST, STL, BLK, TO, PF. Team totals derive from player lines.
4. **Player profiles.** Grad year, position, height, season averages, career
   totals, game log.
5. **Standings.** Per region, computed from results. Overall and region
   record, points for and against, streak, last five. Tie-breakers: region
   record, head to head, point differential.
6. **Leaderboards.** Totals and per-game averages for every stat plus FG%,
   3P%, FT%. Minimum games to qualify. Filter by classification and grad year.
7. **Computer rankings.** Simple Rating System: capped average margin of
   victory plus strength of schedule, iterated to convergence, with a
   home-court adjustment. Ranked overall and within classification. The
   rankings page shows the components. Weekly snapshots show movement.
8. **Search** for schools, teams, and players.
9. **Fan accounts.** Register, log in, follow teams, My Teams page.
10. **Coach and admin tools.** Coach dashboard, roster and schedule editing,
    box score entry form, admin console.
11. **Home page.** Scoreboard for a chosen date, top 10 per classification,
    leaders snapshot.

### Out of scope

Video, photos, articles, recruiting, live play-by-play, native apps, ads or
payments, importing from other sites, multi-state coverage.

### Stretch (after MVP)

Weekly email digest for followed teams, playoff brackets seeded from
rankings, football as a second sport, CSV import for schedules and rosters,
team comparison pages, a public read-only JSON API.

## Tech stack

| Layer      | Choice                                          |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js (App Router) + TypeScript               |
| Database   | Postgres (local via Docker Compose)             |
| ORM        | Prisma                                          |
| UI         | Tailwind CSS + shadcn/ui                        |
| Auth       | Auth.js, credentials provider                   |
| Validation | Zod                                             |
| Tests      | Vitest (unit), Playwright (e2e)                 |
| CI         | GitHub Actions                                  |
| Hosting    | Undecided. Not a concern until the MVP is done. |

## Architecture

- **One monolith.** Public routes are server components with cached queries.
  Coach and admin mutations are server actions guarded by role checks.
- **JSONB stat model.** A `StatDefinition` table describes each sport's stats
  (key, label, type, aggregation). `PlayerGameStat.values` is JSONB keyed by
  those definitions. Adding a sport means inserting rows, not migrating.
- **Derived data.** Standings and leaderboards compute on read with SQL
  aggregates. Rankings recompute in a job whenever a game is finalized and
  are stored with a timestamp so history can be shown.
- **Deterministic seed.** One script generates the full demo season from a
  fixed random seed: schools, rosters, region round-robin schedules, and box
  scores whose totals match the final scores.

## Data model

```
School          id, slug, name, city, mascot, classification, colors
League          id, name ("Region 11"), classification, seasonId
Sport           id, name, gender
StatDefinition  id, sportId, key, label, type, aggregation, sortOrder
Season          id, label ("2025-26"), sportId, startDate, endDate
Team            id, slug, schoolId, seasonId, leagueId, level
Player          id, slug, firstName, lastName, gradYear, heightIn, schoolId
RosterEntry     id, teamId, playerId, jersey, position
Game            id, seasonId, homeTeamId, awayTeamId, startsAt, venue,
                status, homeScore, awayScore, isLeagueGame, neutralSite
PlayerGameStat  id, gameId, teamId, playerId, values (JSONB), started
Ranking         id, teamId, seasonId, rating, mov, sos, rankOverall,
                rankInClass, computedAt
User            id, email, passwordHash, role
CoachAssignment id, userId, teamId
Follow          id, userId, teamId
```

## Routes

Public

```
/                                   home
/scores?date=YYYY-MM-DD             scoreboard for a date
/schools/[slug]                     school hub
/teams/[slug]                       team hub
/teams/[slug]/schedule
/teams/[slug]/roster
/teams/[slug]/stats
/games/[id]                         box score
/players/[slug]                     profile, averages, game log
/standings/[season]/[league]
/leaders/[season]?stat=pts&class=6A
/rankings/[season]?class=6A
/search?q=
```

Account, coach, admin

```
/login  /register
/me                                 My Teams (followed teams)
/coach                              my teams, games needing scores
/coach/teams/[id]/roster
/coach/teams/[id]/schedule
/coach/games/[id]/enter             final score + box score form
/admin                              schools, leagues, seasons, teams, coaches
```

## Roadmap

| #   | Milestone             | Outcome                                                                 |
| --- | --------------------- | ----------------------------------------------------------------------- |
| M0  | Foundation            | Scaffold, tooling, local Postgres, CI.                                  |
| M1  | Data model and seed   | Prisma schema, Utah school dataset, full synthetic season.              |
| M2  | Public read pages     | School, team, schedule, game, player, and search pages.                 |
| M3  | Standings and leaders | Standings per region, leaderboards on JSONB, unit tests.                |
| M4  | Accounts and roles    | Register, login, roles, follow teams, My Teams.                         |
| M5  | Coach and admin tools | Dashboard, roster and schedule editing, box score entry, admin console. |
| M6  | Rankings and home     | SRS rankings with snapshots and explanations, scoreboard, home page.    |
| M7  | Release candidate     | E2E tests, performance and accessibility pass, docs.                    |

## Development

```bash
npm install
cp .env.example .env
npm run db:up
npm run dev
```

Requires Node 22, npm, and Docker Desktop. See [CONTRIBUTING.md](CONTRIBUTING.md)
for the full command list, folder layout, and branch and commit conventions.
