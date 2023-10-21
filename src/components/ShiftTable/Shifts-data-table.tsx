"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
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

import { tableCopyHandler } from "~/utils/helper";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { type DayDetail } from "~/utils/customTypes";

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

  const isSomeRowSelected = table.getIsSomeRowsSelected();
  const selectedShifts = isSomeRowSelected
    ? (table.getSelectedRowModel().flatRows as Row<DayDetail>[])
    : (table.getRowModel().flatRows as Row<DayDetail>[]);

  console.log(selectedShifts);

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
      <div className="flex items-center justify-around gap-4">
        <Button
          className="my-2 self-center align-middle font-light"
          variant={"outline"}
          // disabled={JSON.stringify(rowSelection) === "{}"}
          disabled={!isSomeRowSelected}
          onClick={() => tableCopyHandler(selectedShifts)}
        >
          複製
          <span className="font-extrabold">已選</span>
          資料
        </Button>
        <Button
          className="my-2 self-center align-middle font-light"
          // disabled={JSON.stringify(rowSelection) !== "{}"}
          disabled={isSomeRowSelected}
          variant={"outline"}
          onClick={() => tableCopyHandler(selectedShifts)}
        >
          複製
          <span className="font-extrabold">整週</span>
          資料
        </Button>
      </div>

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
