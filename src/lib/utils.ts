import { type Shifts } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextWeekDates() {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7) + 1);
  let weekArr: Date[] = [];
  const startDate = new Date(d);
  for (let i = 0; i < 7; i++) {
    weekArr = [...weekArr, new Date(startDate)];
    startDate.setDate(startDate.getDate() + 1);
  }
  return weekArr;
}

export function convertDuration(rawDuration: string): string {
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

interface WeekComplex {
  date: string | undefined;
  title: string | undefined;
  dutyObject: Shifts | undefined | null;
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
          date: dateArray[i]?.toLocaleDateString(),
          title: titleArray[i],
          dutyObject: result[0] || {},
        },
      ];
    }
  }

  return dutyComplex;
}
