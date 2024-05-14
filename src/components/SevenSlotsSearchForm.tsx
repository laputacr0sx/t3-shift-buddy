import { useEffect, useMemo, useState } from 'react';
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
import { Eraser } from 'lucide-react';

import { Form, FormDescription } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Textarea } from './ui/textarea';
import { HomepageInput } from './HomepageInput';
import AddToCalendarButtonCustom from './CustomAddToCalendarButton';

import useShiftQuery from '~/hooks/useShiftQuery';

import { abbreviatedDutyNumber } from '~/utils/regex';
import { dayDetailName, sevenSlotsSearchFormSchema } from '~/utils/zodSchemas';
import { api } from '~/utils/api';
import { copyStringToClipboard } from '~/utils/helper';

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

        data[dayDetailName]?.forEach((shiftCode, i) => {
            const prefix = defaultData[i]?.timetable.prefix as string;

            const shiftCodeWithPrefix = shiftCode.match(abbreviatedDutyNumber)
                ? `${prefix}${shiftCode}`
                : `${shiftCode}`;

            if (!shiftCodeWithPrefix) return;
        });

        const newSearch = await handleQuery(defaultData, data);
        setNewSearchParams(newSearch);

        // if (tableData) SetCopyText(getSelectedShiftsString(tableData));
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
                    className="flex min-h-max w-full flex-col items-center space-y-1"
                >
                    <FormDescription className="px-8 pb-2 text-xs">
                        <p>於輸入框內輸入更號，例：</p>
                        <p>
                            J15101則輸入101；991104則輸入991104；881113則輸入881113；如此類推。
                        </p>
                    </FormDescription>
                    {/* <div className="mx-4 grid h-max w-full gap-2 px-4">
                        <Textarea
                            className="min-h-[240px] font-mono font-normal tracking-wider"
                            placeholder="Type your message here."
                            onChange={(e) => {
                                SetCopyText(e.target.value);
                            }}
                            value={copyText}
                        />
                        <Button
                            variant={'outline'}
                            onClick={async () => {
                                await copyStringToClipboard(copyText);
                            }}
                        >
                            <p className="text-emerald-700 dark:text-emerald-200">
                                Open WhatsAPP
                            </p>
                        </Button>
                    </div> */}
                    <section className="flex w-full items-center justify-center gap-2">
                        <Button
                            // disabled={!sevenSlotsSearchForm.formState.isDirty}
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
                        </Button>
                        <AddToCalendarButtonCustom tableData={tableData} />
                        <CopyButton str={exchangeString} />
                        <Link
                            href={`whatsapp://send?text=${encodeURIComponent(
                                exchangeString
                            )}`}
                            className="flex flex-row self-center align-middle text-emerald-700 dark:text-emerald-300"
                        >
                            <MessageCircle className="m-2 h-4 w-4 self-center" />
                            <p className={'self-center text-center text-xs '}>
                                開啟WhatsApp
                            </p>
                        </Link>
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
