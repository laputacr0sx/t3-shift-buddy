import { useEffect, useMemo, useState } from 'react';
import type { z } from 'zod';
import moment from 'moment';

import { Form, FormDescription } from '~/components/ui/form';
import { Button } from '~/components/ui/button';

import {
    type SubmitHandler,
    type SubmitErrorHandler,
    useForm
} from 'react-hook-form';

import { abbreviatedDutyNumber } from '~/utils/regex';
import useShiftQuery from '~/hooks/useShiftQuery';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { encode } from 'querystring';

import { dayDetailName, sevenSlotsSearchFormSchema } from '~/utils/zodSchemas';
import { type inferProcedureOutput } from '@trpc/server';
import { type AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { HomepageInput } from './HomepageInput';

export type SevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

export type DefaultData = inferProcedureOutput<
    AppRouter['timetableController']['getSuitableTimetables']
>;

const SevenSlotsSearchForm = ({
    defaultData
}: {
    defaultData: DefaultData;
}) => {
    const daysLength = defaultData.length;
    const prefixData = defaultData.map((day) => day.prefix);

    const { router, handleQuery } = useShiftQuery(prefixData);
    const [newSearchParams, setNewSearchParams] =
        useState<URLSearchParams | null>(null);
    const [searchObjectArray, setSearchObjectArray] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        const queryParams = new URLSearchParams(encode(router.query));
        !!queryParams.size && setNewSearchParams(queryParams);
    }, [router.query]);

    const shiftsFromSearchParamMemo = useMemo(() => {
        const dateAndShifts: { date: string; shiftCode: string }[] = [];
        if (newSearchParams === null) return dateAndShifts;
        for (const [date, shiftCode] of newSearchParams) {
            dateAndShifts.push({ date, shiftCode });
        }
        return dateAndShifts;
    }, [newSearchParams]);

    const {
        data: tableData,
        isLoading: tableDataIsLoading,
        error: tableDataError
    } = api.dutyController.getDutyByDateDuty.useQuery(
        shiftsFromSearchParamMemo
    );

    const defaultFormValues = useMemo(() => {
        function constructDefaultValues(len: number) {
            return new Array<{ shiftCode: string }>(len).fill({
                shiftCode: ''
            });
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

    const onValidPrefixFormHandler: SubmitHandler<
        SevenSlotsSearchForm
    > = async (data, event) => {
        event?.preventDefault();

        data[dayDetailName]?.forEach(({ shiftCode }, i) => {
            const date = moment(defaultData[i]?.date, 'YYYYMMDD ddd').format(
                'YYYYMMDD'
            );
            const prefix = defaultData[i]?.timetable.prefix as string;

            const shiftCodeWithPrefix = shiftCode.match(abbreviatedDutyNumber)
                ? `${prefix}${shiftCode}`
                : `${shiftCode}`;

            if (!shiftCodeWithPrefix) return;
            setSearchObjectArray((prev) => {
                return { ...prev, [date]: shiftCodeWithPrefix };
            });
        });

        const newSearch = await handleQuery(defaultData, data);
        setNewSearchParams(newSearch);
        // await router.push('#query-result');
    };

    const onInvalidPrefixFormHandler: SubmitErrorHandler<
        SevenSlotsSearchForm
    > = (error, event) => {
        event?.preventDefault();
        console.error({ error });
    };

    return (
        <>
            {/* newSearchParams ? (
                <Button
                    variant={'outline'}
                    onClick={async () => {
                        await router.push('#query-result');
                    }}
                    className="absolute right-2 top-6"
                >
                    <ArrowDownToLine />
                </Button>
            ) : null */}
            <Form {...sevenSlotsSearchForm}>
                <form
                    id="form"
                    onBlur={sevenSlotsSearchForm.handleSubmit(
                        onValidPrefixFormHandler,
                        onInvalidPrefixFormHandler
                    )}
                    onSubmit={sevenSlotsSearchForm.handleSubmit(
                        onValidPrefixFormHandler,
                        onInvalidPrefixFormHandler
                    )}
                    className="flex min-h-max w-full flex-col items-center space-y-1"
                >
                    <FormDescription className="px-8 pb-2 text-xs">
                        <p>於輸入框內輸入更號，例：</p>
                        <p>
                            J15101則輸入101；991104則輸入991104；881113則輸入881113；如此類推。
                        </p>
                    </FormDescription>
                    <HomepageInput
                        defaultData={defaultData}
                        sevenSlotsSearchForm={sevenSlotsSearchForm}
                        tableData={tableData}
                    />
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
            {/* newSearchParams ? (
                <section
                    ref={parent}
                    id="query-result"
                    className="min-h-max w-full items-center justify-center"
                >
                    <h1 className="justify-center py-2 text-center text-2xl font-medium text-foreground">
                        未來更序
                    </h1>
                    <Button
                        variant={'outline'}
                        onClick={async () => {
                            await router.push('#top-bar');
                        }}
                        className="absolute right-2 top-1"
                    >
                        <ArrowUpToLine />
                    </Button>
                    <br />
                    {tableDataIsLoading ? (
                        <div className="flex flex-col items-center justify-center gap-5 pt-5">
                            <TableLoading />
                        </div>
                    ) : tableDataError ? (
                        <p>{tableDataError.message}</p>
                    ) : (
                        <DayDetailTable
                            columns={DayDetailColumn}
                            data={tableData}
                        />
                    )}
                </section>
            ) : null*/}
            {/* tableData ? <DutyDetailsPDF dutyDetails={tableData} /> : null */}
        </>
    );
};

export default SevenSlotsSearchForm;
