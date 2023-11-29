import moment from "moment";
import { type Row } from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import { type DayDetail } from "./customTypes";
import { completeShiftNameRegex, specialDutyRegex } from "./regex";
import holidayJson from "~/utils/holidayHK";
import fixtures from "~/utils/hkjcFixture";
import { type z } from "zod";

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
export function getSelectedShiftsString(selectedShifts: Row<DayDetail>[]) {
  let completeString = "```\n";
  for (const dayDetail of selectedShifts) {
    let dayString = "";

    if (!dayDetail.original.title.match(completeShiftNameRegex)) {
      const { dutyNumber } = dayDetail.original;

      const date = moment(dayDetail.original.date)
        .locale("zh-hk")
        .format("DD/MM(dd)");

      dayString = `${date} ${dutyNumber}\n`;
    } else {
      const { dutyNumber, duration, bNL, bFL, bNT, bFT, remarks } =
        dayDetail.original;
      const date = moment(dayDetail.original.date)
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
export async function tableCopyHandler(selectedShifts: Row<DayDetail>[]) {
  if (!navigator || !navigator.clipboard)
    throw Error("No navigator object nor clipboard found");

  const completeString = getSelectedShiftsString(selectedShifts);

  await navigator.clipboard.writeText(completeString);
  toast("已複製資料");
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
// export const autoPrefix = (weekNumber?: string) => {
//   const nextWeekNumber = weekNumber ?? (getWeekNumberByDate() + 1).toString();

//   const correspondingDates = getNextWeekDates(nextWeekNumber);

//   const formattedDated = correspondingDates.map((date) => {
//     return moment(date).locale("zh-hk").format("YYYYMMDD");
//   });

//   const publicHolidays = holidayJson.vcalendar.flatMap(({ vevent }) =>
//     vevent.flatMap(({ dtstart }) =>
//       dtstart.filter((date) => typeof date === "string")
//     )
//   );
//   const prefixes = [];

//   for (const date of formattedDated) {
//     const isHoliday = !!publicHolidays.filter((holiday) => holiday === date)[0];

//     const racingDetails = fixtures.filter(
//       ({ date: fixtureDay }) =>
//         moment(fixtureDay).locale("zh-hk").format("YYYYMMDD") === date
//     )[0];

//     const holidayDetails = holidayJson.vcalendar[0]?.vevent.filter(
//       ({ dtstart }) => dtstart.includes(date)
//     )[0];

//     const weekDayNum = moment(date).isoWeekday();

//     const prefix = racingDetails
//       ? racingDetails.nightRacing === 0
//         ? "71"
//         : racingDetails.nightRacing === 1 && racingDetails.venue === "H"
//         ? "14"
//         : "13"
//       : weekDayNum === 6 || weekDayNum === 7 || isHoliday
//       ? "75"
//       : "15";

//     prefixes.push({
//       date: moment(date).format("YYYYMMDD ddd"),
//       prefix,
//       racingDetails,
//       holidayDetails,
//     });
//   }

//   return prefixes;
// };

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

export function getChineseLocation(
  location: "HUH" | "SHT" | "SHS" | "HTD" | "LOW" | "TAW" | "TWD" | "FTRH"
) {
  const chineseDuration = {
    HUH: "紅磡",
    SHT: "沙田",
    SHS: "上水",
    HTD: "何東樓",
    LOW: "羅湖",
    TAW: "大圍",
    TWD: "大圍車廠",
    FTRH: "火炭大樓",
  };

  return chineseDuration[location];
}
