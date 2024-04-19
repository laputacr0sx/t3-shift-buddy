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
import { HomepageInput, TableData } from './HomepageInput';
import { CalendarPlus, Eraser } from 'lucide-react';
import { DayDetail } from '~/utils/customTypes';
import { atcb_action } from 'add-to-calendar-button';
import { convertDurationDecimal } from '~/utils/helper';

export type SevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

export type DefaultData = inferProcedureOutput<
    AppRouter['timetableController']['getSuitableTimetables']
>;

type DetailsOfEvent = {
    name?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    timeZone?: string;
    location?: string;
    status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
    sequence?: number;
    uid?: string;
    organizer?: string;
    attendee?: string;
};

function AddToCalendarButtonCustom({ dateData }: { dateData?: TableData }) {
    let resultEvents: DetailsOfEvent[] = [];

    if (!dateData) return null;

    for (const d of dateData) {
        const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks, date } = d;
        const bND: string = moment(date).format('YYYY-MM-DD');
        const durationDecimal = duration
            ? convertDurationDecimal(duration)
            : duration;
        const bFD = moment(`${bND} ${bFT}`).isAfter(moment(`${bND} ${bNT}`))
            ? moment(bND).format('YYYY-MM-DD')
            : moment(bND).add(1, 'd').format('YYYY-MM-DD');

        resultEvents = [
            ...resultEvents,
            {
                name: dutyNumber,
                location: bNL,
                startDate: bND,
                endDate: bFD,
                startTime: bNT,
                endTime: bFT,
                description: `收工地點：${bFL}[br]工時：${durationDecimal}[br]備註：${remarks}`
            }
        ];
    }

    return (
        <Button
            onClick={() => {
                atcb_action({
                    name: 'testing',
                    dates: resultEvents,
                    options: ['Apple', 'Google', 'Microsoft365', 'iCal'],
                    hideIconButton: true,
                    hideBackground: true,
                    buttonStyle: 'default',
                    timeZone: 'Asia/Hong_Kong'
                });
            }}
            className="flex gap-2"
            variant={'outline'}
        >
            <CalendarPlus />
            <p>加入所有更份</p>
        </Button>
    );
}
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

    const { data: tableData } = api.dutyController.getDutyByDateDuty.useQuery(
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
                    <section className="flex w-full items-center justify-center gap-2">
                        <Button
                            disabled={!sevenSlotsSearchForm.formState.isDirty}
                            type="reset"
                            variant={'destructive'}
                            onClick={async () => {
                                sevenSlotsSearchForm.reset();
                                setNewSearchParams(null);
                                await router.replace('/');
                                router.reload();
                            }}
                            className="flex gap-2"
                        >
                            <Eraser />
                            <p>重設表格</p>
                        </Button>
                        <AddToCalendarButtonCustom dateData={tableData} />
                    </section>
                    <HomepageInput
                        defaultData={defaultData}
                        sevenSlotsSearchForm={sevenSlotsSearchForm}
                        tableData={tableData}
                    />
                </form>
            </Form>
            {/* tableData ? <DutyDetailsPDF dutyDetails={tableData} /> : null */}
        </>
    );
};

export default SevenSlotsSearchForm;
