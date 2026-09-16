import { Badge } from "@/components/ui/badge";
import type { School } from "@/generated/prisma/client";
import { classificationLabel } from "@/lib/labels";
import { teamColorStyle } from "@/lib/team-colors";

/**
 * School hub masthead: name, mascot, city, and classification, with the
 * school's colors as accent bars. Colors are never used behind text, so
 * contrast stays predictable whatever the school picked.
 */
export function SchoolHeader({ school }: { school: School }) {
  return (
    <header
      style={teamColorStyle(school.primaryColor, school.secondaryColor)}
      className="space-y-4"
    >
      <div className="flex overflow-hidden rounded-full" aria-hidden>
        <div className="h-1.5 flex-3 bg-team-primary" />
        <div className="h-1.5 flex-1 bg-team-secondary" />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {school.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {school.mascot} &middot; {school.city}, Utah
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {classificationLabel(school.classification)}
        </Badge>
      </div>
    </header>
  );
}
