import moment from 'moment';
import { type z } from 'zod';
import { toast } from 'react-hot-toast';
import type { StaffId, DayDetail, Rosta } from './customTypes';
import { completeShiftNameRegex, specialDutyRegex } from './regex';
import holidayJson, { type Holiday } from '~/utils/holidayHK';
import fixtures, { type Fixture } from '~/utils/hkjcFixture';
import type * as icalParser from 'node-ical';
import { type DateArray, createEvents, type EventAttributes } from 'ics';
import { type Rota } from './standardRosters';
import { type inferProcedureOutput } from '@trpc/server';
import { type AppRouter } from '~/server/api/root';
import { ValueOf } from 'next/dist/shared/lib/constants';

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
 * Converts a raw duration string (e.g. "01:30") to a decimal representation (e.g. "0.83").
 * @param rawDuration The raw duration string to convert.
 * @returns The converted decimal representation of the duration string.
 */
export function convertDurationDecimal(rawDuration: string): string {
    const [wHour, wMinute] = rawDuration.split(':');
    if (!wMinute || !wHour) return '0';
    const minuteDecimal = parseInt(wMinute) / 60;
    return `${parseInt(wHour) + minuteDecimal}`;
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
                // .locale("zh-hk")
                // .calendar({
                //   nextDay(m, now) {
                //     console.log({ m, now });
                //     return "";
                //   },
                // });

                // const date = moment(dayDetail.date)
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

/**
 * Copies the given selected shifts to the clipboard as a code block.
 * @param selectedShifts The selected shifts to copy to the clipboard.
 */
export async function tableCopyHandler(selectedShifts: DayDetail[]) {
    if (navigator?.clipboard)
        throw Error('No navigator object nor clipboard found');

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

/**
 * Converts an array of iCal events to a Blob containing the iCal data.
 *
 * @param {EventAttributes[]} calEvents - An array of iCal event objects.
 * @returns {Promise<Blob>} A Promise that resolves to a Blob containing the iCal data.
 */
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
/**
 * Returns the draft prefix for the given fixture, weekday number, and holiday status.
 * @param fixture The fixture object.
 * @param weekdayNumber The weekday number (0-6).
 * @param isHoliday A boolean value indicating whether the given date is a holiday.
 * @returns {Prefix} The draft prefix for the given fixture, weekday number, and holiday status.
 */
function draftPrefix(
    fixture: Fixture | undefined,
    weekdayNumber: number,
    isHoliday: boolean
): Prefix {
    if (!fixture) {
        return weekdayNumber === 6 || weekdayNumber === 7 || isHoliday
            ? '75'
            : '15';
    }
    if (fixture.nightRacing === 0) {
        return '71';
    } else
        return fixture.nightRacing === 1 && fixture.venue === 'H' ? '14' : '13';
}

/**
 * Returns an array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 * @param moreDays {boolean} Set to true if you want to get days from tomorrow onwards until next Sunday. Defaults to false.
 * @param weekNumber The week number to get the details for. Defaults to the current week number.
 * @returns An array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 */

export function autoPrefix(moreDays = false, weekNumber?: string) {
    const nextWeekNumber = weekNumber ?? (getWeekNumberByDate() + 1).toString();
    console.log(nextWeekNumber);

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

        // const prefix = racingDetails
        //     ? racingDetails.nightRacing === 0
        //         ? '71'
        //         : racingDetails.nightRacing === 1 && racingDetails.venue === 'H'
        //         ? '14'
        //         : '13'
        //     : weekDayNum === 6 || weekDayNum === 7 || isHoliday
        //     ? '75'
        //     : '15';

        prefixes.push({
            date: moment(date).format('YYYYMMDD ddd'),
            prefix,
            racingDetails,
            holidayDetails
        });
    }

    return prefixes;
}

export type PrefixDetail = {
    date: string;
    prefix: string;
    racingDetail: Fixture | null;
    holidayDetail: Holiday | null;
};
export function getPrefixDetailFromId(weekId: string): PrefixDetail[] {
    const [year, week] = weekId.match(/\d+/gim) ?? [
        moment().year().toString(),
        moment().week().toString()
    ];

    const correspondingDates = getNextWeekDates(year, week);

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

        // const prefix = racingDetail
        //     ? racingDetail.nightRacing === 0
        //         ? '71'
        //         : racingDetail.nightRacing === 1 && racingDetail.venue === 'H'
        //         ? '14'
        //         : '13'
        //     : weekDayNum === 6 || weekDayNum === 7 || isHoliday
        //     ? '75'
        //     : '15';

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

/**
 * Returns the Chinese location name for the given location code.
 *
 * @param {unknown} location - The location code to get the name for.
 * @returns {ChineseKey} The Chinese location name for the given location code.
 */
export function getChineseLocation(
    location: unknown
): ValueOf<typeof chineseLocation> {
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
    };

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

export function getRosterRow(
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

    const rowInQuery = Math.abs(+rowNumber - 1 + rowDifference) % rotaLength;

    const sequence = rotaArray[rowInQuery];
    if (!sequence) {
        return {
            sequence: ['找', '不', '到', '行', '序', '!', '!'],
            rowInQuery: 0
        };
    }

    return { sequence, rowInQuery };
}

interface CategoryName {
    tc: string;
    en: string;
}

export function stringifyCategory(category: string | undefined): CategoryName {
    if (!category) {
        return { tc: '', en: '' };
    }
    const categoryName = {
        A: { tc: '九龍', en: 'KLN' },
        B: { tc: '新界', en: 'SHS' },
        C: { tc: '柴油', en: 'ET' },
        S: { tc: '特別', en: 'SP' }
    };

    const prefix = category.slice(0, 1) as keyof typeof categoryName;
    return categoryName[prefix];
}

type Timetables = inferProcedureOutput<
    AppRouter['timetableController']['getAllTimetables']
>;

export function getFitTimetable(
    timetables: Timetables,
    prefixes: PrefixDetail[]
) {
    if (!timetables || !prefixes) {
        return null;
    }

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

type DateDetails = ReturnType<typeof getFitTimetable>;

export function combineDateWithSequence(
    dates: DateDetails,
    sequence: string[]
) {
    const sequenceDetail = dates?.map((date, i) => ({
        ...date,
        standardDuty: sequence[i] as string,
        actualDuty: ''
    }));

    return sequenceDetail;
}
