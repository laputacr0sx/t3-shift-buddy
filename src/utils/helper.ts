import type { Shifts } from "@prisma/client";
import { type WeekComplex } from "./customTypes";
import { toast } from "~/components/ui/useToast";
import moment from "moment";

export function getNextWeekDates(weekNumber?: number) {
  const validWeekNumber = weekNumber ? weekNumber : moment().week() + 1;
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

export function getShiftDetail(arrayOfShift: string[], shiftsArray: Shifts[]) {
  let dutyDetail: Shifts[] = [];

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
  shiftsArray: Shifts[],
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

export const handleOnClickCopyEvent = async (shift: Shifts) => {
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
