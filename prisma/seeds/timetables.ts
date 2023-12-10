import { type Timetable } from "@prisma/client";

export const timetables: Timetable[] = [
  {
    toc: "EAL1200F",
    prefix: "J15",
    dateOfEffective: new Date("2023-10-09T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    toc: "EAL120XF",
    prefix: "D14",
    dateOfEffective: new Date("2023-10-11T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    toc: "EAL720T",
    prefix: "C75",
    dateOfEffective: new Date("2023-08-20T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    toc: "EAL7210",
    prefix: "F75",
    dateOfEffective: new Date("2023-12-16T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    toc: "EAL720D",
    prefix: "V71",
    dateOfEffective: new Date("2023-09-10T00:00:00.0000Z"),
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    toc: "EAL721DE",
    prefix: "Y71",
    dateOfEffective: new Date("2023-12-16T00:00:00.0000Z"),
    isSpecial: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
