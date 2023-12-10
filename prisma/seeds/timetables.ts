import { type Timetable } from "@prisma/client";

export const timetables: Timetable[] = [
  {
    toc: "EAL1200F",
    prefix: "J15",
    dateOfEffective: new Date("09-10-2023T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
  },
];
