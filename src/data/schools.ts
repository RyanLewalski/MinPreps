import { slugify } from "@/lib/slug";

import raw from "./utah-schools.json";

export type ClassificationCode = "6A" | "5A" | "4A" | "3A" | "2A" | "1A";

export interface SchoolRecord {
  /** URL slug derived from shortName, e.g. "west-jordan". */
  slug: string;
  name: string;
  shortName: string;
  city: string;
  mascot: string;
  classification: ClassificationCode;
  /** UHSAA region number for all activities except football. */
  region: number;
  /** Approximate brand colors, hex. */
  primaryColor: string;
  secondaryColor: string;
}

export const UTAH_ALIGNMENT = raw.alignment;

/**
 * Real Utah high schools in the 2025-27 UHSAA 6A and 5A alignment.
 * Everything downstream (players, games, stats) is synthetic.
 */
export const UTAH_SCHOOLS: readonly SchoolRecord[] = raw.schools.map((s) => ({
  ...s,
  classification: s.classification as ClassificationCode,
  slug: slugify(s.shortName),
}));

/** Region name as shown in the UI, e.g. "Region 4". */
export function regionName(region: number): string {
  return `Region ${region}`;
}
