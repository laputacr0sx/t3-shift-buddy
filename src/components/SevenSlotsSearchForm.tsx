import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { z } from 'zod';
import { type inferProcedureOutput } from '@trpc/server';
import { type AppRouter } from '~/server/api/root';
import { zodResolver } from '@hookform/resolvers/zod';
import { encode } from 'querystring';
import {
    type SubmitHandler,
    type SubmitErrorHandler,
    useForm
} from 'react-hook-form';
import { Eraser, MessageCircle } from 'lucide-react';

import { Form, FormDescription } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { HomepageInput } from './HomepageInput';
import AddToCalendarButtonCustom from './CustomAddToCalendarButton';

import useShiftQuery from '~/hooks/useShiftQuery';

import { abbreviatedDutyNumber } from '~/utils/regex';
import { dayDetailName, sevenSlotsSearchFormSchema } from '~/utils/zodSchemas';
import { api } from '~/utils/api';
import { convertTableDatatoExchangeString } from '~/utils/helper';
import CopyButton from './CopyButton';
import WhatsappIcon from './icons/WhatsappIcon';

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

    const exchangeString = convertTableDatatoExchangeString(tableData);

    const defaultFormValues = useMemo(() => {
        function constructDefaultValues(len: number) {
            return new Array<string>(len).fill('');
        }
        return constructDefaultValues(daysLength);
    }, [daysLength]);

    const sevenSlotsSearchForm = useForm<SevenSlotsSearchForm>({
        resolver: async (data, context, options) => {
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

        data[dayDetailName]?.forEach((shiftCode, i) => {
            const prefix = defaultData[i]?.timetable.prefix as string;

            const shiftCodeWithPrefix = shiftCode.match(abbreviatedDutyNumber)
                ? `${prefix}${shiftCode}`
                : `${shiftCode}`;

            if (!shiftCodeWithPrefix) return;
        });

        const newSearch = await handleQuery(defaultData, data);
        setNewSearchParams(newSearch);
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
                    onChange={sevenSlotsSearchForm.handleSubmit(
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
                        <AddToCalendarButtonCustom tableData={tableData} />
                        <CopyButton str={exchangeString} />
                        <Link
                            href={`whatsapp://send?text=${encodeURIComponent(
                                exchangeString
                            )}`}
                        >
                            <WhatsappIcon
                                className="mx-2 text-emerald-700 dark:text-emerald-400"
                                width={'24px'}
                                height={'24px'}
                            />
                        </Link>
                        <Button
                            type="reset"
                            onClick={async () => {
                                sevenSlotsSearchForm.reset();
                                setNewSearchParams(null);
                                await router.replace('/');
                                router.reload();
                            }}
                            className="text-red-700 dark:text-red-400"
                        >
                            <Eraser />
                        </Button>
                    </section>
                    <HomepageInput
                        defaultData={defaultData}
                        sevenSlotsSearchForm={sevenSlotsSearchForm}
                        tableData={tableData}
                    />
                </form>
            </Form>
        </>
    );
};

export default SevenSlotsSearchForm;
