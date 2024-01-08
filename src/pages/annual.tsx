import React, { useState, type ReactElement, useMemo } from 'react';
import { type WeekNumberClickEventHandler } from 'react-day-picker';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';

import { Calendar } from '~/components/ui/calendar';
import moment from 'moment';
import { Button } from '~/components/ui/button';

import { cn } from '~/lib/utils';
import holidayJson from '~/utils/holidayHK';
import fixtures from '~/utils/hkjcFixture';
import { Card } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent
} from '@radix-ui/react-hover-card';

const FixtureLegend = () => {
    return (
        <Card className="absolute right-4 top-4 flex h-10 w-16 flex-col items-start justify-center border-0 px-2">
            <section className="flex items-center justify-center gap-2 align-middle">
                <Separator className="w-4  border-2 border-lime-500 dark:border-lime-300" />
                <p className="text-[6px] text-lime-500 dark:text-lime-500">
                    日馬
                </p>
            </section>
            <section className="flex items-center justify-center gap-2 align-middle">
                <Separator className="w-4  border-2 border-indigo-500 dark:border-indigo-300 " />
                <p className="text-[6px] text-indigo-500 dark:text-indigo-300">
                    夜馬
                </p>
            </section>
            <section className="flex items-center justify-center gap-2 align-middle">
                <Separator className="w-4  border-2 border-amber-500 dark:border-amber-300 " />
                <p className="text-[6px] text-amber-500 dark:text-amber-300">
                    黃昏馬
                </p>
            </section>
        </Card>
    );
};

const AnnualLeaves: NextPageWithLayout = () => {
    const [parent] = useAutoAnimate();
    const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
    const [annualLimit] = useState(3);

    const memoizedPublicHolidayDetails = useMemo(
        () => (formattedDate: string) =>
            holidayJson.vcalendar[0]?.vevent.filter(({ dtstart }) =>
                dtstart.includes(formattedDate)
            )[0],
        []
    );

    const memoizedRacingDetails = useMemo(
        () => (formattedDate: string) =>
            fixtures.filter(({ date: fixtureDate }) => {
                const formatedFixtureDate = moment(fixtureDate)
                    .locale('zh-hk')
                    .format('YYYYMMDD');
                return formatedFixtureDate === formattedDate;
            })[0],
        []
    );

    const handleWeekNumberClick: WeekNumberClickEventHandler = (
        weekNumber,
        dates,
        e
    ) => {
        e.preventDefault();

        setSelectedWeeks((prev) => {
            if (prev.length >= annualLimit) prev.pop();
            if (prev.includes(weekNumber.toString())) return prev;
            return [weekNumber.toString(), ...prev];
        });
    };

    return (
        <div className="relative">
            <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
                日曆
            </h1>
            <FixtureLegend />
            <Calendar
                // fixedWeeks
                // disableNavigation

                weekStartsOn={1}
                showWeekNumber
                ISOWeek
                numberOfMonths={1}
                onWeekNumberClick={handleWeekNumberClick}
                formatters={{
                    formatDay: (date) => {
                        const formattedDate = moment(date)
                            .locale('zh-hk')
                            .format('YYYYMMDD');

                        const holidayDetails =
                            memoizedPublicHolidayDetails(formattedDate);
                        // if (holidayDetails)
                        //   setHolidays((prev) => {
                        //     return [...prev, holidayDetails];
                        //   });
                        const racingDetails =
                            memoizedRacingDetails(formattedDate);

                        return (
                            <section
                                className={cn(
                                    'flex flex-col items-center justify-center text-center',
                                    holidayDetails &&
                                        'border-t-2 border-t-red-500 text-lg font-extrabold ',
                                    (date.getDay() === 0 ||
                                        date.getDay() === 6 ||
                                        holidayDetails) &&
                                        'text-red-800 dark:text-red-400',
                                    racingDetails?.nightRacing === 0
                                        ? 'border-b-2 border-b-lime-500 dark:border-b-lime-300'
                                        : racingDetails?.nightRacing === 1
                                        ? 'border-b-2 border-b-indigo-500 dark:border-b-indigo-300'
                                        : racingDetails?.nightRacing === 2
                                        ? 'border-b-2 border-b-amber-500 dark:border-b-amber-300'
                                        : ''
                                )}
                            >
                                {holidayDetails?.summary ? (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <p>{date.getDate()}</p>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-20">
                                            <div className="space-y-1">
                                                <p className="text-sm">
                                                    {holidayDetails?.summary}
                                                </p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ) : (
                                    <p>{date.getDate()}</p>
                                )}
                            </section>
                        );
                    },
                    formatWeekNumber: (weekNumber) => (
                        <p className="font-mono font-bold text-orange-900 dark:text-orange-300">
                            W{weekNumber.toString().padStart(2, '0')}
                        </p>
                    )
                }}
                // footer={holidays?.map((holiday) => (
                //   <p key={holiday.uid}>{holiday.summary}</p>
                // ))}
            />

            {selectedWeeks.length > 0 ? (
                <p
                    className="flex gap-3 text-lg font-extrabold text-orange-800 dark:text-orange-400"
                    ref={parent}
                >
                    已選週次為{' '}
                    {selectedWeeks.map((weekNumber) => (
                        <span key={weekNumber}>
                            W{weekNumber.toString().padStart(2, '0')}
                        </span>
                    ))}
                </p>
            ) : (
                <p className="flex gap-3 text-lg font-extrabold text-amber-800 dark:text-amber-400">
                    您可選取最多 {annualLimit} 個週次
                </p>
            )}
            <section className="flex flex-col justify-center gap-4">
                <Button
                    variant={'outline'}
                    onClick={() => {
                        localStorage.setItem(
                            'selectedWeeks',
                            JSON.stringify(selectedWeeks)
                        );
                    }}
                    disabled
                >
                    Save
                </Button>
                <Button
                    variant={'destructive'}
                    onClick={() => {
                        setSelectedWeeks([]);
                    }}
                    disabled={selectedWeeks.length === 0}
                >
                    Reset
                </Button>
            </section>
        </div>
    );
};

AnnualLeaves.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default AnnualLeaves;
