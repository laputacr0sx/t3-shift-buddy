import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
    convertMonthNumber,
    convertToICSEvents,
    getWebICSEvents,
    staffBlobURI
} from '~/utils/helper';
import * as icalParser from 'node-ical';
import axios, { type AxiosError } from 'axios';
import { type StaffId } from '~/utils/customTypes';
import { type DateArray, type EventAttributes } from 'ics';
import toast from 'react-hot-toast';

type ChineseCalendarsProps = {
    staffId: StaffId;
};

function ChineseCalendars({ staffId }: ChineseCalendarsProps) {
    const [events, setEvents] = useState<
        null | (EventAttributes & { end: DateArray })[]
    >([]);

    useEffect(() => {
        async function getEvents() {
            const eventResponse = await axios
                .get(staffBlobURI(staffId))
                .then((res) => icalParser.parseICS(res.data as string))
                .catch((err: AxiosError) => {
                    console.error(err);
                    toast.error(err.message);
                    return {} as icalParser.CalendarResponse;
                });

            const webICSEvents = getWebICSEvents(eventResponse);
            const events = convertToICSEvents(webICSEvents);

            setEvents(events);
        }

        void getEvents();

        return () => {
            toast.dismiss();
        };
    }, [staffId]);

    return events?.map((event) => {
        const validStartDate = moment(
            convertMonthNumber(event.start, 'subtract')
        );
        const validEndDate = moment(convertMonthNumber(event.end, 'subtract'));
        // const localDateTime = moment(event.start).locale("zh-hk");

        return (
            <div
                key={event.start.toString()}
                className="mb-4 flex min-h-[24] min-w-[24] items-center justify-center rounded-2xl p-3 font-medium"
            >
                <div className="w-auto flex-none rounded-t text-center shadow-lg md:w-16 lg:rounded-l lg:rounded-t-none ">
                    <div className="block overflow-hidden rounded-t text-center text-primary-foreground ">
                        <div className="bg-emerald-500 py-1 dark:bg-emerald-900">
                            {validStartDate.format('MMMM')}
                        </div>
                        <div className="border-l border-r border-border bg-card pt-1">
                            <span className="text-xl font-bold leading-tight">
                                {validStartDate.date()}
                            </span>
                        </div>
                        <div className="-pt-2 mb-1 rounded-b-lg border-b border-l border-r border-border bg-card text-center">
                            <span className="text-xs">
                                {validStartDate.format('dd')}
                            </span>
                        </div>

                        <div className="rounded-b-lg border-b border-l border-r border-border pb-2 text-center">
                            <span className="text-xs leading-normal">
                                {validStartDate.format('HH:mm')} to {''}
                                {validEndDate.format('HH:mm')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
}

export default ChineseCalendars;
