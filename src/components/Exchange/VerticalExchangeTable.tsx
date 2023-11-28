import { Fragment, useState } from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { autoPrefix } from "~/utils/helper";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  daysDetails: ReturnType<typeof autoPrefix>;
}

export function VerticalExchangeTable<TData, TValue>({
  columns,
  data,
  daysDetails,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="mx-2 overflow-hidden rounded-2xl border-x border-solid border-sky-800 font-mono dark:border-sky-300">
        <Table>
          <TableHeader className="flex flex-row ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="grid">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // colSpan={header.colSpan}
                      rowSpan={4}
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
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={`${row.id}`}
                    data-state={row.getIsSelected() && "selected"}
                    id={`${row.id}`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
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
    </div>
  );
}
