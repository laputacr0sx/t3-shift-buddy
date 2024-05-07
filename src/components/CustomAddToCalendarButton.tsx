import moment from 'moment';
import { atcb_action } from 'add-to-calendar-button';
import { CalendarPlus } from 'lucide-react';

import { Button } from './ui/button';
import { convertDurationDecimal } from '~/utils/helper';
import { type DayDetail } from '~/utils/customTypes';

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
    tableData,
    countString
}: {
    tableData: DayDetail[];
    countString: string;
}) {
    const numberOfSelectedShifts = tableData.length;

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
            onClick={(e) => {
                e.preventDefault();
                return atcb_action({
                    name: 'dutyEvents',
                    dates: resultEvents,
                    options: ['Apple', 'Google', 'Microsoft365', 'iCal'],
                    buttonStyle: 'default',
                    timeZone: 'Asia/Hong_Kong'
                });
            }}
            disabled={!tableData}
            className="flex gap-2"
            variant={'outline'}
        >
            <CalendarPlus strokeWidth={1} />
            {!!numberOfSelectedShifts ? (
                <p className="tracking-widest">
                    <span>加</span>
                    <span className="font-mono font-extrabold">
                        {countString}
                    </span>
                    <span>更到月曆</span>
                </p>
            ) : (
                '未選取任何更份'
            )}
        </Button>
    );
}
