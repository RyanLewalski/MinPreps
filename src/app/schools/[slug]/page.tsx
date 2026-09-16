import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SchoolHeader } from "@/components/school/school-header";
import { SchoolTeams } from "@/components/school/school-teams";
import { classificationLabel } from "@/lib/labels";
import { getSchoolBySlug } from "@/server/queries";

// Typed by hand rather than with the PageProps helper so lint works on a
// fresh checkout, before `next typegen` has produced the route types.
interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) {
    return { title: "School not found" };
  }
  return {
    title: school.name,
    description: `${school.shortName} ${school.mascot}, ${school.city}, Utah. ${classificationLabel(school.classification)} teams, schedules, rosters, and stats.`,
  };
}

// The slug is only known at request time, so the read happens inside a
// Suspense boundary and the layout around it prerenders as the static shell.
export default function SchoolPage({ params }: SchoolPageProps) {
  return (
    <Suspense fallback={<SchoolPageFallback />}>
      <SchoolPageContent params={params} />
    </Suspense>
  );
}

async function SchoolPageContent({ params }: Pick<SchoolPageProps, "params">) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <SchoolHeader school={school} />
      <SchoolTeams teams={school.teams} />
    </div>
  );
}

function SchoolPageFallback() {
  return (
    <div aria-busy className="animate-pulse space-y-8">
      <div className="space-y-4">
        <div className="h-1.5 rounded-full bg-muted" />
        <div className="h-9 w-72 rounded-lg bg-muted" />
        <div className="h-5 w-48 rounded-lg bg-muted" />
      </div>
      <div className="h-6 w-32 rounded-lg bg-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
