import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import type { HomepageInputProps } from './HomepageInput';
import type { SevenSlotsSearchForm } from './SevenSlotsSearchForm';
import { Copy } from 'lucide-react';

import { CardContent, CardFooter, CardTitle } from './ui/card';
import { FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

import { abbreviatedDutyNumber } from '~/utils/regex';
import { convertDurationDecimal, getChineseLocation } from '~/utils/helper';
import { dayDetailName } from '~/utils/zodSchemas';

export type DutyCardProps = Pick<HomepageInputProps, 'tableData'> & {
    correspondingDate: moment.Moment;
    field: ControllerRenderProps<SevenSlotsSearchForm, `${string}[${number}]`>;
    legitPrefix: string;
    form: UseFormReturn<SevenSlotsSearchForm>;
};

function DutyContentCard({
    legitPrefix,
    tableData,
    correspondingDate,
    field,
    form
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
                                            checked={field.value.includes(
                                                correspondingData.dutyNumber.slice(
                                                    3
                                                )
                                            )}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([
                                                        ...field.value,
                                                        correspondingData.dutyNumber.slice(
                                                            3
                                                        )
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
                    {/* <Button
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Copy size={14} />
                    </Button> */}
                </section>
            </CardContent>
            <CardFooter className="font-mono font-light">{remarks}</CardFooter>
        </>
    );
}

export default DutyContentCard;
