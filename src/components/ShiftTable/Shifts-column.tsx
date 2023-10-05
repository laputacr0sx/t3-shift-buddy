import { createColumnHelper } from "@tanstack/react-table";
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

const columnHelper = createColumnHelper<ShiftTable>();

export const columns = [
  columnHelper.group({
    id: "detail",
    header: () => <span className="block text-center align-middle">更餡</span>,
    columns: [
      columnHelper.accessor("date", {
        header: () => <span className="text-teal-300">日期</span>,
        cell: ({ row }) => {
          const date = row.getValue("date") satisfies Date;
          const formattedDate = moment(date)
            .locale("zh-hk")
            .format("DD/MM ddd");
          return (
            // <ChineseCalendar date={date} />
            <div className="text-center text-xs font-light">
              {formattedDate}
            </div>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("dutyNumber", {
        header: () => <span className="text-teal-500">更號</span>,
        cell: ({ row }) => {
          const dutyNumber: string = row.getValue("dutyNumber");
          return <div className="text-center font-medium">{dutyNumber}</div>;
        },
        footer: (props) => props.column.id,
      }),
      {
        accessorKey: "duration",
        header: "工時",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "remarks",
        header: "備註",
        footer: (props) => props.column.id,
      },
    ],
  }),
  columnHelper.group({
    id: "bookOn",
    header: () => <span className="block text-center align-middle">上班</span>,
    columns: [
      columnHelper.accessor("bNL", {
        header: () => <span className="text-teal-500">地點</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("bNT", {
        header: () => <span className="text-teal-500">時間</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: "bookOff",
    header: () => <span className="block text-center align-middle">下班</span>,
    columns: [
      {
        accessorKey: "bFT",
        header: "時間",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "bFL",
        header: "地點",
        footer: (props) => props.column.id,
      },
    ],
  }),
];
