import moment from "moment";
import { type Row } from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import { type DayDetail } from "./customTypes";
import { completeShiftNameRegex, shiftNumberRegex } from "./regex";

// check if today is after wednesday
export const isTodayAfterWednesday = (day?: moment.Moment) => {
  day = day ?? moment();
  const wednesday = moment().day(3);
  return day.isAfter(wednesday);
};

/**
 * Returns Moment Object from today to next sunday included.
 * @returns Moment Object from today to next sunday included.
 */
// export const getDatesFromToday = () => {
//   const today = moment().startOf("day");
//   const nextWeek = today
//     .clone()
//     .add(isTodayAfterWednesday(today) ? 1 : 0, "week");
//   const nextSunday = nextWeek.clone().add(1, "week").startOf("week");
//   const dates = [];
//   while (today.isSameOrBefore(nextSunday)) {
//     dates.push(today.clone());
//     today.add(1, "day");
//   }
//   return dates;
// };
export const getDatesTillSunday = () => {
  const today = moment().startOf("day");
  const endOfWeek = today
    .clone()
    .add(isTodayAfterWednesday(today) ? 1 : 0, "week")
    .endOf("isoWeek");

  const dates = [];
  while (today.isSameOrBefore(endOfWeek)) {
    dates.push(today.clone());
    today.add(1, "day");
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
  const mondayFromWeekNumber = moment().day("Monday").week(validWeekNumber);

  let weekArr = new Array<Date>();

  for (let i = 0; i < 7; i++) {
    const date = mondayFromWeekNumber.add(i ? 1 : 0, "d");

    weekArr = [...weekArr, date.toDate()];
  }

  return weekArr;
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
      dayString = `${date} ${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\n`;
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

import holidayJson from "~/utils/holidayHK";
import fixtures from "~/utils/hkjcFixture";

/**
 * Returns an array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 * @param weekNumber The week number to get the details for. Defaults to the current week number.
 * @returns An array of objects, each containing the date, prefix, and racing/holiday details for each day of the given week.
 */
export const autoPrefix = (weekNumber?: string) => {
  // const nextWeekNumber = weekNumber ?? (getWeekNumberByDate() + 1).toString();

  const correspondingDates = getNextWeekDates();
  // const correspondingDates = getDatesTillSunday();

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

    const racingDetails = fixtures.filter(
      ({ date: fixtureDay }) =>
        moment(fixtureDay).locale("zh-hk").format("YYYYMMDD") === date
    )[0];

    const holidayDetails = holidayJson.vcalendar[0]?.vevent.filter(
      ({ dtstart }) => dtstart.includes(date)
    )[0];

    const weekDayNum = moment(date).isoWeekday();

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
};
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

export const getDutyNumberPreview = (
  shifts: string[],
  weekNumber?: number
): string[] => {
  const dayDetail: string[] = [];
  const weekPreview = autoPrefix(weekNumber?.toString());

  weekPreview.forEach((day, i) => {
    let dayDetailString = "";
    const date = moment(day.date, "YYYYMMDD ddd");

    const shiftName = shifts[i] as string;
    const shiftCode = shiftName.match(shiftNumberRegex)?.[0];

    dayDetailString = `${date.format("DD/MM(dd)")} ${
      shiftCode ? day.prefix.concat(shiftCode) : shiftName
    }`;

    dayDetail.push(dayDetailString);
  });

  console.log(dayDetail);

  return dayDetail;
};
