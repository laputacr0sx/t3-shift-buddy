import moment from 'moment';
import { atcb_action } from 'add-to-calendar-button';
import { CalendarPlus } from 'lucide-react';

import { type TableData } from './HomepageInput';
import { Button } from './ui/button';
import { convertDurationDecimal } from '~/utils/helper';

type DetailsOfEvent = {
    name?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    timeZone?: string;
    location?: string;
    status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
    sequence?: number;
    uid?: string;
    organizer?: string;
    attendee?: string;
};

export default function AddToCalendarButtonCustom({
    tableData
}: {
    tableData?: TableData;
}) {
    if (!tableData) return null;

    let resultEvents: DetailsOfEvent[] = [];
    for (const d of tableData) {
        const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks, date } = d;
        const bND: string = moment(date).format('YYYY-MM-DD');
        const durationDecimal = duration
            ? convertDurationDecimal(duration)
            : duration;
        const bFD = moment(`${bND} ${bFT}`).isAfter(moment(`${bND} ${bNT}`))
            ? moment(bND).format('YYYY-MM-DD')
            : moment(bND).add(1, 'd').format('YYYY-MM-DD');

        resultEvents = [
            ...resultEvents,
            {
                name: dutyNumber,
                location: bNL,
                startDate: bND,
                endDate: bFD,
                startTime: bNT,
                endTime: bFT,
                description: `收工地點：${bFL}[br]工時：${durationDecimal}[br]備註：${remarks}`
            }
        ];
    }

    return (
        <Button
            disabled={resultEvents.length === 0}
            onClick={(e) => {
                e.preventDefault();
                atcb_action({
                    name: 'dutyEvents',
                    dates: resultEvents,
                    options: ['Apple', 'Google', 'Microsoft365', 'iCal'],
                    buttonStyle: 'default',
                    timeZone: 'Asia/Hong_Kong'
                });
            }}
            className="flex gap-2"
            variant={'outline'}
        >
            <CalendarPlus strokeWidth={2} />
            {/* <p>加入所有更份</p> */}
        </Button>
    );
}
