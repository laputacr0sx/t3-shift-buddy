import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { threeDigitShiftRegex } from "./regex";
import { WeekPrefix } from "@prisma/client";

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

export function combinePrefix(
  prefixObject: WeekPrefix | undefined,
  shiftSequence: string[]
) {
  const completeShiftCode: string[] = [];
  for (let i = 0; i < 7; i++) {
    if (prefixObject) {
      completeShiftCode.push(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        prefixObject.content[i]?.concat(shiftSequence[i] || "") || ""
      );
    }
  }
  return completeShiftCode;
}
