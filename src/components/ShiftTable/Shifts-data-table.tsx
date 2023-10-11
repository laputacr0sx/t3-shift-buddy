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
import { convertDuration } from "~/utils/helper";
import { toast } from "../ui/useToast";
import { Separator } from "../ui/separator";

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

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-2 rounded-2xl border-y border-solid border-sky-800 font-mono dark:border-sky-300">
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
      <Separator />
      <Button
        className="my-6"
        variant={"secondary"}
        disabled={JSON.stringify(rowSelection) === "{}"}
        onClick={async () => {
          // console.log(JSON.stringify(rowSelection) === "{}");

          if (!navigator || !navigator.clipboard)
            throw Error("No navigator object nor clipboard found");

          const selectedShifts = table.getSelectedRowModel().flatRows;

          let completeString = "```\n";
          for (const dayDetail of selectedShifts) {
            const validatedDayDetail = dayDetailSchema.safeParse(
              dayDetail.original
            );

            if (!validatedDayDetail.success) {
              break;
            }

            const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } =
              validatedDayDetail.data;

            const date = moment(validatedDayDetail.data.date)
              .locale("zh-hk")
              .format("DD/MM ddd");
            const durationDecimal = convertDuration(duration);
            const dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\n`;

            completeString = completeString + dayString;
          }
          completeString = completeString + "```";

          // console.log(completeString);

          await navigator.clipboard.writeText(completeString);
          toast({
            description: "已複製資料",
          });
        }}
      >
        複製已選資料
      </Button>
    </div>
  );
}
