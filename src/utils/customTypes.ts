import { type Shifts } from "@prisma/client";

export interface WeekComplex {
  date: Date;
  title: string;
  dutyObject: Shifts;
}
