import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
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
import { useForm } from 'react-hook-form';
import router from 'next/router';

import {
    abbreviatedDutyNumber,
    shiftNameRegex,
    shiftRowRegex
} from '~/utils/regex';

import { autoPrefix } from '~/utils/helper';
import moment from 'moment';

import { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import TouchPad from './ui/touch-pad';
import { rawShiftArraySchema } from '~/utils/zodSchemas';

const rowFormSchema = z.object({
    shiftRow: z.string().regex(shiftRowRegex, '輸入更號不正確')
});

export default function SearchShiftForm() {
    const [parent] = useAutoAnimate();

    const [timetable, setTimetable] = useState<ReturnType<typeof autoPrefix>>(
        []
    );

    useEffect(() => {
        setTimetable(autoPrefix());
    }, []);

    const rowForm = useForm<z.infer<typeof rowFormSchema>>({
        resolver: zodResolver(rowFormSchema),
        defaultValues: {
            shiftRow: ''
        },
        mode: 'onBlur'
    });

    async function onSubmitForRow(values: z.infer<typeof rowFormSchema>) {
        await router.push(`wholeweek/${values.shiftRow.toUpperCase()}`);
    }

    return (
        <>
            <Form {...rowForm}>
                <form
                    onSubmit={rowForm.handleSubmit(onSubmitForRow)}
                    className="space-y-8"
                >
                    <FormField
                        control={rowForm.control}
                        name="shiftRow"
                        render={({ field }) => {
                            const values: unknown =
                                field.value.length > 0 &&
                                field.value.match(shiftNameRegex);
                            const validatedRawShiftArray =
                                rawShiftArraySchema.safeParse(values);

                            return (
                                <FormItem>
                                    <FormLabel>整週番號</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="font-mono tracking-wide"
                                            placeholder="101102103104105106RD"
                                            type="search"
                                        />
                                    </FormControl>
                                    <FormDescription
                                        className="flex flex-col gap-1"
                                        ref={parent}
                                    >
                                        {timetable.map((day, i) => {
                                            const formatedDate = moment(
                                                day.date,
                                                'YYYYMMDD ddd'
                                            ).format('DD/MM（dd）');
                                            return (
                                                <p
                                                    key={day.date}
                                                    className="py-1 font-mono tracking-wide"
                                                >
                                                    {formatedDate}
                                                    {validatedRawShiftArray.success &&
                                                    validatedRawShiftArray.data[
                                                        i
                                                    ] ? (
                                                        <>
                                                            {validatedRawShiftArray.data[
                                                                i
                                                            ]?.match(
                                                                abbreviatedDutyNumber
                                                            )
                                                                ? `${
                                                                      day.prefix
                                                                  }${
                                                                      validatedRawShiftArray
                                                                          .data[
                                                                          i
                                                                      ] as string
                                                                  }`
                                                                : `${
                                                                      validatedRawShiftArray
                                                                          .data[
                                                                          i
                                                                      ] as string
                                                                  }`}
                                                        </>
                                                    ) : (
                                                        `${day.prefix}___`
                                                    )}{' '}
                                                    {day.holidayDetails
                                                        ?.summary ??
                                                    day.racingDetails?.venue ===
                                                        'S'
                                                        ? '沙田'
                                                        : day.racingDetails
                                                              ?.venue === 'H'
                                                        ? '跑馬地'
                                                        : ''}
                                                    {day.racingDetails
                                                        ?.nightRacing === 0
                                                        ? '日馬'
                                                        : day.racingDetails
                                                              ?.nightRacing ===
                                                          1
                                                        ? '夜馬'
                                                        : day.racingDetails
                                                              ?.nightRacing ===
                                                          2
                                                        ? '黃昏馬'
                                                        : ''}
                                                </p>
                                            );
                                        })}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <TouchPad rowForm={rowForm} />
                    <div className="flex justify-center gap-8">
                        <Button type="submit" variant={'outline'}>
                            查下週更資料
                        </Button>
                        <Button
                            type="reset"
                            variant={'destructive'}
                            onClick={() => {
                                rowForm.reset({ shiftRow: '' });
                            }}
                        >
                            重置
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
