import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from 'next';
import { type NextRouter, useRouter } from 'next/router';
import { useMemo } from 'react';
import moment from 'moment';
import superjson from 'superjson';
import { useForm } from 'react-hook-form';
import { Eraser } from 'lucide-react';
import { encode } from 'querystring';

import { getAuth } from '@clerk/nextjs/server';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { zodResolver } from '@hookform/resolvers/zod';

import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import { api } from '~/utils/api';
import {
    dayDetailName,
    queryStringSchema,
    sevenSlotsSearchFormSchema
} from '~/utils/zodSchemas';
import { cn } from '~/lib/utils';
import { getRacingStyle } from '~/utils/helper';
import { abbreviatedDutyNumber } from '~/utils/regex';

import { Button } from '~/components/ui/button';
import PageTitle from '~/components/PageTitle';
import TableLoading from '~/components/TableLoading';
import type {
    DefaultData,
    SevenSlotsSearchForm
} from '~/components/SevenSlotsSearchForm';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Card, CardHeader } from '~/components/ui/card';
import WeatherIconDisplay from '~/components/WeatherIconDisplay';
import { Badge } from '~/components/ui/badge';
import { Label } from '~/components/ui/label';
import DutyContentCard from '~/components/DutyContentCard';
import type { TableData } from '~/components/HomepageInput';

function queryStringToArrayObject(str: string) {
    const validQueryStr = queryStringSchema.safeParse(str);
    if (!validQueryStr.success) {
        return [];
    }

    return validQueryStr.data;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const userQuery = encode(context.query);
    const queryArray = queryStringToArrayObject(userQuery);

    const auth = getAuth(context.req);
    const today = moment().format('YYYYMMDD ddd');

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth, user: null, clerkMeta: null }),
        transformer: superjson
    });

    await helpers.dutyController.getDutyByDateDuty.prefetch(queryArray);
    await helpers.timetableController.getSuitableTimetables.prefetch();

    return {
        props: {
            trpcState: helpers.dehydrate(),
            today,
            userQuery
        }
    };
}

type WeekBadgeDisplayProps = {
    idx: number;
    isMonday: boolean;
    correspondingDate: moment.Moment;
};
function WeekBadgeDisplay({
    idx,
    isMonday,
    correspondingDate
}: WeekBadgeDisplayProps) {
    return (
        (idx === 0 || isMonday) && (
            <Badge
                variant={'outline'}
                className="mt-1 w-fit border-green-700 dark:border-green-400"
            >
                <Label>{correspondingDate.format('[Y]YYYY[W]WW')}</Label>
            </Badge>
        )
    );
}

function TestServerSideForm({
    details,
    r,
    tableData
}: {
    details: DefaultData;
    tableData?: TableData;
    r: NextRouter;
}) {
    const daysLength = details.length;

    const defaultFormValues = useMemo(() => {
        function constructDefaultValues(len: number) {
            return new Array<string>(len).fill('');
        }
        return constructDefaultValues(daysLength);
    }, [daysLength]);

    const sevenSlotsSearchForm = useForm<SevenSlotsSearchForm>({
        resolver: async (data, context, options) => {
            // console.log('formData', data);
            // console.log(
            //     'validation result',
            //     await zodResolver(sevenSlotsSearchFormSchema)(
            //         data,
            //         context,
            //         options
            //     )
            // );
            const zodResolved = await zodResolver(sevenSlotsSearchFormSchema)(
                data,
                context,
                options
            );

            return zodResolved;
        },
        mode: 'onChange',
        defaultValues: {
            [dayDetailName]: defaultFormValues
        }
    });

    async function onSubmitHandler(data: SevenSlotsSearchForm) {
        const out: Record<string, string> = {};
        data[dayDetailName]?.forEach((shiftCode, i) => {
            const date = moment(details[i]?.date, 'YYYYMMDD ddd').format(
                'YYYYMMDD'
            );
            const prefix = details[i]?.timetable.prefix as string;

            const shiftCodeWithPrefix = shiftCode.match(abbreviatedDutyNumber)
                ? `${prefix}${shiftCode}`
                : `${shiftCode}`;

            if (!shiftCodeWithPrefix) return;

            if (shiftCode) {
                out[date] = shiftCodeWithPrefix;
            }
        });
        await r.replace({ pathname: '/search', query: out });
    }

    return (
        <>
            <Form {...sevenSlotsSearchForm}>
                <form
                    id="form"
                    onBlur={sevenSlotsSearchForm.handleSubmit(onSubmitHandler)}
                    className="flex min-h-max w-full flex-col items-center space-y-1"
                >
                    <FormDescription className="px-8 pb-2 text-xs">
                        <p>於輸入框內輸入更號，例：</p>
                        <p>
                            J15101則輸入101；991104則輸入991104；881113則輸入881113；如此類推。
                        </p>
                    </FormDescription>
                    {details.map(
                        (
                            {
                                date,
                                holidayDetail,
                                racingDetail,
                                timetable: { prefix },
                                weather
                            },
                            idx
                        ) => {
                            const correspondingDate = moment(
                                date,
                                'YYYYMMDD ddd'
                            );
                            const formatedDate =
                                correspondingDate.format('DD/MM(dd)');
                            const isRedDay =
                                correspondingDate.isoWeekday() === 7 ||
                                !!holidayDetail;
                            const isMonday =
                                correspondingDate.isoWeekday() === 1;
                            const legitPrefix = prefix;

                            return (
                                <fieldset
                                    key={date}
                                    className="flex w-full flex-col items-center justify-center gap-2"
                                >
                                    <WeekBadgeDisplay
                                        idx={idx}
                                        correspondingDate={correspondingDate}
                                        isMonday={isMonday}
                                    />
                                    <FormField
                                        control={sevenSlotsSearchForm.control}
                                        name={`${dayDetailName}[${idx}]`}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="w-full">
                                                    <Card
                                                        className={cn(
                                                            'w-content mx-4 flex flex-col rounded-none rounded-r-2xl rounded-bl-2xl border'
                                                        )}
                                                    >
                                                        <CardHeader>
                                                            <FormLabel className="flex flex-row items-center justify-between">
                                                                <p
                                                                    className={cn(
                                                                        'flex items-center rounded px-1 font-mono text-sm xs:text-base',
                                                                        isRedDay &&
                                                                        'bg-rose-500/40 dark:bg-rose-300/40',
                                                                        getRacingStyle(
                                                                            racingDetail
                                                                        )
                                                                    )}
                                                                >
                                                                    {
                                                                        formatedDate
                                                                    }
                                                                </p>
                                                                <WeatherIconDisplay
                                                                    weather={
                                                                        weather
                                                                    }
                                                                />
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        className="w-10 font-mono tracking-tight focus-visible:ring-cyan-700 focus-visible:dark:ring-cyan-300 xs:w-24"
                                                                        maxLength={
                                                                            7
                                                                        }
                                                                        placeholder="xxx"
                                                                        autoCapitalize="characters"
                                                                        autoComplete="off"
                                                                        autoCorrect="off"
                                                                        spellCheck="false"
                                                                    />
                                                                </FormControl>
                                                            </FormLabel>
                                                            <FormMessage className="text-right text-lg" />
                                                        </CardHeader>
                                                        <DutyContentCard
                                                            form={
                                                                sevenSlotsSearchForm
                                                            }
                                                            tableData={
                                                                tableData
                                                            }
                                                            correspondingDate={
                                                                correspondingDate
                                                            }
                                                            legitPrefix={
                                                                legitPrefix
                                                            }
                                                            field={field}
                                                        />
                                                    </Card>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </fieldset>
                            );
                        }
                    )}
                    <section className="flex w-full items-center justify-center gap-2">
                        <Button
                            disabled={!sevenSlotsSearchForm.formState.isDirty}
                            type="reset"
                            variant={'destructive'}
                            onClick={async () => {
                                sevenSlotsSearchForm.reset();
                                await r.replace({ pathname: 'search' });
                            }}
                            className="flex gap-2"
                        >
                            <Eraser />
                            <p>重設表格</p>
                        </Button>
                    </section>
                </form>
            </Form>
        </>
    );
}

type DayViewProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostViewPage(props: DayViewProps) {
    const { today, userQuery: serverSideQuery } = props;
    const r = useRouter();
    //   const clientSideQuery = encode(r.query);

    // const clientSideQueryArray = queryStringToArrayObject(clientSideQuery);
    const serverSideQueryArray = queryStringToArrayObject(serverSideQuery);

    const { data: tableData } =
        api.dutyController.getDutyByDateDuty.useQuery(serverSideQueryArray);

    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.timetableController.getSuitableTimetables.useQuery();

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    return (
        <>
            <PageTitle>{today}</PageTitle>
            <TestServerSideForm
                details={weekDetails}
                r={r}
                tableData={tableData}
            />
            {/* <pre>{JSON.stringify(serverSideQueryArray, null, 2)}</pre>
            <pre>{JSON.stringify(clientSideQueryArray, null, 2)}</pre> */}
        </>
    );
}
