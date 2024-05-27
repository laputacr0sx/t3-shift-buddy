import moment from 'moment';
import type { Timetable } from '@prisma/client';
import { type z } from 'zod';
import { toast } from 'react-hot-toast';
import type * as icalParser from 'node-ical';
import { type DateArray, createEvents, type EventAttributes } from 'ics';

import type {
    StaffId,
    DayDetail,
    Rosta,
    DateDetails,
    DateDetailsWithSequences
} from './customTypes';
import {
    completeShiftNameRegex,
    shiftNameWithoutDayoff,
    specialDutyRegex
} from './regex';
import { type Rota } from './standardRosters';

import holidayJson, { type Holiday } from '~/utils/holidayHK';
import fixtures, { type Fixture } from '~/utils/hkjcFixture';
import { rotaET, rotaKLN, rotaSHS } from '~/utils/standardRosters';

import type { TableData } from '~/components/HomepageInput';
import { BestExchangeFormSchema } from '~/components/Exchange/BestExchangeForm';

moment.updateLocale('zh-hk', {
    weekdaysShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    weekdaysMin: ['日', '一', '二', '三', '四', '五', '六']
    // week: {
    //     dow: 1 // Monday is the first day of the week.
    // }
});

export const isTodayAfterWednesday = (day?: moment.Moment) => {
    day = day ?? moment();
    const wednesday = moment().day(3);
    return day.isAfter(wednesday);
};

/**
 * Returns Moment Object from tomorrow to next sunday included.
 * @returns Moment Object from tomorrow to next sunday included.
 */
export const getDatesTillSunday = () => {
    const tomorrow = moment().add(1, 'd').startOf('day');
    const endOfWeek = tomorrow
        .clone()
        .add(isTodayAfterWednesday(tomorrow) ? 1 : 0, 'week')
        .endOf('isoWeek');

    const dates = [];
    while (tomorrow.isSameOrBefore(endOfWeek)) {
        dates.push(tomorrow.clone());
        tomorrow.add(1, 'day');
    }
    return dates;
};

/**
 * Returns the ISO week number of the given date.
 * @param queryDate The date to get the week number for. Defaults to the current date.
 * @returns The ISO week number of the given date.
 */
export function getWeekNumberByDate(queryDate?: Date) {
    return moment(queryDate ?? undefined).isoWeek();
}

/**
 * Returns an array of dates for the next week, starting from the given week number.
 * @param weekNumber The week number to start from. Defaults to the current week number.
 * @returns An array of dates for the next week, starting from the given week number.
 */
export const getNextWeekDates = (year?: string, weekNumber?: string) => {
    const validWeekNumber = weekNumber ? +weekNumber : moment().week();
    const validYear = year ? +year : moment().year();

    const startOfWeek = moment()
        .year(validYear)
        .week(validWeekNumber)
        .startOf('isoWeek');

    const endOfWeek = startOfWeek.clone().endOf('isoWeek');

    const dates = [];
    while (startOfWeek.isSameOrBefore(endOfWeek)) {
        dates.push(startOfWeek.clone());
        startOfWeek.add(1, 'd');
    }
    return dates;
};

/**
 * Converts a raw duration string (e.g. "7:30") to a decimal representation (e.g. "7.5").
 * @param rawDuration The raw duration string to convert.
 * @returns The converted decimal representation of the duration string.
 */
export function convertDurationDecimal(rawDuration: string): string {
    if (!rawDuration) return '';

    const [wHour, wMinute] = rawDuration.split(':');
    if (!wMinute || !wHour) return '0';
    const minuteDecimal = parseInt(wMinute) / 60;
    return `${parseInt(wHour) + minuteDecimal}`;
}

export function stringifyDuty(duty: DayDetail): string {
    let completeString = '```\n';
    let dayString = '';

    if (!duty.title.match(completeShiftNameRegex)) {
        const { dutyNumber } = duty;
        const date = moment(duty.date).locale('zh-hk').format('DD/MM(dd)');
        dayString = `${date} ${dutyNumber}\n`;
    } else {
        const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } = duty;
        const date = moment(duty.date).locale('zh-hk').format('DD/MM(dd)');
        const durationDecimal = convertDurationDecimal(duration);
        dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}] <${remarks}> \n`;
    }
    completeString = completeString + dayString;

    completeString = completeString + '```';

    return completeString;
}

export async function copyStringToClipboard(str: string) {
    if (!navigator?.clipboard) {
        toast.error('找不到剪貼簿');
        return;
    }

    await navigator.clipboard.writeText(str);
    toast.success('已複製資料');
}

/**
 * Returns a string representation of the selected shifts, wrapped in code blocks.
 * @param selectedShifts The selected shifts to convert to a string representation.
 * @returns The string representation of the selected shifts, wrapped in code blocks.
 */
export function getSelectedShiftsString(selectedShifts: DayDetail[]) {
    let completeString = '```\n';
    for (const dayDetail of selectedShifts) {
        let dayString = '';

        if (!dayDetail.title.match(completeShiftNameRegex)) {
            const { dutyNumber } = dayDetail;

            const date = moment(dayDetail.date)
                .locale('zh-hk')
                .format('DD/MM(dd)');

            dayString = `${date} ${dutyNumber}\n`;
        } else {
            const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } =
                dayDetail;
            const date = moment(dayDetail.date)
                .locale('zh-hk')
                .format('DD/MM(dd)');
            const durationDecimal = convertDurationDecimal(duration);
            dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}] <${remarks}> \n`;
        }
        completeString = completeString + dayString;
    }
    completeString = completeString + '```';

    return completeString;
}

export async function tableCopyHandler(selectedShifts?: DayDetail[]) {
    if (!selectedShifts) return;
    if (!navigator?.clipboard) {
        toast.error('找不到剪貼簿');
        return;
    }

    const completeString = getSelectedShiftsString(selectedShifts);

    await navigator.clipboard.writeText(completeString);
    toast.success('已複製資料');
}

/**
 * Converts a month number to a date array.
 * @param {number[]} dateArray - An array containing the year, month, and optional day.
 * @param {'add'|'subtract'} mode - Indicates whether to add or subtract one month from the given date. Defaults to 'add'.
 * @returns {DateArray} - An array containing the year, month, and optional day, adjusted by the given mode.
 */
export function convertMonthNumber(
    dateArray: number[],
    mode: 'add' | 'subtract' = 'add'
): DateArray {
    const [year, month, ...rest] = dateArray;

    if (mode === 'add') {
        return [year as number, (month as number) + 1, ...rest] as DateArray;
    } else {
        return [year as number, (month as number) - 1, ...rest] as DateArray;
    }
}

export function getICSObject(selectedShifts: DayDetail[]): EventAttributes[] {
    const events = selectedShifts.map<EventAttributes>((shift) => {
        const { date, bFL, bFT, bNL, bNT, duration, dutyNumber, remarks } =
            shift;
        const validDate = moment(date, 'YYYYMMDD').format('YYYY-MM-DD');

        const start = moment.utc(`${validDate} ${bNT}`).toArray().splice(0, 5);
        const end = moment(`${validDate} ${bFT}`).isAfter(
            moment(`${validDate} ${bNT}`)
        )
            ? moment(`${validDate} ${bFT}`).toArray().splice(0, 5)
            : moment(`${validDate} ${bFT}`).add(1, 'd').toArray().splice(0, 5);
        const durationDecimal = duration
            ? convertDurationDecimal(duration)
            : duration;

        return {
            start: convertMonthNumber(start),
            startInputType: 'local',
            end: convertMonthNumber(end),
            endInputType: 'local',

            title: dutyNumber,
            description: `收工地點：${getChineseLocation(
                bFL
            )}\n工時：${durationDecimal}\n備註：${remarks}`,

            location: getChineseLocation(bNL),
            busyStatus: 'BUSY',
            productId: 'calendar',
            classification: 'PUBLIC',
            sequence: 0
        } as EventAttributes;
    });

    return events;
}

export function convertICSEventsToBlob(calEvents: EventAttributes[]) {
    return new Promise<Blob>((resolve, reject) => {
        createEvents(calEvents, (error, value) => {
            if (error) {
                reject(error);
            }
            resolve(
                new Blob([value], {
                    type: 'text/calendar'
                })
            );
        });
    });
}

type Prefix = '75' | '71' | '15' | '13' | '14';
export function draftPrefix(
    raceFixture: Fixture | undefined,
    weekdayNumber: number,
    isHoliday: boolean
): Prefix {
    if (!raceFixture) {
        return weekdayNumber === 6 || weekdayNumber === 7 || isHoliday
            ? '75'
            : '15';
    }
    if (raceFixture.nightRacing === 1) {
        return raceFixture.venue === 'H' ? '14' : '13';
    } else return '71';
}

export function autoPrefix(moreDays = false, weekNumber?: string) {
    const nextWeekNumber = weekNumber ?? (getWeekNumberByDate() + 1).toString();

    const correspondingDates = moreDays
        ? getDatesTillSunday()
        : getNextWeekDates(nextWeekNumber);

    const formattedDated = correspondingDates.map((date) => {
        return moment(date).locale('zh-hk').format('YYYYMMDD');
    });

    const publicHolidays = holidayJson.vcalendar.flatMap(({ vevent }) =>
        vevent.flatMap(({ dtstart }) =>
            dtstart.filter((date) => typeof date === 'string')
        )
    );
    const prefixes = [];

    for (const date of formattedDated) {
        const isHoliday = !!publicHolidays.filter(
            (holiday) => holiday === date
        )[0];
        const weekDayNum = moment(date).isoWeekday();

        const racingDetails = fixtures.filter(
            ({ date: fixtureDay }) =>
                moment(fixtureDay).locale('zh-hk').format('YYYYMMDD') === date
        )[0];

        const holidayDetails = holidayJson.vcalendar[0]?.vevent.filter(
            ({ dtstart }) => dtstart.includes(date)
        )[0];

        const prefix = draftPrefix(racingDetails, weekDayNum, isHoliday);

        prefixes.push({
            date: moment(date).format('YYYYMMDD ddd'),
            prefix,
            racingDetails,
            holidayDetails
        });
    }

    return prefixes;
}

export type DateDetail = {
    date: string;
    prefix: string;
    racingDetail: Fixture | null;
    holidayDetail: Holiday | null;
};
export function getDateDetailFromId(
    weekId: string,
    moreDays = false
): DateDetail[] {
    const [year, week] = weekId.match(/\d+/gim) ?? [
        moment().year().toString(),
        moment().week().toString()
    ];

    const correspondingDates = moreDays
        ? getDatesTillSunday()
        : getNextWeekDates(year, week);

    const formattedDated = correspondingDates.map((date) => {
        return moment(date).locale('zh-hk').format('YYYYMMDD');
    });

    const publicHolidays = holidayJson.vcalendar.flatMap(({ vevent }) =>
        vevent.flatMap(({ dtstart }) =>
            dtstart.filter((date) => typeof date === 'string')
        )
    );
    const prefixes = [];

    for (const date of formattedDated) {
        const isHoliday = !!publicHolidays.filter(
            (holiday) => holiday === date
        )[0];
        const weekDayNum = moment(date).isoWeekday();

        const racingDetail = fixtures.filter(
            ({ date: fixtureDay }) =>
                moment(fixtureDay).locale('zh-hk').format('YYYYMMDD') === date
        )[0];

        const holidayDetail = holidayJson.vcalendar[0]?.vevent.filter(
            ({ dtstart }) => dtstart.includes(date)
        )[0];

        const prefix = draftPrefix(racingDetail, weekDayNum, isHoliday);

        prefixes.push({
            date: moment(date).format('YYYYMMDD ddd'),
            prefix,
            racingDetail: racingDetail ?? null,
            holidayDetail: holidayDetail ?? null
        });
    }

    return prefixes;
}

export const getResponseWithType = async <S extends z.Schema>(
    url: string,
    schema: S,
    params?: RequestInit
): Promise<z.infer<S>> => {
    const res = await fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        },
        ...params
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse(await res.json());
};

export function getJointDutyNumbers(prefixes: string[], shiftCodes: string[]) {
    // const prefixes = ["J15", "D14", "V71", "C75"];
    // const shiftCodes = ["15129", "15107", "75123", "71129", "15133", "14134"];
    const mapResult = shiftCodes.flatMap((shiftCode) => {
        const isSpecialDuty = shiftCode.match(specialDutyRegex);
        // shorthand return when shiftCode is not abbreviated.
        if (!isSpecialDuty)
            return prefixes.flatMap((prefix) => {
                const isNumericPrefixEqual =
                    prefix.slice(1) === shiftCode.slice(0, 2);
                if (!isNumericPrefixEqual) return [];
                return prefix.slice(0, 1).concat(shiftCode);
            });

        return shiftCode;
    });
    return mapResult;
}

export function getChineseLocation(location: unknown) {
    type ChineseKey = keyof typeof chineseLocation;

    const chineseLocation = {
        HUH: '紅磡',
        SHT: '沙田',
        SHS: '上水',
        HTD: '何東樓',
        LOW: '羅湖',
        TAW: '大圍',
        TWD: '大圍車廠',
        FTRH: '火炭大樓'
    } as const;

    return chineseLocation[location as ChineseKey];
}

export const staffBlobURI = (staffId: StaffId) =>
    `https://r4wbzko8exh5zxdl.public.blob.vercel-storage.com/${staffId}.ics`;

export function getWebICSEvents(
    webEvents: icalParser.CalendarResponse
): icalParser.VEvent[] {
    const events = [];
    for (const e in webEvents) {
        if (webEvents.hasOwnProperty(e)) {
            const ev = webEvents[e];
            if (!ev) continue;
            if (ev.type == 'VEVENT') {
                events.push(ev);
            }
        }
    }
    return events;
}

export function convertToICSEvents(webICSEvents: icalParser.VEvent[]) {
    return webICSEvents.map<EventAttributes & { end: DateArray }>(
        (icsEvent) => {
            const start = moment(icsEvent.start).toArray().splice(0, 5);
            const end = moment(icsEvent.end).toArray().splice(0, 5);
            const dutyNumber = icsEvent.summary;
            const bNL = icsEvent.location;
            const description = icsEvent.description;

            return {
                start: convertMonthNumber(start),
                startInputType: 'local',
                end: convertMonthNumber(end),
                endInputType: 'local',
                title: dutyNumber,
                description,
                location: getChineseLocation(bNL),
                busyStatus: 'BUSY',
                productId: 'calendar',
                classification: 'PUBLIC',
                sequence: 0
            } satisfies EventAttributes & { end: DateArray };
        }
    );
}

export function getDefaultRosterRow(
    rotaArray: Rota,
    rowNumberWithCategory: string | undefined,
    rowDifference: number
): { sequence: Rosta; rowInQuery: number } {
    const rotaLength = rotaArray.length;

    if (!rowNumberWithCategory) {
        return { sequence: new Array<string>(7).fill(''), rowInQuery: 0 };
    }

    const rowNumber = rowNumberWithCategory.match(/\d+/)?.[0];
    if (!rowNumber) {
        return {
            sequence: ['行', '序', '錯', '誤', '!', '!', '!'],
            rowInQuery: 0
        };
    }
    if (+rowNumber > rotaLength || +rowNumber < 1) {
        return {
            sequence: ['行', '序', '出', '錯', '!', '!', '!'],
            rowInQuery: 0
        };
    }

    const rowInQuery = Math.abs(+rowNumber - 1) % rotaLength;
    const sequence = rotaArray[rowInQuery];
    if (!sequence) {
        return {
            sequence: ['找', '不', '到', '行', '序', '!', '!'],
            rowInQuery: 0
        };
    }

    return { sequence, rowInQuery };
}

interface DefaultRosterDetail {
    sequence: string[];
    rowInQuery: number;
    sequenceId: string;
}

export function defaultRosterDetail(
    rowId: string,
    updatedAt: string,
    correspondingMoment: moment.Moment
): DefaultRosterDetail {
    const { en } = translateRow(rowId);
    const rotaArray = getRota(en);
    const weekOfCorrespondingMoment = correspondingMoment.isoWeek();
    const weekOfUpdatedAt = moment(updatedAt).isoWeek();

    const weekDiff = weekOfCorrespondingMoment - weekOfUpdatedAt;
    const rotaLength = rotaArray.length;
    const rowNumber = rowId.slice(1);

    const updatedRowNumber =
        Math.abs(+rowNumber + weekDiff) % rotaLength === 0
            ? rotaLength
            : Math.abs(+rowNumber + weekDiff) % rotaLength;

    const latestRow = rowId.slice(0, 1).concat(updatedRowNumber.toString());

    const sequenceId = `${correspondingMoment.format(
        '[Y]YYYY[W]WW'
    )}${latestRow}`;

    const defaultRosterDetail: DefaultRosterDetail = {
        sequence: [],
        rowInQuery: 0,
        sequenceId: ''
    };

    if (!updatedRowNumber) {
        return {
            ...defaultRosterDetail,
            sequence: ['行', '序', '錯', '誤', '!', '!', '!']
        };
    }

    if (updatedRowNumber > rotaLength || updatedRowNumber < 1) {
        return {
            ...defaultRosterDetail,
            sequence: ['行', '序', '出', '錯', '!', '!', '!']
        };
    }

    const sequence = rotaArray[updatedRowNumber - 1];

    if (!sequence) {
        return {
            ...defaultRosterDetail,
            sequence: ['找', '不', '到', '行', '序', '!', '!']
        };
    }

    return {
        ...defaultRosterDetail,
        sequence,
        rowInQuery: updatedRowNumber - 1,
        sequenceId
    };
}

interface CategoryName {
    tc: string;
    en: string;
}

export function translateRow(rowID: string | undefined): CategoryName {
    if (!rowID) {
        return { tc: '', en: '' };
    }
    const categoryName = {
        A: { tc: '九龍', en: 'KLN' },
        B: { tc: '新界', en: 'SHS' },
        C: { tc: '柴油', en: 'ET' },
        S: { tc: '特別', en: 'SPC' }
    };

    const prefix = rowID.slice(0, 1) as keyof typeof categoryName;
    return categoryName[prefix];
}

export function getFitTimetable(
    timetables: Timetable[],
    prefixes: DateDetail[]
): (DateDetail & { timetable: Timetable })[] {
    return prefixes.map((prefix) => {
        const prefixDate = moment(prefix.date, 'YYYYMMDD ddd');

        const samePrefixTimetable = timetables.filter((timetable) => {
            const checkSpecial =
                moment(timetable.dateOfEffective).isSame(prefixDate, 'd') &&
                timetable.isSpecial;

            const checkNormal =
                !timetable.isSpecial &&
                timetable.prefix.includes(prefix.prefix) &&
                prefixDate.isSameOrAfter(
                    moment(timetable.dateOfEffective),
                    'isoWeek'
                );

            return checkSpecial || checkNormal;
        });

        const fittedTimetable = samePrefixTimetable?.reduce(
            (prevTimeTable, currTimetable) => {
                const prevDOEDiff = moment(prevTimeTable.dateOfEffective).diff(
                    prefixDate
                );
                const currDOEDiff = moment(currTimetable.dateOfEffective).diff(
                    prefixDate
                );

                return prevDOEDiff - currDOEDiff < 0
                    ? currTimetable
                    : prevTimeTable;
            }
        );
        return { ...prefix, timetable: fittedTimetable };
    });
}

export function combineDateWithSequence(
    dates: DateDetails,
    standardSequence: string[],
    actualSequence: string[] | null
): DateDetailsWithSequences[] {
    const sequenceDetail = dates?.map((date, i) => ({
        ...date,
        standardDuty: standardSequence[i] as string,
        actualDuty: actualSequence ? (actualSequence[i] as string) : 'RD'
    }));

    return sequenceDetail;
}

export const getRota = (categoryName: string) => {
    switch (categoryName) {
        case 'KLN':
            return rotaKLN;
        case 'SHS':
            return rotaSHS;
        case 'ET':
            return rotaET;
        default:
            return rotaKLN;
    }
};

export function getRacingStyle(racingDetail: Fixture | null) {
    switch (racingDetail?.nightRacing) {
        case 0:
            return 'border-b-2 border-b-lime-500 dark:border-b-lime-300';
        case 1:
            return 'border-b-2 border-b-violet-500 dark:border-b-violet-300';
        case 2:
            return 'border-b-2 border-b-amber-500 dark:border-b-amber-300';
        default:
            return '';
    }
}

export function convertWeatherIcons(iconId: string | undefined): string {
    if (!iconId) {
        return '';
    }

    const iconTable: Record<string, string> = {
        '50': 'sunny-day',
        '51': `fair-day`,
        '52': `cloudy-day-3`,
        '53': `fair-day-rain`,
        '54': `rainy-3`,
        '60': `cloudy`,
        '61': `overcast`,
        '62': `rainy-4`,
        '63': `rainy-6`,
        '64': `rainy-8`,
        '65': `thunderstorms`,
        '70': `moon-new`,
        '71': `moon-waxing-crescent`,
        '72': `moon-first-quarter`,
        '73': `moon-full`,
        '74': `moon-last-quarter`,
        '75': `moon-waning-crescent`,
        '76': `cloudy-day-3`,
        '77': `fair-day`,
        '80': `wind`,
        '81': `dry`,
        '82': `humid`,
        '83': `fog`,
        '84': `mist`,
        '85': `haze`,
        '90': `hot`,
        '91': `warm`,
        '92': `cool`,
        '93': `cold`,
        unavailable: `exceptional`
    };
    return iconTable[iconId] as string;
}

/**
 * 檢查更份是否死早夜
 **/
export function checkDeadDuty(detail: DayDetail): boolean {
    const { date, bNT, bFT } = detail;

    const d = moment(date, 'YYYYMMDD').format('YYYY-MM-DD');
    const DEAD_EARLY = moment(`${d} 06:15`);
    const DEAD_LATE = moment(`${d} 00:30`).add(1, 'd');

    const start = moment.utc(`${d} ${bNT}`);
    const end = moment(`${d} ${bFT}`).isAfter(moment(`${d} ${bNT}`))
        ? moment(`${d} ${bFT}`)
        : moment(`${d} ${bFT}`).add(1, 'd');

    let isDead = false;
    if (start.isBefore(DEAD_EARLY)) {
        isDead = true;
    }
    if (end.isAfter(DEAD_LATE)) {
        isDead = true;
    }

    return isDead;
}

export function getDeadDutyStyle(isDead: boolean): string {
    return '';
}

export function convertTableDatatoExchangeString(
    tableData?: TableData,
    isMono = false
): string {
    if (!tableData) {
        return '';
    }

    let completeString = isMono ? '```\n' : '';
    for (const dayDetail of tableData) {
        let dayString = '';

        if (!dayDetail.title.match(shiftNameWithoutDayoff)) {
            const { dutyNumber } = dayDetail;

            const date = moment(dayDetail.date)
                .locale('zh-hk')
                .format('DD/MM(dd)');

            dayString = `${date} ${dutyNumber}\n`;
        } else {
            const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } =
                dayDetail;
            const date = moment(dayDetail.date)
                .locale('zh-hk')
                .format('DD/MM(dd)');
            const durationDecimal = convertDurationDecimal(duration);
            dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}] <${remarks}> \n`;
        }
        completeString = completeString + dayString;
    }
    completeString = completeString + (isMono ? '```' : '');

    return completeString;
}

export function exchangeProcess(ctx: BestExchangeFormSchema) {
    return;
}
