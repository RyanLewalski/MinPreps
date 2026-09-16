import type { ClassificationCode } from "@/data/schools";
import type { Classification, Gender, Level } from "@/generated/prisma/enums";

/**
 * Display labels for the schema's enums. Prisma returns the enum member
 * names (SIX_A, BOYS, VARSITY), so every page goes through here to show
 * the fan-facing text (6A, Boys, Varsity).
 */

const CLASSIFICATION_CODES: Record<Classification, ClassificationCode> = {
  SIX_A: "6A",
  FIVE_A: "5A",
  FOUR_A: "4A",
  THREE_A: "3A",
  TWO_A: "2A",
  ONE_A: "1A",
};

const CLASSIFICATION_BY_CODE: Record<ClassificationCode, Classification> = {
  "6A": "SIX_A",
  "5A": "FIVE_A",
  "4A": "FOUR_A",
  "3A": "THREE_A",
  "2A": "TWO_A",
  "1A": "ONE_A",
};

/** SIX_A -> "6A" */
export function classificationLabel(
  classification: Classification,
): ClassificationCode {
  return CLASSIFICATION_CODES[classification];
}

/** "6A" -> SIX_A. The inverse, for loading the school dataset. */
export function classificationFromCode(
  code: ClassificationCode,
): Classification {
  return CLASSIFICATION_BY_CODE[code];
}

const GENDER_LABELS: Record<Gender, string> = {
  BOYS: "Boys",
  GIRLS: "Girls",
};

/** BOYS -> "Boys" */
export function genderLabel(gender: Gender): string {
  return GENDER_LABELS[gender];
}

const LEVEL_LABELS: Record<Level, string> = {
  VARSITY: "Varsity",
  JV: "JV",
  FRESHMAN: "Freshman",
};

/** VARSITY -> "Varsity" */
export function levelLabel(level: Level): string {
  return LEVEL_LABELS[level];
}

/** { name: "Basketball", gender: BOYS } -> "Boys Basketball" */
export function sportLabel(sport: { name: string; gender: Gender }): string {
  return `${genderLabel(sport.gender)} ${sport.name}`;
}
