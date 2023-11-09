import moment from "moment";
import { type Row } from "@tanstack/react-table";
import type { Shift } from "@prisma/client";
import { toast } from "~/components/ui/useToast";
import { type DayDetail, type WeekComplex } from "./customTypes";
import { completeShiftNameRegex } from "./regex";

export function getWeekNumber(queryDate?: Date) {
  return moment(queryDate ? queryDate : undefined).isoWeek();
}

export const getNextWeekDates = (weekNumber?: number, format?: string) => {
  const validWeekNumber = weekNumber ? weekNumber : getWeekNumber() + 1;
  const mondayFromWeekNumber = moment().day("Monday").week(validWeekNumber);

  let weekArr = new Array<Date>();

  for (let i = 0; i < 7; i++) {
    const date = mondayFromWeekNumber.add(i ? 1 : 0, "d");

    weekArr = [...weekArr, date.toDate()];
  }

  return weekArr;
};

export function convertDurationDecimal(rawDuration: string): string {
  const [wHour, wMinute] = rawDuration.split(":");
  if (!wMinute || !wHour) return "0";
  const minuteDecimal = parseInt(wMinute) / 60;
  return `${parseInt(wHour) + minuteDecimal}`;
}

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

export async function tableCopyHandler(selectedShifts: Row<DayDetail>[]) {
  if (!navigator || !navigator.clipboard)
    throw Error("No navigator object nor clipboard found");

  const completeString = getSelectedShiftsString(selectedShifts);

  await navigator.clipboard.writeText(completeString);
  toast({
    description: "已複製資料",
  });
}

import holidayJson from "~/utils/holidayHK";
import fixtures from "~/utils/hkjcFixture";

export const autoPrefix = (weekNumber?: number) => {
  const correspondingDates = getNextWeekDates(
    weekNumber ?? getWeekNumber() + 1
  );

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
