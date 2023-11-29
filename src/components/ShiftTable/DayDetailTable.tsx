import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import React, { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "~/components/ui/table";

import { Separator } from "../ui/separator";
import { type DayDetail } from "~/utils/customTypes";
import TableCopyButtons from "../TableCopyButtons";
import { Button } from "../ui/button";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DayDetailTable<TData, TValue>({
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

  return (
    <div className="flex w-auto flex-col gap-4">
      <div className="mx-2 overflow-hidden rounded-2xl border-y border-solid border-sky-800 font-mono dark:border-sky-300">
        <Table>
          <TableCaption>
            <p>
              <span className="">
                如欲將更份加至Google月曆，必須於PlayStore下載並安裝
              </span>
              <Link
                className="text-lime-500"
                href={
                  "https://play.google.com/store/apps/details?id=com.google.android.calendar&pcampaignid=web_share"
                }
              >
                Google Calendar
              </Link>
              <span>，方可正常使用</span>
            </p>
          </TableCaption>
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

      <TableCopyButtons
        isSomeRowSelected={isSomeRowSelected}
        selectedShifts={selectedShifts}
      />
    </div>
  );
}
