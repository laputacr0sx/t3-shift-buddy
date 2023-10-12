import { type Shifts } from "@prisma/client";

export interface WeekComplex {
  date: Date;
  title: string;
  dutyObject: Shifts;
}

export const workLocation = [
  "HUH",
  "SHT",
  "SHS",
  "HTD",
  "LOW",
  "TAW",
  "TWD",
] as const;
