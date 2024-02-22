import { useEffect, useMemo, useState } from 'react';
import type { z } from 'zod';
import moment from 'moment';

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
import { Button } from '~/components/ui/button';

import { Badge } from '~/components/ui/badge';

import {
    type SubmitHandler,
    type SubmitErrorHandler,
    useForm
} from 'react-hook-form';

import { autoPrefix } from '~/utils/helper';
import { abbreviatedDutyNumber } from '~/utils/regex';
import useShiftQuery from '~/hooks/useShiftQuery';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

import { encode } from 'querystring';

import { cn } from '~/lib/utils';
import { Label } from './ui/label';
import { dayDetailName, sevenSlotsSearchFormSchema } from '~/utils/zodSchemas';
import { type inferProcedureOutput } from '@trpc/server';
import { type AppRouter } from '~/server/api/root';

export type SevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

const SevenSlotsSearchForm = ({
    defaultData
}: {
    defaultData: inferProcedureOutput<
        AppRouter['timetableController']['getSuitableTimetables']
    >;
}) => {
    const [parent] = useAutoAnimate();

    const prefixData = defaultData.map((day) => day.prefix);

    console.log(prefixData);

    const { router, handleQuery } = useShiftQuery(prefixData);
    const [newSearchParams, setNewSearchParams] =
        useState<URLSearchParams | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(encode(router.query));
        !!queryParams.size && setNewSearchParams(queryParams);
    }, [router.query]);

    const autoDayDetail = useMemo(() => autoPrefix(true), []);

    const shiftsFromSearchParamMemo = useMemo(() => {
        const dateAndShifts: { date: string; shiftCode: string }[] = [];
        if (newSearchParams === null) return dateAndShifts;
        for (const [date, shiftCode] of newSearchParams) {
            dateAndShifts.push({ date, shiftCode });
        }
        return dateAndShifts;
    }, [newSearchParams]);

    const sevenSlotsSearchForm = useForm<SevenSlotsSearchForm>({
        resolver: async (data, context, options) => {
            // you can debug your validation schema here
            // console.log("formData", data);
            // console.log(
            //   "validation result",
            //   await zodResolver(sevenSlotsSearchFormSchema)(data, context, options)
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
            [dayDetailName]: [
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' },
                { shiftCode: '' }
            ]
        }
    });

    const onValidPrefixFormHandler: SubmitHandler<
        SevenSlotsSearchForm
    > = async (data, event) => {
        event?.preventDefault();
        const newSearch = await handleQuery(autoDayDetail, data);
        setNewSearchParams(newSearch);
        await router.push('#query-result');
    };

    const onInvalidPrefixFormHandler: SubmitErrorHandler<
        SevenSlotsSearchForm
    > = (error, event) => {
        event?.preventDefault();
        console.error({ error });
    };

    return (
        <>
            {newSearchParams ? (
                <Button
                    onClick={async () => {
                        await router.push('#query-result');
                    }}
                    className="absolute right-2 top-6"
                >
                    <ArrowDownToLine />
                </Button>
            ) : null}
            <Form {...sevenSlotsSearchForm}>
                <form
                    id="form"
                    onSubmit={sevenSlotsSearchForm.handleSubmit(
                        onValidPrefixFormHandler,
                        onInvalidPrefixFormHandler
                    )}
                    className="flex min-h-screen w-full flex-col items-center space-y-1"
                >
                    <FormDescription className="pb-2 text-xs">
                        <p>於輸入框內輸入更號，例：</p>
                        <p>
                            J15101則輸入101；
                            991104則輸入991104；881113則輸入881113；如此類推。
                        </p>
                    </FormDescription>

                    {
                        /* Map through dates obtained and generate appropriate input fields for the form */
                        autoDayDetail.map((day, i) => {
                            const correspondingDate = moment(
                                day.date,
                                'YYYYMMDD ddd'
                            );
                            const formatedDate =
                                correspondingDate.format('DD/MM(dd)');
                            const isRedDay =
                                correspondingDate.isoWeekday() === 7 ||
                                !!day.holidayDetails;
                            const isMonday =
                                correspondingDate.isoWeekday() === 1;

                            const legitPrefix = prefixData?.slice(
                                -autoDayDetail.length
                            )[i];

                            return (
                                <fieldset
                                    key={day.date}
                                    className="flex w-full flex-col items-center justify-center gap-2"
                                >
                                    {(i === 0 || isMonday) && (
                                        <Badge
                                            variant={'outline'}
                                            className="w-fit border-green-700 dark:border-green-400 "
                                        >
                                            <Label>{`Y${correspondingDate.year()}W${correspondingDate.isoWeek()}`}</Label>
                                        </Badge>
                                    )}
                                    <FormField
                                        control={sevenSlotsSearchForm.control}
                                        name={`${dayDetailName}[${i}].shiftCode`}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="w-content flex flex-col xs:w-full">
                                                    <div className="w-content flex flex-col gap-2 space-y-0 xs:flex-row xs:items-center xs:justify-around xs:gap-0">
                                                        <FormLabel
                                                            className={cn(
                                                                'w-fit items-center rounded px-1 font-mono text-sm xs:text-base',
                                                                isRedDay &&
                                                                    'bg-rose-500/40 dark:bg-rose-300/40',
                                                                day
                                                                    .racingDetails
                                                                    ?.nightRacing ===
                                                                    0
                                                                    ? 'border-b-2 border-b-lime-500 dark:border-b-lime-300 '
                                                                    : day
                                                                          .racingDetails
                                                                          ?.nightRacing ===
                                                                      1
                                                                    ? 'border-b-2 border-b-violet-500 dark:border-b-violet-300'
                                                                    : day
                                                                          .racingDetails
                                                                          ?.nightRacing ===
                                                                      2
                                                                    ? 'border-b-2 border-b-amber-500 dark:border-b-amber-300'
                                                                    : ''
                                                            )}
                                                        >
                                                            {formatedDate}{' '}
                                                            {sevenSlotsSearchForm.getValues(
                                                                field.name
                                                            ) ? (
                                                                sevenSlotsSearchForm.control.getFieldState(
                                                                    field.name
                                                                ).invalid ? (
                                                                    `${
                                                                        legitPrefix as string
                                                                    }___`
                                                                ) : (
                                                                    <>
                                                                        {(
                                                                            field.value as string
                                                                        ).match(
                                                                            abbreviatedDutyNumber
                                                                        )
                                                                            ? `${
                                                                                  legitPrefix as string
                                                                              }${
                                                                                  field.value as string
                                                                              }`
                                                                            : `${
                                                                                  field.value as string
                                                                              }`}
                                                                    </>
                                                                )
                                                            ) : (
                                                                `${
                                                                    legitPrefix as string
                                                                }___`
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-auto font-mono tracking-tight focus-visible:ring-cyan-700 focus-visible:dark:ring-cyan-300 xs:w-24"
                                                                maxLength={7}
                                                                placeholder={`xxx / xxxxxx`}
                                                                autoCapitalize="characters"
                                                                autoComplete="off"
                                                                autoCorrect="off"
                                                                spellCheck="false"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </fieldset>
                            );
                        })
                    }
                    <div className="flex items-center justify-center gap-8">
                        <Button
                            type="submit"
                            variant={'secondary'}
                            disabled={!sevenSlotsSearchForm.formState.isDirty}
                        >
                            查資料
                        </Button>
                        <Button
                            type="reset"
                            variant={'destructive'}
                            onClick={async () => {
                                sevenSlotsSearchForm.reset();
                                setNewSearchParams(null);
                                await router.replace('/');
                                router.reload();
                            }}
                        >
                            重置
                        </Button>
                    </div>
                </form>
            </Form>
            {newSearchParams ? (
                <section
                    ref={parent}
                    id="query-result"
                    className="h-screen min-h-screen w-full items-center justify-center"
                >
                    <h1 className="justify-center py-2 text-center text-2xl font-medium text-foreground">
                        未來更序
                    </h1>
                    <Button
                        onClick={async () => {
                            await router.push('#title');
                        }}
                        className="absolute right-0 top-1"
                    >
                        <ArrowUpToLine />
                    </Button>
                    <br />
                    {/* {queryIsLoading ? (
                        <div className="flex flex-col items-center justify-center gap-5 pt-5">
                            <Skeleton className="h-80 w-72" />
                        </div>
                    ) : queryError ? (
                        <p>{queryError.message}</p>
                    ) : (
                        <DayDetailTable
                            columns={DayDetailColumn}
                            data={queryData}
                        />
                    )} */}
                </section>
            ) : null}
        </>
    );
};

export default SevenSlotsSearchForm;
