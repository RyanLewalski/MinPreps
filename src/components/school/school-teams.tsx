import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { genderLabel, levelLabel } from "@/lib/labels";
import { groupTeamsBySport } from "@/lib/team-groups";
import type { SchoolDetail } from "@/server/queries";

/**
 * A school's teams grouped by sport, then gender, then season. Each row
 * links to the team hub.
 */
export function SchoolTeams({ teams }: { teams: SchoolDetail["teams"] }) {
  const sports = groupTeamsBySport(teams);

  if (sports.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        No teams have been added for this school yet.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {sports.map((sport) => (
        <section key={sport.sportName} className="space-y-4">
          <h2 className="font-heading text-xl font-semibold">
            {sport.sportName}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sport.genders.map((group) => {
              const teamCount = group.seasons.reduce(
                (count, season) => count + season.teams.length,
                0,
              );
              return (
                <Card key={group.gender}>
                  <CardHeader>
                    <CardTitle>{genderLabel(group.gender)}</CardTitle>
                    <CardDescription>
                      {group.seasons.length}{" "}
                      {group.seasons.length === 1 ? "season" : "seasons"}
                      {teamCount !== group.seasons.length &&
                        ` · ${teamCount} teams`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {group.seasons.flatMap((season) =>
                        season.teams.map((team) => (
                          <li key={team.id}>
                            <Link
                              href={`/teams/${team.slug}`}
                              className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                            >
                              <span>
                                <span className="block font-medium">
                                  {season.label}{" "}
                                  {team.level !== "VARSITY" &&
                                    levelLabel(team.level)}
                                </span>
                                <span className="block text-sm text-muted-foreground">
                                  {team.league?.name ?? "Independent"}
                                </span>
                              </span>
                              <ChevronRightIcon
                                aria-hidden
                                className="size-4 shrink-0 text-muted-foreground"
                              />
                            </Link>
                          </li>
                        )),
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
