import { useEffect, useMemo, useState } from 'react';

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    CellContext,
    RowData,
    createColumnHelper
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '~/components/ui/table';

import { api } from '~/utils/api';
import { combineDateWithSequence } from '~/pages';
import moment from 'moment';
import { Input } from '../ui/input';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

type Rota = ReturnType<typeof combineDateWithSequence>[0];

const columnHelper = createColumnHelper<Rota>();

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

function RotaTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [editData, setEditData] = useState(() => [...data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection
        },
        meta: {
            updateData: (rowIndex: number, columnId: string, value: string) => {
                console.log({ rowIndex, columnId, value });
                setEditData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value
                            } as TData;
                        }
                        return row;
                    })
                );
            }
        }
    });

    const sequence = useMemo(
        () =>
            table.getRowModel().rows.map((row) => {
                const prefix = row.getValue('prefix') satisfies string;
                const standardDuty = row.getValue(
                    'standardDuty'
                ) satisfies string;
                const actualDuty = row.getValue('actualDuty') satisfies string;

                if (!prefix) return '';

                return (
                    prefix.concat(
                        actualDuty.length <= 0 ? standardDuty : actualDuty
                    ) || 'R15101'
                );
            }),
        [table]
    );

    const { data: duty } =
        api.dutyController.getDutiesBySequence.useQuery(sequence);

    console.log(duty);

    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className="whitespace-nowrap"
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
                <TableBody className="font-mono">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
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
            </Table>
            <pre className="whitespace-pre-wrap">
                {JSON.stringify(data, null, '\t')}
            </pre>
        </>
    );
}

export default RotaTable;

type CellProps = CellContext<Rota, unknown>;

export function EditableCell({
    getValue,
    row: { index },
    column: { id },
    table
}: CellProps) {
    const initialValue = getValue() as string;
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
    };

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            size={7}
            className="h-8 bg-none no-underline"
        />
    );
}
