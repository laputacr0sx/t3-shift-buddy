import React from 'react';
import Link from 'next/link';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption
} from '~/components/ui/table';
import TableActions from '~/components/TableCopyButtons';

import { type DayDetail } from '~/utils/customTypes';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DayDetailTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable<TData>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection
        }
    });

    const isAllRowSelected = table.getIsAllRowsSelected();
    const isSomeRowSelected = table.getIsSomeRowsSelected();
    const selectedShifts = table
        .getSelectedRowModel()
        .flatRows.map((shift) => shift.original);

    const allShifts = table
        .getRowModel()
        .flatRows.flatMap((shift) => shift.original);

    return (
        <div className="flex flex-col justify-center gap-4 md:w-screen md:max-w-fit">
            <div className="mx-2 overflow-hidden rounded-2xl border-y border-solid border-sky-800 font-mono dark:border-sky-300">
                <Table>
                    <TableCaption className="pb-3">
                        <p>
                            <span className="">
                                如欲將更份加至Google月曆，必須於PlayStore下載並安裝
                            </span>
                            <Link
                                className="font-serif font-extrabold tracking-widest text-lime-800 dark:text-lime-600"
                                href={
                                    'https://play.google.com/store/apps/details?id=com.google.android.calendar&pcampaignid=web_share'
                                }
                            >
                                Google Calendar
                            </Link>
                            <span>，方可正常使用。</span>
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
                                                      header.column.columnDef
                                                          .header,
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
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
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
                    {/* <TableFooter> */}
                    {/*     {table.getFooterGroups().map((footerGroup) => ( */}
                    {/*         <TableRow key={footerGroup.id}> */}
                    {/*             {footerGroup.headers.map((header) => ( */}
                    {/*                 <TableHead */}
                    {/*                     key={header.id} */}
                    {/*                     colSpan={header.colSpan} */}
                    {/*                 > */}
                    {/*                     {header.isPlaceholder */}
                    {/*                         ? null */}
                    {/*                         : flexRender( */}
                    {/*                               header.column.columnDef */}
                    {/*                                   .footer, */}
                    {/*                               header.getContext() */}
                    {/*                           )} */}
                    {/*                 </TableHead> */}
                    {/*             ))} */}
                    {/*         </TableRow> */}
                    {/*     ))} */}
                    {/* </TableFooter> */}
                </Table>
            </div>

            <TableActions
                isAllRowSelected={isAllRowSelected}
                isSomeRowSelected={isSomeRowSelected}
                selectedShifts={selectedShifts as DayDetail[]}
                allShifts={allShifts as DayDetail[]}
            />
        </div>
    );
}
