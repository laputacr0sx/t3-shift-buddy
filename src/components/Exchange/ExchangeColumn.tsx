import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { z } from "zod";
import { autoPrefix } from "~/utils/helper";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const days = autoPrefix(true);

export const exchangeSchema = z.object({
  name: z.string(),
  staffId: z.string().length(6),
  // grade: z.enum(["G40", "G50", "S10", "S20"]),
  grade: z.string(),
  weekNumber: z.string(),
  exchangeDetails: z.record(z.string().length(8), z.string().max(7)),
  rowSequence: z.string(),
});

export type Exchange = z.infer<typeof exchangeSchema>;

const columnHelper = createColumnHelper<Exchange>();

export const ExchangeColumn: ColumnDef<Exchange>[] = [
  columnHelper.group({
    id: "staffDetails",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-slate-700 dark:border-sky-300 dark:text-slate-300">
        員工詳情
      </span>
    ),
    columns: [
      { id: "name", accessorKey: "name", header: "姓名" },
      { id: "staffId", accessorKey: "staffId", header: "員工號碼" },
      { id: "grade", accessorKey: "grade", header: "職級" },
      { id: "weekNumber", accessorKey: "weekNumber", header: "週數" },
      { id: "status", accessorKey: "", header: "狀態" },
    ],
  }),
  columnHelper.group({
    id: "exchangeDetails",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-slate-700 dark:border-sky-300 dark:text-slate-300">
        調更詳情
      </span>
    ),
    columns: days.map((day) => {
      const dateKey = moment(day.date, "YYYYMMDD ddd").format("YYYYMMDD");
      const dateShort = moment(day.date, "YYYYMMDD ddd").format("DD/MM");
      const weekDay = moment(day.date, "YYYYMMDD ddd").format("dd");

      return {
        accessorKey: `exchangeDetails.${dateKey}`,
        header: () => (
          <section className="flex flex-col px-0 text-center align-middle font-mono">
            <p>{dateShort}</p>
            <p>{weekDay}</p>
            <p>{day.prefix}</p>
          </section>
        ),

        cell: ({ row }) => {
          // console.log({ column, row, cell });
          const thisRowValue: string = row.getValue(
            `exchangeDetails_${dateKey}`
          );
          return <p className="text-center align-middle">{thisRowValue}</p>;
        },
      };
    }),
  }),
  { id: "rowSequence", accessorKey: "rowSequence", header: "編定輪次" },
  { id: "oddHours", accessorKey: "", header: "私鐘" },
  // { id: "signature", accessorKey: "", header: "簽名" },
];
