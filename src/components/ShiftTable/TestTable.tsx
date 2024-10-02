import { useEffect, useMemo, useState } from 'react';

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

import moment from 'moment';
import toast from 'react-hot-toast';

import { type inferProcedureOutput } from '@trpc/server';
import { cn } from '~/lib/utils';
import { type AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { convertDurationDecimal } from '~/utils/helper';
import { abbreviatedDutyNumber } from '~/utils/regex';
import { rotaSchema } from '~/utils/zodSchemas';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import React from 'react';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

export type Rota = inferProcedureOutput<
    AppRouter['weekDetailsController']['getDetails']
>['detailsWithWeather'][0];

type CellProps = {
    props: CellContext<Rota, unknown>;
    standardDutySequences: string[];
};
const EditCell = (props: CellProps) => {
    const { getValue, row, table, column } = props.props;
    const standardDutySequences = props.standardDutySequences;

    const standardPlaceholder = standardDutySequences.at(row.index);

    const initialValue = getValue() as string;
    console.log(initialValue);

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    function onBlur() {
        table.options.meta?.updateData(row.index, column.id, value);
        console.log(value);
    }

    return (
        <Input
            className="font-mono"
            placeholder={standardPlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            size={2}
        />
    );
};

const columnHelper = createColumnHelper<Rota>();

const OddHours = ({
    duties,
    sequence
}: {
    duties: inferProcedureOutput<
        AppRouter['dutyController']['getDutiesBySequence']
    >;
    sequence: string[];
}) => {
    const DAY_HOUR = 7;
    const STANDARD_HOURS = 42;
    let totalHour = STANDARD_HOURS;
    const H = ['GH', 'SH', 'MA_L'];

    for (const duty of sequence) {
        if (H.indexOf(duty) !== -1) {
            totalHour += DAY_HOUR;
        } else {
            const actualDuty = duties.filter(
                (actualDuty) => actualDuty.dutyNumber.slice(3) === duty
            )[0];

            if (!actualDuty) break;

            const duration = +convertDurationDecimal(actualDuty.duration);
            const oddHour = duration - DAY_HOUR;
            totalHour += oddHour;
        }
    }
    return <p>{totalHour}</p>;
};

interface TestTableProps<TData> {
    defaultData: TData[];
    sequenceId: string;
}

export const TestTable = ({
    defaultData,
    sequenceId
}: TestTableProps<Rota>) => {
    const [data, setData] = useState<Rota[]>([]);
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    const actualRotaSequence: string[] = useMemo(
        () =>
            data.map(({ timetable, actualDuty }) => {
                if (actualDuty === '') return 'RD';

                const rawActualDuty = actualDuty.match(abbreviatedDutyNumber)
                    ? `${timetable.prefix}${actualDuty}`
                    : `${actualDuty}`;

                const actualRotaParser = rotaSchema.safeParse(rawActualDuty);

                if (!actualRotaParser.success) {
                    toast.error('Error input', { position: 'bottom-center' });
                    return 'RD';
                }

                return actualRotaParser.data;
            }),
        [data]
    );

    const {
        data: actualDuties,
        isLoading: actualDutyLoading,
        error: actualDutyError
    } = api.dutyController.getDutiesBySequence.useQuery(actualRotaSequence);

    const { mutate: mutateSequence } =
        api.sequenceController.demoMutateSequence.useMutation({
            onSuccess: () =>
                toast.success('更新成功', { position: 'bottom-center' }),
            onError: () =>
                toast.error('更新失敗', { position: 'bottom-center' })
        });

    const columns = [
        columnHelper.accessor(
            (row) => {
                const rowDate = moment(row.date, 'YYYYMMDD ddd');
                const prefix = row.timetable.prefix;

                return (
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center justify-center gap-1">
                            <section className="flex flex-col items-center justify-center">
                                <Label className="text-sm">
                                    {rowDate.format('M')}
                                </Label>
                                <Label className="text-lg font-bold">
                                    {rowDate.format('DD')}
                                </Label>
                            </section>
                            <Label>{rowDate.format('dd')}</Label>
                        </div>
                        {prefix}
                    </div>
                );
            },
            {
                id: 'detail',
                header: '明細',
                cell: (props) => props.getValue()
            }
        ),
        columnHelper.accessor((row) => row.actualDuty, {
            id: 'dutyDisplay',
            header: '更',
            cell: (props) => (
                <EditCell
                    props={props}
                    standardDutySequences={rawStandardDuties}
                />
            )
        })
    ];

    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection
        },
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

    const rawStandardDuties = useMemo(
        () => data.map((day) => day.standardDuty),
        [data]
    );

    const rawActualDuties = useMemo(
        () => data.map((day) => day.actualDuty),
        [data]
    );

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                colSpan={header.colSpan}
                                className="text-center"
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
                    table.getRowModel().rows.map((row) => {
                        const rowDate = moment(
                            row.getValue('date'),
                            'YYYYMMDD ddd'
                        );
                        const today = moment();
                        const isToday = rowDate.isSame(today, 'd');

                        return (
                            <TableRow
                                key={row.id}
                                className={cn(isToday && 'bg-accent')}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'w-fit items-center justify-center whitespace-nowrap text-center'
                                            )}
                                        >
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
            <TableFooter className="font-mono font-thin">
                <TableRow>
                    <TableHead colSpan={2} className="h-8">
                        小結
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableCell className="text-center">工時</TableCell>
                    {!actualDutyLoading ? (
                        actualDutyError ? (
                            <TableCell colSpan={2}>
                                Something went wrong
                            </TableCell>
                        ) : (
                            <>
                                <TableCell>
                                    <OddHours
                                        duties={actualDuties}
                                        sequence={rawActualDuties}
                                    />
                                </TableCell>
                            </>
                        )
                    ) : (
                        <TableCell>
                            <Skeleton className="h-3 w-8"></Skeleton>
                        </TableCell>
                    )}
                </TableRow>
            </TableFooter>
            <Button
                className="bg-emerald-600"
                onClick={() => {
                    mutateSequence({
                        sequenceId: sequenceId,
                        sequence: data.map(({ actualDuty }) => actualDuty)
                    });
                }}
            >
                儲存更份
            </Button>
        </Table>
    );
};
