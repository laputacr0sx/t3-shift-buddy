import type { Shift } from "@prisma/client";
import {
  type HolidaysObject,
  type DayDetail,
  type WeekComplex,
} from "./customTypes";
import { toast } from "~/components/ui/useToast";
import moment from "moment";
import { type Row } from "@tanstack/react-table";
import { completeShiftNameRegex } from "./regex";

export function getCurrentWeekNumber(queryDate?: Date) {
  return moment(queryDate ? queryDate : undefined).isoWeek();
}

export function getNextWeekDates(weekNumber?: number) {
  const validWeekNumber = weekNumber ? weekNumber : getCurrentWeekNumber() + 1;
  const mondayFromWeekNumber = moment().day("Monday").week(validWeekNumber);

  let weekArr = new Array<Date>();

  for (let i = 0; i < 7; i++) {
    weekArr = [...weekArr, mondayFromWeekNumber.add(i ? 1 : 0, "d").toDate()];
  }

  return weekArr;
}

export function convertDurationDecimal(rawDuration: string): string {
  const [wHour, wMinute] = rawDuration.split(":");
  if (!wMinute || !wHour) return "0";
  const minuteDecimal = parseInt(wMinute) / 60;
  return `${parseInt(wHour) + minuteDecimal}`;
}

export function getShiftDetail(arrayOfShift: string[], shiftsArray: Shift[]) {
  let dutyDetail: Shift[] = [];

  for (const inputDutyNumber of arrayOfShift) {
    const result = shiftsArray?.filter(({ dutyNumber }) => {
      return dutyNumber === inputDutyNumber || "";
    });

    if (!!result?.[0]) {
      dutyDetail = [...dutyDetail, result[0]];
    }
  }

  return dutyDetail;
}

export function getCompleteWeekComplex(
  titleArray: string[],
  shiftsArray: Shift[],
  dateArray: Date[]
) {
  let dutyComplex: WeekComplex[] = [];

  for (let i = 0; i < titleArray.length; i++) {
    const result = shiftsArray?.filter(({ dutyNumber }) => {
      return dutyNumber === titleArray[i] || "";
    });

    if (!!result?.[0] && !!dateArray?.[0]) {
      dutyComplex = [
        ...dutyComplex,
        {
          date: dateArray[i] as Date,
          title: titleArray[i] as string,
          dutyObject: result[0] || {},
        },
      ];
    }
  }

  return dutyComplex;
}

export const handleOnClickCopyEvent = async (shift: Shift) => {
  const { bFL, bNL, duration, dutyNumber, remarks, bNT, bFT } = shift;
  const durationDecimal = convertDurationDecimal(duration);

  if (!navigator || !navigator.clipboard)
    throw Error("No navigator object nor clipboard found");

  await navigator.clipboard.writeText(
    `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``
  );

  toast({
    title: `已複製 ${dutyNumber} 更資料`,
    description: `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``,
  });
};

export async function tableCopyHandler(selectedShifts: Row<DayDetail>[]) {
  if (!navigator || !navigator.clipboard)
    throw Error("No navigator object nor clipboard found");

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

  await navigator.clipboard.writeText(completeString);
  toast({
    description: "已複製資料",
  });
}

import { holidayJson } from "~/utils/holidayHK";

export const getHolidays = (dates: Date[]) => {
  //
};
