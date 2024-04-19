import moment from 'moment';
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import type { inferProcedureOutput } from '@trpc/server';

import type { AppRouter } from '~/server/api/root';
import type { DefaultData, SevenSlotsSearchForm } from './SevenSlotsSearchForm';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from './ui/card';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from './ui/form';

import WeatherIconDisplay from './WeatherIconDisplay';

import { cn } from '~/lib/utils';
import {
    convertDurationDecimal,
    getChineseLocation,
    getRacingStyle
} from '~/utils/helper';
import { dayDetailName } from '~/utils/zodSchemas';
import { abbreviatedDutyNumber } from '~/utils/regex';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';

export type TableData = inferProcedureOutput<
    AppRouter['dutyController']['getDutyByDateDuty']
>;

export interface HomepageInputProps {
    defaultData: DefaultData;
    sevenSlotsSearchForm: UseFormReturn<SevenSlotsSearchForm>;
    tableData?: TableData;
}

export type DutyCardProps = Pick<HomepageInputProps, 'tableData'> & {
    correspondingDate: moment.Moment;
    field: ControllerRenderProps<
        SevenSlotsSearchForm,
        `${string}[${number}].shiftCode`
    >;
    legitPrefix: string;
};

export interface AddToCalendarButtonProps {
    dateData: TableData[0];
}

export function HomepageInput({
    defaultData,
    sevenSlotsSearchForm,
    tableData
}: HomepageInputProps) {
    function DutyCard({
        legitPrefix,
        tableData,
        correspondingDate,
        field
    }: DutyCardProps) {
        const correspondingData = tableData?.filter(
            (d) => d.date === correspondingDate.format('YYYYMMDD')
        )[0];

        if (!correspondingData)
            return (
                <CardContent>
                    <CardTitle className="font-mono font-bold">
                        {sevenSlotsSearchForm.getValues(field.name) ? (
                            sevenSlotsSearchForm.control.getFieldState(
                                field.name
                            ).invalid ? (
                                `${legitPrefix}___`
                            ) : (
                                <>
                                    {(field.value as string).match(
                                        abbreviatedDutyNumber
                                    )
                                        ? `${legitPrefix}${field.value as string
                                        }`
                                        : `${field.value as string}`}
                                </>
                            )
                        ) : (
                            `${legitPrefix}___`
                        )}
                    </CardTitle>
                </CardContent>
            );

        const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks } =
            correspondingData;

        const cBNL = getChineseLocation(bNL);
        const cBFL = getChineseLocation(bFL);
        const dDur = +convertDurationDecimal(duration);

        return (
            <>
                <CardContent className="flex items-center justify-between font-mono">
                    <section>
                        <CardTitle className="font-bold">
                            {dutyNumber}
                        </CardTitle>
                        <span className="flex items-center gap-3 text-center">
                            <p className="flex flex-col items-center">
                                <span>{cBNL}</span>
                                <span>{bNT}</span>
                            </p>
                            <p>-</p>
                            <p className="flex flex-col items-center">
                                <span>{cBFL}</span>
                                <span>{bFT}</span>
                            </p>
                            {dDur}
                        </span>
                    </section>
                    <section className="flex gap-1">
                        <Button variant={'outline'}>
                            <Copy size={20} />
                        </Button>
                    </section>
                </CardContent>
                <CardFooter className="font-mono font-light">
                    {remarks}
                </CardFooter>
            </>
        );
    }
    return defaultData.map(
        (
            {
                date,
                holidayDetail,
                racingDetail,
                timetable: { prefix },
                weather
            },
            i
        ) => {
            const correspondingDate = moment(date, 'YYYYMMDD ddd');
            const formatedDate = correspondingDate.format('DD/MM(dd)');
            const isRedDay =
                correspondingDate.isoWeekday() === 7 || !!holidayDetail;
            const isMonday = correspondingDate.isoWeekday() === 1;

            const legitPrefix = prefix;

            return (
                <fieldset
                    key={date}
                    className="flex w-full flex-col items-center justify-center gap-2"
                >
                    {(i === 0 || isMonday) && (
                        <Badge
                            variant={'outline'}
                            className="mt-1 w-fit border-green-700 dark:border-green-400"
                        >
                            <Label>
                                {correspondingDate.format('[Y]YYYY[W]WW')}
                            </Label>
                        </Badge>
                    )}
                    <FormField
                        control={sevenSlotsSearchForm.control}
                        name={`${dayDetailName}[${i}].shiftCode`}
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
                                                    {formatedDate}
                                                </p>
                                                <WeatherIconDisplay
                                                    weather={weather}
                                                />
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-10 font-mono tracking-tight focus-visible:ring-cyan-700 focus-visible:dark:ring-cyan-300 xs:w-24"
                                                        maxLength={7}
                                                        placeholder="xxx"
                                                        autoCapitalize="characters"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        spellCheck="false"
                                                    />
                                                </FormControl>
                                            </FormLabel>
                                            <CardDescription>
                                                <FormMessage className="text-right text-lg" />
                                            </CardDescription>
                                        </CardHeader>
                                        <DutyCard
                                            tableData={tableData}
                                            correspondingDate={
                                                correspondingDate
                                            }
                                            legitPrefix={legitPrefix}
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
    );
}
