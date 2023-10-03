"use client";

import { type Shifts } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ShiftTable = {
  date: string;
  title: string;
  dutyObject: {
    id: string;
    dutyNumber: string;
    bNL: string;
    bNT: string;
    bFT: string;
    bFL: string;
    duration: string;
    remarks: string;
  };
};

export const columns: ColumnDef<Shifts>[] = [
  // {
  //   accessorKey: "date",
  //   header: () => <div className="text-teal-300">日期</div>,
  // },
  {
    accessorKey: "dutyNumber",
    header: () => <div className="text-teal-300">更號</div>,
  },
  {
    accessorKey: "bNL",
    header: "上班地點",
  },
  {
    accessorKey: "bNT",
    header: "上班時間",
  },
  {
    accessorKey: "bFT",
    header: "下班時間",
  },
  {
    accessorKey: "bFL",
    header: "下班地點",
  },
  {
    accessorKey: "duration",
    header: "工時",
  },
  {
    accessorKey: "remarks",
    header: "備註",
  },
];
