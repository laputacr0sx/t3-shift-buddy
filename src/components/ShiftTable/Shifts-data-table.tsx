"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "../ui/button";
import { dayDetailSchema } from "~/pages/wholeweek/[shiftsequence]";
import moment from "moment";
import { convertDurationDecimal } from "~/utils/helper";
import { toast } from "../ui/useToast";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleCopyEvent = async () => {
    if (!navigator || !navigator.clipboard)
      throw Error("No navigator object nor clipboard found");

    const selectedShifts = table.getSelectedRowModel().flatRows;

    let completeString = "```\n";
    for (const dayDetail of selectedShifts) {
      const validatedDayDetail = dayDetailSchema.safeParse(dayDetail.original);

      if (!validatedDayDetail.success) {
        break;
      }

      const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } =
        validatedDayDetail.data;

      const date = moment(validatedDayDetail.data.date)
        .locale("zh-hk")
        .format("DD/MM ddd");
      const durationDecimal = convertDurationDecimal(duration);
      const dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\n`;

      completeString = completeString + dayString;
    }
    completeString = completeString + "```";

    await navigator.clipboard.writeText(completeString);
    toast({
      description: "已複製資料",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-2 overflow-hidden rounded-2xl border-y border-solid border-sky-800 font-mono dark:border-sky-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap align-middle text-sky-700 dark:text-sky-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Separator className="w-[90%]" />
      <Button
        className="my-2 self-center align-middle font-light"
        disabled={JSON.stringify(rowSelection) === "{}"}
        onClick={() => void handleCopyEvent()}
      >
        複製
        <span className="font-extrabold">已選</span>
        資料
      </Button>
      <Button
        className="my-2 self-center align-middle font-light"
        disabled={JSON.stringify(rowSelection) !== "{}"}
        onClick={() => void handleCopyEvent()}
      >
        複製
        <span className="font-extrabold">整週</span>
        資料
      </Button>
      <Link
        href={`whatsapp://send?text=`}
        className="flex flex-row self-center align-middle text-emerald-700 dark:text-emerald-300"
      >
        <MessageCircle className="m-2 h-4 w-4 self-center" />
        <p className={"self-center text-center text-xs "}>開啟WhatsApp</p>
      </Link>
    </div>
  );
}
