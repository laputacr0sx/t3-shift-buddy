import moment from 'moment';
import type { UseFormReturn } from 'react-hook-form';

import type { DefaultData, SevenSlotsSearchForm } from './SevenSlotsSearchForm';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from './ui/form';

import WeatherIconDisplay from './WeatherIconDisplay';

import { cn } from '~/lib/utils';
import { getRacingStyle } from '~/utils/helper';
import { dayDetailName } from '~/utils/zodSchemas';
import { abbreviatedDutyNumber } from '~/utils/regex';

interface HomepageInputProps {
    defaultData: DefaultData;
    sevenSlotsSearchForm: UseFormReturn<SevenSlotsSearchForm>;
}
export function HomepageInput({
    defaultData,
    sevenSlotsSearchForm
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
                            className="w-fit border-green-700 dark:border-green-400 "
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
                                <FormItem className="flex w-auto flex-col xs:w-full">
                                    <div className="w-content mx-8 flex flex-col space-y-0 xs:flex-row xs:items-center xs:justify-between xs:gap-0">
                                        <FormLabel className="flex flex-row items-center justify-center gap-2">
                                            <p
                                                className={cn(
                                                    'flex items-center rounded px-1 font-mono text-sm xs:text-base',
                                                    isRedDay &&
                                                    'bg-rose-500/40 dark:bg-rose-300/40',
                                                    getRacingStyle(racingDetail)
                                                )}
                                            >
                                                {formatedDate}
                                            </p>
                                            <WeatherIconDisplay
                                                weather={weather}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="w-fit">
                                                <div className="flex flex-row items-center justify-center gap-2 font-mono font-bold">
                                                    {sevenSlotsSearchForm.getValues(
                                                        field.name
                                                    ) ? (
                                                        sevenSlotsSearchForm.control.getFieldState(
                                                            field.name
                                                        ).invalid ? (
                                                            `${legitPrefix}___`
                                                        ) : (
                                                            <>
                                                                {(
                                                                    field.value as string
                                                                ).match(
                                                                    abbreviatedDutyNumber
                                                                )
                                                                    ? `${legitPrefix}${field.value as string
                                                                    }`
                                                                    : `${field.value as string
                                                                    }`}
                                                            </>
                                                        )
                                                    ) : (
                                                        `${legitPrefix}___`
                                                    )}
                                                    <Input
                                                        {...field}
                                                        className="w-10 font-mono tracking-tight focus-visible:ring-cyan-700 focus-visible:dark:ring-cyan-300 xs:w-24"
                                                        maxLength={7}
                                                        placeholder={`xxx`}
                                                        autoCapitalize="characters"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        spellCheck="false"
                                                    />
                                                </div>
                                                <FormMessage className="text-center text-xs" />
                                            </div>
                                        </FormControl>
                                    </div>
                                </FormItem>
                            );
                        }}
                    />
                </fieldset>
            );
        }
    );
}
