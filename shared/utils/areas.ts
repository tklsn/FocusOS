export const AREA_COLORS = [
  "slate",
  "blue",
  "teal",
  "green",
  "amber",
  "orange",
  "pink",
  "violet",
] as const;

export const AREA_ICONS = [
  "briefcase",
  "flask-conical",
  "graduation-cap",
  "house",
  "heart",
  "book-open",
  "dumbbell",
  "wallet",
  "users",
  "palette",
  "code",
  "leaf",
] as const;

export type AreaColor = (typeof AREA_COLORS)[number];
export type AreaIcon = (typeof AREA_ICONS)[number];
