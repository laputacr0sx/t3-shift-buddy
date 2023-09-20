import { type Shifts } from "@prisma/client";

export interface WeekComplex {
  date: Date | undefined;
  title: string | undefined;
  dutyObject: Shifts | undefined;
}
