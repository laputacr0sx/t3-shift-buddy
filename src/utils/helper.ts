import moment from "moment";
import { type z } from "zod";
import { toast } from "react-hot-toast";
import { type StaffId, type DayDetail } from "./customTypes";
import { completeShiftNameRegex, specialDutyRegex } from "./regex";
import holidayJson from "~/utils/holidayHK";
import fixtures from "~/utils/hkjcFixture";
import type * as icalParser from "node-ical";
import { type DateArray, createEvents, type EventAttributes } from "ics";

moment.updateLocale("zh-hk", {
  weekdaysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
  weekdaysMin: ["日", "一", "二", "三", "四", "五", "六"],
});

// check if today is after wednesday
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
  const tomorrow = moment().add(1, "d").startOf("day");
  const endOfWeek = tomorrow
    .clone()
    .add(isTodayAfterWednesday(tomorrow) ? 1 : 0, "week")
    .endOf("isoWeek");

  const dates = [];
  while (tomorrow.isSameOrBefore(endOfWeek)) {
    dates.push(tomorrow.clone());
    tomorrow.add(1, "day");
  }
  return dates;
};

/**
 * Returns the ISO week number of the given date.
 * @param queryDate The date to get the week number for. Defaults to the current date.
 * @returns The ISO week number of the given date.
 */
export function getWeekNumberByDate(queryDate?: Date) {
  return moment(queryDate ? queryDate : undefined).isoWeek();
}

/**
 * Returns an array of dates for the next week, starting from the given week number.
 * @param weekNumber The week number to start from. Defaults to the current week number.
 * @returns An array of dates for the next week, starting from the given week number.
 */
export const getNextWeekDates = (weekNumber?: string) => {
  const validWeekNumber = weekNumber
    ? parseInt(weekNumber)
    : getWeekNumberByDate() + 1;
  const startOfWeek = moment().week(validWeekNumber).startOf("isoWeek");
  const endOfWeek = startOfWeek.clone().endOf("isoWeek");

  const dates = [];
  while (startOfWeek.isSameOrBefore(endOfWeek)) {
    dates.push(startOfWeek.clone());
    startOfWeek.add(1, "day");
  }
  return dates;
};

/**
 * Converts a raw duration string (e.g. "01:30") to a decimal representation (e.g. "0.83").
 * @param rawDuration The raw duration string to convert.
 * @returns The converted decimal representation of the duration string.
 */
export function convertDurationDecimal(rawDuration: string): string {
  const [wHour, wMinute] = rawDuration.split(":");
  if (!wMinute || !wHour) return "0";
  const minuteDecimal = parseInt(wMinute) / 60;
  return `${parseInt(wHour) + minuteDecimal}`;
}

/**
 * Returns a string representation of the selected shifts, wrapped in code blocks.
 * @param selectedShifts The selected shifts to convert to a string representation.
 * @returns The string representation of the selected shifts, wrapped in code blocks.
 */
export function getSelectedShiftsString(selectedShifts: DayDetail[]) {
  let completeString = "```\n";
  for (const dayDetail of selectedShifts) {
    let dayString = "";

    if (!dayDetail.title.match(completeShiftNameRegex)) {
      const { dutyNumber } = dayDetail;

      const date = moment(dayDetail.date).locale("zh-hk").format("DD/MM(dd)");

      dayString = `${date} ${dutyNumber}\n`;
    } else {
      const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } = dayDetail;
      const date = moment(dayDetail.date)
        // .locale("zh-hk")
        // .calendar({
        //   nextDay(m, now) {
        //     console.log({ m, now });
        //     return "";
        //   },
        // });

        // const date = moment(dayDetail.date)
        .locale("zh-hk")
        .format("DD/MM(dd)");
      const durationDecimal = convertDurationDecimal(duration);
      dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}] <${remarks}> \n`;
    }
    completeString = completeString + dayString;
  }
  completeString = completeString + "```";

  return completeString;
}

/**
 * Copies the given selected shifts to the clipboard as a code block.
 * @param selectedShifts The selected shifts to copy to the clipboard.
 */
export async function tableCopyHandler(selectedShifts: DayDetail[]) {
  if (!navigator || !navigator.clipboard)
    throw Error("No navigator object nor clipboard found");

  const completeString = getSelectedShiftsString(selectedShifts);

  await navigator.clipboard.writeText(completeString);
  toast.success("已複製資料");
}

export function convertMonthNumber(
  dateArray: number[],
  mode: "add" | "subtract" = "add"
): DateArray {
  const [year, month, ...rest] = dateArray;

  if (mode === "add") {
    return [year as number, (month as number) + 1, ...rest] as DateArray;
  } else {
    return [year as number, (month as number) - 1, ...rest] as DateArray;
  }
}

export function getICSObject(selectedShifts: DayDetail[]): EventAttributes[] {
  const events = selectedShifts.map<EventAttributes>((shift) => {
    const { date, bFL, bFT, bNL, bNT, duration, dutyNumber, remarks } = shift;
    const validDate = moment(date, "YYYYMMDD").format("YYYY-MM-DD");

    const start = moment.utc(`${validDate} ${bNT}`).toArray().splice(0, 5);
    const end = moment(`${validDate} ${bFT}`).isAfter(
      moment(`${validDate} ${bNT}`)
    )
      ? moment(`${validDate} ${bFT}`).toArray().splice(0, 5)
      : moment(`${validDate} ${bFT}`).add(1, "d").toArray().splice(0, 5);
    const durationDecimal = duration
      ? convertDurationDecimal(duration)
      : duration;

    return {
      start: convertMonthNumber(start),
      startInputType: "local",
      end: convertMonthNumber(end),
      endInputType: "local",

      title: dutyNumber,
      description: `收工地點：${getChineseLocation(
        bFL
      )}\n工時：${durationDecimal}\n備註：${remarks}`,

      location: getChineseLocation(bNL),
      busyStatus: "BUSY",
      productId: "calendar",
      classification: "PUBLIC",
      sequence: 0,
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
          type: "text/calendar",
        })
      );
    });
  });
}

/**
 * Returns an array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 * @param weekNumber The week number to get the details for. Defaults to the current week number.
 * @returns An array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 */

export function autoPrefix(moreDays = false, weekNumber?: string) {
  const nextWeekNumber = weekNumber ?? (getWeekNumberByDate() + 1).toString();

  const correspondingDates = moreDays
    ? getDatesTillSunday()
    : getNextWeekDates(nextWeekNumber);

  const formattedDated = correspondingDates.map((date) => {
    return moment(date).locale("zh-hk").format("YYYYMMDD");
  });

  const publicHolidays = holidayJson.vcalendar.flatMap(({ vevent }) =>
    vevent.flatMap(({ dtstart }) =>
      dtstart.filter((date) => typeof date === "string")
    )
  );
  const prefixes = [];

  for (const date of formattedDated) {
    const isHoliday = !!publicHolidays.filter((holiday) => holiday === date)[0];
    const weekDayNum = moment(date).isoWeekday();

    const racingDetails = fixtures.filter(
      ({ date: fixtureDay }) =>
        moment(fixtureDay).locale("zh-hk").format("YYYYMMDD") === date
    )[0];

    const holidayDetails = holidayJson.vcalendar[0]?.vevent.filter(
      ({ dtstart }) => dtstart.includes(date)
    )[0];

    const prefix = racingDetails
      ? racingDetails.nightRacing === 0
        ? "71"
        : racingDetails.nightRacing === 1 && racingDetails.venue === "H"
        ? "14"
        : "13"
      : weekDayNum === 6 || weekDayNum === 7 || isHoliday
      ? "75"
      : "15";

    prefixes.push({
      date: moment(date).format("YYYYMMDD ddd"),
      prefix,
      racingDetails,
      holidayDetails,
    });
  }

  return prefixes;
}

export const fetchTyped = async <S extends z.Schema>(
  url: string,
  schema: S,
  params?: RequestInit
): Promise<z.infer<S>> => {
  const res = await fetch(url, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    ...params,
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
        const isNumericPrefixEqual = prefix.slice(1) === shiftCode.slice(0, 2);
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
    HUH: "紅磡",
    SHT: "沙田",
    SHS: "上水",
    HTD: "何東樓",
    LOW: "羅湖",
    TAW: "大圍",
    TWD: "大圍車廠",
    FTRH: "火炭大樓",
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
      if (ev.type == "VEVENT") {
        events.push(ev);
      }
    }
  }
  return events;
}

export function convertToICSEvents(webICSEvents: icalParser.VEvent[]) {
  return webICSEvents.map<EventAttributes & { end: DateArray }>((icsEvent) => {
    const start = moment(icsEvent.start).toArray().splice(0, 5);
    const end = moment(icsEvent.end).toArray().splice(0, 5);
    const dutyNumber = icsEvent.summary;
    const bNL = icsEvent.location;
    const description = icsEvent.description;

    return {
      start: convertMonthNumber(start),
      // startInputType: "local",
      end: convertMonthNumber(end),
      // endInputType: "local",
      title: dutyNumber,
      description,
      location: getChineseLocation(bNL),
      busyStatus: "BUSY",
      productId: "calendar",
      classification: "PUBLIC",
      sequence: 0,
    } as EventAttributes & { end: DateArray };
  });
}
