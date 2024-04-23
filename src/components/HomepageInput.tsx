import moment from 'moment';
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import type { inferProcedureOutput } from '@trpc/server';

import type { AppRouter } from '~/server/api/root';
import type { DefaultData, SevenSlotsSearchForm } from './SevenSlotsSearchForm';
import WeatherIconDisplay from './WeatherIconDisplay';

import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
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

import { cn } from '~/lib/utils';
import {
    checkDeadDuty,
    convertDurationDecimal,
    getChineseLocation,
    getRacingStyle
} from '~/utils/helper';
import { dayDetailName } from '~/utils/zodSchemas';
import { abbreviatedDutyNumber } from '~/utils/regex';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

export interface HomepageInputProps {
    defaultData: DefaultData;
    sevenSlotsSearchForm: UseFormReturn<SevenSlotsSearchForm>;
    tableData?: TableData;
}

export type DutyCardProps = Pick<HomepageInputProps, 'tableData'> & {
    correspondingDate: moment.Moment;
    field: ControllerRenderProps<SevenSlotsSearchForm, `${string}[${number}]`>;
    legitPrefix: string;
    form: UseFormReturn<SevenSlotsSearchForm>;
    idx: number;
};

function DutyContentCard({
    legitPrefix,
    tableData,
    correspondingDate,
    field,
    form,
    idx
}: DutyCardProps) {
    const correspondingData = tableData?.filter(
        (d) => d.date === correspondingDate.format('YYYYMMDD')
    )[0];

    const userInputStr = field.value.toString();

    const formName = field.name;
    const {
        getValues,
        control: { getFieldState }
    } = form;

    if (!correspondingData)
        return (
            <CardContent>
                <CardTitle className="font-mono font-bold">
                    {getValues(formName) ? (
                        getFieldState(formName).invalid ? (
                            `${legitPrefix}___`
                        ) : (
                            <>
                                {userInputStr.match(abbreviatedDutyNumber)
                                    ? `${legitPrefix}${userInputStr}`
                                    : `${userInputStr}`}
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
                    <CardTitle className="font-bold">{dutyNumber}</CardTitle>
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
                        <p>{dDur}</p>
                    </span>
                </section>
                <section className="flex flex-col gap-1">
                    <FormField
                        control={form.control}
                        name={dayDetailName}
                        render={({ field }) => {
                            return (
                                <FormItem className="flex w-full items-end justify-center self-center align-middle">
                                    <FormControl>
                                        <Checkbox
                                            className="border-slate-600 dark:border-slate-100"
                                            checked={
                                                !!field.value.filter((d) => {
                                                    d ===
                                                        correspondingData.dutyNumber.slice(
                                                            3
                                                        );
                                                })
                                            }
                                            onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([
                                                        ...field.value,
                                                        {
                                                            shiftCode:
                                                                correspondingData.dutyNumber.slice(
                                                                    3
                                                                )
                                                        }
                                                    ])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) =>
                                                                value !==
                                                                correspondingData.dutyNumber.slice(
                                                                    3
                                                                )
                                                        )
                                                    );
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="tracking-wider text-slate-600 dark:text-slate-100">
                                        加入調更字串
                                    </FormLabel>
                                </FormItem>
                            );
                        }}
                    />
                    <Button>
                        <Copy size={14} />
                    </Button>
                </section>
            </CardContent>
            <CardFooter className="font-mono font-light">{remarks}</CardFooter>
        </>
    );
}

export type TableData = inferProcedureOutput<
    AppRouter['dutyController']['getDutyByDateDuty']
>;

export function HomepageInput({
    defaultData,
    sevenSlotsSearchForm,
    tableData
}: HomepageInputProps) {
    return defaultData.map(
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
                    {(idx === 0 || isMonday) && (
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
                                        <DutyContentCard
                                            form={sevenSlotsSearchForm}
                                            tableData={tableData}
                                            correspondingDate={
                                                correspondingDate
                                            }
                                            legitPrefix={legitPrefix}
                                            field={field}
                                            idx={idx}
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
