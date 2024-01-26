import { useState, useEffect } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
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
import useDuties from '~/hooks/useDuties';

import { convertDurationDecimal } from '~/utils/helper';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        // interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

type Rota = NonNullable<ReturnType<typeof combineDateWithSequence>>[0];

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
        />
    );
};

const columnHelper = createColumnHelper<Rota>();

type TestTableProps<TData> = {
    defaultData: TData[];
};

export const TestTable = ({ defaultData }: TestTableProps<Rota>) => {
    const [data, setData] = useState<Rota[]>([]);

    useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    const incomingSequnce = data.map(
        ({ timetable, standardDuty, actualDuty }) => {
            if (!timetable) return '';

            return timetable.prefix.concat(
                actualDuty.length <= 0 ? standardDuty : actualDuty
            );
        }
    );

    const { data: duties, isLoading: dutyLoading } = useDuties({
        sequence: incomingSequnce
    });

    const standardHours = duties?.reduce((acc, cur) => {
        const duration = +convertDurationDecimal(cur.duration);

        return acc + duration;
    }, 0);

    const columns = [
        columnHelper.accessor(
            (row) => moment(row.date, 'YYYYMMDD ddd').format('DD ddd'),
            {
                id: 'date',
                header: '日期'
            }
        ),
        columnHelper.accessor((row) => row.timetable?.prefix, {
            id: 'prefix',
            header: '時間表'
        }),
        columnHelper.accessor('standardDuty', {
            id: 'standardDuty',
            header: '標準更'
        }),
        columnHelper.accessor((row) => row.actualDuty, {
            id: 'actualDuty',
            header: '真實更',
            cell: EditCell,
            footer: 'hello'
        })
    ];

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
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>本週總工時：</TableCell>
                        <TableCell>{standardHours}</TableCell>
                        <TableCell>{standardHours}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            {/* <pre>{JSON.stringify(data, null, '\t')}</pre> */}
        </>
    );
};
