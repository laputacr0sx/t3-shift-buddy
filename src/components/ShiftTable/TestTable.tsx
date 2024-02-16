import { useState, useEffect, useMemo } from 'react';

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
import { Input } from '../ui/input';
import useDuties from '~/hooks/useDuties';

import {
    type combineDateWithSequence,
    convertDurationDecimal
} from '~/utils/helper';
import { api, type RouterOutputs } from '~/utils/api';
import { Skeleton } from '../ui/skeleton';
import { abbreviatedDutyNumber } from '~/utils/regex';
import { Button } from '../ui/button';
import { rostaSchema, rotaSchema } from '~/utils/zodSchemas';
import toast from 'react-hot-toast';
import useToastError from '~/hooks/useToastError';
import { TRPCError } from '@trpc/server';

declare module '@tanstack/table-core' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

export type Rota = NonNullable<ReturnType<typeof combineDateWithSequence>>[0];

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
            placeholder="101"
        />
    );
};

const columnHelper = createColumnHelper<Rota>();

type TestTableProps<TData> = {
    defaultData: TData[];
};

const OddHours = ({
    duties
}: {
    duties: RouterOutputs['dutyController']['getDutiesBySequence'];
}) => {
    const STANDARD_HOURS = 42;
    const actualHours = duties?.reduce((acc, cur) => {
        const duration = +convertDurationDecimal(cur.duration);

        return acc + duration;
    }, 0);

    const oddHours = actualHours === 0 ? 0 : actualHours - STANDARD_HOURS;

    if (oddHours < 0) {
        return <p className=""> {oddHours}</p>;
    }
    if (oddHours > 0) {
        return <p>+{oddHours}</p>;
    }
    return <p>±0</p>;
};

export const TestTable = ({ defaultData }: TestTableProps<Rota>) => {
    const [data, setData] = useState<Rota[]>([]);

    const rosterId = useMemo(
        () =>
            moment(defaultData.at(0)?.date, 'YYYYMMDD ddd').format(
                `[Y]YYYY[W]WW`
            ),
        [defaultData]
    );

    useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    const standardRotaSequence = data.map(({ timetable, standardDuty }) => {
        const rawStandardDuty = standardDuty.match(abbreviatedDutyNumber)
            ? `${timetable.prefix}${standardDuty}`
            : `${standardDuty}`;

        const standardRotaParser = rotaSchema.safeParse(rawStandardDuty);

        console.log(standardRotaParser);

        if (!standardRotaParser.success) {
            throw new TRPCError({ code: 'PARSE_ERROR' });
        }

        return standardRotaParser.data;
    });

    const actualRotaSequence: string[] = useMemo(
        () =>
            data.map(({ timetable, actualDuty }) => {
                if (actualDuty === '') return 'RD';

                const rawActualDuty = actualDuty.match(abbreviatedDutyNumber)
                    ? `${timetable.prefix}${actualDuty}`
                    : `${actualDuty}`;

                const actualRotaParser = rotaSchema.safeParse(rawActualDuty);

                if (!actualRotaParser.success) {
                    throw new TRPCError({ code: 'PARSE_ERROR' });
                }

                return actualRotaParser.data;
            }),
        [data]
    );

    const {
        data: standardDuties,
        isLoading: standardDutyLoading,
        error: standardDutyError
    } = api.dutyController.getDutiesBySequence.useQuery(standardRotaSequence);

    const {
        data: actualDuties,
        isLoading: actualDutyLoading,
        error: actualDutyError
    } = api.dutyController.getDutiesBySequence.useQuery(actualRotaSequence);

    const { mutate: mutateSequence } =
        api.sequenceController.demoMutateSequence.useMutation({});

    const standardHours = standardDuties?.reduce((hours, duty) => {
        const duration = +convertDurationDecimal(duty.duration);

        return hours + duration;
    }, 0);

    const columns = [
        columnHelper.accessor('date', {
            id: 'date',
            header: '日期',
            cell: (row) => {
                const rowDate = moment(row.getValue(), 'YYYYMMDD ddd');
                return (
                    <div className="flex items-center justify-center gap-1">
                        <section>
                            <p className="text-sm">{rowDate.format('M')}</p>
                            <p className="text-lg font-bold">
                                {rowDate.format('DD')}
                            </p>
                        </section>
                        <p>{rowDate.format('dd')}</p>
                    </div>
                );
            }
        }),
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
                                    className="whitespace-nowrap text-center"
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
                                        className="items-center justify-center whitespace-nowrap text-center"
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
                <TableFooter className="font-thin">
                    <TableRow>
                        <TableHead colSpan={4} className="h-8">
                            小結
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableCell className="text-right">工時</TableCell>
                        {!standardDutyLoading && !actualDutyLoading ? (
                            standardDutyError || actualDutyError ? (
                                <TableCell colSpan={3}>
                                    Something went wrong
                                </TableCell>
                            ) : (
                                <>
                                    <TableCell className="text-center">
                                        {standardHours}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <OddHours duties={standardDuties} />
                                    </TableCell>
                                    <TableCell>
                                        <OddHours duties={actualDuties} />
                                    </TableCell>
                                </>
                            )
                        ) : (
                            <>
                                <TableCell>
                                    <Skeleton className="h-3 w-5"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-5"></Skeleton>
                                </TableCell>
                            </>
                        )}
                    </TableRow>
                </TableFooter>
            </Table>
            {/* <pre>{JSON.stringify(data, null, '\t')}</pre> */}
            <Button
                variant={'ghost'}
                size={'sm'}
                onClick={() => {
                    mutateSequence({
                        rosterId: rosterId,
                        sequence: actualRotaSequence
                    });
                }}
            >
                try get sequence
            </Button>
        </>
    );
};
