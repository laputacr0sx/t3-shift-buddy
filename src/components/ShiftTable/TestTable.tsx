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

import { convertDurationDecimal, convertWeatherIcons } from '~/utils/helper';
import { api } from '~/utils/api';
import { Skeleton } from '../ui/skeleton';
import { abbreviatedDutyNumber } from '~/utils/regex';
import { Button } from '../ui/button';
import { rotaSchema } from '~/utils/zodSchemas';
import { TRPCError, type inferProcedureOutput } from '@trpc/server';
import toast from 'react-hot-toast';
import { type AppRouter } from '~/server/api/root';
import { cn } from '~/lib/utils';
import Image from 'next/image';
import { Label } from '../ui/label';

declare module '@tanstack/table-core' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

export type Rota = inferProcedureOutput<
    AppRouter['weekDetailsController']['getDetails']
>['detailsWithWeather'][0];

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
            width={12}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            size={7}
        />
    );
};

const columnHelper = createColumnHelper<Rota>();

const OddHours = ({
    duties
}: {
    duties: inferProcedureOutput<
        AppRouter['dutyController']['getDutiesBySequence']
    >;
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

interface TestTableProps<TData> {
    defaultData: TData[];
}

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
                    toast.error('Error input', { duration: 1300 });
                    return 'RD';
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
        api.sequenceController.demoMutateSequence.useMutation({
            onSuccess: () =>
                toast.success('更新成功', { position: 'bottom-center' }),
            onError: () =>
                toast.error('更新失敗', { position: 'bottom-center' })
        });

    const standardHours = standardDuties?.reduce((hours, duty) => {
        const duration = +convertDurationDecimal(duty.duration);

        return hours + duration;
    }, 0);

    const columns = [
        columnHelper.accessor(
            (row) => {
                const weather = row.weather;
                const hTemp = weather?.forecastMaxtemp.value;
                const lTemp = weather?.forecastMintemp.value;
                const icon = weather?.ForecastIcon.toString();
                const iconURI = convertWeatherIcons(icon);

                const rowDate = moment(row.date, 'YYYYMMDD ddd');

                return (
                    <div className='flex justify-center items-center gap-1'>
                        <div className="flex items-center justify-center gap-1">
                            <section className='flex flex-col justify-center items-center'>
                                <Label className="text-sm">{rowDate.format('M')}</Label>
                                <Label className="text-lg font-bold">
                                    {rowDate.format('DD')}
                                </Label>
                            </section>
                            <Label>{rowDate.format('dd')}</Label>
                        </div>
                        {weather ? (
                            <div className="flex font-extralight flex-col justify-center items-center">
                                <Label className="dark:text-indigo-300 text-indigo-700">{lTemp}℃</Label>
                                <Label className="dark:text-rose-300 text-rose-700">{hTemp}℃</Label>
                            </div>
                        ) : null}
                        {icon ? (
                            <Image
                                src={`/image/weatherIcons/animated/${iconURI}.svg`}
                                alt={`${iconURI}`}
                                width={30}
                                height={30}
                            />
                        ) : null}
                    </div>
                );
            },
            {
                id: 'date',
                header: '日期',
                cell: (props) => props.getValue()
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
                                    className={cn(isToday && 'bg-accent', '')}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'items-center justify-center whitespace-nowrap text-center w-fit'
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
            <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                    mutateSequence({
                        rosterId: rosterId,
                        sequence: data.map(({ actualDuty }) => actualDuty)
                    });
                }}
            >
                更新更份
            </Button>
        </>
    );
};
