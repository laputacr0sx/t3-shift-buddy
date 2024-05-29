import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, Row, type RowProps } from 'react-day-picker';

import { zhHK } from 'date-fns/locale';

import { cn } from '~/lib/utils';
import { buttonVariants } from '~/components/ui/button';
import moment from 'moment';
import {
    differenceInCalendarDays,
    eachDayOfInterval,
    startOfWeek
} from 'date-fns';
import { useMemo } from 'react';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, ...props }: CalendarProps) {
    function isPastDate(date: Date) {
        const SUNDAY_NUMBER = 7;
        const sunday =
            moment().isoWeekday() <= 2
                ? moment().isoWeekday(SUNDAY_NUMBER).toDate()
                : moment().add(1, 'weeks').isoWeekday(SUNDAY_NUMBER).toDate();

        return (
            differenceInCalendarDays(date, new Date()) < 0 ||
            differenceInCalendarDays(date, sunday) > 0
        );
    }

    const onlyFutureRowMemoized = useMemo(() => {
        return function OnlyFutureRow(props: RowProps) {
            const isPastRow = props.dates.every((date) => isPastDate(date));
            if (isPastRow) return <></>;
            return <Row {...props} />;
        };
    }, []);

    function datesBeforeToday(): Date[] {
        return eachDayOfInterval({
            start: startOfWeek(new Date()),
            end: new Date(new Date().setDate(new Date().getDate() + 6))
        }).filter((day) => {
            return day.getDay() < new Date().getDay() && day < new Date();
        });
    }

    return (
        <DayPicker
            locale={zhHK}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-2',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell:
                    'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
                ),
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'text-muted-foreground opacity-80',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames
            }}
            components={{
                Row: onlyFutureRowMemoized
            }}
            disabled={datesBeforeToday()}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
