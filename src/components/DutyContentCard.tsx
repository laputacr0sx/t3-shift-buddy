import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import type { HomepageInputProps } from './HomepageInput';
import type { SevenSlotsSearchForm } from './SevenSlotsSearchForm';

import { CardContent, CardFooter, CardTitle } from './ui/card';

import { abbreviatedDutyNumber } from '~/utils/regex';
import { convertDurationDecimal, getChineseLocation } from '~/utils/helper';
import { Accordion, AccordionContent, AccordionTrigger } from './ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';

export type DutyContentCardProps = Pick<HomepageInputProps, 'tableData'> & {
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
}: DutyContentCardProps) {
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

    const notHUH = (location: string): string => {
        return location === 'HUH' ? '' : 'font-bold italic';
    };

    return (
        <>
            <CardContent className="flex items-center justify-between font-mono">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="CardContent-1">
                        <CardTitle className="font-bold">
                            <AccordionTrigger className="font-bold">
                                {dutyNumber}
                            </AccordionTrigger>
                        </CardTitle>
                        <AccordionContent>
                            <p className="flex items-center gap-3 text-center">
                                <p className="flex flex-col items-center">
                                    <span className={notHUH(bNL)}>{cBNL}</span>
                                    <span>{bNT}</span>
                                </p>
                                <p>-</p>
                                <p className="flex flex-col items-center">
                                    <span className={notHUH(bFL)}>{cBFL}</span>
                                    <span>{bFT}</span>
                                </p>
                                <p>{dDur}</p>
                            </p>
                            <p className="font-mono font-light">{remarks}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </>
    );
}

export default DutyContentCard;
