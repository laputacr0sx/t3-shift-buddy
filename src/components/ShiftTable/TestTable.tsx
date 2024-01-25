import { useState, useEffect, useMemo } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '~/components/ui/table';

import {
    type CellContext,
    type RowData,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';
import { type combineDateWithSequence } from '~/pages';
import moment from 'moment';
import { Input } from '../ui/input';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

type Rota = ReturnType<typeof combineDateWithSequence>[0];

type CellProps = CellContext<Rota, unknown>;

const EditCell = ({ getValue, row, column, table }: CellProps) => {
    const initialValue = getValue() as string;
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };
    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            size={7}
            className="h-8"
        />
    );
};

const columnHelper = createColumnHelper<Rota>();

interface DataTableProps<TData> {
    defaultData: TData[];
}

export const TestTable = ({ defaultData }: DataTableProps<Rota>) => {
    const columns = useMemo(
        () => [
            columnHelper.accessor(
                (row) => moment(row.date, 'YYYYMMDD ddd').format('DD ddd'),
                {
                    id: 'data',
                    header: '日期'
                }
            ),
            columnHelper.accessor((row) => row.timetable?.prefix, {
                id: 'prefix',
                header: '時間表'
            }),
            columnHelper.accessor((row) => row.standardDuty, {
                id: 'standardDuty',
                header: '標準輪值'
            }),
            columnHelper.accessor((row) => row.actualDuty, {
                id: 'actualDuty',
                header: '真實輪值',
                cell: EditCell
            })
        ],
        []
    );

    console.log(defaultData);

    const [data, setData] = useState(() => defaultData);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex: number, columnId: string, value: string) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value
                            } as Rota;
                        }
                        return row;
                    })
                );
            }
        }
    });

    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className="whitespace-nowrap"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="font-mono">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
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
            </Table>
            {/* <pre>{JSON.stringify(data, null, '\t')}</pre> */}
        </>
    );
};
