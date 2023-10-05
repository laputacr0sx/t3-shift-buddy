import { type ColumnDef } from "@tanstack/react-table";
import moment from "moment";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ShiftTable = {
  date: string;
  title: string;
  id?: string;
  dutyNumber?: string;
  bNL?: string;
  bNT?: string;
  bFT?: string;
  bFL?: string;
  duration?: string;
  remarks?: string;
};

export const columns: ColumnDef<ShiftTable>[] = [
  {
    accessorKey: "date",
    header: () => <div className="text-teal-300">日期</div>,
    cell: ({ row }) => {
      const date = row.getValue("date") satisfies Date;
      const formattedDate = moment(date).locale("zh-hk").format("DD/MM ddd");

      return (
        <div className="text-center text-xs font-light">{formattedDate}</div>
      );
    },
    footer: () => <>Testing</>,
  },
  {
    accessorKey: "dutyNumber",
    header: () => <div className="text-teal-500">更號</div>,
    cell: ({ row }) => {
      const dutyNumber: string = row.getValue("dutyNumber");

      return <div className="text-center font-medium">{dutyNumber}</div>;
    },
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
