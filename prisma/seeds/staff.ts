import { type Staff } from "@prisma/client";

export const staff: Staff[] = [
  {
    id: "602949",
    name: "NG SAI HO",
    email: "testing@testing.com",
    gradeId: "G50",
    areaId: "KLN",
    dateOfJoin: new Date("2016-06-01T00:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "dd8b2812-d2f3-4624-becf-0f569cf8f604",
  },
  {
    id: "589942",
    name: "YEUNG KAM YIN",
    email: "yky@mtr.com.hk",
    gradeId: "G50",
    areaId: "KLN",
    dateOfJoin: new Date("2016-06-01T00:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
  },
  {
    id: "609447",
    name: "TSING WAI SHUN",
    email: "tsingws@mtr.com.hk",
    gradeId: "G50",
    areaId: "SHS",
    dateOfJoin: new Date("2016-06-01T00:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
  },
];
