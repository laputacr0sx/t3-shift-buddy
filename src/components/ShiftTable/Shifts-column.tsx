import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import ChineseCalendar from "../ChineseCalendar";

import { Checkbox } from "~/components/ui/checkbox";
import { type DayDetail } from "~/pages/wholeweek/[shiftsequence]";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { Button } from "../ui/button";
import { atcb_action } from "add-to-calendar-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// export function getChineseLocation(location: string): string {
//   const locationSet = {
//     HUH: "紅磡",
//     SHT: "沙田",
//     SHS: "上水",
//     HTD: "何東樓",
//     LOW: "羅湖",
//     TAW: "大圍",
//   };

//   return;
// }

const columnHelper = createColumnHelper<DayDetail>();

export const columns: ColumnDef<DayDetail>[] = [
  {
    id: "add_to_calendar",
    header: () => (
      <span className="block text-center align-middle text-purple-700 dark:text-purple-300">
        加到日曆
      </span>
    ),
    // <span>加到日曆</span>,
    cell: ({ row }) => {
      const dutyNumber: string = row.getValue("dutyNumber");
      const bNL: string = row.getValue("bNL");
      const bND: string = moment(row.getValue("date")).format("YYYY-MM-DD");
      const bNT: string = row.getValue("bNT");
      const bFL: string = row.getValue("bFL");
      const bFT: string = row.getValue("bFT");
      const remarks: string = row.getValue("remarks");
      const bFD = moment(`${bND} ${bFT}`).isAfter(moment(`${bND} ${bNT}`))
        ? moment(bND).format("YYYY-MM-DD")
        : moment(bND).add(1, "d").format("YYYY-MM-DD");

      return !dutyNumber.match(/(RD|CL|AL|GH|SH)/gim) ? (
        <Button
          onClick={() => {
            atcb_action({
              name: dutyNumber,
              options: ["Apple", "Google"],
              location: bNL,
              startDate: bND,
              endDate: bFD,
              startTime: bNT,
              description: `${bFL} ${remarks}`,
              endTime: bFT,
              hideIconButton: true,
              hideBackground: true,
              label: "加至日曆",
              buttonStyle: "default",
              timeZone: "Asia/Hong_Kong",
            });
          }}
          variant={"secondary"}
        >
          加到日曆
        </Button>
      ) : // <AddToCalendarButton
      //   name={dutyNumber}
      //   options={["Google", "iCal"]}
      //   location={bNL}
      //   startDate={bND}
      //   endDate={bFD}
      //   startTime={bNT}
      //   endTime={bFT}
      //   description=""
      //   hideIconButton
      //   hideBackground
      //   label="加至日曆"
      //   buttonStyle="default"
      //   timeZone="Asia/Hong_Kong"
      // ></AddToCalendarButton>
      null;
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="border-secondary"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-secondary"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  columnHelper.group({
    id: "detail",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-slate-700 dark:border-sky-300 dark:text-slate-300">
        更餡
      </span>
    ),
    columns: [
      columnHelper.accessor("date", {
        header: () => (
          <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
            日期
          </span>
        ),
        cell: ({ row }) => {
          const date = row.getValue("date") satisfies Date;
          const formattedDate = moment(date).locale("zh-hk").format("DD/MM dd");
          return (
            // <ChineseCalendar date={date} />
            <span className="block py-2 text-center align-middle text-slate-600 dark:text-slate-200">
              {formattedDate}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("dutyNumber", {
        header: () => (
          <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
            更號
          </span>
        ),
        cell: ({ row }) => {
          const dutyNumber: string = row.getValue("dutyNumber");
          return (
            <span className="block py-2 text-center align-middle text-slate-600 dark:text-slate-200">
              {dutyNumber}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      {
        accessorKey: "duration",
        header: () => (
          <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
            工時
          </span>
        ),
        cell: ({ row }) => {
          const duration: string = row.getValue("duration");
          return (
            <span className="block py-2 text-center align-middle font-medium text-slate-600 dark:text-slate-200">
              {duration}
            </span>
          );
        },
        footer: (props) => props.column.id,
      },
    ],
  }),
  columnHelper.group({
    id: "bookOn",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-teal-700 dark:border-sky-300 dark:text-teal-400">
        上班
      </span>
    ),
    columns: [
      columnHelper.accessor("bNL", {
        header: () => (
          <span className="block text-center align-middle text-teal-700 dark:text-teal-200">
            地點
          </span>
        ),
        cell: ({ row }) => {
          const bNL: string = row.getValue("bNL");
          return (
            <span className="block py-2 text-center align-middle font-medium text-teal-600 dark:text-teal-200">
              {bNL}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("bNT", {
        header: () => (
          <span className="block text-center align-middle text-teal-700 dark:text-teal-200">
            時間
          </span>
        ),
        cell: ({ row }) => {
          const bNT: string = row.getValue("bNT");
          return (
            <span className="block py-2 text-center align-middle font-medium text-teal-600 dark:text-teal-200">
              {bNT}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: "bookOff",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-rose-700 dark:border-sky-300 dark:text-rose-400">
        下班
      </span>
    ),
    columns: [
      {
        accessorKey: "bFT",
        header: () => (
          <span className="block text-center align-middle text-rose-700 dark:text-rose-300">
            時間
          </span>
        ),
        cell: ({ row }) => {
          const bFT: string = row.getValue("bFT");
          return (
            <span className="block py-2 text-center align-middle font-medium text-rose-600 dark:text-rose-200">
              {bFT}
            </span>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "bFL",
        header: () => (
          <span className="block text-center align-middle text-rose-700 dark:text-rose-300">
            地點
          </span>
        ),
        cell: ({ row }) => {
          const bFL: string = row.getValue("bFL");
          return (
            <span className="block py-2 text-center align-middle font-medium text-rose-600 dark:text-rose-200">
              {bFL}
            </span>
          );
        },
        footer: (props) => props.column.id,
      },
    ],
  }),
  columnHelper.group({
    id: "remarks",
    header: () => (
      <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-amber-700 dark:border-sky-300 dark:text-amber-300">
        備註
      </span>
    ),
    columns: [
      columnHelper.accessor("remarks", {
        header: () => <p></p>,
        cell: ({ row }) => {
          const remarks: string = row.getValue("remarks");
          return (
            <span className="block py-2 text-left align-middle font-medium text-amber-600 dark:text-amber-200">
              {remarks}
            </span>
          );
        },
      }),
    ],
  }),
];
