import type { inferProcedureOutput } from '@trpc/server';
import moment from 'moment';
import type { UseFormReturn } from 'react-hook-form';

import type { AppRouter } from '~/server/api/root';
import type { DefaultData, SevenSlotsSearchForm } from './SevenSlotsSearchForm';
import WeatherIconDisplay from './WeatherIconDisplay';

import { Badge } from './ui/badge';
import { Card, CardHeader } from './ui/card';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { cn } from '~/lib/utils';
import { dayDetailName } from '~/utils/zodSchemas';
import CardDateLabel from './CardDateParagraph';
import DutyContentCard from './DutyContentCard';

export interface HomepageInputProps {
    defaultData: DefaultData;
    sevenSlotsSearchForm: UseFormReturn<SevenSlotsSearchForm>;
    tableData?: TableData;
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
            const correspondingDate = moment(date);
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
                                <FormItem className="w-full xl:w-[50%]">
                                    <Card
                                        className={cn(
                                            'w-content mx-4 flex flex-col rounded-none rounded-r-2xl rounded-bl-2xl border'
                                        )}
                                    >
                                        <CardHeader>
                                            <FormLabel className="flex flex-row items-center justify-between">
                                                <CardDateLabel
                                                    isRedDay={isRedDay}
                                                    racingDetail={racingDetail}
                                                >
                                                    {formatedDate}
                                                </CardDateLabel>
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
                                            <FormMessage className="text-right text-lg" />
                                        </CardHeader>
                                        <DutyContentCard
                                            form={sevenSlotsSearchForm}
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
